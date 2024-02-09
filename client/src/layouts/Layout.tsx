import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header/Header'
import Aside from '../components/Aside/Aside'
import Footer from '../components/Footer/Footer'

const Layout = () => {
	return (
		<div className='main'>
			<Aside />
			<div className='wrapper'>
				<Header />
				<div className='content'>
					<Outlet />
				</div>
				<Footer />
			</div>
		</div>
	)
}

export default Layout
