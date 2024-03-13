import React from 'react'
import { useSelector } from 'react-redux'
import { setCategoryId, setNameCategory } from '../../redux/slices/filterSlice'
import { RootState, useAppDispatch } from '../../redux/store'

export const arrCategories = ['Все', 'Катриджи', 'Системники', 'Мониторы', 'Видеокарты']

export const Categories: React.FC = React.memo(() => {
	const value = useSelector((state: RootState) => state.filterSlice.categoryId)
	const dispatch = useAppDispatch()

	const setCategory = React.useCallback((index: number, item: string) => {
		dispatch(setCategoryId(index))
		dispatch(setNameCategory(item))
	}, [])

	return (
		<div className='categories'>
			<ul>
				{arrCategories.map((item, index) => (
					<li
						key={index}
						onClick={() => setCategory(index, item)}
						className={value === index ? 'active' : ''}
					>
						{item}
					</li>
				))}
			</ul>
		</div>
	)
})
