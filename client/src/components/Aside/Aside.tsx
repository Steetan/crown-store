import React, { ChangeEvent } from 'react'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../../redux/store'
import {
	setFromRangeFilter,
	setIsVisibleFilterPopup,
	setSelectedRatingFilter,
	setToRangeFilter,
} from '../../redux/slices/filterSlice'
import {
	getCart,
	setCountProduct,
	setTotalCount,
	setTotalPrice,
} from '../../redux/slices/cartSlice'

const Aside = () => {
	const [inputBefore, setInputBefore] = React.useState('')
	const [inputAfter, setInputAfter] = React.useState('')
	const [selectedRating, setSelectedRating] = React.useState<null | number>(null)

	const { isVisibleFilterPopup } = useSelector((state: RootState) => state.filterSlice)

	const isFilter = React.useRef<HTMLDivElement>(null)
	const dispatch = useAppDispatch()

	const listRating = ['Товары с хорошим рейтингом', 'Товары с плохим рейтингом']

	isVisibleFilterPopup
		? document.body.classList.add('active')
		: document.body.classList.remove('active')

	const setAside = () => {
		dispatch(setFromRangeFilter(Number(inputBefore)))
		dispatch(setToRangeFilter(Number(inputAfter)))
		dispatch(setIsVisibleFilterPopup(false))
		dispatch(setSelectedRatingFilter(selectedRating))
		getProductsCart()
		window.scrollTo(0, 0)
	}

	const resetFilters = () => {
		setInputBefore('')
		setInputAfter('')
		dispatch(setFromRangeFilter(0))
		dispatch(setToRangeFilter(0))
		dispatch(setSelectedRatingFilter(null))
		setSelectedRating(null)
		getProductsCart()
	}

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

	return (
		<div ref={isFilter} className={isVisibleFilterPopup ? 'aside active' : 'aside'}>
			<div className='aside-close-wrapper' onClick={() => setAside()}>
				<div className='aside-close'></div>
			</div>
			<h2 className='aside__main-title'>Фильтры</h2>
			<div className='aside__filter-main'>
				<h2 className='aside__title'>Диапазон</h2>
				<div className='aside__filter-inputs'>
					<input
						className='aside__filter-input'
						type='text'
						placeholder='от'
						value={inputBefore}
						onChange={(event: ChangeEvent<HTMLInputElement>) => setInputBefore(event.target.value)}
					/>
					<input
						className='aside__filter-input'
						type='text'
						placeholder='до'
						value={inputAfter}
						onChange={(event: ChangeEvent<HTMLInputElement>) => setInputAfter(event.target.value)}
					/>
				</div>
			</div>
			<div className='aside__rating-main'>
				<h2 className='aside__title'>Рейтинг</h2>
				<div className='aside__rating-blocks'>
					{listRating.map((item, index) => (
						<h3
							className={
								selectedRating === index ? 'aside__rating-block active' : 'aside__rating-block'
							}
							onClick={() => setSelectedRating(index)}
							key={index}
						>
							{item}
						</h3>
					))}
				</div>
			</div>
			<div className='aside__buttons'>
				<button className='aside__button aside__button--reset' onClick={resetFilters}>
					Сбросить фильтры
				</button>
				<button className='aside__button' onClick={setAside}>
					Применить
				</button>
			</div>
		</div>
	)
}

export default Aside
