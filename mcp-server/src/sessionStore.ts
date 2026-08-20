import { Redis } from '@upstash/redis'

const SESSION_TTL_SECONDS = 60 * 60 * 24 // 1일 미사용 시 자동 만료

const redis = Redis.fromEnv()

function key(sessionId: string): string {
  return `mcp-session:${sessionId}`
}

export async function markSessionInitialized(sessionId: string): Promise<void> {
  await redis.set(key(sessionId), '1', { ex: SESSION_TTL_SECONDS })
}

export async function isSessionInitialized(sessionId: string): Promise<boolean> {
  return (await redis.get(key(sessionId))) !== null
}
