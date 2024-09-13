import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Products = () => {
	const baseURL = import.meta.env.VITE_API_URL
	const navigate = useNavigate()
	const [products, setProducts] = useState([])
	const [suppliers, setSuppliers] = useState([])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] =
		useState(false)
	const [productData, setProductData] = useState({
		name: '',
		sku: '',
		quantity: '',
		supplier_id: '',
	})

	const fetchProducts = useCallback(async () => {
		const token = localStorage.getItem('token')
		const response = await axios.get(`${baseURL}products`, {
			headers: {
				Authorization: `Bearer ${token}`,
				'ngrok-skip-browser-warning': true,
			},
		})
		setProducts(response.data)
	}, [])

	const handleAddOrEditProduct = useCallback(async () => {
		const token = localStorage.getItem('token')
		if (productData.id) {
			await axios.put(
				`${baseURL}products/${productData.id}`,
				productData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'ngrok-skip-browser-warning': true,
					},
				}
			)
		} else {
			await axios.post(`${baseURL}products`, productData, {
				headers: {
					Authorization: `Bearer ${token}`,
					'ngrok-skip-browser-warning': true,
				},
			})
		}
		setIsModalOpen(false)
		setProductData({ name: '', sku: '', quantity: '', supplier_id: '' })
		fetchProducts()
	}, [productData])

	const handleDeleteProduct = useCallback(async () => {
		const token = localStorage.getItem('token')
		await axios.delete(`${baseURL}products/${productData.id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
				'ngrok-skip-browser-warning': true,
			},
		})
		setIsDeleteProductModalOpen(false)
		setProductData({ name: '', sku: '', quantity: '', supplier_id: '' })
		fetchProducts()
	}, [productData])

	useEffect(() => {
		fetchProducts()
	}, [])

	useEffect(() => {
		const fetchSuppliersForDropdown = async () => {
			const token = localStorage.getItem('token')
			const response = await axios.get(`${baseURL}supplier`, {
				headers: {
					Authorization: `Bearer ${token}`,
					'ngrok-skip-browser-warning': true,
				},
			})
			setSuppliers(response.data)
		}
		if (isModalOpen) {
			fetchSuppliersForDropdown()
		} else {
			setSuppliers([])
		}
	}, [isModalOpen])

	return (
		<div className="p-6">
			<div className="flex w-full justify-between items-center py-3">
				<h1 className="text-2xl">Products</h1>
				<div className="flex gap-6">
					<span
						className="text-xl underline hover:scale-110 text-blue-600 cursor-pointer"
						onClick={() => navigate('/suppliers')}
					>
						Suppliers
					</span>
					<span
						className="text-xl underline hover:scale-110 text-blue-600 cursor-pointer"
						onClick={() => navigate('/warehouses')}
					>
						Warehouses
					</span>
					<span
						className="text-xl underline hover:scale-110 text-red-600 cursor-pointer"
						onClick={() => {
							localStorage.clear()
							navigate('/signin')
						}}
					>
						Logout
					</span>
				</div>
			</div>
			<button
				className="mb-4 p-2 bg-blue-600 text-white rounded-lg"
				onClick={() => setIsModalOpen(true)}
			>
				Add Product
			</button>
			<table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
				<thead className="bg-blue-200">
					<tr>
						<th className="py-2">Name</th>
						<th className="py-2">SKU</th>
						<th className="py-2">Quantity</th>
						<th className="py-2">Action</th>
					</tr>
				</thead>
				<tbody>
					{products?.length > 0 &&
						products.map((product) => (
							<tr
								key={product.id}
								className="bg-gray-200"
							>
								<td className="py-2 text-center">
									{product.name}
								</td>
								<td className="py-2 text-center">
									{product.sku}
								</td>
								<td className="py-2 text-center">
									{product.quantity}
								</td>
								<td className="flex py-2 justify-center underline text-blue-600 gap-3">
									<span
										className="hover:scale-110 cursor-pointer"
										onClick={() => {
											setProductData({
												id: product.id,
												name: product.name,
												sku: product.sku,
												quantity: product.quantity,
												supplier_id:
													product.supplier_id,
											})
											setIsModalOpen(true)
										}}
									>
										Edit
									</span>
									<span
										className="hover:scale-110 cursor-pointer"
										onClick={() => {
											setProductData({
												id: product.id,
												name: product.name,
												sku: product.sku,
												quantity: product.quantity,
												supplier_id:
													product.supplier_id,
											})
											setIsDeleteProductModalOpen(true)
										}}
									>
										Delete
									</span>
								</td>
							</tr>
						))}
					{products?.length === 0 && (
						<tr className="bg-gray-200 border-b border-gray-300">
							<td
								colSpan={'4'}
								className="py-2 text-center"
							>
								{'No Products Found!'}
							</td>
						</tr>
					)}
				</tbody>
			</table>

			{/* Add/Edit Product Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
					<div className="bg-white rounded-lg p-6">
						<div className="flex w-full justify-between">
							<h2 className="text-xl mb-4">{`${
								!productData?.id ? 'Add' : 'Edit'
							} Product`}</h2>
							<span
								className="text-xl mb-4 hover:scale-125 font-bold cursor-pointer items-center"
								onClick={() => {
									setIsModalOpen(false)
									setProductData({
										name: '',
										sku: '',
										quantity: '',
										supplier_id: '',
									})
								}}
							>
								X
							</span>
						</div>
						<input
							type="text"
							className="w-full mb-4 p-2 border rounded-lg"
							placeholder="Name"
							value={productData.name}
							onChange={(e) =>
								setProductData({
									...productData,
									name: e.target.value,
								})
							}
						/>
						<input
							type="text"
							className="w-full mb-4 p-2 border rounded-lg"
							placeholder="SKU"
							value={productData.sku}
							onChange={(e) =>
								setProductData({
									...productData,
									sku: e.target.value,
								})
							}
						/>
						<input
							type="number"
							className="w-full mb-4 p-2 border rounded-lg"
							placeholder="Quantity"
							value={productData.quantity}
							onChange={(e) =>
								setProductData({
									...productData,
									quantity: e.target.value,
								})
							}
						/>
						<select
							id="suppliers-dropdown"
							value={productData.supplier_id}
							onChange={(e) =>
								setProductData({
									...productData,
									supplier_id: e.target.value,
								})
							}
							className="w-full mb-4 p-[0.6rem] bg-white border rounded-lg"
						>
							<option
								value=""
								disabled
							>
								Select A Supplier
							</option>
							{suppliers.map((supplier) => (
								<option
									key={supplier.id}
									value={supplier.id}
								>
									{supplier.name}
								</option>
							))}
						</select>
						<button
							className="w-full p-2 bg-green-700 text-white rounded-lg"
							onClick={handleAddOrEditProduct}
						>
							Save
						</button>
					</div>
				</div>
			)}
			{/* Delete Product Modal */}
			{isDeleteProductModalOpen && (
				<div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
					<div className="bg-white rounded-lg p-6 w-[30%]">
						<div className="flex w-full justify-between">
							<h2 className="text-xl">{'Delete Warehouse'}</h2>
							<span
								className="text-xl hover:scale-125 font-bold cursor-pointer items-center"
								onClick={() => {
									setIsDeleteProductModalOpen(false)
									setProductData({
										id: '',
										name: '',
										sku: '',
										quantity: '',
										supplier_id: '',
									})
								}}
							>
								X
							</span>
						</div>
						<p className="py-5">{`Are you sure you want to delete ${productData.name}?`}</p>

						<div className="flex gap-3">
							<button
								className="w-full p-2 bg-red-700 text-white rounded-lg"
								onClick={handleDeleteProduct}
							>
								Yes
							</button>
							<button
								className="w-full p-2 bg-gray-400 text-black rounded-lg"
								onClick={() => {
									setIsDeleteProductModalOpen(false)
									setProductData({
										id: '',
										name: '',
										sku: '',
										quantity: '',
										supplier_id: '',
									})
								}}
							>
								No
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Products
