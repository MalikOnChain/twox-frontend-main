const AGENT_DEBUG_ENDPOINT =
  'http://127.0.0.1:7502/ingest/c1e1f37c-ef0d-433c-9219-185f5ff480a9'
const AGENT_DEBUG_SESSION = '9131d2'

/** Browser-side payment UI traces (same ingest as backend). Enable NEXT_PUBLIC_DEBUG_PAYMENT_TRACE=true */
export function paymentDebugTraceClient(payload: {
  flow: string
  step: string
  data?: Record<string, unknown>
}): void {
  if (process.env.NEXT_PUBLIC_DEBUG_PAYMENT_TRACE !== 'true') return
  const body = JSON.stringify({
    sessionId: AGENT_DEBUG_SESSION,
    location: `payments|${payload.flow}|${payload.step}|client`,
    message: `${payload.flow} · ${payload.step}`,
    data: { flow: payload.flow, step: payload.step, ...payload.data },
    timestamp: Date.now(),
  })
  fetch(AGENT_DEBUG_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': AGENT_DEBUG_SESSION },
    body,
  }).catch(() => {})
}
