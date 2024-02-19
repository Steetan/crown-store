import React from 'react'
import { useAppDispatch } from '../redux/store'
import { fetchAdminMe } from '../redux/slices/authSlice'
import { useForm } from 'react-hook-form'
import { TextField } from '@mui/material'
import { createProduct } from '../redux/slices/productSlice'
import NotFound from './NotFound'
import customAxios from '../axios'

export interface DataProduct {
	id?: string
	title: string
	description: string
	fileimg: string
	price: number
	rating: number
	category: number
	totalcount: number
	imgurl?: string
}

const AdminPanel: React.FC = () => {
	const [hasError, setHasError] = React.useState(false)
	const [imgUrl, setImgUrl] = React.useState('')
	const inputFileRef = React.useRef<HTMLInputElement>(null)
	const [fetchData, setFetchData] = React.useState<DataProduct[]>([])
	const [isVisiblePopupUpdate, setIsVisiblePopupUpdate] = React.useState(false)

	const dispatch = useAppDispatch()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<DataProduct>()

	React.useEffect(() => {
		customAxios.get(`http://localhost:8080/adminpanel`).then(({ data }) => {
			setFetchData(data)
		})
	}, [])

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
			formData.append('image', event.target.files[0])

			customAxios.post('http://localhost:8080/upload', formData).then(({ data }) => {
				setImgUrl(data.url)
			})
		} catch (error) {
			console.warn(error)
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

	const deleteItem = (id: string, title: string) => {
		try {
			if (window.confirm(`Вы действительно хотите удалить продукт ${title}?`)) {
				customAxios
					.delete(`http://localhost:8080/deletebyid`, {
						params: {
							product: id,
						},
					})
					.then(() => {
						customAxios.get(`http://localhost:8080/adminpanel`).then(({ data }) => {
							setFetchData(data)
						})
					})
			}
		} catch (error) {
			console.log(error)
		}
	}

	const onSubmit = async (values: DataProduct) => {
		const data = await dispatch(createProduct({ ...values, fileimg: imgUrl }))
		if (!data.payload) {
			return alert('Не удалось создать продукт!')
		}
		if (data.payload) {
			window.location.reload()
		}
	}

	console.log(isVisiblePopupUpdate)

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
						{!imgUrl && (
							<label htmlFor='file-upload' className='custom-file-upload'>
								Выберите файл
							</label>
						)}
						<input
							id='file-upload'
							ref={inputFileRef}
							type='file'
							style={{ display: 'none' }}
							onChange={handleFileChange}
							// {...register('fileimg', { required: 'Добавьте файл', onChange: handleFileChange })}
						/>
						{errors.fileimg && <p style={{ color: 'red' }}>{errors.fileimg.message}</p>}
					</div>
					<img
						className='form-block__img-upload'
						src={`http://localhost:8080/uploads/${imgUrl}`}
						alt=''
					/>
					{imgUrl && <button onClick={deleteImg}>del</button>}
					<div className='form-block__btns'>
						<button type='submit' className='button button--footer'>
							Добавить продукт
						</button>
					</div>
				</form>
			</div>
			<div className='admin__list-block'>
				<div className='admin__list-item'>
					<div className='admin__list-cell admin__list-cell--title'>id</div>
					<div className='admin__list-cell admin__list-cell--title'>title</div>
					<div className='admin__list-cell admin__list-cell--title'>description</div>
					<div className='admin__list-cell admin__list-cell--title'>price</div>
					<div className='admin__list-cell admin__list-cell--title'>category</div>
					<div className='admin__list-cell admin__list-cell--title'>imgurl</div>
					<div className='admin__list-cell admin__list-cell--title'>rating</div>
					<div className='admin__list-cell admin__list-cell--title'>totalcount</div>
				</div>
				{fetchData.map((item: DataProduct) => (
					<>
						<div className='admin__list-item'>
							<div className='admin__list-cell'>{item.id}</div>
							<div className='admin__list-cell'>{item.title}</div>
							<div className='admin__list-cell'>{item.description}</div>
							<div className='admin__list-cell'>{item.price}</div>
							<div className='admin__list-cell'>{item.category}</div>
							<div className='admin__list-cell'>{item.imgurl ? item.imgurl : 'null'}</div>
							<div className='admin__list-cell'>{item.rating}</div>
							<div className='admin__list-cell'>{item.totalcount}</div>
							<div
								className='admin__list-cell-delete'
								onClick={() => deleteItem(item.id ? item.id : '', item.title)}
							>
								x
							</div>
							<div
								className='admin__list-cell-delete'
								onClick={() => setIsVisiblePopupUpdate(true)}
							>
								u
							</div>
						</div>
					</>
				))}
			</div>
			{/* {isVisiblePopupUpdate && (
				<div className='popup-update'>
					<h3 className='form-block__title'>Изменить продукт</h3>
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
							{!imgUrl && (
								<label htmlFor='file-upload' className='custom-file-upload'>
									Выберите файл
								</label>
							)}
							<input
								id='file-upload'
								ref={inputFileRef}
								type='file'
								style={{ display: 'none' }}
								onChange={handleFileChange}
							/>
							{errors.fileimg && <p style={{ color: 'red' }}>{errors.fileimg.message}</p>}
						</div>
						<img
							className='form-block__img-upload'
							src={`http://localhost:8080/uploads/${imgUrl}`}
							alt=''
						/>
						{imgUrl && <button onClick={deleteImg}>del</button>}
						<div className='form-block__btns'>
							<button type='submit' className='button button--footer'>
								Изменить
							</button>
						</div>
					</form>
				</div>
			)} */}
		</div>
	)
}

export default AdminPanel
