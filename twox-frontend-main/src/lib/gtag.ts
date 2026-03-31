const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

export const pageview = (url: string) => {
  if (measurementId) {
    window.gtag('config', measurementId, {
      page_path: url,
    })
  } else {
    console.warn('Google Analytics Measurement ID is not defined.')
  }
}

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label: string
  value: number
}) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}
