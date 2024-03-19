import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

import './scss/app.scss'
import FullProduct from './pages/FullProduct'
import Layout from './layouts/Layout'
import customAxios from './axios'
import { useAppDispatch } from './redux/store'
import { fetchUserMe } from './redux/slices/authSlice'
import ResultBuy from './pages/ResultBuy'

const Login = React.lazy(() => import('./pages/Login'))
const Registration = React.lazy(() => import('./pages/Registration'))
const Cart = React.lazy(() => import('./pages/Cart'))
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'))
const SettingsUser = React.lazy(() => import('./pages/SettingsUser'))

const App = () => {
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
				<Route path='product/:id' element={<FullProduct />} />
				<Route path='resultbuy' element={<ResultBuy />} />
				<Route path='*' element={<NotFound />} />
				<Route
					path='adminpanel'
					element={
						<React.Suspense fallback={<div className='loading-cart'></div>}>
							<AdminPanel />
						</React.Suspense>
					}
				/>
				<Route
					path='auth/login'
					element={
						<React.Suspense fallback={<div className='loading-cart'></div>}>
							<Login />
						</React.Suspense>
					}
				/>
				<Route
					path='auth/reg'
					element={
						<React.Suspense fallback={<div className='loading-cart'></div>}>
							<Registration />
						</React.Suspense>
					}
				/>
				<Route
					path='settings'
					element={
						<React.Suspense fallback={<div className='loading-cart'></div>}>
							<SettingsUser />
						</React.Suspense>
					}
				/>
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
