import React from 'react'
import { useAppDispatch } from '../redux/store'
import { fetchAdminMe } from '../redux/slices/authSlice'
import { useForm } from 'react-hook-form'
import { TextField } from '@mui/material'
import { createProduct } from '../redux/slices/productSlice'
import NotFound from './NotFound'
import axios from 'axios'

export interface DataProduct {
	title: string
	description: string
	fileimg: string
	price: number
	rating: number
	category: number
	totalcount: number
}

const AdminPanel: React.FC = () => {
	const [hasError, setHasError] = React.useState(false)
	const [imgUrl, setImgUrl] = React.useState('')

	const dispatch = useAppDispatch()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<DataProduct>()

	React.useEffect(() => {
		const fetchMe = async () => {
			const data = await dispatch(fetchAdminMe())
			if (data.payload.error) {
				setHasError(true)
			}
		}
		fetchMe()
	}, [dispatch])

	if (hasError) {
		return <NotFound />
	}

	const handleFileChange = async (event: any) => {
		try {
			const formData = new FormData()
			const file = event.target.files[0]
			formData.append('image', file)
			const { data } = await axios.post('http://localhost:8080/upload', formData)
			setImgUrl(data.url)
			console.log(`http://localhost:8080${imgUrl}`)
		} catch (error) {
			console.warn(error)
		}
	}

	const onSubmit = async (values: DataProduct) => {
		const data = await dispatch(createProduct({ ...values, fileimg: imgUrl }))
		if (!data.payload) {
			return alert('Не удалось создать продукт!')
		}
		if (data.payload) {
			window.location.reload()
			return alert('Ну чето создалось!')
		}
	}

	return (
		<div>
			<div className='form-block'>
				<h3 className='form-block__title'>Добавить продукт</h3>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='form-block__inputs'>
						<TextField
							id='outlined-basic'
							className='form-block__input'
							label='Название'
							variant='outlined'
							{...register('title', { required: 'Укажите название' })}
						/>
						{errors.title && <p style={{ color: 'red' }}>{errors.title.message}</p>}
						<TextField
							id='outlined-basic'
							label='Описание'
							className='form-block__input'
							variant='outlined'
							{...register('description', { required: 'Укажите описание' })}
						/>
						{errors.description && <p style={{ color: 'red' }}>{errors.description.message}</p>}
						<TextField
							id='outlined-basic'
							label='Цена'
							className='form-block__input'
							variant='outlined'
							{...register('price', { required: 'Укажите цену' })}
						/>
						{errors.price && <p style={{ color: 'red' }}>{errors.price.message}</p>}
						<TextField
							id='outlined-basic'
							label='Категория'
							className='form-block__input'
							variant='outlined'
							{...register('category', { required: 'Укажите категорию' })}
						/>
						{errors.price && <p style={{ color: 'red' }}>{errors.price.message}</p>}
						<TextField
							id='outlined-basic'
							label='Рейтинг от 1 до 5'
							className='form-block__input'
							variant='outlined'
							{...register('rating', { required: 'Укажите цену' })}
						/>
						{errors.rating && <p style={{ color: 'red' }}>{errors.rating.message}</p>}
						<TextField
							id='outlined-basic'
							label='Количество'
							className='form-block__input'
							variant='outlined'
							{...register('totalcount', { required: 'Укажите цену' })}
						/>
						{errors.totalcount && <p style={{ color: 'red' }}>{errors.totalcount.message}</p>}
						<TextField
							type='file'
							className='form-block__input'
							variant='outlined'
							{...register('fileimg', { required: 'Добавьте файл', onChange: handleFileChange })}
						/>
						{errors.fileimg && <p style={{ color: 'red' }}>{errors.fileimg.message}</p>}
					</div>
					<img src={`http://localhost:8080${imgUrl}`} alt='' />
					<div className='form-block__btns'>
						{/* {!answReg && (
							<p style={{ textAlign: 'center', color: 'red' }}>
								Такой пользователь уже существует!
							</p>
						)} */}
						<button type='submit' className='button button--footer'>
							Зарегистрироваться
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default AdminPanel
