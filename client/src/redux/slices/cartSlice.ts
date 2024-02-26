import { RootState } from './../store'
import customAxios from '../../axios'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum Status {
	LOADING = 'loading',
	SUCCESS = 'success',
	ERROR = 'error',
}

export type typeCartItem = {
	id: string
	title: string
	imgurl: string
	price: number
	count: number
}

type typeInitialState = {
	totalPrice: number
	totalCount: number
	cartItems: typeCartItem[]
	status: Status
	countProduct: { product: string; count: number }[]
}

const initialState: typeInitialState = {
	totalPrice: 0,
	totalCount: 0,
	cartItems: [],
	countProduct: [],
	status: Status.LOADING,
}

export const getCart = createAsyncThunk('auth/getCart', async () => {
	const { data } = await customAxios.get(`http://localhost:8080/cart/get`)
	return data
})

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		setTotalPrice: (state, action: PayloadAction<number>) => {
			state.totalPrice = action.payload
		},
		setCartItems: (state, action: PayloadAction<any>) => {
			state.cartItems = action.payload
		},
		setTotalCount: (state, action: PayloadAction<any>) => {
			state.totalCount = action.payload
		},
		setCountProduct: (state, action: PayloadAction<{ product: string; count: number }[]>) => {
			state.countProduct = action.payload
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getCart.pending, (state) => {
			state.status = Status.LOADING
		})
		builder.addCase(getCart.fulfilled, (state, action) => {
			state.status = Status.SUCCESS
			state.cartItems = action.payload.results
		})
		builder.addCase(getCart.rejected, (state) => {
			state.status = Status.ERROR
		})
	},
})

export const selectCart = (state: RootState) => state.cartSlice

export const { setTotalPrice, setCartItems, setTotalCount, setCountProduct } = cartSlice.actions

export default cartSlice.reducer
