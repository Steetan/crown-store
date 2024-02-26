import React from 'react'
import { useForm } from 'react-hook-form'
import { RootState, useAppDispatch } from '../redux/store'
import { fetchRegister, selectIsAuth, setUserImgUrl } from '../redux/slices/authSlice'
import { useSelector } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'
import { TextField } from '@mui/material'
import customAxios from '../axios'
import axios from 'axios'

export interface FormData {
	name: string
	fname: string
	oname: string
	email: string
	phone: number
	password: string
	confirmPassword: string
	url?: string
}

const Registration = ({}) => {
	const dispatch = useAppDispatch()
	const isAuth = useSelector(selectIsAuth)
	const { userImgUrl } = useSelector((state: RootState) => state.authSlice)

	const inputFileRef = React.useRef<HTMLInputElement>(null)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>()

	const onSubmit = async (values: FormData) => {
		const data = await dispatch(fetchRegister({ ...values, url: userImgUrl }))

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

	const handleFileChange = async (event: any) => {
		try {
			const formData = new FormData()
			formData.append('image', event.target.files[0])

			customAxios.post('http://localhost:8080/upload/user', formData).then(({ data }) => {
				dispatch(setUserImgUrl(`${data.url}`))
			})
		} catch (error) {
			console.warn(error)
		}
	}

	const deleteImg = () => {
		try {
			axios.delete(`http://localhost:8080/upload/auth/delete/${userImgUrl}`)
			if (inputFileRef.current) {
				inputFileRef.current.value = ''
			}
			dispatch(setUserImgUrl(''))
		} catch (error) {
			console.log(error)
		}
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
						{!userImgUrl && (
							<label htmlFor='file-upload' className='custom-file-upload'>
								Загрузить фото
							</label>
						)}
						<input
							id='file-upload'
							ref={inputFileRef}
							type='file'
							style={{ display: 'none' }}
							onChange={handleFileChange}
						/>

						{userImgUrl && (
							<button className='settings__btn-delete' onClick={deleteImg}>
								Удалить
							</button>
						)}
						<img
							className='form-block__img-upload'
							src={`http://localhost:8080/uploads/userIcons/${userImgUrl}`}
							alt=''
						/>
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
