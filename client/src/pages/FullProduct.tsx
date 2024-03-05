import React from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { getCart, setCountProduct, setTotalCount, setTotalPrice } from '../redux/slices/cartSlice'
import { useAppDispatch } from '../redux/store'

interface IProduct {
	imgurl: string
	title: string
	description: string
}

const FullProduct: React.FC = () => {
	const { id } = useParams()
	const [dataProduct, setDataProduct] = React.useState<IProduct>({
		imgurl: '',
		title: '',
		description: '',
	})

	const dispatch = useAppDispatch()

	React.useEffect(() => {
		const fetchProduct = async () => {
			try {
				const { data } = await axios.get(`http://localhost:8080/${id}`)
				setDataProduct(data[0])

				const getProductsCart = () => {
					let totalPrice = 0

					dispatch(getCart()).then((data) => {
						let arrCountProduct: { product: string; count: number }[] = []
						data.payload &&
							data.payload.results.forEach((item: any) => {
								totalPrice += item.product_price * item.totalcount
								arrCountProduct.push({ product: item.product_id, count: item.totalcount })
							})
						dispatch(setCountProduct(arrCountProduct))
						dispatch(setTotalPrice(totalPrice))
						dispatch(setTotalCount(data.payload?.results.length))
					})
				}

				getProductsCart()
			} catch (error) {
				console.log(error)
			}
		}

		fetchProduct()
	}, [])

	return (
		<div className='container container--fullProduct'>
			<div className='product-block__image'>
				<img
					src={`http://localhost:8080/uploads/${dataProduct.imgurl}`}
					alt='Product'
					// onError={(e) => {
					// 	e.currentTarget.src = require('../../assets/placeholder.jpg')
					// }}
				/>
			</div>
			<h2 className='product-block__title--fullProduct'>{dataProduct.title}</h2>
			<p className='product-block__desc'>{dataProduct.description}</p>
		</div>
	)
}

export default FullProduct
