import React from 'react'
import customAxios from '../../axios'
import { RootState, useAppDispatch } from '../../redux/store'
import { fetchDeleteMe, setUserImgUrl } from '../../redux/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const SettingsUser = ({}) => {
	const [userDataName, setUserDataName] = React.useState('')
	const [userDataFname, setUserDataFname] = React.useState('')
	const [userDataOname, setUserDataOname] = React.useState('')

	const inputFileRef = React.useRef<HTMLInputElement>(null)

	const { userImgUrl } = useSelector((state: RootState) => state.authSlice)

	const [userPassword, setUserPassword] = React.useState('')
	const [userPasswordRepeat, setUserPasswordRepeat] = React.useState('')

	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	React.useEffect(() => {
		const fetchMe = async () => {
			const { data } = await customAxios.get('auth/meinfo')

			console.log(data)
			setUserDataName(data.name_user)
			setUserDataFname(data.fname_user)
			setUserDataOname(data.oname_user)
		}
		fetchMe()
	}, [])

	const onClickItemDelete = async () => {
		if (window.confirm('Вы действительно хотите удалить аккаунт?')) {
			await customAxios.delete('/cart/deleteallbyid')
			await dispatch(fetchDeleteMe(window.localStorage.getItem('token'))).finally(() => {
				window.localStorage.removeItem('token')
				navigate('/')
			})
			window.location.reload()
		}
	}

	const onSubmit = async () => {
		try {
			if (userDataName && userDataFname) {
				const { data } = await customAxios.patch('/auth/update', {
					name: userDataName,
					fname: userDataFname,
					oname: userDataOname,
				})

				alert(data.message)
			}
		} catch (error) {
			console.log(error)
			alert('Не удалось обновить данные')
		}
	}

	const onClickUpdatePassword = async () => {
		try {
			if (userPassword && userPassword === userPasswordRepeat) {
				const { data } = await customAxios.patch('/auth/updpass', {
					password: userPassword,
				})
				data && alert('Пароль был успешно изменен')
			}
		} catch (error) {
			console.log(error)
			alert('Не удалось обновить пароль')
		}
	}

	const handleFileChange = async (event: any) => {
		try {
			const formData = new FormData()
			formData.append('image', event.target.files[0])

			await customAxios.post('http://localhost:8080/upload/user', formData).then(({ data }) => {
				try {
					dispatch(setUserImgUrl(`${data.url}`))
					customAxios
						.patch('/auth/updimg', {
							img: data.url,
						})
						.then(({ data }) => {
							data && alert('Аватарка была успешно изменена')
						})
				} catch (error) {
					console.log(error)
					alert('Не удалось обновить аватарку')
				}
			})
		} catch (error) {
			console.warn(error)
		}
	}

	const deleteImg = async () => {
		try {
			await customAxios.delete(`http://localhost:8080/upload/user/delete/${userImgUrl}`)
			if (inputFileRef.current) {
				inputFileRef.current.value = ''
			}

			await customAxios.patch('/auth/updimg', {
				img: '',
			})
		} catch (error) {
			console.log(error)
		}
		dispatch(setUserImgUrl(''))
	}

	return (
		<div className='settings'>
			<h2 className='settings__title'>Настройки аккаунта</h2>
			<div className='settings__main-block'>
				<div>
					<div className='form-block'>
						<h3 className='form-block__title'>Поменять данные</h3>
						<h4 className='settings__label'>Имя</h4>
						<input
							className='settings__input'
							type='text'
							value={userDataName}
							onChange={(e) => setUserDataName(e.target.value)}
						/>
						{!userDataName && <p style={{ color: 'red', marginBottom: 10 }}>Введите имя</p>}
						<h4 className='settings__label'>Фамилия</h4>
						<input
							className='settings__input'
							type='text'
							value={userDataFname}
							onChange={(e) => setUserDataFname(e.target.value)}
						/>
						{!userDataFname && <p style={{ color: 'red', marginBottom: 10 }}>Введите фамилию</p>}
						<h4 className='settings__label'>Отчество</h4>
						<input
							className='settings__input'
							type='text'
							value={userDataOname}
							onChange={(e) => setUserDataOname(e.target.value)}
						/>
						<button type='submit' className='button button--footer' onClick={onSubmit}>
							Обновить
						</button>
					</div>
				</div>
				<div className='settings__block-right'>
					<div className='settings__password-block'>
						<h3 className='form-block__title settings__password-title'>Новый пароль</h3>
						<div className='settings__password-inputs'>
							<div className='settings__password-input'>
								<div>
									<h4 className='settings__label'>Пароль</h4>
									<input
										className='settings__input'
										type='password'
										value={userPassword}
										onChange={(e) => setUserPassword(e.target.value)}
									/>
								</div>
								{/* {!userPassword && <p style={{ color: 'red', marginBottom: 10 }}>Введите пароль</p>} */}
							</div>
							<div className='settings__password-hr'></div>
							<div className='settings__password-input'>
								<div>
									<h4 className='settings__label'>Пароль ещё раз</h4>
									<input
										className='settings__input'
										type='password'
										value={userPasswordRepeat}
										onChange={(e) => setUserPasswordRepeat(e.target.value)}
									/>
								</div>
								{/* {!userPasswordRepeat && (
									<p style={{ color: 'red', marginBottom: 10 }}>Введите пароль еще раз</p>
								)} */}
							</div>
						</div>
						{userPassword !== userPasswordRepeat && (
							<p style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>
								Пароли не совпадают
							</p>
						)}
						<div className='settings__btn-password-block'>
							<button
								className='button button--footer settings__btn-password-update'
								onClick={onClickUpdatePassword}
							>
								Обновить пароль
							</button>
						</div>
					</div>

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
			</div>
			<button
				className='settings__btn-delete settings__btn-delete--acc'
				onClick={onClickItemDelete}
			>
				Удалить аккаунт
			</button>
		</div>
	)
}

export default SettingsUser
