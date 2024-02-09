import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../store'
import customAxios from '../../axios'
import { FormData } from '../../pages/Registration'

export const fetchUserData = createAsyncThunk(
	'auth/fetchUserData',
	async (params: { email: string; password: string }) => {
		const { data } = await axios.post(`http://localhost:8080/auth/login`, params)
		return data
	},
)

export const fetchAdmin = createAsyncThunk(
	'auth/fetchAdmin',
	async (params: { email: string; password: string }) => {
		const { data } = await axios.post(`http://localhost:8080/auth/admin`, params)
		return data
	},
)

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params: FormData) => {
	const { data } = await axios.post(`http://localhost:8080/auth/reg`, params)
	return data
})

export const fetchUserMe = createAsyncThunk('auth/fetchUserDataMe', async () => {
	const { data } = await customAxios.get('http://localhost:8080/auth/me')
	return data
})

export const fetchAdminMe = createAsyncThunk('auth/fetchAdminMe', async () => {
	const { data } = await customAxios.get('http://localhost:8080/auth/adminme')
	return data
})

export const fetchDeleteMe = createAsyncThunk(
	'auth/fetchUserDataMe',
	async (params: string | null) => {
		const { data } = await customAxios.delete(`http://localhost:8080/auth/delete?token=${params}`)
		return data
	},
)

export enum Status {
	LOADING = 'loading',
	SUCCESS = 'success',
	ERROR = 'error',
}

type TypeAuthState = {
	data: any
	status: string
}

const initialState: TypeAuthState = {
	data: null,
	status: Status.LOADING,
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: (state) => {
			state.data = null
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchUserData.pending, (state) => {
			state.status = Status.LOADING
			state.data = null
		})
		builder.addCase(fetchUserData.fulfilled, (state, action) => {
			state.data = action.payload
			state.status = Status.SUCCESS
		})
		builder.addCase(fetchUserData.rejected, (state) => {
			state.status = Status.ERROR
			state.data = null
		})
		builder.addCase(fetchUserMe.pending, (state) => {
			state.status = Status.LOADING
			state.data = null
		})
		builder.addCase(fetchUserMe.fulfilled, (state, action) => {
			state.data = action.payload
			state.status = Status.SUCCESS
		})
		builder.addCase(fetchUserMe.rejected, (state) => {
			state.status = Status.ERROR
			state.data = null
		})
		builder.addCase(fetchRegister.pending, (state) => {
			state.status = Status.LOADING
			state.data = null
		})
		builder.addCase(fetchRegister.fulfilled, (state, action) => {
			state.data = action.payload
			state.status = Status.SUCCESS
		})
		builder.addCase(fetchRegister.rejected, (state, action) => {
			state.status = Status.ERROR
			state.data = action.payload
		})
		builder.addCase(fetchAdmin.pending, (state) => {
			state.status = Status.LOADING
			state.data = null
		})
		builder.addCase(fetchAdmin.fulfilled, (state, action) => {
			state.data = action.payload
			state.status = Status.SUCCESS
		})
		builder.addCase(fetchAdmin.rejected, (state) => {
			state.status = Status.ERROR
			state.data = null
		})
		builder.addCase(fetchAdminMe.pending, (state) => {
			state.status = Status.LOADING
			state.data = null
		})
		builder.addCase(fetchAdminMe.fulfilled, (state, action) => {
			state.data = action.payload
			state.status = Status.SUCCESS
		})
		builder.addCase(fetchAdminMe.rejected, (state) => {
			state.status = Status.ERROR
			state.data = null
		})
	},
})

export const selectIsAuth = (state: RootState) => Boolean(state.authSlice.data)

export const selectIsAuthAdmin = (state: RootState) => Boolean(state.authSlice.data)

export default authSlice.reducer

export const { logout } = authSlice.actions
