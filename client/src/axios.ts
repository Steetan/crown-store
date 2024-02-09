import axios, { AxiosInstance } from 'axios'

const instance: AxiosInstance = axios.create({
	baseURL: 'http://localhost:8080',
})

instance.interceptors.request.use((config) => {
	const token = window.localStorage.getItem('token')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

export default instance
