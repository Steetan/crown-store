import React from 'react'

const NotFound: React.FC = () => {
	return (
		<div className='notFoundBlock'>
			<h1 className='notFoundEmoji'>😐</h1>
			<br />
			<h2 className='notFoundText'>Тут ничего нет</h2>
			<p className='notFoundSubtitle'>Данная страница отсутствует</p>
		</div>
	)
}

export default NotFound
