import React from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from '../redux/store'
import { fetchRegister, selectIsAuth } from '../redux/slices/authSlice'
import { useSelector } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'
import { TextField } from '@mui/material'

export interface FormData {
	name: string
	fname: string
	oname: string
	email: string
	phone: number
	password: string
	confirmPassword: string
}

const Registration = ({}) => {
	const dispatch = useAppDispatch()
	const isAuth = useSelector(selectIsAuth)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>()

	const onSubmit = async (values: FormData) => {
		const data = await dispatch(fetchRegister(values))

		if (!data.payload) {
			return alert('Не удалось зарегистрироваться!')
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
				<h3 className='form-block__title'>Регистрация</h3>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='form-block__inputs'>
						<TextField
							error={errors.password && true}
							id='outlined-basic'
							className='form-block__input'
							label='Имя'
							variant='outlined'
							{...register('name', { required: 'Укажите имя' })}
						/>
						{errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
						<TextField
							error={errors.password && true}
							id='outlined-basic'
							label='Фамилия'
							className='form-block__input'
							variant='outlined'
							{...register('fname', { required: 'Укажите фамилию' })}
						/>
						{errors.fname && <p style={{ color: 'red' }}>{errors.fname.message}</p>}
						<TextField
							error={errors.password && true}
							id='outlined-basic'
							label='Отчество'
							className='form-block__input'
							variant='outlined'
							{...register('oname', { required: 'Укажите отчество' })}
						/>
						{errors.oname && <p style={{ color: 'red' }}>{errors.oname.message}</p>}
						<TextField
							error={errors.password && true}
							id='outlined-basic'
							label='Email'
							className='form-block__input'
							variant='outlined'
							{...register('email', { required: 'Укажите почту' })}
						/>
						{errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
						<TextField
							error={errors.password && true}
							id='outlined-basic'
							label='Номер телефона'
							className='form-block__input'
							variant='outlined'
							{...register('phone', { required: 'Укажите номер телефона' })}
						/>
						{errors.phone && <p style={{ color: 'red' }}>{errors.phone.message}</p>}
						<TextField
							error={errors.password && true}
							id='outlined-basic'
							label='Пароль'
							className='form-block__input'
							variant='outlined'
							type='password'
							{...register('password', { required: 'Укажите пароль' })}
						/>
						{errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
					</div>
					<div className='form-block__btns'>
						<button type='submit' className='button button--footer'>
							Зарегистрироваться
						</button>
						<p>
							Есть аккаунт?
							<Link to='/auth/login' className='button-link-reg'>
								{' '}
								Войти
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	)
}

export default Registration
