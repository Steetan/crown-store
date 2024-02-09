import React from 'react'
import { useAppDispatch } from '../redux/store'
import { fetchAdminMe } from '../redux/slices/authSlice'
import { useNavigate } from 'react-router-dom'

const AdminPanel: React.FC = () => {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const fetchMe = async () => {
		const data = await dispatch(fetchAdminMe())

		if (data.payload.error) {
			navigate('/')
		}
	}

	fetchMe()

	return <h1>hello world</h1>
}

export default AdminPanel
