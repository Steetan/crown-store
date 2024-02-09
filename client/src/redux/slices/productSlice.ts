import { typeCartItem } from './cartSlice'
import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export enum Status {
	LOADING = 'loading',
	SUCCESS = 'success',
	ERROR = 'error',
}

export type TypeProductState = {
	items: typeCartItem[]
	status: Status
}

const initialState: TypeProductState = {
	items: [],
	status: Status.LOADING,
}

export const fetchProducts = createAsyncThunk(
	'product/fetchProductStatus',
	async ({
		categoryParam,
		sortParam,
		orderParam,
		inputParam,
		selectedPage,
		fromRangeFilter,
		toRangeFilter,
		selectedRating,
	}: Record<string, string>) => {
		const { data } = await axios.get(
			`http://localhost:8080/?${categoryParam}${sortParam}${orderParam}${inputParam}&page=${selectedPage}&limit=8&fromRange=${fromRangeFilter}&toRange=${toRangeFilter}&selectedRatingFilter=${selectedRating}`,
		)
		return data.products
	},
)

const productSlice = createSlice({
	name: 'product',
	initialState,
	reducers: {
		setItems(state, action) {
			state.items = action.payload
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchProducts.pending, (state) => {
			state.status = Status.LOADING
			state.items = []
		})
		builder.addCase(fetchProducts.fulfilled, (state, action) => {
			state.items = action.payload
			state.status = Status.SUCCESS
		})
		builder.addCase(fetchProducts.rejected, (state) => {
			state.status = Status.ERROR
			state.items = []
		})
	},
})

export const { setItems } = productSlice.actions

export default productSlice.reducer
