# 타이포그래피 토큰 스케일 재설계 + 블로그 템플릿 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 디자인 시스템에 없던 타이포그래피·레이아웃 토큰 축(64개)을 신설하고, 그 토큰만으로 벤치마크 수준의 사내 블로그 화면 4종을 구현할 수 있음을 자동 검사로 입증한다.

**Architecture:** 2층 구조. 1층은 `tokens/base.css`의 타입 래더(원시 크기 사다리), 2층은 `tokens/semantic.css`의 역할 토큰(`--font-size-body` 등). 컴포넌트는 2층만 참조한다. Tailwind의 `fontSize` 키를 1·2층 변수로 재매핑하여 기존 컴포넌트 400여 곳을 수정하지 않고 새 스케일을 적용한다. 블로그 템플릿은 `src/templates/service/blog/`에 신설하며, 토큰 밖의 리터럴 값을 쓰지 못하도록 테스트로 강제한다.

**Tech Stack:** CSS Custom Properties, Tailwind CSS 3.4, React 18 + TypeScript, Vitest + Testing Library, Storybook 10, Playwright(신규 devDependency, 시각 회귀 및 벤치마크 계측 전용)

**Spec:** `docs/superpowers/specs/2026-09-11-blog-tokens-design.md`

---

## 파일 구조

### 신규 생성

| 파일 | 책임 |
|---|---|
| `scripts/visual-snapshot.mjs` | Storybook 정적 빌드를 띄우고 전 스토리를 PNG로 캡처·비교 |
| `scripts/measure-benchmark.mjs` | 벤치마크 사이트의 계산된 스타일 추출 |
| `src/tokens.test.ts` | 토큰 파일의 구조 규칙 검사 (래더 참조, 기존 토큰 보존, Tailwind 연결) |
| `src/templates/service/blog/types.ts` | 블로그 템플릿 4종이 공유하는 데이터 타입 |
| `src/templates/service/blog/BlogCardGrid.tsx` | 카드 3열 그리드 + 카테고리 필터 (벤치마크 재현 대상) |
| `src/templates/service/blog/BlogMagazine.tsx` | 대형 피처드 글 + 하위 리스트 |
| `src/templates/service/blog/BlogMinimalList.tsx` | 썸네일 없는 텍스트 리스트 |
| `src/templates/service/blog/BlogArticle.tsx` | 글 상세 (본문 + 목차 + 관련 글) |
| `src/templates/service/blog/blog-tokens.test.ts` | 블로그 템플릿의 토큰 준수 검사 (V1) |
| `src/templates/service/blog/BlogCardGrid.test.tsx` | 렌더링·필터 동작 검사 |
| `src/stories/templates/Blog.stories.tsx` | 블로그 4종 스토리 |
| `src/stories/docs/Typography.mdx` | 타입 래더·역할 토큰 문서 |
| `docs/benchmarks/studeo-insights.md` | 벤치마크 계측 결과 + 판정 기록 |

### 수정

| 파일 | 변경 내용 |
|---|---|
| `tokens/base.css` | 타입 래더 11칸 + weight 4 + leading 4 + tracking 5 추가 (기존 토큰 삭제 없음) |
| `tokens/semantic.css` | 역할 토큰 31개 + measure/width-content/aspect 9개 추가 |
| `tailwind.config.js` | `fontSize` 재매핑, `maxWidth`·`aspectRatio`·`letterSpacing`·`lineHeight`·`fontWeight` 확장 |
| `src/templates/index.ts` | 블로그 템플릿 4종 export |
| `src/stories/docs/TokenReference.mdx` | 신설 축 반영 |
| `package.json` | `playwright` devDependency, `snapshot:*` 스크립트 |
| `.gitignore` | 스냅샷 산출물 제외 |

---

## Task 1: 시각 회귀 스냅샷 하네스

타입 스케일 변경은 전 화면에 영향을 준다. 변경 전후를 비교할 수단을 **가장 먼저** 만든다.

**Files:**
- Create: `scripts/visual-snapshot.mjs`
- Modify: `package.json`, `.gitignore`

- [ ] **Step 1: playwright 설치**

```bash
npm install --save-dev playwright@^1.47.0
npx playwright install chromium
```

- [ ] **Step 2: 스냅샷 스크립트 작성**

`scripts/visual-snapshot.mjs` 생성. Storybook 정적 빌드를 Node 내장 http로 서빙하고, `index.json`의 모든 story를 순회하며 PNG를 캡처한다. 비교는 PNG 바이트 해시로 한다(렌더링이 결정적이므로 픽셀이 같으면 바이트도 같다). 별도 이미지 diff 라이브러리를 두지 않는다.

```javascript
// scripts/visual-snapshot.mjs
// 사용법: node scripts/visual-snapshot.mjs base   → 기준선 캡처
//        node scripts/visual-snapshot.mjs diff   → 기준선과 비교
import { createServer } from 'node:http'
import { createReadStream, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { extname, join } from 'node:path'
import { chromium } from 'playwright'

const MODE = process.argv[2]
if (MODE !== 'base' && MODE !== 'diff') {
  console.error('사용법: node scripts/visual-snapshot.mjs <base|diff>')
  process.exit(1)
}

const STATIC_DIR = 'storybook-static'
const OUT_DIR = join('.snapshots', MODE)
const BASE_DIR = join('.snapshots', 'base')
const PORT = 6199
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.map': 'application/json',
}

if (!existsSync(STATIC_DIR)) {
  console.error(`${STATIC_DIR} 가 없습니다. 먼저 npm run build-storybook 을 실행하세요.`)
  process.exit(1)
}

rmSync(OUT_DIR, { recursive: true, force: true })
mkdirSync(OUT_DIR, { recursive: true })

const server = createServer((req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0])
  const file = join(STATIC_DIR, path === '/' ? 'index.html' : path)
  if (!existsSync(file)) { res.writeHead(404); res.end(); return }
  res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' })
  createReadStream(file).pipe(res)
})
await new Promise((r) => server.listen(PORT, r))

const index = JSON.parse(readFileSync(join(STATIC_DIR, 'index.json'), 'utf-8'))
const stories = Object.values(index.entries).filter((e) => e.type === 'story')
console.log(`스토리 ${stories.length}개 캡처 시작 (mode=${MODE})`)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
let captured = 0

for (const story of stories) {
  await page.goto(`http://localhost:${PORT}/iframe.html?id=${story.id}&viewMode=story`, {
    waitUntil: 'networkidle',
  })
  await page.waitForSelector('#storybook-root', { state: 'attached' })
  await page.screenshot({ path: join(OUT_DIR, `${story.id}.png`), fullPage: true })
  captured += 1
}

await browser.close()
server.close()
console.log(`캡처 완료: ${captured}개 → ${OUT_DIR}`)

if (MODE === 'diff') {
  if (!existsSync(BASE_DIR)) {
    console.error('기준선이 없습니다. 먼저 npm run snapshot:base 를 실행하세요.')
    process.exit(1)
  }
  const hash = (f) => createHash('sha256').update(readFileSync(f)).digest('hex')
  const baseFiles = new Set(readdirSync(BASE_DIR))
  const diffFiles = new Set(readdirSync(OUT_DIR))
  const changed = []
  const added = [...diffFiles].filter((f) => !baseFiles.has(f))
  const removed = [...baseFiles].filter((f) => !diffFiles.has(f))
  for (const f of diffFiles) {
    if (!baseFiles.has(f)) continue
    if (hash(join(BASE_DIR, f)) !== hash(join(OUT_DIR, f))) changed.push(f)
  }
  console.log(`\n=== 비교 결과 ===`)
  console.log(`변경: ${changed.length}건, 추가: ${added.length}건, 삭제: ${removed.length}건`)
  for (const f of changed) console.log(`  변경 ${f}`)
  for (const f of added) console.log(`  추가 ${f}`)
  for (const f of removed) console.log(`  삭제 ${f}`)
}
```

- [ ] **Step 3: npm 스크립트와 gitignore 추가**

`package.json`의 `scripts`에 아래 3줄을 추가한다.

```json
"snapshot:build": "storybook build",
"snapshot:base": "npm run snapshot:build && node scripts/visual-snapshot.mjs base",
"snapshot:diff": "npm run snapshot:build && node scripts/visual-snapshot.mjs diff"
```

`.gitignore` 끝에 추가한다.

```
.snapshots/
```

- [ ] **Step 4: 기준선 캡처**

Run: `npm run snapshot:base`
Expected: `캡처 완료: 236개 → .snapshots/base` (개수는 저장소 상태에 따라 달라질 수 있으나 200개 이상이어야 한다)

- [ ] **Step 5: 하네스가 결정적인지 검증**

코드를 변경하지 않은 상태로 비교를 실행해 차이가 0건인지 확인한다. 여기서 차이가 나면 하네스를 신뢰할 수 없으므로 다음 Task로 넘어가면 안 된다.

Run: `npm run snapshot:diff`
Expected: `변경: 0건, 추가: 0건, 삭제: 0건`

> 차이가 0건이 아니면: 애니메이션·랜덤 데이터·현재 시각을 쓰는 스토리가 원인이다. 해당 스토리 id를 `scripts/visual-snapshot.mjs`의 `stories` 필터에 제외 목록으로 추가하고 그 사유를 주석으로 남긴 뒤 Step 4부터 다시 실행한다.

- [ ] **Step 6: 커밋**

```bash
git add scripts/visual-snapshot.mjs package.json package-lock.json .gitignore
git commit -m "chore(test): 시각 회귀 스냅샷 하네스 추가"
```

---

## Task 2: 벤치마크 계측

**Files:**
- Create: `scripts/measure-benchmark.mjs`, `docs/benchmarks/studeo-insights.md`

- [ ] **Step 1: 계측 스크립트 작성**

`scripts/measure-benchmark.mjs` 생성.

```javascript
// scripts/measure-benchmark.mjs
// 사용법: node scripts/measure-benchmark.mjs https://studeo.com.au/insights/
import { chromium } from 'playwright'

