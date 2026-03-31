// Parse commas into thousands
const parseCommasToThousands = (value: number) => {
  // Ensure the value is a number and format it to 2 decimal places
  const formattedValue = parseFloat(String(value)).toFixed(2)

  // Convert to string and format with commas
  return formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  // return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default parseCommasToThousands

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num)
}

export const precisionNumber = (value: number | string) => {
  const num = parseFloat(value.toString()).toFixed(8)

  return new Intl.NumberFormat().format(Number(num))
}
