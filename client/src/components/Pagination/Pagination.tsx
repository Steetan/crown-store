import React from 'react'
import ReactPaginate from 'react-paginate'
import { useSelector } from 'react-redux'
import { setSelectedPage } from '../../redux/slices/filterSlice'

import styles from './Pagination.module.scss'
import { useAppDispatch, RootState } from '../../redux/store'

export const Pagination: React.FC<{ allPages: number }> = ({ allPages }) => {
	const dispatch = useAppDispatch()
	const initPage = useSelector((state: RootState) => state.filterSlice.selectedPage)
	return (
		<ReactPaginate
			className={styles.paginationBlock}
			breakLabel='...'
			nextLabel='>'
			onPageChange={(e) => dispatch(setSelectedPage(e.selected + 1))}
			pageRangeDisplayed={5}
			pageCount={Math.ceil(allPages / 4)}
			previousLabel='<'
			renderOnZeroPageCount={null}
			forcePage={initPage - 1}
		/>
	)
}
