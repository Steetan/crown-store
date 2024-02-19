import React from 'react'
import customAxios from '../../axios'
import { useAppDispatch } from '../../redux/store'
import { fetchDeleteMe } from '../../redux/slices/authSlice'
import { useNavigate } from 'react-router-dom'

const SettingsUser = ({}) => {
	const [userDataName, setUserDataName] = React.useState('')
	const [userDataFname, setUserDataFname] = React.useState('')
	const [userDataOname, setUserDataOname] = React.useState('')

	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	React.useEffect(() => {
		const fetchMe = async () => {
			const { data } = await customAxios.get('auth/meinfo')

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
		}
	}

	return (
		<div className='settings-block'>
			<div className='form-block'>
				<h3 className='form-block__title'>Поменять данные</h3>
				<h4 className='update-user-label'>Имя</h4>
				<input
					className='update-user-input'
					type='text'
					value={userDataName}
					onChange={(e) => setUserDataName(e.target.value)}
				/>
				{!userDataName && <p style={{ color: 'red', marginBottom: 10 }}>Введите имя</p>}
				<h4 className='update-user-label'>Фамилия</h4>
				<input
					className='update-user-input'
					type='text'
					value={userDataFname}
					onChange={(e) => setUserDataFname(e.target.value)}
				/>
				{!userDataFname && <p style={{ color: 'red', marginBottom: 10 }}>Введите фамилию</p>}
				<h4 className='update-user-label'>Отчество</h4>
				<input
					className='update-user-input'
					type='text'
					value={userDataOname}
					onChange={(e) => setUserDataOname(e.target.value)}
				/>
				<button type='submit' className='button button--footer' onClick={onSubmit}>
					Изменить
				</button>
			</div>
			<button className='btn-delete-user' onClick={onClickItemDelete}>
				Удалить аккаунт
			</button>
		</div>
	)
}

export default SettingsUser
