import React from 'react'
import '../scss/app.scss'
import { Link, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getCart, selectCart, setTotalCount, setTotalPrice } from '../redux/slices/cartSlice'
import { RootState, useAppDispatch } from '../redux/store'
import customAxios from '../axios'
import cartIcon from '../assets/cart-b.svg'
import trashIcon from '../assets/trash.svg'

import { CartItem, CartEmpty } from '../components'
import { selectIsAuth } from '../redux/slices/authSlice'

const Card: React.FC = () => {
	const { totalPrice, cartItems } = useSelector(selectCart)
	const { totalCount } = useSelector((state: RootState) => state.cartSlice)
	const isAuth = useSelector(selectIsAuth)
	const dispatch = useAppDispatch()

	const getProductsCart = async () => {
		let totalPrice = 0

		dispatch(getCart()).then((data) => {
			dispatch(setTotalCount(data.payload.results.length))
			data.payload.results.forEach((item: any) => {
				totalPrice += item.product_price * item.totalcount
			})
			dispatch(setTotalPrice(totalPrice))
		})
	}

	React.useEffect(() => {
		getProductsCart()
	}, [])

	if (!isAuth) {
		return <Navigate to='/auth/login' />
	}

	if (!cartItems.length) {
		return <CartEmpty />
	}

	const cleanCart = async () => {
		if (window.confirm('Вы действительно хотите очистить корзину?')) {
			await customAxios.delete('/cart/delete')
			await getProductsCart()
		}
	}

	const cleanCartBuy = async () => {
		await customAxios.delete('/cart/delete')
		await getProductsCart()
	}

	return (
		<div className='container container--cart'>
			<div className='cart'>
				<div className='cart__top'>
					<h2 className='content__title'>
						<img style={{ width: 30, marginRight: 10 }} src={cartIcon} alt='cart' />
						Корзина
					</h2>
					<button onClick={cleanCart} className='cart__clear'>
						<img src={trashIcon} alt='' />
						<span>Очистить корзину</span>
					</button>
				</div>
				<div className='content__items content__items--cart'>
					{cartItems.map((item: any) => (
						<CartItem
							key={item.id}
							id={item.product_id}
							totalcount={item.totalcount}
							title={item.product_title}
							imgurl={item.product_img}
						/>
					))}
				</div>
				<div className='cart__bottom'>
					<div className='cart__bottom-details'>
						<span>
							{' '}
							Всего: <b>{totalCount} шт.</b>{' '}
						</span>
						<span>
							{' '}
							Сумма заказа: <b>{totalPrice} ₽</b>{' '}
						</span>
					</div>
					<div className='cart__bottom-buttons'>
						<Link to='/' className='button button--outline button--add go-back-btn'>
							<svg
								width='8'
								height='14'
								viewBox='0 0 8 14'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M7 13L1 6.93015L6.86175 1'
									stroke='#D3D3D3'
									strokeWidth='1.5'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>

							<span>Вернуться назад</span>
						</Link>
						<Link to='/resultbuy' className='button pay-btn' onClick={cleanCartBuy}>
							<span>Оплатить сейчас</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Card
