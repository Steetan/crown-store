import React from 'react'
import customAxios from '../../axios'
import { getCart, setTotalCount, setTotalPrice } from '../../redux/slices/cartSlice'
import { useAppDispatch } from '../../redux/store'

interface ICartItem {
	id: string
	title: string
	imgurl: string
	totalcount: number
}

export const CartItem: React.FC<ICartItem> = ({ id, title, imgurl }) => {
	const dispatch = useAppDispatch()
	const [fetchPrice, setFetchPrice] = React.useState(0)
	const [fetchCount, setFetchCount] = React.useState(0)

	const actItem = (act: string) => {
		let totalPrice = 0
		switch (act) {
			case 'plus':
				customAxios.patch('/cart/update', { act: 'plus', productid: id }).then(({ data }) => {
					setFetchPrice(data.results.find((obj: any) => obj.product_id === id)?.product_price)
					setFetchCount(data.results.find((obj: any) => obj.product_id === id)?.totalcount)
					data.results.forEach((item: any) => {
						totalPrice += item.product_price * item.totalcount
					})
					dispatch(setTotalPrice(totalPrice))
				})
				break
			case 'minus':
				customAxios.patch('/cart/update', { act: 'minus', productid: id }).then(({ data }) => {
					setFetchPrice(data.results.find((obj: any) => obj.product_id === id)?.product_price)
					setFetchCount(data.results.find((obj: any) => obj.product_id === id)?.totalcount)
					data.results.forEach((item: any) => {
						totalPrice += item.product_price * item.totalcount
					})
					dispatch(setTotalPrice(totalPrice))
				})
				break
		}
	}

	const getProductsCart = async () => {
		let totalPrice = 0

		await dispatch(getCart()).then((data) => {
			setFetchPrice(data.payload.results.find((obj: any) => obj.product_id === id)?.product_price)
			setFetchCount(data.payload.results.find((obj: any) => obj.product_id === id)?.totalcount)
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

	const deleteProductCart = async () => {
		if (window.confirm('Вы действительно хотите удалить?')) {
			await customAxios.delete('/cart/deletebyid', {
				params: {
					product: id,
				},
			})
			await getProductsCart()
		}
	}

	return (
		<div className='cart__item'>
			<div className='cart__item-left'>
				<div className='cart__item-img'>
					<img src={imgurl} alt='Product' />
				</div>
				<div className='cart__item-info'>
					<h3>{title}</h3>
				</div>
			</div>
			<div className='cart__item-count-price'>
				<div className='cart__item-count'>
					<button
						disabled={fetchCount <= 1}
						onClick={() => actItem('minus')}
						className='button button--outline button--circle cart__item-count-minus'
					>
						<svg
							width='10'
							height='10'
							viewBox='0 0 10 10'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M5.92001 3.84V5.76V8.64C5.92001 9.17016 5.49017 9.6 4.96001 9.6C4.42985 9.6 4.00001 9.17016 4.00001 8.64L4 5.76L4.00001 3.84V0.96C4.00001 0.42984 4.42985 0 4.96001 0C5.49017 0 5.92001 0.42984 5.92001 0.96V3.84Z'
								fill='#EB5A1E'
							/>
							<path
								d='M5.75998 5.92001L3.83998 5.92001L0.959977 5.92001C0.429817 5.92001 -2.29533e-05 5.49017 -2.29301e-05 4.96001C-2.2907e-05 4.42985 0.429817 4.00001 0.959977 4.00001L3.83998 4L5.75998 4.00001L8.63998 4.00001C9.17014 4.00001 9.59998 4.42985 9.59998 4.96001C9.59998 5.49017 9.17014 5.92001 8.63998 5.92001L5.75998 5.92001Z'
								fill='#EB5A1E'
							/>
						</svg>
					</button>
					<b>{fetchCount}</b>
					<div
						onClick={() => actItem('plus')}
						className='button button--outline button--circle cart__item-count-plus'
					>
						<svg
							width='10'
							height='10'
							viewBox='0 0 10 10'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M5.92001 3.84V5.76V8.64C5.92001 9.17016 5.49017 9.6 4.96001 9.6C4.42985 9.6 4.00001 9.17016 4.00001 8.64L4 5.76L4.00001 3.84V0.96C4.00001 0.42984 4.42985 0 4.96001 0C5.49017 0 5.92001 0.42984 5.92001 0.96V3.84Z'
								fill='#EB5A1E'
							/>
							<path
								d='M5.75998 5.92001L3.83998 5.92001L0.959977 5.92001C0.429817 5.92001 -2.29533e-05 5.49017 -2.29301e-05 4.96001C-2.2907e-05 4.42985 0.429817 4.00001 0.959977 4.00001L3.83998 4L5.75998 4.00001L8.63998 4.00001C9.17014 4.00001 9.59998 4.42985 9.59998 4.96001C9.59998 5.49017 9.17014 5.92001 8.63998 5.92001L5.75998 5.92001Z'
								fill='#EB5A1E'
							/>
						</svg>
					</div>
				</div>
				<div className='cart__item-price'>
					<b>{fetchPrice * fetchCount} ₽</b>
				</div>
			</div>

			<div className='cart__item-remove'>
				<div onClick={deleteProductCart} className='button button--outline button--circle'>
					<svg
						width='10'
						height='10'
						viewBox='0 0 10 10'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M5.92001 3.84V5.76V8.64C5.92001 9.17016 5.49017 9.6 4.96001 9.6C4.42985 9.6 4.00001 9.17016 4.00001 8.64L4 5.76L4.00001 3.84V0.96C4.00001 0.42984 4.42985 0 4.96001 0C5.49017 0 5.92001 0.42984 5.92001 0.96V3.84Z'
							fill='#EB5A1E'
						/>
						<path
							d='M5.75998 5.92001L3.83998 5.92001L0.959977 5.92001C0.429817 5.92001 -2.29533e-05 5.49017 -2.29301e-05 4.96001C-2.2907e-05 4.42985 0.429817 4.00001 0.959977 4.00001L3.83998 4L5.75998 4.00001L8.63998 4.00001C9.17014 4.00001 9.59998 4.42985 9.59998 4.96001C9.59998 5.49017 9.17014 5.92001 8.63998 5.92001L5.75998 5.92001Z'
							fill='#EB5A1E'
						/>
					</svg>
				</div>
			</div>
		</div>
	)
}
