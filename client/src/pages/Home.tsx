import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setFilters, setIsVisibleFilterPopup, setSelectedPage } from '../redux/slices/filterSlice'
import { fetchProducts } from '../redux/slices/productSlice'
import { RootState, useAppDispatch } from '../redux/store'
import qs from 'qs'

import {
	ProductBlock,
	ProductBlockSkeleton,
	Pagination,
	Categories,
	Sort,
	listSort,
	listTypeSort,
} from '../components'
import { getCart, setCountProduct, setTotalCount, setTotalPrice } from '../redux/slices/cartSlice'
import { fetchAdminMe, setIsAdmin } from '../redux/slices/authSlice'

export interface IProductBlock {
	id: string
	title: string
	imgurl: string
	price: number
	count: number
	countProduct?: { product: string; count: number }[]
}

const Home = () => {
	const [allPages, setAllPages] = React.useState<number>(1)

	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const isSearch = React.useRef(false)
	const isMounted = React.useRef(false)

	const {
		categoryId,
		sort,
		typeSort,
		nameCategory,
		searchInput,
		selectedPage,
		fromRangeFilter,
		toRangeFilter,
		selectedRatingFilter,
	} = useSelector((state: RootState) => state.filterSlice)
	const { items, status } = useSelector((state: RootState) => state.productSlice)
	const { countProduct } = useSelector((state: RootState) => state.cartSlice)

	React.useEffect(() => {
		if (window.location.search) {
			const params = qs.parse(window.location.search.substring(1))

			const sort = listSort.find((obj) => obj.sort === params.sortProperty)
			const typeSort = listTypeSort.find((obj) => obj.sort === params.typeSortProperty)

			dispatch(
				setFilters({
					...params,
					sort,
					typeSort,
				}),
			)
		}

		isSearch.current = false

		try {
			const fetchMe = async () => {
				const data = await dispatch(fetchAdminMe())

				if (data.payload.error) {
					dispatch(setIsAdmin(false))
				} else {
					dispatch(setIsAdmin(true))
				}
			}
			fetchMe()
		} catch (error) {
			console.log(error)
		}
	}, [])

	const getProducts = async () => {
		const categoryParam: string = `${`categoryid=${categoryId}`}`
		const sortParam: string = `&sortBy=${sort.sort}`
		const orderParam: string = `&order=${typeSort.sort}`
		const inputParam: string = `${searchInput && `&search=${searchInput}`}`
		const selectedRating = selectedRatingFilter !== null ? String(selectedRatingFilter) : ''

		const data = await dispatch(
			fetchProducts({
				categoryParam,
				sortParam,
				orderParam,
				inputParam,
				selectedPage: String(selectedPage),
				fromRangeFilter: String(fromRangeFilter),
				toRangeFilter: String(toRangeFilter),
				selectedRating,
			}),
		)
		window.scrollTo(0, 0)

		setAllPages(data.payload.totalPages)
	}

	React.useEffect(() => {
		if (!isSearch.current) {
			getProducts()
		}
		isSearch.current = false
	}, [
		categoryId,
		sort.sort,
		typeSort.sort,
		searchInput,
		selectedPage,
		fromRangeFilter,
		toRangeFilter,
		selectedRatingFilter,
	])

	React.useEffect(() => {
		if (isMounted.current) {
			const queryString = qs.stringify({
				sortProperty: sort.sort,
				typeSortProperty: typeSort.sort,
				categoryId,
				selectedPage,
				nameCategory,
			})

			navigate(`?${queryString}`)
		}
		isMounted.current = true
	}, [categoryId, sort.sort, typeSort.sort, selectedPage, nameCategory])

	React.useEffect(() => {
		getProductsCart()

		dispatch(setSelectedPage(1))
	}, [categoryId])

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

	const setFilter = () => {
		dispatch(setIsVisibleFilterPopup(true))
		window.scrollTo(0, 0)
	}

	return (
		<div className='container'>
			<div className='content__top'>
				<Categories />
				<div className='content-settings'>
					<h2 className='content__title'>{nameCategory}</h2>
					<div className='content-settings__right-block'>
						<Sort value={sort} getProductsCart={getProductsCart} />
						<div className='filter-button-wrapper'>
							<img
								className='filter-button'
								src={require('../assets/filter.jpg')}
								alt=''
								onClick={() => setFilter()}
							/>
							{(Number(fromRangeFilter) ||
								Number(toRangeFilter) ||
								selectedRatingFilter !== null) && <div className='filter-button-notif'></div>}
						</div>
					</div>
				</div>
			</div>
			{searchInput && !items.length && (
				<div className='content__err'>
					<h2>Ничего не удалось найти 😓</h2>
				</div>
			)}
			{status === 'error' && !searchInput ? (
				<div className='content__err'>
					<h2>Произошла ошибка 😓</h2>
					<p>К сожалению, не удалось получить данные. Попробуйте повторить попытку позже.</p>
				</div>
			) : (
				<div className='content__items'>
					{status === 'loading'
						? [...new Array(6)].map((_, index) => <ProductBlockSkeleton key={index} />)
						: items.map((item: IProductBlock) => (
								<ProductBlock
									key={item.id}
									{...item}
									countProduct={countProduct}
									count={item?.count}
								/>
						  ))}
				</div>
			)}
			{status === 'success' && !items.length && !searchInput && (
				<h2 className='empty-items'>Нет таких товаров 😕</h2>
			)}

			{status == 'success' && allPages > 1 && <Pagination allPages={allPages} />}
		</div>
	)
}

export default Home
