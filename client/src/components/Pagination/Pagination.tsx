import React from 'react'
import ReactPaginate from 'react-paginate'
import { useSelector } from 'react-redux'
import { setSelectedPage } from '../../redux/slices/filterSlice'

import styles from './Pagination.module.scss'
import { useAppDispatch, RootState } from '../../redux/store'

export const Pagination: React.FC<{ allPages: number }> = ({ allPages }) => {
	const dispatch = useAppDispatch()
	const initPage = useSelector((state: RootState) => state.filterSlice.selectedPage)
	console.log(allPages)
	return (
		<ReactPaginate
			className={styles.paginationBlock}
			breakLabel='...'
			nextLabel='>'
			onPageChange={(e) => dispatch(setSelectedPage(e.selected + 1))}
			pageRangeDisplayed={5}
			pageCount={allPages}
			previousLabel='<'
			renderOnZeroPageCount={null}
			forcePage={initPage - 1}
		/>
	)
}
