import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

import './scss/app.scss'
import FullProduct from './pages/FullProduct'
import Layout from './layouts/Layout'
import Login from './pages/Login'
import Registration from './pages/Registration'
import customAxios from './axios'
import { useAppDispatch } from './redux/store'
import { fetchUserMe } from './redux/slices/authSlice'
import AdminPanel from './pages/AdminPanel'
import SettingsUser from './components/SettingsUser/SettingsUser'
import ResultBuy from './pages/ResultBuy'
const Cart = React.lazy(() => import('./pages/Cart'))

function App() {
	const dispatch = useAppDispatch()

	React.useEffect(() => {
		const fetchPages = async () => {
			try {
				await customAxios.get('')
				await dispatch(fetchUserMe())
			} catch (error) {
				console.error(error)
			}
		}

		fetchPages()
	}, [])
	return (
		<Routes>
			<Route path='/' element={<Layout />}>
				<Route path='' element={<Home />} />
				<Route path='adminpanel' element={<AdminPanel />} />
				<Route path='auth/login' element={<Login />} />
				<Route path='auth/reg' element={<Registration />} />
				<Route path='settings' element={<SettingsUser />} />
				<Route path='product/:id' element={<FullProduct />} />
				<Route path='resultbuy' element={<ResultBuy />} />
				<Route path='*' element={<NotFound />} />
				<Route
					path='cart'
					element={
						<React.Suspense fallback={<div className='loading-cart'></div>}>
							<Cart />
						</React.Suspense>
					}
				/>
			</Route>
		</Routes>
	)
}

export default App
