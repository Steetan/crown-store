import React from 'react'
import styles from './NotFoundBlock.module.scss'

export const NotFoundBlock = () => {
	return (
		<div className={styles.notFoundBlock}>
			<h1 className={styles.notFoundEmoji}>😐</h1>
			<br />
			<h2 className={styles.notFoundText}>Тут ничего нет</h2>
			<p className={styles.notFoundSubtitle}>Данная страница отсутствует</p>
		</div>
	)
}