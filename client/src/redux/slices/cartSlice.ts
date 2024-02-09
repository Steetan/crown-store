import { getCartLS } from '../../utils/getCartLS'
import { RootState } from './../store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type typeCartItem = {
	id: string
	title: string
	imgurl: string
	price: number
	count: number
}

type typeInitialState = {
	totalPrice: number
	cartItems: typeCartItem[]
}

const { cartItems, totalPrice } = getCartLS()

const initialState: typeInitialState = {
	totalPrice,
	cartItems,
}

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addItem(state, action: PayloadAction<typeCartItem>) {
			const findItem = state.cartItems.find((obj) => obj.id === action.payload.id)

			if (!findItem) {
				state.cartItems.push({
					...action.payload,
					count: 0,
				})
			}
		},
		removeItem(state, action) {
			const findItem = state.cartItems.find((obj) => obj.id === action.payload)
			if (findItem) {
				state.totalPrice -= findItem.price * findItem.count
			}
			state.cartItems = state.cartItems.filter((obj) => obj.id !== action.payload)
		},
		plusItem(state, action) {
			const findItem = state.cartItems.find((obj) => obj.id === action.payload)

			if (findItem) {
				findItem.count++
				state.totalPrice += findItem.price
			}
		},
		minusItem(state, action) {
			const findItem = state.cartItems.find((obj) => obj.id === action.payload)

			if (findItem) {
				findItem.count--
				state.totalPrice -= findItem.price
				state.cartItems = state.cartItems.filter((el) => el.count !== 0)
			}
		},
		clearItems(state) {
			state.cartItems = []
			state.totalPrice = 0
		},
	},
})

export const selectCart = (state: RootState) => state.cartSlice

export const { addItem, removeItem, clearItems, minusItem, plusItem } = cartSlice.actions

export default cartSlice.reducer
