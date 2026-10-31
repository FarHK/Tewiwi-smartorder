const ORDER_STORAGE_KEY = 'tewiwi-orders'

export function readOrders() {
  const savedOrders = window.localStorage.getItem(ORDER_STORAGE_KEY)
  if (!savedOrders) return []
  const parsedOrders = JSON.parse(savedOrders)
  return Array.isArray(parsedOrders) ? parsedOrders : []
}

export function writeOrders(orders) {
  window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders))
}