const url = process.argv[2]
if (!url) { console.error('사용법: node scripts/measure-benchmark.mjs <url>'); process.exit(1) }

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
await page.goto(url, { waitUntil: 'networkidle' })

const result = await page.evaluate(() => {
  const read = (el) => {
    const s = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    return {
      tag: el.tagName.toLowerCase(),
      text: (el.textContent ?? '').trim().slice(0, 40),
      fontSize: s.fontSize,
      lineHeight: s.lineHeight,
      fontWeight: s.fontWeight,
      letterSpacing: s.letterSpacing,
      textTransform: s.textTransform,
      width: Math.round(r.width),
      height: Math.round(r.height),
    }
  }
  // 텍스트 요소 표본
  const textEls = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a,time,span,li')]
    .filter((el) => (el.textContent ?? '').trim().length > 1)
    .filter((el) => el.getBoundingClientRect().height > 0)
    .slice(0, 80)
    .map(read)

  // 그리드 컨테이너 표본
  const grids = [...document.querySelectorAll('*')]
    .filter((el) => {
      const s = getComputedStyle(el)
      return s.display === 'grid' || s.display === 'flex'
    })
    .filter((el) => el.children.length >= 2 && el.getBoundingClientRect().width > 600)
    .slice(0, 10)
    .map((el) => {
      const s = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      return {
        display: s.display,
        gridTemplateColumns: s.gridTemplateColumns,
        gap: s.gap,
        width: Math.round(r.width),
        maxWidth: s.maxWidth,
        children: el.children.length,
      }
    })

  // 이미지 종횡비
  const images = [...document.querySelectorAll('img')]
    .filter((el) => el.getBoundingClientRect().width > 100)
    .slice(0, 10)
    .map((el) => {
      const r = el.getBoundingClientRect()
      const s = getComputedStyle(el)
      return {
        width: Math.round(r.width),
        height: Math.round(r.height),
        ratio: (r.width / r.height).toFixed(3),
        borderRadius: s.borderRadius,
        objectFit: s.objectFit,
      }
    })

  return { textEls, grids, images }
})

await browser.close()
console.log(JSON.stringify(result, null, 2))
```

- [ ] **Step 2: 계측 실행**

Run: `node scripts/measure-benchmark.mjs https://studeo.com.au/insights/ > /tmp/studeo-raw.json`
Expected: 종료 코드 0, `/tmp/studeo-raw.json`에 `textEls`, `grids`, `images` 키를 가진 JSON 생성

> 사이트 접속이 실패하면(네트워크 차단, 사이트 개편) 스펙 6-1의 예비 벤치마크(`awwwards.com/inspiration/blog-section-mobile-vention-blog`의 Visit Resource 링크)로 대체하고, 대체 사실을 Step 3 문서에 기록한다.

- [ ] **Step 3: 계측 결과 문서화**

`docs/benchmarks/studeo-insights.md`를 생성하고 아래 표를 채운다. 값은 `/tmp/studeo-raw.json`에서 읽는다. `래더 대응` 열은 Task 3에서 확정하므로 지금은 `미정`이 아니라 **실측 px 값만** 기록하고, 표의 마지막 열은 Task 3 Step 5에서 채운다.

```markdown
# 벤치마크 계측: studeo.com.au/insights/

- 계측일: 2026-09-11
- 뷰포트: 1440 x 1000
- 계측 도구: `scripts/measure-benchmark.mjs`
- 계측 범위: 타이포 위계 / 간격 리듬 / 레이아웃 구조만. **색상과 폰트 패밀리는 계측 대상이 아니며 SFOOD 브랜드 토큰을 유지한다.**

## 타이포 계측

| 역할 | 요소 | font-size | line-height | font-weight | letter-spacing | 래더 대응 |
|---|---|---|---|---|---|---|
| 페이지 제목 | | | | | | |
| 카드 제목 | | | | | | |
| 카테고리 태그 | | | | | | |
| 날짜 | | | | | | |
| 본문/요약 | | | | | | |

## 레이아웃 계측

| 항목 | 실측값 | 토큰 대응 |
|---|---|---|
| 컨테이너 최대 폭 | | |
| 그리드 컬럼 구성 | | |
| 그리드 gap | | |
| 카드 폭 | | |
| 썸네일 종횡비 | | |
| 썸네일 모서리 반경 | | |

## 판정 기록

Task 14에서 작성한다.
```

- [ ] **Step 4: 커밋**

```bash
git add scripts/measure-benchmark.mjs docs/benchmarks/studeo-insights.md
git commit -m "chore(bench): 벤치마크 계측 스크립트 및 studeo 계측 결과 추가"
```

---

## Task 3: 타입 래더 신설 (1층)

**Files:**
- Create: `src/tokens.test.ts`
- Modify: `tokens/base.css`

- [ ] **Step 1: 실패하는 테스트 작성**

CSS는 jsdom에서 외부 파일을 계산해주지 않으므로, 토큰 파일을 **텍스트로 파싱해 구조 규칙**을 검사한다. 이 테스트는 "값이 예쁜가"가 아니라 "시스템 규칙을 지키는가"를 본다.

```typescript
// src/tokens.test.ts
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const read = (p: string) => readFileSync(resolve(__dirname, '..', p), 'utf-8')
const base = read('tokens/base.css')

/** `--name: value;` 선언을 모두 뽑는다 */
function declarations(css: string): Map<string, string> {
  const map = new Map<string, string>()
  for (const m of css.matchAll(/^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/gm)) {
    map.set(m[1], m[2].trim())
  }
  return map
}

describe('타입 래더 (1층)', () => {
  const decls = declarations(base)

  const LADDER = [
    '--text-2xs', '--text-xs', '--text-sm', '--text-md', '--text-lg',
    '--text-xl', '--text-2xl', '--text-3xl', '--text-4xl', '--text-5xl', '--text-6xl',
  ]

  it('래더 11칸이 모두 정의된다', () => {
    for (const name of LADDER) expect(decls.has(name), `${name} 누락`).toBe(true)
  })

  it('래더 값은 rem 단위다', () => {
    for (const name of LADDER) expect(decls.get(name)).toMatch(/^[\d.]+rem$/)
  })

  it('래더는 아래에서 위로 단조 증가한다', () => {
    const values = LADDER.map((n) => parseFloat(decls.get(n)!))
    for (let i = 1; i < values.length; i += 1) {
      expect(values[i], `${LADDER[i]} 가 ${LADDER[i - 1]} 보다 크지 않음`).toBeGreaterThan(values[i - 1])
    }
  })

  it('weight / leading / tracking 축이 정의된다', () => {
    const expected = [
      '--weight-normal', '--weight-medium', '--weight-semibold', '--weight-bold',
      '--leading-none', '--leading-tight', '--leading-normal', '--leading-relaxed',
      '--tracking-tight', '--tracking-normal', '--tracking-wide', '--tracking-wider', '--tracking-widest',
    ]
    for (const name of expected) expect(decls.has(name), `${name} 누락`).toBe(true)
  })

  it('기존 토큰을 삭제하지 않는다', () => {
    const mustKeep = [
      '--brand-600', '--gray-900', '--white', '--font-sans', '--font-mono',
      '--space-4', '--radius-md', '--shadow-sm', '--duration-normal',
    ]
    for (const name of mustKeep) expect(decls.has(name), `${name} 이 삭제됨`).toBe(true)
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/tokens.test.ts`
Expected: FAIL — `--text-2xs 누락` 등 래더 관련 검사가 실패한다. 마지막 "기존 토큰을 삭제하지 않는다"는 PASS여야 한다.

- [ ] **Step 3: 래더 구현**

`tokens/base.css`의 `/* 타이포그래피 */` 블록 **바로 아래**에 아래를 삽입한다. 기존 `--font-sans`, `--font-mono` 선언은 그대로 둔다.

