import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Products from './components/Products'
import Suppliers from './components/Suppliers'
import Warehouses from './components/Warehouses'
import SignIn from './components/SignIn'
import WarehouseInventory from './components/WarehouseInventory'

const App = () => {
	const isAuthenticated = localStorage.getItem('token')

	return (
		<Routes>
			<Route
				path="/"
				element={
					isAuthenticated ? (
						<Navigate to="/products" />
					) : (
						<Navigate to="/signin" />
					)
				}
			/>
			<Route
				path="/signin"
				element={<SignIn />}
			/>
			<Route
				path="/products"
				element={
					isAuthenticated ? <Products /> : <Navigate to="/signin" />
				}
			/>
			<Route
				path="/suppliers"
				element={
					isAuthenticated ? <Suppliers /> : <Navigate to="/signin" />
				}
			/>
			<Route
				path="/warehouses"
				element={
					isAuthenticated ? <Warehouses /> : <Navigate to="/signin" />
				}
			/>
			<Route
				path="/warehouses/:warehouseID/inventory"
				element={
					isAuthenticated ? (
						<WarehouseInventory />
					) : (
						<Navigate to="/signin" />
					)
				}
			/>
		</Routes>
	)
}

export default App
