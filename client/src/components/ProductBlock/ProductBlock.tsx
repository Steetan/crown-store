import React from 'react'
import { useSelector } from 'react-redux'
import { setTotalCount, setTotalPrice } from '../../redux/slices/cartSlice'
import { Link } from 'react-router-dom'
import { RootState, useAppDispatch } from '../../redux/store'
import customAxios from '../../axios'

interface IProductBlock {
	id: string
	title: string
	imgurl: string
	price: number
	countProduct?: { product: string; count: number }[]
}

export const ProductBlock: React.FC<IProductBlock> = ({
	id,
	title,
	imgurl,
	price,
	countProduct,
}) => {
	const { totalCount, totalPrice } = useSelector((state: RootState) => state.cartSlice)
	const dispatch = useAppDispatch()
	const [targetProduct, setTargetProduct] = React.useState<{ product: string; count: number }>({
		product: '',
		count: 0,
	})

	React.useEffect(() => {
		const target = countProduct?.find((product) => product.product === id)
		setTargetProduct(target ?? { product: 'id', count: 0 })
	}, [countProduct])

	const onClickAdd = async () => {
		customAxios
			.get('/cart/getbyid', {
				params: {
					product: id,
				},
			})
			.then(({ data }) => {
				!data.value && dispatch(setTotalCount(totalCount + 1))
				dispatch(setTotalPrice(totalPrice + price))
				if (targetProduct) {
					const newCount = targetProduct.count + 1
					setTargetProduct({ ...targetProduct, count: newCount })
				}
				if (!data.value) {
					return customAxios.post('/cart', {
						product: id,
						price,
						act: 'push',
						title,
						imgurl,
					})
				} else if (data.value) {
					return customAxios.patch('/cart/update', {
						productid: id,
						act: 'plus',
					})
				}
			})
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
					{targetProduct.count !== 0 && <i>{targetProduct.count}</i>}
				</button>
			</div>
		</div>
	)
}
