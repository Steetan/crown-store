import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FormData } from './Registration'
import { useAppDispatch } from '../redux/store'
import { fetchUserData, selectIsAuth } from '../redux/slices/authSlice'
import { useSelector } from 'react-redux'
import { TextField } from '@mui/material'

const Login = ({}) => {
	const dispatch = useAppDispatch()
	const isAuth = useSelector(selectIsAuth)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({ mode: 'onChange' })

	const onSubmit = async (values: FormData) => {
		const data = await dispatch(fetchUserData(values))

		if (!data.payload) {
			return alert('Не удалось авторизоваться!')
		}

		if (data.payload.token) {
			window.localStorage.setItem('token', data.payload.token)
		}
	}

	if (isAuth) {
		return <Navigate to='/' />
	}

	return (
		<div className='form-block-wrapper'>
			<div className='form-block'>
				<h3 className='form-block__title'>Вход</h3>
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
						<p>
							Нет аккаунта?
							<Link to='/auth/reg' className='button-link-reg'>
								{' '}
								Зарегистрируйся
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	)
}

export default Login
