import { typeCartItem } from '../redux/slices/cartSlice'

export const calcTotalPrice = (items: typeCartItem[]) => {
	return items.reduce((sum, obj) => obj.price * obj.count + sum, 0)
}
