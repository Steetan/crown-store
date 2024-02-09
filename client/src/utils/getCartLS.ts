import { calcTotalPrice } from "./calcTotalPrice"

export const getCartLS = () => {
  const dataLS = localStorage.getItem('cart')
  const cartItems = dataLS ? JSON.parse(dataLS) : []
  const totalPrice = calcTotalPrice(cartItems)
	return {
    cartItems,
    totalPrice
  }
}
