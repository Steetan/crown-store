import React from 'react'
import { useAppDispatch } from '../redux/store'
import { fetchAdminMe } from '../redux/slices/authSlice'
import NotFound from './NotFound'
import customAxios from '../axios'
import AdminForm from '../components/AdminForm/AdminForm'
import AdminFormUpdate from '../components/AdminFormUpdate/AdminFormUpdate'

export interface DataProduct {
	id?: string
	title: string | undefined
	description: string | undefined
	fileimg: string | undefined
	price: number | undefined
	rating: number | undefined
	category: number | undefined
	count: number | undefined
	imgurl?: string | undefined
}

const AdminPanel: React.FC = () => {
	const [hasError, setHasError] = React.useState(false)
	const [fetchData, setFetchData] = React.useState<DataProduct[]>([])
	const [isVisiblePopupUpdate, setIsVisiblePopupUpdate] = React.useState(false)
	const [selectedProductData, setSelectedProductData] = React.useState<any>({})

	const dispatch = useAppDispatch()

	React.useEffect(() => {
		try {
			customAxios.get(`http://localhost:8080/adminpanel`).then(({ data }) => {
				setFetchData(data)
			})
		} catch (error) {
			console.log(error)
		}
	}, [])

	React.useEffect(() => {
		try {
			const fetchMe = async () => {
				const data = await dispatch(fetchAdminMe())
				if (data.payload.error) {
					setHasError(true)
				}
			}
			fetchMe()
		} catch (error) {
			console.log(error)
		}
	}, [dispatch])

	if (hasError) {
		return <NotFound />
	}

	if (!fetchData || !Array.isArray(fetchData)) {
		return <div className='loading-cart'></div>
	}

	const deleteItem = (id: string, title: string | undefined) => {
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

	const deleteProducts = () => {
		try {
			if (window.confirm(`Вы действительно хотите удалить все продукты?`)) {
				customAxios.delete(`http://localhost:8080/`).then(() => {
					customAxios.get(`http://localhost:8080/adminpanel`).then(({ data }) => {
						setFetchData(data)
					})
				})
			}
		} catch (error) {
			console.log(error)
		}
	}

	const onOpenPopup = (item: DataProduct) => {
		setIsVisiblePopupUpdate(true)
		document.body.classList.add('active')
		setSelectedProductData(item)
		window.scrollTo(0, 0)
	}

	const onClosePopup = () => {
		setIsVisiblePopupUpdate(false)
		document.body.classList.remove('active')
	}

	return (
		<div className='admin-block'>
			<div className='form-block form-block--admin'>
				<h3 className='form-block__title'>Добавить</h3>
				<AdminForm nameButton='Добавить продукт' />
			</div>
			<div className='admin__list-main-block'>
				<div className='admin__list-header'>
					<h3 className='admin__list-title'>Продукты</h3>
					<h4 className='admin__list-deleteAll' onClick={deleteProducts}>
						Удалить все
					</h4>
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
						<div className='admin__list-cell admin__list-cell--title'>count</div>
					</div>
					{!hasError &&
						fetchData.map((item: DataProduct) => (
							<div key={item.id}>
								<div className='admin__list-item'>
									<div className='admin__list-cell'>{item.id}</div>
									<div className='admin__list-cell'>{item.title}</div>
									<div className='admin__list-cell'>{item.description}</div>
									<div className='admin__list-cell'>{item.price}</div>
									<div className='admin__list-cell'>{item.category}</div>
									<div className='admin__list-cell'>{item.imgurl ? item.imgurl : 'false'}</div>
									<div className='admin__list-cell'>{item.rating}</div>
									<div className='admin__list-cell'>{item.count}</div>
									<div className='admin__list-cell-act'>
										<img
											onClick={() => onOpenPopup(item)}
											className='admin__list-cell-update'
											src={require('../assets/system-update.png')}
											alt='update'
											title='обновить строку'
										/>
										<img
											className='admin__list-cell-delete'
											onClick={() => deleteItem(item.id ? item.id : '', item.title)}
											src={require('../assets/delete.png')}
											title='удалить строку'
										/>
									</div>
								</div>
							</div>
						))}
				</div>
				{isVisiblePopupUpdate && (
					<div className='popup-update__wrapper'>
						<div className='popup-update'>
							<h3 className='form-block__title'>Обновить продукт</h3>
							<div className='popup-update__close-wrap' onClick={onClosePopup}>
								<div className='popup-update__close'></div>
							</div>
							<AdminFormUpdate
								nameButton='Обновить'
								productData={selectedProductData}
								setFetchData={setFetchData}
								setIsVisiblePopupUpdate={setIsVisiblePopupUpdate}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default AdminPanel