```css
  /* 타입 래더 — 크기 사다리. 컴포넌트는 이 값을 직접 쓰지 않고
     semantic.css의 역할 토큰(--font-size-*)을 통해 사용한다.
     ref: docs/superpowers/specs/2026-09-11-blog-tokens-design.md 4-1, 2026-09 */
  --text-2xs: 0.6875rem;  /* 11px */
  --text-xs:  0.75rem;    /* 12px */
  --text-sm:  0.875rem;   /* 14px — 기간계 본문 기준선 */
  --text-md:  1rem;       /* 16px */
  --text-lg:  1.125rem;   /* 18px — 편집형 본문 */
  --text-xl:  1.375rem;   /* 22px */
  --text-2xl: 1.75rem;    /* 28px */
  --text-3xl: 2.25rem;    /* 36px */
  --text-4xl: 3rem;       /* 48px */
  --text-5xl: 3.75rem;    /* 60px */
  --text-6xl: 4.5rem;     /* 72px — 매거진 헤드라인 */

  /* 굵기 — 실사용 4종(semibold 96, medium 81, bold 66, normal 4) 기준, 2026-09 */
  --weight-normal:   400;
  --weight-medium:   500;
  --weight-semibold: 600;
  --weight-bold:     700;

  /* 행간 — 실사용 3종(relaxed 19, none 4, tight 3) + 본문 기본값 normal, 2026-09 */
  --leading-none:    1;
  --leading-tight:   1.2;
  --leading-normal:  1.5;
  --leading-relaxed: 1.65;

  /* 자간 — 실사용 4종(wider 18, wide 15, tight 5, widest 3) + 리셋용 normal, 2026-09 */
  --tracking-tight:  -0.015em;
  --tracking-normal: 0;
  --tracking-wide:   0.025em;
  --tracking-wider:  0.05em;
  --tracking-widest: 0.1em;
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/tokens.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 5: 벤치마크 계측값과 래더 대조**

`docs/benchmarks/studeo-insights.md`의 `래더 대응` 열을 채운다. 각 실측값에 대해 다음 중 하나를 적는다.

- `--text-XX` — 실측값이 래더 칸과 ±1px 이내로 일치 (반올림 허용)
- `신규 칸 필요: NNpx` — 어떤 칸과도 3px 이상 차이
- `기각: 사유` — 벤치마크 고유 표현이라 채택하지 않음

`신규 칸 필요`가 **3개 이상**이면 래더 설계가 벤치마크와 맞지 않는다는 뜻이므로, 여기서 멈추고 4-1 스케일 비율을 재검토한 뒤 Step 3부터 다시 수행한다. 2개 이하이면 해당 칸을 `tokens/base.css`에 추가하고 `src/tokens.test.ts`의 `LADDER` 배열에도 추가한 뒤 Step 4를 다시 실행한다.

- [ ] **Step 6: 커밋**

```bash
git add tokens/base.css src/tokens.test.ts docs/benchmarks/studeo-insights.md
git commit -m "feat(tokens): 타입 래더 및 weight/leading/tracking 축 신설"
```

---

## Task 4: 역할 토큰 신설 (2층)

**Files:**
- Modify: `tokens/semantic.css`, `src/tokens.test.ts`

- [ ] **Step 1: 실패하는 테스트 추가**

`src/tokens.test.ts` 끝에 아래 describe 블록을 추가한다. 파일 상단의 `read`, `declarations` 헬퍼를 그대로 재사용한다.

```typescript
describe('역할 토큰 (2층)', () => {
  const semantic = read('tokens/semantic.css')
  const decls = declarations(semantic)

  const ROLES = ['display', 'h1', 'h2', 'h3', 'h4', 'body-lg', 'body', 'body-sm', 'caption', 'overline', 'code']

  it('모든 역할에 size와 leading이 정의된다', () => {
    for (const role of ROLES) {
      expect(decls.has(`--font-size-${role}`), `--font-size-${role} 누락`).toBe(true)
      expect(decls.has(`--font-leading-${role}`), `--font-leading-${role} 누락`).toBe(true)
    }
  })

  it('weight는 지정된 6개 역할에만 정의된다', () => {
    const withWeight = ['display', 'h1', 'h2', 'h3', 'h4', 'overline']
    for (const role of withWeight) {
      expect(decls.has(`--font-weight-${role}`), `--font-weight-${role} 누락`).toBe(true)
    }
    for (const role of ROLES.filter((r) => !withWeight.includes(r))) {
      expect(decls.has(`--font-weight-${role}`), `--font-weight-${role} 는 과잉 정의`).toBe(false)
    }
  })

  it('tracking은 지정된 3개 역할에만 정의된다', () => {
    const withTracking = ['display', 'h1', 'overline']
    for (const role of withTracking) {
      expect(decls.has(`--font-tracking-${role}`), `--font-tracking-${role} 누락`).toBe(true)
    }
    for (const role of ROLES.filter((r) => !withTracking.includes(r))) {
      expect(decls.has(`--font-tracking-${role}`), `--font-tracking-${role} 는 과잉 정의`).toBe(false)
    }
  })

  it('역할 토큰은 리터럴 값을 갖지 않고 1층 래더만 참조한다', () => {
    for (const [name, value] of decls) {
      if (!/^--font-(size|leading|weight|tracking)-/.test(name)) continue
      expect(value, `${name} 이 리터럴 값 ${value} 을 직접 가짐`).toMatch(/^var\(--(text|leading|weight|tracking)-[a-z0-9-]+\)$/)
    }
  })

  it('body 는 기간계 기준선인 --text-sm 을 유지한다', () => {
    expect(decls.get('--font-size-body')).toBe('var(--text-sm)')
  })

  it('measure / width-content / aspect 축이 정의된다', () => {
    const expected = [
      '--measure-prose', '--measure-narrow',
      '--width-content-sm', '--width-content-md', '--width-content-lg', '--width-content-xl',
      '--aspect-wide', '--aspect-card', '--aspect-square',
    ]
    for (const name of expected) expect(decls.has(name), `${name} 누락`).toBe(true)
  })

  it('기각된 축은 정의하지 않는다', () => {
    for (const name of decls.keys()) {
      expect(name, `기각된 축 ${name} 이 정의됨`).not.toMatch(/^--(z|border-width|opacity)-/)
    }
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/tokens.test.ts`
Expected: FAIL — `--font-size-display 누락` 등 역할 토큰 검사가 실패한다.

- [ ] **Step 3: 역할 토큰 구현**

`tokens/semantic.css`의 `/* 타이포 */` 블록(`--font-body`, `--font-code` 선언부) **바로 아래**에 삽입한다. 기존 선언은 그대로 둔다.

```css
  /* 역할 토큰 — 컴포넌트는 반드시 이 층만 참조한다. base.css의 --text-* 직접 사용 금지.
     ref: docs/superpowers/specs/2026-09-11-blog-tokens-design.md 4-2, 2026-09 */
  --font-size-display:   var(--text-5xl);
  --font-size-h1:        var(--text-3xl);
  --font-size-h2:        var(--text-2xl);
  --font-size-h3:        var(--text-xl);
  --font-size-h4:        var(--text-md);
  --font-size-body-lg:   var(--text-lg);
  --font-size-body:      var(--text-sm);   /* 기간계 본문 기준선. 변경 시 41종 템플릿 영향 */
  --font-size-body-sm:   var(--text-xs);
  --font-size-caption:   var(--text-xs);
  --font-size-overline:  var(--text-2xs);
  --font-size-code:      var(--text-xs);

  --font-leading-display:  var(--leading-none);
  --font-leading-h1:       var(--leading-tight);
  --font-leading-h2:       var(--leading-tight);
  --font-leading-h3:       var(--leading-tight);
  --font-leading-h4:       var(--leading-normal);
  --font-leading-body-lg:  var(--leading-relaxed);
  --font-leading-body:     var(--leading-normal);
  --font-leading-body-sm:  var(--leading-normal);
  --font-leading-caption:  var(--leading-normal);
  --font-leading-overline: var(--leading-none);
  --font-leading-code:     var(--leading-normal);

  --font-weight-display:  var(--weight-bold);
  --font-weight-h1:       var(--weight-bold);
  --font-weight-h2:       var(--weight-semibold);
  --font-weight-h3:       var(--weight-semibold);
  --font-weight-h4:       var(--weight-semibold);
  --font-weight-overline: var(--weight-medium);

  --font-tracking-display:  var(--tracking-tight);
  --font-tracking-h1:       var(--tracking-tight);
  --font-tracking-overline: var(--tracking-widest);

  /* 콘텐츠 가독 폭 — 긴 본문 1열의 최대 폭. ref: 같은 스펙 4-3, 2026-09 */
  --measure-prose:  68ch;
  --measure-narrow: 52ch;

  /* 레이아웃 폭 — 하드코딩 max-w-* 74곳을 대체 */
  --width-content-sm: 40rem;   /* 640px */
  --width-content-md: 56rem;   /* 896px */
  --width-content-lg: 72rem;   /* 1152px */
  --width-content-xl: 80rem;   /* 1280px */

  /* 종횡비 — 썸네일·미디어 박스 */
  --aspect-wide:   16 / 9;
  --aspect-card:   3 / 2;
  --aspect-square: 1 / 1;
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/tokens.test.ts`
Expected: PASS (12 tests)

- [ ] **Step 5: 기존 테스트 회귀 확인**

Run: `npm run test`
Expected: 전량 PASS

- [ ] **Step 6: 커밋**

```bash
git add tokens/semantic.css src/tokens.test.ts
git commit -m "feat(tokens): 역할 토큰 31개 및 measure/width/aspect 축 신설"
```

---

## Task 5: Tailwind 재매핑

기존 컴포넌트 400여 곳의 클래스명을 수정하지 않고 새 스케일을 적용하는 단계다. **이 Task에서만 기존 화면의 픽셀이 바뀐다.**

**Files:**
- Modify: `tailwind.config.js`, `src/tokens.test.ts`

- [ ] **Step 1: 실패하는 테스트 추가**

`src/tokens.test.ts` 끝에 추가한다.

```typescript
describe('Tailwind 연결', () => {
  const config = read('tailwind.config.js')

  it('fontSize 에 역할 키가 등록된다', () => {
    for (const role of ['display', 'h1', 'h2', 'h3', 'h4', 'body-lg', 'body', 'body-sm', 'caption', 'overline']) {
      expect(config, `fontSize 에 ${role} 없음`).toContain(`var(--font-size-${role})`)
    }
  })

  it('기존 fontSize 키가 래더 변수로 재매핑된다', () => {
    for (const rung of ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl']) {
      expect(config, `래더 ${rung} 미연결`).toContain(`var(--text-${rung})`)
    }
  })

  it('maxWidth 와 aspectRatio 가 토큰에 연결된다', () => {
    expect(config).toContain('var(--width-content-lg)')
    expect(config).toContain('var(--measure-prose)')
    expect(config).toContain('var(--aspect-wide)')
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/tokens.test.ts`
Expected: FAIL — `fontSize 에 display 없음`

- [ ] **Step 3: Tailwind 설정 수정**

`tailwind.config.js`의 `theme.extend` 안, 기존 `fontFamily` 블록 아래에 추가한다. 기존 `colors`, `borderRadius`, `boxShadow`, `spacing`, `transitionDuration` 블록은 수정하지 않는다.

```javascript
      fontSize: {
        // 래더 직결 — 기존 컴포넌트의 text-sm 등이 새 스케일을 따라간다
        '2xs':  'var(--text-2xs)',
        xs:     'var(--text-xs)',
        sm:     'var(--text-sm)',
        base:   'var(--text-md)',
        md:     'var(--text-md)',
        lg:     'var(--text-lg)',
        xl:     'var(--text-xl)',
        '2xl':  'var(--text-2xl)',
        '3xl':  'var(--text-3xl)',
        '4xl':  'var(--text-4xl)',
        '5xl':  'var(--text-5xl)',
        '6xl':  'var(--text-6xl)',
        // 역할 키 — 신규 템플릿은 이쪽을 쓴다
        display:   ['var(--font-size-display)',  { lineHeight: 'var(--font-leading-display)' }],
        h1:        ['var(--font-size-h1)',       { lineHeight: 'var(--font-leading-h1)' }],
        h2:        ['var(--font-size-h2)',       { lineHeight: 'var(--font-leading-h2)' }],
        h3:        ['var(--font-size-h3)',       { lineHeight: 'var(--font-leading-h3)' }],
        h4:        ['var(--font-size-h4)',       { lineHeight: 'var(--font-leading-h4)' }],
        'body-lg': ['var(--font-size-body-lg)',  { lineHeight: 'var(--font-leading-body-lg)' }],
        body:      ['var(--font-size-body)',     { lineHeight: 'var(--font-leading-body)' }],
        'body-sm': ['var(--font-size-body-sm)',  { lineHeight: 'var(--font-leading-body-sm)' }],
        caption:   ['var(--font-size-caption)',  { lineHeight: 'var(--font-leading-caption)' }],
        overline:  ['var(--font-size-overline)', { lineHeight: 'var(--font-leading-overline)' }],
      },
      fontWeight: {
        normal:   'var(--weight-normal)',
        medium:   'var(--weight-medium)',
        semibold: 'var(--weight-semibold)',
        bold:     'var(--weight-bold)',
      },
      lineHeight: {
        none:    'var(--leading-none)',
        tight:   'var(--leading-tight)',
        normal:  'var(--leading-normal)',
        relaxed: 'var(--leading-relaxed)',
      },
      letterSpacing: {
        tight:   'var(--tracking-tight)',
        normal:  'var(--tracking-normal)',
        wide:    'var(--tracking-wide)',
        wider:   'var(--tracking-wider)',
        widest:  'var(--tracking-widest)',
      },
      maxWidth: {
        'content-sm': 'var(--width-content-sm)',
        'content-md': 'var(--width-content-md)',
        'content-lg': 'var(--width-content-lg)',
        'content-xl': 'var(--width-content-xl)',
        prose:        'var(--measure-prose)',
        narrow:       'var(--measure-narrow)',
      },
      aspectRatio: {
        wide:   'var(--aspect-wide)',
        card:   'var(--aspect-card)',
        square: 'var(--aspect-square)',
      },
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/tokens.test.ts`
Expected: PASS (15 tests)

- [ ] **Step 5: 빌드와 기존 테스트 확인**

Run: `npm run build && npm run test`
Expected: 둘 다 성공

- [ ] **Step 6: 시각 회귀 비교 — 이 계획에서 가장 중요한 검증 지점**

Run: `npm run snapshot:diff`
Expected: 변경 건수가 0이 아니다. 타입 스케일을 재설계했으므로 **변경이 나오는 것이 정상**이다.

출력된 변경 목록에서 다음 두 가지를 구분한다.

1. **의도된 변화** — 글자 크기가 커지거나 작아졌지만 레이아웃은 정상
2. **깨짐** — 텍스트 잘림(ellipsis 과다), 컨테이너 넘침, 요소 겹침, 버튼 안 글자 삐져나옴

`.snapshots/base/<id>.png` 와 `.snapshots/diff/<id>.png` 를 나란히 열어 확인한다. 깨짐이 **1건이라도** 있으면 해당 컴포넌트의 원인 칸을 특정해 `tokens/base.css`의 래더 값을 조정하고 Step 5부터 다시 수행한다.

합격 조건: **깨짐 0건.**

- [ ] **Step 7: 커밋**

```bash
git add tailwind.config.js src/tokens.test.ts
git commit -m "feat(tokens): Tailwind fontSize/maxWidth/aspectRatio를 토큰에 연결"
```

---

## Task 6: 블로그 공용 타입

**Files:**
- Create: `src/templates/service/blog/types.ts`

- [ ] **Step 1: 타입 정의**

블로그 템플릿 4종이 공유하는 데이터 모양을 한 곳에 둔다. 기존 `src/templates/types.ts`의 `NavItem` 패턴을 따른다.

```typescript
// src/templates/service/blog/types.ts
export interface BlogCategory {
  /** 필터 식별자. 'all' 은 전체 보기 예약어 */
  id: string
  label: string
}

export interface BlogPost {
  id: string
  title: string
  /** 목록 카드에 보이는 2줄 요약 */
  excerpt?: string
  /** 카테고리 id. BlogCategory.id 와 일치해야 한다 */
  categoryId: string
  categoryLabel: string
  /** 표시용 날짜 문자열. 포맷팅은 호출 측 책임 */
  date: string
  author?: string
  /** 썸네일 이미지 URL. 없으면 플레이스홀더가 렌더링된다 */
  thumbnail?: string
  href: string
}

export interface BlogArticleSection {
  id: string
  heading: string
  /** 문단 배열. 각 원소가 <p> 하나가 된다 */
  paragraphs: string[]
}
```

- [ ] **Step 2: 타입 컴파일 확인**

Run: `npx tsc --noEmit`
Expected: 오류 없음

- [ ] **Step 3: 커밋**

```bash
git add src/templates/service/blog/types.ts
git commit -m "feat(blog): 블로그 템플릿 공용 타입 추가"
```

---

## Task 7: 토큰 준수 검사 (V1 자동화)

블로그 템플릿을 쓰기 **전에** 감시 장치를 먼저 만든다. 그래야 구현 중에 `text-[17px]` 같은 우회가 들어오지 않는다.

**Files:**
- Create: `src/templates/service/blog/blog-tokens.test.ts`

- [ ] **Step 1: 검사 테스트 작성**

기존 코드베이스는 `px-[var(--page-padding)]` 처럼 **대괄호 안에 토큰 참조**를 쓴다. 이것은 정상이므로 위반이 아니다. `var(--` 를 포함하지 않는 대괄호 값만 위반으로 잡는다.

```typescript
// src/templates/service/blog/blog-tokens.test.ts
import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const DIR = __dirname
const files = readdirSync(DIR).filter((f) => f.endsWith('.tsx'))

describe('블로그 템플릿 토큰 준수 (스펙 7-4 V1)', () => {
  it('검사 대상 파일이 존재한다', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  it.each(files)('%s: 토큰이 아닌 임의값을 쓰지 않는다', (file) => {
    const src = readFileSync(join(DIR, file), 'utf-8')
    const violations: string[] = []

    // Tailwind 임의값 문법 중 var(--) 참조가 아닌 것
    for (const m of src.matchAll(/\b[a-z-]+-\[([^\]]+)\]/g)) {
      if (!m[1].includes('var(--')) violations.push(m[0])
    }
    // 인라인 style 의 px / rem 리터럴
    for (const m of src.matchAll(/style=\{\{[^}]*?\b\d+(?:px|rem)\b[^}]*?\}\}/g)) {
      violations.push(m[0].slice(0, 60))
    }

    expect(violations, `${file} 위반: ${violations.join(', ')}`).toEqual([])
  })

  it.each(files)('%s: 1층 래더를 직접 참조하지 않는다', (file) => {
    const src = readFileSync(join(DIR, file), 'utf-8')
    const direct = [...src.matchAll(/var\(--(?:text|leading|weight|tracking)-[a-z0-9-]+\)/g)].map((m) => m[0])
    expect(direct, `${file} 은 역할 토큰(--font-size-*)을 써야 한다`).toEqual([])
  })

  it('블로그 전용 토큰은 3개 이하다 (스펙 7-4 V4)', () => {
    const css = readFileSync(join(DIR, '..', '..', '..', '..', 'tokens', 'semantic.css'), 'utf-8')
    const blogTokens = [...css.matchAll(/^\s*(--blog-[a-z0-9-]+)\s*:/gm)].map((m) => m[1])
    expect(blogTokens.length, `--blog-* 초과: ${blogTokens.join(', ')}`).toBeLessThanOrEqual(3)
  })
})
```

- [ ] **Step 2: 테스트 실행 확인**

이 시점에는 `.tsx` 파일이 없으므로 첫 번째 검사가 실패한다. 이것이 정상이다.

Run: `npx vitest run src/templates/service/blog/blog-tokens.test.ts`
Expected: FAIL — `검사 대상 파일이 존재한다` 가 실패 (0 > 0 불성립)

- [ ] **Step 3: 커밋하지 않고 Task 8로 넘어간다**

이 시점의 테스트는 실패 상태다. 실패하는 테스트를 단독 커밋하면 `git bisect` 시 빨간 커밋이 남는다. 이 파일은 Task 8 Step 5에서 `BlogCardGrid.tsx` 와 **함께** 커밋한다.

---

## Task 8: BlogCardGrid (벤치마크 재현 대상)

**Files:**
- Create: `src/templates/service/blog/BlogCardGrid.tsx`, `src/templates/service/blog/BlogCardGrid.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

```tsx
// src/templates/service/blog/BlogCardGrid.test.tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BlogCardGrid } from './BlogCardGrid'
import type { BlogCategory, BlogPost } from './types'

const CATEGORIES: BlogCategory[] = [
  { id: 'all', label: '전체' },
  { id: 'tech', label: '기술' },
  { id: 'culture', label: '문화' },
]

const POSTS: BlogPost[] = [
  { id: '1', title: 'OMS 재구축 회고', categoryId: 'tech', categoryLabel: '기술', date: '2026-09-01', href: '/p/1', excerpt: '주문 관리 시스템을 다시 만들며 배운 것' },
  { id: '2', title: '사내 해커톤 후기', categoryId: 'culture', categoryLabel: '문화', date: '2026-08-20', href: '/p/2' },
  { id: '3', title: 'WMS 성능 개선', categoryId: 'tech', categoryLabel: '기술', date: '2026-08-10', href: '/p/3' },
]

describe('BlogCardGrid', () => {
  it('전체 글을 렌더링한다', () => {
    render(<BlogCardGrid title="인사이트" categories={CATEGORIES} posts={POSTS} />)
    expect(screen.getByText('OMS 재구축 회고')).toBeInTheDocument()
    expect(screen.getByText('사내 해커톤 후기')).toBeInTheDocument()
    expect(screen.getByText('WMS 성능 개선')).toBeInTheDocument()
  })

  it('카테고리를 선택하면 해당 글만 남는다', async () => {
    const user = userEvent.setup()
    render(<BlogCardGrid title="인사이트" categories={CATEGORIES} posts={POSTS} />)
    await user.click(screen.getByRole('button', { name: '문화' }))
    expect(screen.getByText('사내 해커톤 후기')).toBeInTheDocument()
    expect(screen.queryByText('OMS 재구축 회고')).not.toBeInTheDocument()
  })

  it('선택된 카테고리를 aria-pressed 로 알린다', async () => {
    const user = userEvent.setup()
    render(<BlogCardGrid title="인사이트" categories={CATEGORIES} posts={POSTS} />)
    const techButton = screen.getByRole('button', { name: '기술' })
    expect(techButton).toHaveAttribute('aria-pressed', 'false')
    await user.click(techButton)
    expect(techButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('글이 없으면 빈 상태 문구를 보여준다', async () => {
    const user = userEvent.setup()
    render(<BlogCardGrid title="인사이트" categories={CATEGORIES} posts={[POSTS[0]]} />)
    await user.click(screen.getByRole('button', { name: '문화' }))
    expect(screen.getByText('해당 카테고리의 글이 없습니다.')).toBeInTheDocument()
  })

  it('각 글이 상세 링크를 갖는다', () => {
    render(<BlogCardGrid title="인사이트" categories={CATEGORIES} posts={POSTS} />)
    expect(screen.getByRole('link', { name: /OMS 재구축 회고/ })).toHaveAttribute('href', '/p/1')
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/templates/service/blog/BlogCardGrid.test.tsx`
Expected: FAIL — `Failed to resolve import "./BlogCardGrid"`

- [ ] **Step 3: 구현**

역할 토큰 유틸리티(`text-h1`, `text-body`, `text-overline`)와 레이아웃 토큰(`max-w-content-lg`, `aspect-card`)만 사용한다. 리터럴 임의값은 쓰지 않는다.

```tsx
// src/templates/service/blog/BlogCardGrid.tsx
import { useMemo, useState } from 'react'
import { cn } from '../../../utils/cn'
import type { BlogCategory, BlogPost } from './types'

export interface BlogCardGridProps {
  title: string
  description?: string
  categories: BlogCategory[]
  posts: BlogPost[]
  /** 더 불러올 글이 있을 때 버튼을 노출한다 */
  onLoadMore?: () => void
  className?: string
}

export function BlogCardGrid({
  title, description, categories, posts, onLoadMore, className,
}: BlogCardGridProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? 'all')

  const visible = useMemo(
    () => (activeId === 'all' ? posts : posts.filter((p) => p.categoryId === activeId)),
    [posts, activeId],
  )

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="mx-auto max-w-content-lg px-[var(--page-padding)] py-[var(--spacing-2xl)]">
        <header className="mb-[var(--spacing-xl)]">
          <h1 className="text-h1 font-bold tracking-tight text-foreground">{title}</h1>
          {description && (
            <p className="mt-[var(--spacing-md)] max-w-prose text-body-lg text-secondary">{description}</p>
          )}
        </header>

        <nav aria-label="카테고리" className="mb-[var(--spacing-xl)] flex flex-wrap gap-[var(--spacing-sm)]">
          {categories.map((c) => {
            const active = c.id === activeId
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveId(c.id)}
                className={cn(
                  'rounded-badge px-[var(--spacing-md)] py-[var(--spacing-sm)] text-body-sm font-medium transition-colors duration-default',
                  active
                    ? 'bg-brand text-on-brand'
                    : 'bg-surface-subtle text-secondary hover:bg-surface-raised hover:text-foreground',
                )}
              >
                {c.label}
              </button>
            )
          })}
        </nav>

        {visible.length === 0 ? (
          <p className="py-[var(--spacing-2xl)] text-center text-body text-muted">
            해당 카테고리의 글이 없습니다.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-[var(--spacing-lg)] sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((post) => (
              <li key={post.id}>
                <a
                  href={post.href}
                  className="group flex h-full flex-col overflow-hidden rounded-card bg-surface shadow-card transition-shadow duration-default hover:shadow-raised"
                >
                  <div className="aspect-card w-full overflow-hidden bg-surface-subtle">
                    {post.thumbnail && (
                      <img
                        src={post.thumbnail}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-slow group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-[var(--spacing-lg)]">
                    <span className="text-overline font-medium uppercase tracking-widest text-brand">
                      {post.categoryLabel}
                    </span>
                    <h2 className="mt-[var(--spacing-sm)] text-h3 font-semibold text-foreground">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-[var(--spacing-sm)] line-clamp-2 text-body text-secondary">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-auto pt-[var(--spacing-md)] text-caption text-muted">
                      <time dateTime={post.date}>{post.date}</time>
                      {post.author && <span> · {post.author}</span>}
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}

        {onLoadMore && visible.length > 0 && (
          <div className="mt-[var(--spacing-xl)] flex justify-center">
            <button
              type="button"
              onClick={onLoadMore}
              className="rounded-btn border border-border px-[var(--spacing-lg)] py-[var(--spacing-sm)] text-body font-medium text-foreground transition-colors duration-default hover:bg-surface-subtle"
            >
              더 보기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/templates/service/blog/`
Expected: `BlogCardGrid.test.tsx` 5 PASS, `blog-tokens.test.ts` 전부 PASS

> `line-clamp-2` 가 동작하지 않으면 Tailwind 3.4 기본 포함 플러그인이므로 설정 변경이 필요 없다. 빌드 경고가 나면 해당 클래스만 `overflow-hidden` + `[display:-webkit-box]` 조합으로 바꾸지 말고, 먼저 `npx tailwindcss --help` 로 버전을 확인한다.

- [ ] **Step 5: 커밋**

```bash
git add src/templates/service/blog/BlogCardGrid.tsx \
        src/templates/service/blog/BlogCardGrid.test.tsx \
        src/templates/service/blog/blog-tokens.test.ts
git commit -m "feat(blog): BlogCardGrid 템플릿 및 토큰 준수 검사 추가"
```

---

## Task 9: BlogMagazine

**Files:**
- Create: `src/templates/service/blog/BlogMagazine.tsx`

- [ ] **Step 1: 구현**

래더 상단 칸(`text-display`)과 `tracking-tight`, `leading-none` 을 검증하는 템플릿이다.

```tsx
// src/templates/service/blog/BlogMagazine.tsx
import { cn } from '../../../utils/cn'
import type { BlogPost } from './types'

export interface BlogMagazineProps {
  eyebrow?: string
  /** 상단 대형 피처드 글 */
  featured: BlogPost
  /** 피처드 아래 목록 */
  posts: BlogPost[]
  className?: string
}

export function BlogMagazine({ eyebrow, featured, posts, className }: BlogMagazineProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="mx-auto max-w-content-xl px-[var(--page-padding)] py-[var(--spacing-2xl)]">
        {eyebrow && (
          <p className="mb-[var(--spacing-lg)] text-overline font-medium uppercase tracking-widest text-brand">
            {eyebrow}
          </p>
        )}

        <a href={featured.href} className="group block">
          <div className="aspect-wide w-full overflow-hidden rounded-card bg-surface-subtle">
            {featured.thumbnail && (
              <img
                src={featured.thumbnail}
                alt=""
                className="h-full w-full object-cover transition-transform duration-slow group-hover:scale-105"
              />
            )}
          </div>
          <h1 className="mt-[var(--spacing-lg)] max-w-prose text-display font-bold leading-none tracking-tight text-foreground">
            {featured.title}
          </h1>
          {featured.excerpt && (
            <p className="mt-[var(--spacing-md)] max-w-prose text-body-lg leading-relaxed text-secondary">
              {featured.excerpt}
            </p>
          )}
          <div className="mt-[var(--spacing-md)] text-caption text-muted">
            <span className="font-medium text-brand">{featured.categoryLabel}</span>
            <span> · </span>
            <time dateTime={featured.date}>{featured.date}</time>
          </div>
        </a>

        <hr className="my-[var(--spacing-xl)] border-border-subtle" />

        <ul className="grid grid-cols-1 gap-[var(--spacing-xl)] md:grid-cols-2">
          {posts.map((post) => (
            <li key={post.id}>
              <a href={post.href} className="group block">
                <span className="text-overline font-medium uppercase tracking-widest text-brand">
                  {post.categoryLabel}
                </span>
                <h2 className="mt-[var(--spacing-sm)] text-h2 font-semibold leading-tight text-foreground group-hover:text-brand">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-[var(--spacing-sm)] text-body text-secondary">{post.excerpt}</p>
                )}
                <time dateTime={post.date} className="mt-[var(--spacing-sm)] block text-caption text-muted">
                  {post.date}
                </time>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 토큰 준수 검사 통과 확인**

Run: `npx vitest run src/templates/service/blog/blog-tokens.test.ts`
Expected: PASS — `BlogMagazine.tsx` 항목이 추가되어도 위반 0건

- [ ] **Step 3: 커밋**

```bash
git add src/templates/service/blog/BlogMagazine.tsx
git commit -m "feat(blog): BlogMagazine 템플릿 추가"
```

---

## Task 10: BlogMinimalList

**Files:**
- Create: `src/templates/service/blog/BlogMinimalList.tsx`

- [ ] **Step 1: 구현**

썸네일 없이 타이포와 여백만으로 위계를 만드는 템플릿이다. `--font-size-overline` 과 `--font-tracking-overline` 을 검증한다.

```tsx
// src/templates/service/blog/BlogMinimalList.tsx
import { cn } from '../../../utils/cn'
import type { BlogPost } from './types'

export interface BlogMinimalListProps {
  title: string
  description?: string
  posts: BlogPost[]
  className?: string
}

export function BlogMinimalList({ title, description, posts, className }: BlogMinimalListProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="mx-auto max-w-content-sm px-[var(--page-padding)] py-[var(--spacing-2xl)]">
        <header className="mb-[var(--spacing-xl)]">
          <h1 className="text-h1 font-bold tracking-tight text-foreground">{title}</h1>
          {description && (
            <p className="mt-[var(--spacing-md)] text-body-lg leading-relaxed text-secondary">
              {description}
            </p>
          )}
        </header>

        <ul>
          {posts.map((post) => (
            <li key={post.id} className="border-b border-border-subtle last:border-b-0">
              <a
                href={post.href}
                className="flex flex-col gap-[var(--spacing-xs)] py-[var(--spacing-lg)] transition-colors duration-default hover:bg-surface-subtle"
              >
                <span className="text-overline font-medium uppercase tracking-widest text-muted">
                  {post.categoryLabel}
                </span>
                <h2 className="text-h3 font-semibold leading-tight text-foreground">{post.title}</h2>
                {post.excerpt && <p className="text-body text-secondary">{post.excerpt}</p>}
                <time dateTime={post.date} className="text-caption text-muted">{post.date}</time>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 토큰 준수 검사 통과 확인**

Run: `npx vitest run src/templates/service/blog/blog-tokens.test.ts`
Expected: PASS

- [ ] **Step 3: 커밋**

```bash
git add src/templates/service/blog/BlogMinimalList.tsx
git commit -m "feat(blog): BlogMinimalList 템플릿 추가"
```

---

## Task 11: BlogArticle

**Files:**
- Create: `src/templates/service/blog/BlogArticle.tsx`

- [ ] **Step 1: 구현**

`--measure-prose` 와 `--font-leading-body-lg` 를 검증하는 유일한 템플릿이다.

```tsx
// src/templates/service/blog/BlogArticle.tsx
import { cn } from '../../../utils/cn'
import type { BlogArticleSection, BlogPost } from './types'

export interface BlogArticleProps {
  categoryLabel: string
  title: string
  lead?: string
  author?: string
  date: string
  coverImage?: string
  sections: BlogArticleSection[]
  /** 본문 우측 목차에 노출된다. 비어 있으면 목차를 렌더링하지 않는다 */
  showToc?: boolean
  relatedPosts?: BlogPost[]
  className?: string
}

export function BlogArticle({
  categoryLabel, title, lead, author, date, coverImage,
  sections, showToc = true, relatedPosts = [], className,
}: BlogArticleProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <article className="mx-auto max-w-content-md px-[var(--page-padding)] py-[var(--spacing-2xl)]">
        <header className="mx-auto max-w-prose">
          <span className="text-overline font-medium uppercase tracking-widest text-brand">
            {categoryLabel}
          </span>
          <h1 className="mt-[var(--spacing-md)] text-h1 font-bold leading-tight tracking-tight text-foreground">
            {title}
          </h1>
          {lead && (
            <p className="mt-[var(--spacing-lg)] text-body-lg leading-relaxed text-secondary">{lead}</p>
          )}
          <div className="mt-[var(--spacing-lg)] text-caption text-muted">
            {author && <span>{author} · </span>}
            <time dateTime={date}>{date}</time>
          </div>
        </header>

        {coverImage && (
          <div className="mt-[var(--spacing-xl)] aspect-wide w-full overflow-hidden rounded-card bg-surface-subtle">
            <img src={coverImage} alt="" className="h-full w-full object-cover" />
          </div>
        )}

        {showToc && sections.length > 0 && (
          <nav
            aria-label="목차"
            className="mx-auto mt-[var(--spacing-xl)] max-w-prose rounded-card bg-surface-subtle p-[var(--spacing-lg)]"
          >
            <p className="text-overline font-medium uppercase tracking-widest text-muted">목차</p>
            <ol className="mt-[var(--spacing-sm)] flex flex-col gap-[var(--spacing-xs)]">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-body text-secondary hover:text-brand">
                    {i + 1}. {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="mx-auto mt-[var(--spacing-xl)] max-w-prose">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="mt-[var(--spacing-xl)] first:mt-0">
              <h2 className="text-h2 font-semibold leading-tight text-foreground">{s.heading}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i} className="mt-[var(--spacing-md)] text-body-lg leading-relaxed text-secondary">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        {relatedPosts.length > 0 && (
          <footer className="mt-[var(--spacing-2xl)] border-t border-border-subtle pt-[var(--spacing-xl)]">
            <h2 className="text-h3 font-semibold text-foreground">관련 글</h2>
            <ul className="mt-[var(--spacing-lg)] grid grid-cols-1 gap-[var(--spacing-lg)] sm:grid-cols-3">
              {relatedPosts.map((post) => (
                <li key={post.id}>
                  <a href={post.href} className="group block">
                    <span className="text-overline font-medium uppercase tracking-widest text-muted">
                      {post.categoryLabel}
                    </span>
                    <h3 className="mt-[var(--spacing-xs)] text-body font-semibold leading-tight text-foreground group-hover:text-brand">
                      {post.title}
                    </h3>
                    <time dateTime={post.date} className="mt-[var(--spacing-xs)] block text-caption text-muted">
                      {post.date}
                    </time>
                  </a>
                </li>
              ))}
            </ul>
          </footer>
        )}
      </article>
    </div>
  )
}
```

- [ ] **Step 2: 토큰 준수 검사 및 전체 테스트 통과 확인**

Run: `npm run test`
Expected: 전량 PASS

- [ ] **Step 3: 커밋**

```bash
git add src/templates/service/blog/BlogArticle.tsx
git commit -m "feat(blog): BlogArticle 템플릿 추가"
```

---

## Task 12: export 및 스토리

**Files:**
- Modify: `src/templates/index.ts`
- Create: `src/stories/templates/Blog.stories.tsx`

- [ ] **Step 1: export 추가**

`src/templates/index.ts` 끝, `export type { DetailField } from './business/types'` **앞**에 추가한다.

```typescript
export { BlogCardGrid } from './service/blog/BlogCardGrid'
export type { BlogCardGridProps } from './service/blog/BlogCardGrid'
export { BlogMagazine } from './service/blog/BlogMagazine'
export type { BlogMagazineProps } from './service/blog/BlogMagazine'
export { BlogMinimalList } from './service/blog/BlogMinimalList'
export type { BlogMinimalListProps } from './service/blog/BlogMinimalList'
export { BlogArticle } from './service/blog/BlogArticle'
export type { BlogArticleProps } from './service/blog/BlogArticle'
export type { BlogCategory, BlogPost, BlogArticleSection } from './service/blog/types'
```

- [ ] **Step 2: 스토리 작성**

기존 `Landing.stories.tsx` 패턴을 따른다.

```tsx
// src/stories/templates/Blog.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { BlogCardGrid } from '../../templates/service/blog/BlogCardGrid'
import { BlogMagazine } from '../../templates/service/blog/BlogMagazine'
import { BlogMinimalList } from '../../templates/service/blog/BlogMinimalList'
import { BlogArticle } from '../../templates/service/blog/BlogArticle'
import type { BlogCategory, BlogPost } from '../../templates/service/blog/types'

const CATEGORIES: BlogCategory[] = [
  { id: 'all', label: '전체' },
  { id: 'tech', label: '기술' },
  { id: 'culture', label: '문화' },
  { id: 'product', label: '프로덕트' },
]

const POSTS: BlogPost[] = [
  { id: '1', title: 'OMS 재구축, 18개월의 기록', excerpt: '주문 관리 시스템을 처음부터 다시 만들며 마주친 문제와 선택을 정리했습니다.', categoryId: 'tech', categoryLabel: '기술', date: '2026-09-01', author: '개발팀', href: '#' },
  { id: '2', title: '사내 해커톤에서 나온 것들', excerpt: '이틀 동안 열두 팀이 만든 결과물과, 그중 실제로 도입된 세 가지.', categoryId: 'culture', categoryLabel: '문화', date: '2026-08-20', author: 'AX팀', href: '#' },
  { id: '3', title: 'WMS 피킹 경로 최적화', excerpt: '창고 동선을 다시 계산해 평균 피킹 시간을 줄인 방법.', categoryId: 'tech', categoryLabel: '기술', date: '2026-08-10', author: '물류IT', href: '#' },
  { id: '4', title: '디자인 시스템을 토큰부터 다시', excerpt: '색상만 있던 시스템에 타이포그래피 축을 세운 과정.', categoryId: 'product', categoryLabel: '프로덕트', date: '2026-07-28', author: 'AX팀', href: '#' },
  { id: '5', title: 'PRM 파트너 온보딩 개선', excerpt: '가입부터 첫 주문까지 걸리던 시간을 줄였습니다.', categoryId: 'product', categoryLabel: '프로덕트', date: '2026-07-15', author: '프로덕트팀', href: '#' },
  { id: '6', title: '신입 개발자 3개월 회고', excerpt: '처음 합류해 겪은 것들을 솔직하게 적었습니다.', categoryId: 'culture', categoryLabel: '문화', date: '2026-07-02', author: '개발팀', href: '#' },
]

const meta: Meta = { title: 'Templates/Service/Blog', parameters: { layout: 'fullscreen' } }
export default meta

export const CardGrid: StoryObj = {
  render: () => (
    <BlogCardGrid
      title="SFOOD 인사이트"
      description="식품 유통의 문제를 기술로 푸는 과정을 기록합니다."
      categories={CATEGORIES}
      posts={POSTS}
      onLoadMore={() => {}}
    />
  ),
}

export const Magazine: StoryObj = {
  render: () => <BlogMagazine eyebrow="이번 달의 글" featured={POSTS[0]} posts={POSTS.slice(1, 5)} />,
}

export const MinimalList: StoryObj = {
  render: () => (
    <BlogMinimalList
      title="기록"
      description="짧게 자주 남기는 글 모음입니다."
      posts={POSTS}
    />
  ),
}

export const Article: StoryObj = {
  render: () => (
    <BlogArticle
      categoryLabel="프로덕트"
      title="디자인 시스템을 토큰부터 다시 세웠습니다"
      lead="색상 90개만 있던 시스템에 타이포그래피와 레이아웃 축을 추가하고, 그 토큰만으로 이 블로그를 만들었습니다."
      author="AX팀"
      date="2026-09-11"
      sections={[
        { id: 'problem', heading: '무엇이 문제였나', paragraphs: [
          '토큰 119개 중 90개가 색상이었습니다. 글자 크기, 굵기, 행간, 자간, 콘텐츠 폭을 제어하는 토큰은 하나도 없었습니다.',
          '컴포넌트는 Tailwind 기본값을 직접 쓰고 있었고, 화면마다 최대 폭이 제각각이었습니다.',
        ] },
        { id: 'approach', heading: '어떻게 풀었나', paragraphs: [
          '크기 사다리를 한 벌 만들고, 그 위에 역할 토큰 층을 얹었습니다. 컴포넌트는 역할 토큰만 참조합니다.',
          'Tailwind의 fontSize 키를 새 토큰에 다시 연결해, 기존 컴포넌트를 한 줄도 고치지 않고 새 스케일을 적용했습니다.',
        ] },
        { id: 'result', heading: '무엇이 달라졌나', paragraphs: [
          '이 글이 놓인 페이지는 토큰 밖의 값을 하나도 쓰지 않았습니다. 그것을 테스트로 강제하고 있습니다.',
        ] },
      ]}
      relatedPosts={POSTS.slice(0, 3)}
    />
  ),
}
```

- [ ] **Step 3: 빌드 및 테스트 확인**

Run: `npm run build && npm run test && npm run build-storybook`
Expected: 셋 다 성공

- [ ] **Step 4: 패키지 포함 확인**

Run: `npm pack --dry-run 2>&1 | grep -c "dist/"`
Expected: 1 이상 (블로그 템플릿은 `dist/index.js` 에 번들된다)

- [ ] **Step 5: 커밋**

```bash
git add src/templates/index.ts src/stories/templates/Blog.stories.tsx
git commit -m "feat(blog): 블로그 템플릿 export 및 스토리 추가"
```

---

## Task 13: 문서화

**Files:**
- Create: `src/stories/docs/Typography.mdx`
- Modify: `src/stories/docs/TokenReference.mdx`

- [ ] **Step 1: Typography 문서 작성**

```mdx
import { Meta } from '@storybook/addon-docs/blocks'

<Meta title="Docs/Typography" />

# 타이포그래피

타이포 토큰은 2층 구조입니다.

<table>
  <thead>
    <tr><th>층</th><th>파일</th><th>예시</th><th>컴포넌트에서 사용</th></tr>
  </thead>
  <tbody>
    <tr><td>1층 타입 래더</td><td><code>tokens/base.css</code></td><td><code>--text-lg</code></td><td><strong>금지</strong></td></tr>
    <tr><td>2층 역할 토큰</td><td><code>tokens/semantic.css</code></td><td><code>--font-size-body</code></td><td><strong>이것만 사용</strong></td></tr>
  </tbody>
</table>

컴포넌트가 1층을 직접 참조하면 역할이 사라져 나중에 위계를 조정할 수 없습니다. 블로그 템플릿에는 이 규칙을 강제하는 테스트(`src/templates/service/blog/blog-tokens.test.ts`)가 있습니다.

## 타입 래더 (1층)

<table>
  <thead><tr><th>토큰</th><th>크기</th></tr></thead>
  <tbody>
    <tr><td><code>--text-2xs</code></td><td>11px</td></tr>
    <tr><td><code>--text-xs</code></td><td>12px</td></tr>
    <tr><td><code>--text-sm</code></td><td>14px</td></tr>
    <tr><td><code>--text-md</code></td><td>16px</td></tr>
    <tr><td><code>--text-lg</code></td><td>18px</td></tr>
    <tr><td><code>--text-xl</code></td><td>22px</td></tr>
    <tr><td><code>--text-2xl</code></td><td>28px</td></tr>
    <tr><td><code>--text-3xl</code></td><td>36px</td></tr>
    <tr><td><code>--text-4xl</code></td><td>48px</td></tr>
    <tr><td><code>--text-5xl</code></td><td>60px</td></tr>
    <tr><td><code>--text-6xl</code></td><td>72px</td></tr>
  </tbody>
</table>

## 역할 토큰 (2층)

<table>
  <thead><tr><th>역할</th><th>Tailwind 클래스</th><th>용도</th></tr></thead>
  <tbody>
    <tr><td><code>display</code></td><td><code>text-display</code></td><td>매거진 헤드라인</td></tr>
    <tr><td><code>h1</code>~<code>h4</code></td><td><code>text-h1</code>~<code>text-h4</code></td><td>제목 위계</td></tr>
    <tr><td><code>body-lg</code></td><td><code>text-body-lg</code></td><td>긴 글 본문 (블로그, 랜딩)</td></tr>
    <tr><td><code>body</code></td><td><code>text-body</code></td><td>기본 본문 (기간계 기준선)</td></tr>
    <tr><td><code>body-sm</code></td><td><code>text-body-sm</code></td><td>보조 본문</td></tr>
    <tr><td><code>caption</code></td><td><code>text-caption</code></td><td>날짜, 메타 정보</td></tr>
    <tr><td><code>overline</code></td><td><code>text-overline</code></td><td>카테고리 태그, 라벨</td></tr>
  </tbody>
</table>

## 밀도가 다른 화면은 어떻게 하나

런타임 밀도 모드를 두지 않습니다. **화면이 역할 토큰을 골라 씁니다.**

- 기간계(ERP/OMS/WMS): 본문에 <code>text-body</code>(14px)
- 블로그·랜딩: 본문에 <code>text-body-lg</code>(18px)

이유는 설계 문서 3절(`docs/superpowers/specs/2026-09-11-blog-tokens-design.md`)을 참고하세요.

## 레이아웃 폭

<table>
  <thead><tr><th>토큰</th><th>Tailwind</th><th>용도</th></tr></thead>
  <tbody>
    <tr><td><code>--measure-prose</code></td><td><code>max-w-prose</code></td><td>긴 본문 1열 (68ch)</td></tr>
    <tr><td><code>--measure-narrow</code></td><td><code>max-w-narrow</code></td><td>좁은 본문 (52ch)</td></tr>
    <tr><td><code>--width-content-sm</code></td><td><code>max-w-content-sm</code></td><td>640px</td></tr>
    <tr><td><code>--width-content-md</code></td><td><code>max-w-content-md</code></td><td>896px</td></tr>
    <tr><td><code>--width-content-lg</code></td><td><code>max-w-content-lg</code></td><td>1152px</td></tr>
    <tr><td><code>--width-content-xl</code></td><td><code>max-w-content-xl</code></td><td>1280px</td></tr>
  </tbody>
</table>
```

- [ ] **Step 2: TokenReference 갱신**

`src/stories/docs/TokenReference.mdx` 의 `## Spacing 토큰` 섹션 **앞**에 아래를 삽입한다.

```mdx
## 타이포그래피 토큰

타이포 토큰은 2층 구조이며 분량이 많아 별도 문서로 분리했습니다. **Docs/Typography** 를 참고하세요.

컴포넌트는 역할 토큰(`--font-size-body` 등)만 사용하고, 타입 래더(`--text-lg` 등)를 직접 참조하지 않습니다.

## 레이아웃 폭 / 종횡비 토큰

<table>
  <thead><tr><th>토큰</th><th>용도</th></tr></thead>
  <tbody>
    <tr><td><code>--measure-prose</code></td><td>긴 본문 1열 최대 폭 (68ch)</td></tr>
    <tr><td><code>--measure-narrow</code></td><td>좁은 본문 최대 폭 (52ch)</td></tr>
    <tr><td><code>--width-content-sm/md/lg/xl</code></td><td>페이지 컨테이너 최대 폭</td></tr>
    <tr><td><code>--aspect-wide</code></td><td>16:9 미디어 박스</td></tr>
    <tr><td><code>--aspect-card</code></td><td>3:2 카드 썸네일</td></tr>
    <tr><td><code>--aspect-square</code></td><td>1:1 정사각 썸네일</td></tr>
  </tbody>
</table>
```

- [ ] **Step 3: Storybook 빌드 확인**

Run: `npm run build-storybook`
Expected: 성공. 빌드 후 `grep -c "Typography" storybook-static/index.json` 이 1 이상

- [ ] **Step 4: 커밋**

```bash
git add src/stories/docs/Typography.mdx src/stories/docs/TokenReference.mdx
git commit -m "docs(tokens): 타이포그래피 및 레이아웃 폭 토큰 문서 추가"
```

---

## Task 14: 최종 검증 (스펙 7-3, 7-4)

여기서 "사내 블로그를 신규 토큰으로 디자인할 수 있다"를 실제로 입증한다.

**Files:**
- Modify: `docs/benchmarks/studeo-insights.md`

- [ ] **Step 1: T1 기존 회귀**

Run: `npm run test`
Expected: 전량 PASS, 실패 0건

- [ ] **Step 2: T2 시각 회귀**

Run: `npm run snapshot:diff`
Expected: 변경 목록이 출력된다. 목록의 모든 항목을 `.snapshots/base/` 와 `.snapshots/diff/` 에서 비교해 **깨짐(텍스트 잘림·넘침·겹침) 0건**임을 확인한다. 블로그 4종은 신규이므로 `추가` 로 잡힌다.

- [ ] **Step 3: T3 반응형**

Run: `npm run dev` 후 브라우저에서 `Templates/Service/Blog` 의 4개 스토리를 390px / 768px / 1280px 폭으로 확인
Expected: 세 폭 모두에서 가로 스크롤 0건, 텍스트 잘림 0건

- [ ] **Step 4: T4 다크모드**

Storybook 툴바의 Theme 을 dark 로 전환해 블로그 4종을 확인한다.
Expected: 배경이 투명하게 비치는 요소 0건, 읽을 수 없을 만큼 대비가 낮은 텍스트 0건

- [ ] **Step 5: T5 접근성**

Storybook Accessibility 패널에서 블로그 4개 스토리를 확인한다.
Expected: violation 0건

- [ ] **Step 6: V1 임의값 0건**

Run: `npx vitest run src/templates/service/blog/blog-tokens.test.ts`
Expected: PASS

추가로 육안 확인을 위해 실행한다.

Run: `grep -rnoE '\b[a-z-]+-\[[^]]+\]' src/templates/service/blog/*.tsx | grep -v 'var(--' | wc -l`
Expected: `0`

- [ ] **Step 7: V4 블로그 전용 토큰 0건**

Run: `grep -c -- '--blog-' tokens/semantic.css tokens/base.css`
Expected: 두 파일 모두 `0`

- [ ] **Step 8: V2 토큰 커버리지 산정**

`docs/benchmarks/studeo-insights.md` 의 계측 표를 기준으로 계산한다.

- 분모: 계측한 전체 항목 수 (타이포 5행 × 4속성 + 레이아웃 6행)
- 분자: `래더 대응` / `토큰 대응` 열에 **토큰 이름이 적힌** 항목 수

Expected: **90% 이상**

- [ ] **Step 9: V3 구조 재현 확인**

`CardGrid` 스토리와 벤치마크 스크린샷을 나란히 놓고 항목별로 대조한다.

| 항목 | 확인 |
|---|---|
| 카드 그리드 3열 → 2열 → 1열 | |
| 카테고리 필터 바 | |
| 썸네일 종횡비 | |
| 카드 내부 위계 (태그 → 제목 → 요약 → 날짜) | |
| 더 보기 버튼 | |

Expected: 전 항목 충족

- [ ] **Step 10: 판정 기록 작성**

`docs/benchmarks/studeo-insights.md` 의 `## 판정 기록` 섹션을 채운다. V2에서 토큰으로 덮지 못한 항목 각각을 아래 둘 중 하나로 판정하고 사유를 적는다.

- **구조적 결함** → 전역 래더/역할 토큰으로 승격. 이 경우 Task 3 또는 Task 4로 돌아가 토큰을 추가하고 Task 14를 다시 수행한다.
- **벤치마크 고유 표현** → 채택하지 않음. 기각 사유를 적는다.

부족분을 블로그 파일에만 임의값으로 때우는 것은 금지한다. Step 6이 이를 차단한다.

- [ ] **Step 11: 최종 산출물 확인 및 커밋**

Run: `npm run build && npm run test && npm run build-storybook`
Expected: 셋 다 성공

```bash
git add docs/benchmarks/studeo-insights.md
git commit -m "docs(bench): 벤치마크 재현 검증 결과 및 판정 기록"
```

- [ ] **Step 12: 브랜치 및 PR**

`dev-branch-pr` 스킬을 사용해 `develop` 대상 PR을 생성한다. PR 본문에 아래를 포함한다.

- 신규 토큰 64개 목록
- Task 5 Step 6의 시각 회귀 결과 (변경 건수, 깨짐 0건)
- V1~V4 결과 수치
- 기각한 축 3개(z-index / border-width / opacity)와 사유

---

## 완료 기준

아래가 모두 참일 때 이 계획은 완료된다.

- [ ] `npm run test` 전량 통과
- [ ] `npm run build`, `npm run build-storybook` 성공
- [ ] 시각 회귀에서 깨짐 0건
- [ ] V1 임의값 0건 (테스트로 강제)
- [ ] V2 토큰 커버리지 90% 이상
- [ ] V3 구조 재현 전 항목 충족
- [ ] V4 `--blog-*` 토큰 3개 이하
- [ ] 블로그 4종이 390/768/1280px, 라이트/다크 모두 정상
- [ ] `docs/benchmarks/studeo-insights.md` 에 판정 기록 완료
