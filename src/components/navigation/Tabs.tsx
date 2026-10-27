import { cn } from '../../utils/cn'
import { KeyboardEvent, ReactNode, useId, useRef, useState } from 'react'

/**
 * 탭 패널의 개별 항목 정의.
 */
export interface TabItem {
  /** 탭 식별자 */
  key: string
  /** 탭 버튼 레이블 */
  label: string
  /** 탭 콘텐츠 */
  content: ReactNode
}

export interface TabsProps {
  items: TabItem[]
  label?: string
  /** 전달하면 선택 상태를 외부에서 제어합니다. */
  value?: string
  /** 비제어 모드의 초기 선택 탭 */
  defaultValue?: string
  /** 클릭 또는 키보드로 다른 탭을 선택할 때 호출됩니다. */
  onValueChange?: (value: string) => void
}

/** 여러 콘텐츠 패널을 탭으로 전환해 표시합니다. */
export function Tabs({ items, label = '탐색 탭', value, defaultValue, onValueChange }: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? items[0]?.key)
  const tabsId = useId()
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const selectedValue = value === undefined ? uncontrolledValue : value
  const activeKey = items.some(item => item.key === selectedValue) ? selectedValue : items[0]?.key

  const selectTab = (key: string) => {
    if (value === undefined) setUncontrolledValue(key)
    onValueChange?.(key)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (items.length === 0) return
    let nextIndex: number | undefined
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % items.length
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + items.length) % items.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = items.length - 1
    if (nextIndex === undefined || items.length === 0) return
    event.preventDefault()
    selectTab(items[nextIndex].key)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <div>
      <div role="tablist" aria-label={label} className="flex border-b border-border">
        {items.map((item, index) => {
          const selected = activeKey === item.key
          const tabId = `${tabsId}-tab-${index}`
          const panelId = `${tabsId}-panel-${index}`
          return (
          <button
            key={item.key}
            ref={element => { tabRefs.current[index] = element }}
            id={tabId}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            onClick={() => selectTab(item.key)}
            onKeyDown={event => handleKeyDown(event, index)}
            className={cn(
              'h-10 px-ws-4 text-label font-medium border-b-2 -mb-px transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand',
              selected
                ? 'border-brand text-brand'
                : 'border-transparent text-secondary hover:text-foreground'
            )}
          >
            {item.label}
          </button>
          )
        })}
      </div>
      {items.map((item, index) => item.key === activeKey && (
        <div key={item.key} id={`${tabsId}-panel-${index}`} role="tabpanel" aria-labelledby={`${tabsId}-tab-${index}`} tabIndex={0} className="pt-ws-4 text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
          {item.content}
        </div>
      ))}
    </div>
  )
}
