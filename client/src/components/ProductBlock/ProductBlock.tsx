import React from 'react'
import { useSelector } from 'react-redux'
import { addItem, plusItem, typeCartItem } from '../../redux/slices/cartSlice'
import { Link } from 'react-router-dom'
import { RootState, useAppDispatch } from '../../redux/store'

interface IProductBlock {
	id: string
	title: string
	imgurl: string
	price: number
}

export const ProductBlock: React.FC<IProductBlock> = ({ id, title, imgurl, price }) => {
	const cartItem = useSelector((state: RootState) =>
		state.cartSlice.cartItems.find((obj: IProductBlock) => obj.id === id),
	)
	const dispatch = useAppDispatch()

	const countItem = cartItem ? cartItem.count : 0

	const onClickAdd = () => {
		const item = {
			id,
			title,
			price,
			imgurl,
		} as typeCartItem
		dispatch(addItem(item))
		dispatch(plusItem(item.id))
	}

	return (
		<div className='product-block'>
			<Link to={`product/${id}`} title='посмотреть подробную информацию'>
				<img
					className='product-block__image'
					src={imgurl}
					alt='Product'
					onError={(e) => {
						e.currentTarget.src = require('../../assets/placeholder.jpg')
					}}
				/>
			</Link>
			<h4 className='product-block__title'>{title}</h4>
			<div className='product-block__bottom'>
				<div className='product-block__price'>{price} ₽</div>
				<button onClick={() => onClickAdd()} className='button button--outline button--add'>
					<span>Добавить</span>
					{countItem !== 0 && <i>{countItem}</i>}
				</button>
			</div>
		</div>
	)
}
