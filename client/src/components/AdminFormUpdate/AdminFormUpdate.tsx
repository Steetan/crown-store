import React from 'react'
import { useForm } from 'react-hook-form'
import { DataProduct } from '../../pages/AdminPanel'
import { TextField } from '@mui/material'
import { updateProduct } from '../../redux/slices/productSlice'
import customAxios from '../../axios'
import { useAppDispatch } from '../../redux/store'

interface IAdminFormUpdate {
	nameButton: string
	productData?: DataProduct
	setFetchData: React.Dispatch<React.SetStateAction<DataProduct[]>>
	setIsVisiblePopupUpdate: React.Dispatch<React.SetStateAction<boolean>>
}

const AdminFormUpdate: React.FC<IAdminFormUpdate> = ({
	nameButton,
	productData,
	setFetchData,
	setIsVisiblePopupUpdate,
}) => {
	const [imgUrlUpdate, setImgUrlUpdate] = React.useState('')
	const inputFileRef = React.useRef<HTMLInputElement>(null)
	const dispatch = useAppDispatch()

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<DataProduct>()

	const onSubmit = async (values: DataProduct) => {
		try {
			const data = await dispatch(
				updateProduct({ ...values, fileimg: imgUrlUpdate, id: productData?.id }),
			)
			if (!data.payload) {
				return alert('Не удалось обновить продукт!')
			}
			if (data.payload) {
				try {
					customAxios.get(`http://localhost:8080/adminpanel`).then(({ data }) => {
						setFetchData(data)
						setIsVisiblePopupUpdate(false)
						document.body.classList.remove('active')
						alert('Продукт был успешно обновлен!')
					})
				} catch (error) {
					console.log(error)
				}
			}
		} catch (error) {
			console.log(error)
		}
	}

	const handleFileChangeUpdate = async (event: any) => {
		try {
			const formDataUpdate = new FormData()
			formDataUpdate.append('image', event.target.files[0])

			customAxios.post('http://localhost:8080/upload', formDataUpdate).then(({ data }) => {
				setImgUrlUpdate(data.url)
			})
		} catch (error) {
			console.warn(error)
		}
	}

	const deleteImg = () => {
		try {
			customAxios.delete(`http://localhost:8080/upload/delete/${imgUrlUpdate}`)
			if (inputFileRef.current) {
				inputFileRef.current.value = ''
				setImgUrlUpdate('')
			}
		} catch (error) {
			console.log(error)
		}
	}

	React.useEffect(() => {
		setValue('title', productData?.title)
		setValue('description', productData?.description)
		setValue('price', productData?.price)
		setValue('category', productData?.category)
		setValue('rating', productData?.rating)
		setValue('count', productData?.count)
		setImgUrlUpdate(productData?.imgurl ? productData.imgurl : '')
	}, [productData, setValue])

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
					{...register('count', { required: 'Укажите количество' })}
				/>
				{errors.count && <p style={{ color: 'red' }}>{errors.count.message}</p>}
				{!imgUrlUpdate && (
					<label htmlFor='file-upload-update' className='custom-file-upload'>
						Загрузить фото
					</label>
				)}
				<input
					id='file-upload-update'
					ref={inputFileRef}
					type='file'
					style={{ display: 'none' }}
					onChange={handleFileChangeUpdate}
				/>
			</div>
			{imgUrlUpdate && (
				<div className='custom-block-img'>
					<img
						className='form-block__img-upload'
						src={`http://localhost:8080/uploads/${imgUrlUpdate}`}
						alt=''
					/>
					{imgUrlUpdate && (
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

export default AdminFormUpdate
