/** Optional payment UI traces. Set NEXT_PUBLIC_DEBUG_PAYMENT_TRACE=true and NEXT_PUBLIC_PAYMENT_TRACE_INGEST_URL to enable. */
export function paymentDebugTraceClient(payload: {
  flow: string
  step: string
  data?: Record<string, unknown>
}): void {
  if (process.env.NEXT_PUBLIC_DEBUG_PAYMENT_TRACE !== 'true') return
  const url = process.env.NEXT_PUBLIC_PAYMENT_TRACE_INGEST_URL?.trim()
  if (!url) return
  const body = JSON.stringify({
    location: `payments|${payload.flow}|${payload.step}|client`,
    message: `${payload.flow} · ${payload.step}`,
    data: { flow: payload.flow, step: payload.step, ...payload.data },
    timestamp: Date.now(),
  })
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  }).catch(() => undefined)
}
