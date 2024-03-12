import React from 'react'
import { useSelector } from 'react-redux'
import { setTotalCount, setTotalPrice } from '../../redux/slices/cartSlice'
import { Link } from 'react-router-dom'
import { RootState, useAppDispatch } from '../../redux/store'
import customAxios from '../../axios'
import { selectIsAuth } from '../../redux/slices/authSlice'
import { IProductBlock } from '../../pages/Home'

export const ProductBlock: React.FC<IProductBlock> = ({
	id,
	title,
	imgurl,
	price,
	countProduct,
	count,
}) => {
	const { totalCount, totalPrice } = useSelector((state: RootState) => state.cartSlice)
	const { nameCategory } = useSelector((state: RootState) => state.filterSlice)
	const dispatch = useAppDispatch()
	const [targetProduct, setTargetProduct] = React.useState<{ product: string; count: number }>({
		product: '',
		count: 0,
	})

	const isAuth = useSelector(selectIsAuth)

	React.useEffect(() => {
		const target = countProduct?.find((product) => product.product === id)
		setTargetProduct(target ?? { product: 'id', count: 0 })
	}, [countProduct, nameCategory])

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
		count && (
			<div className='product-block'>
				<div className='product-block__top'>
					<Link to={`product/${id}`} title='посмотреть подробную информацию'>
						<div className='product-block__image'>
							<img
								src={`http://localhost:8080/uploads/${imgurl}`}
								alt='Product'
								onError={(e) => {
									e.currentTarget.src = require('../../assets/placeholder.jpg')
								}}
							/>
						</div>
					</Link>
					<h4 className='product-block__title'>{title}</h4>
				</div>
				<div className='product-block__bottom'>
					<div className='product-block__price'>{price} ₽</div>
					{isAuth && (
						<button onClick={() => onClickAdd()} className='button button--outline button--add'>
							<span>Добавить</span>
							{targetProduct.count !== 0 && <i>{targetProduct.count}</i>}
						</button>
					)}
				</div>
			</div>
		)
	)
}
