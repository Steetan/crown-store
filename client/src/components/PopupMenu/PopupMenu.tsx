import React from 'react'
import { RootState, useAppDispatch } from '../../redux/store'
import { logout, setIsAdmin, setUserImgUrl } from '../../redux/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import customAxios from '../../axios'
import { useSelector } from 'react-redux'

interface IPopupMenu {
	isAuth: any
}

const PopupMenu: React.FC<IPopupMenu> = ({ isAuth }) => {
	const [isVisibleMenu, setIsVisibleMenu] = React.useState(false)
	const [nickname, setNickname] = React.useState('')

	const dispatch = useAppDispatch()
	const menuRef = React.useRef<HTMLDivElement>(null)

	const { userImgUrl } = useSelector((state: RootState) => state.authSlice)

	const navigate = useNavigate()

	React.useEffect(() => {
		try {
			if (isAuth) {
				const fetchUserImg = async () => {
					const { data } = await customAxios.get('/auth/meinfo')
					dispatch(setUserImgUrl(data.user_imgurl))
					setNickname(data.email)
				}
				fetchUserImg()
			}

			const handleClickOutSide = (event: MouseEvent) => {
				const _event = event as MouseEvent & {
					path: Node[]
				}

				if (menuRef.current && !_event.composedPath().includes(menuRef.current)) {
					setIsVisibleMenu(false)
				}
			}

			document.body.addEventListener('click', handleClickOutSide)

			return () => document.body.removeEventListener('click', handleClickOutSide)
		} catch (error) {
			console.log(error)
		}
	}, [isAuth])

	const resetUser = () => {
		window.localStorage.removeItem('token')
		navigate('/')
		setIsVisibleMenu(false)
	}

	const onClickItemLogout = async () => {
		if (window.confirm('Вы действительно хотите выйти?')) {
			await dispatch(setIsAdmin(false))
			await dispatch(setUserImgUrl(''))
			await dispatch(logout())
			resetUser()
		}
	}

	return (
		<>
			{isAuth && (
				<div className='btn-avatar' onClick={() => setIsVisibleMenu(!isVisibleMenu)} ref={menuRef}>
					{userImgUrl && (
						<img
							className='btn-avatar-img'
							src={`http://localhost:8080/uploads/userIcons/${userImgUrl}`}
							alt='ava'
						/>
					)}
					{!userImgUrl && (
						<img
							className='btn-avatar-img'
							src={require('../../assets/avatar-icon.png')}
							alt='ava'
						/>
					)}
				</div>
			)}
			{isVisibleMenu && (
				<div className='popup-menu'>
					{isAuth && (
						<p className='popup-menu-info-user'>
							Вы вошли как <br />
							<b>{nickname}</b>
						</p>
					)}
					<ul className='popup-menu-list'>
						<li className='popup-menu-item' onClick={() => navigate('/settings')}>
							Настройки
						</li>
						<li className='popup-menu-item' onClick={onClickItemLogout}>
							Выйти
						</li>
					</ul>
				</div>
			)}
		</>
	)
}

export default PopupMenu
