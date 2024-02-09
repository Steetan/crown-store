import React from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

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

	React.useEffect(() => {
		const fetchProduct = async () => {
			try {
				const { data } = await axios.get(`http://localhost:8080/${id}`)
				setDataProduct(data[0])
			} catch (error) {
				console.log(error)
			}
		}

		fetchProduct()
	}, [])

	return (
		<div className='container container--fullProduct'>
			<img className='product-block__image' src={dataProduct.imgurl} alt='Product' />
			<h2>{dataProduct.title}</h2>
			<p>{dataProduct.description}</p>
		</div>
	)
}

export default FullProduct
