import React from 'react'
import { Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FormData } from './Registration'
import { useAppDispatch } from '../redux/store'
import { fetchAdmin, selectIsAuth } from '../redux/slices/authSlice'
import { useSelector } from 'react-redux'
import { TextField } from '@mui/material'

const AdminLogin = ({}) => {
	const dispatch = useAppDispatch()
	const isAuth = useSelector(selectIsAuth)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({ mode: 'onChange' })

	const onSubmit = async (values: FormData) => {
		const data = await dispatch(fetchAdmin(values))

		console.log(data)

		if (!data.payload) {
			return alert('Не удалось авторизоваться!')
		}

		if (data.payload.token) {
			window.localStorage.setItem('token', data.payload.token)
		}
	}

	if (isAuth) {
		return <Navigate to='/auth/adminpanel' />
	}

	return (
		<div className='form-block-wrapper'>
			<div className='form-block'>
				<h3 className='form-block__title'>Вход в админ панель</h3>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='form-block__inputs'>
						<TextField
							error={errors.email && true}
							id='outlined-basic'
							label='Логин'
							variant='outlined'
							{...register('email', { required: 'Укажите почту' })}
						/>
						{errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
						<TextField
							error={errors.password && true}
							id='outlined-basic'
							label='Пароль'
							type='password'
							variant='outlined'
							{...register('password', { required: 'Укажите пароль' })}
						/>
						{errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
					</div>
					<div className='form-block__btns-login'>
						<button type='submit' className='button button-login'>
							Войти
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default AdminLogin
