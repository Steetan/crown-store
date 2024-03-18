import React from 'react'
import { useForm } from 'react-hook-form'
import { DataProduct } from '../../pages/AdminPanel'
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { createProduct } from '../../redux/slices/productSlice'
import customAxios from '../../axios'
import { useAppDispatch } from '../../redux/store'
import { arrCategories } from '../Categories/Categories'

const AdminForm: React.FC<{ nameButton: string; productData?: DataProduct }> = ({ nameButton }) => {
	const [imgUrl, setImgUrl] = React.useState('')
	const [category, setCategory] = React.useState('')
	const inputFileRef = React.useRef<HTMLInputElement>(null)
	const dispatch = useAppDispatch()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<DataProduct>()

	const onSubmit = async (values: DataProduct) => {
		try {
			const data = await dispatch(createProduct({ ...values, fileimg: imgUrl }))
			if (!data.payload) {
				return alert('Не удалось создать продукт!')
			}
			if (data.payload) {
				window.location.reload()
			}
		} catch (error) {
			console.log(error)
		}
	}

	const handleFileChange = async (event: any) => {
		try {
			const formData = new FormData()
			formData.append('image', event.target.files[0])

			customAxios.post('http://localhost:8080/upload', formData).then(({ data }) => {
				setImgUrl(data.url)
			})
		} catch (error) {
			console.log(error)
		}
	}

	const deleteImg = () => {
		try {
			customAxios.delete(`http://localhost:8080/upload/delete/${imgUrl}`)
			if (inputFileRef.current) {
				inputFileRef.current.value = ''
				setImgUrl('')
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
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
				<FormControl fullWidth>
					<InputLabel id='demo-simple-select-label'>Категория</InputLabel>
					<Select
						labelId='demo-simple-select-label'
						id='demo-simple-select'
						value={category}
						label='Категория'
						{...register('category', {
							required: 'Укажите категорию',
							onChange: (event) => setCategory(event.target.value),
						})}
					>
						{arrCategories.slice(1).map((item, index) => (
							<MenuItem key={index + 1} value={index + 1}>
								{item}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				{errors.category && <p style={{ color: 'red' }}>{errors.category.message}</p>}
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
					{...register('count', { required: 'Укажите количество' })}
				/>
				{errors.count && <p style={{ color: 'red' }}>{errors.count.message}</p>}
				{!imgUrl && (
					<label htmlFor='file-upload-create' className='custom-file-upload'>
						Загрузить фото
					</label>
				)}
				<input
					id='file-upload-create'
					ref={inputFileRef}
					type='file'
					style={{ display: 'none' }}
					onChange={handleFileChange}
				/>
			</div>
			{imgUrl && (
				<div className='custom-block-img'>
					<img
						className='form-block__img-upload'
						src={`http://localhost:8080/uploads/${imgUrl}`}
						alt=''
					/>
					{imgUrl && (
						<button className='settings__btn-delete' onClick={deleteImg}>
							Удалить
						</button>
					)}
				</div>
			)}
			<div className='form-block__btns'>
				<button type='submit' className='button button--footer'>
					{nameButton}
				</button>
			</div>
		</form>
	)
}

export default AdminForm
