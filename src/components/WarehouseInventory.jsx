import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const WarehouseInventory = () => {
	const baseURL = import.meta.env.VITE_API_URL
	const { warehouseID } = useParams()
	const navigate = useNavigate()
	const [warehouseName, setWarehouseName] = useState('')
	const [warehouseProducts, setWarehouseProducts] = useState([])
	const [products, setProducts] = useState([])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [
		isDeleteWarehouseProductModalOpen,
		setIsDeleteWarehouseProductModalOpen,
	] = useState(false)
	const [warehouseProductData, setWarehouseProductData] = useState({
		product_id: '',
		warehouse_id: warehouseID,
		quantity: '',
	})

	const fetchWarehouses = useCallback(async () => {
		const token = localStorage.getItem('token')
		const response = await axios.get(`${baseURL}warehouse/${warehouseID}`, {
			headers: {
				Authorization: `Bearer ${token}`,
				'ngrok-skip-browser-warning': true,
			},
		})
		setWarehouseName(response.data.name)
		setWarehouseProducts(response.data.products_detail)
	}, [])

	const handleAddOrEditWarehouse = useCallback(async () => {
		const token = localStorage.getItem('token')
		if (warehouseProductData.id) {
			await axios.put(
				`${baseURL}product-warehouse/${warehouseProductData.product_id}/${warehouseID}`,
				warehouseProductData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'ngrok-skip-browser-warning': true,
					},
				}
			)
		} else {
			await axios.post(
				`${baseURL}product-warehouse`,
				warehouseProductData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'ngrok-skip-browser-warning': true,
					},
				}
			)
		}
		setIsModalOpen(false)
		setWarehouseProductData({
			id: '',
			product_id: '',
			warehouse_id: warehouseID,
			quantity: '',
		})
		fetchWarehouses()
	}, [warehouseProductData])

	const handleDeleteWarehouse = useCallback(async () => {
		const token = localStorage.getItem('token')
		await axios.delete(
			`${baseURL}product-warehouse/${warehouseProductData.product_id}/${warehouseID}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					'ngrok-skip-browser-warning': true,
				},
			}
		)
		setIsDeleteWarehouseProductModalOpen(false)
		setWarehouseProductData({
			id: '',
			product_id: '',
			warehouse_id: warehouseID,
			quantity: '',
		})
		fetchWarehouses()
	}, [warehouseProductData])

	useEffect(() => {
		fetchWarehouses()
	}, [])

	useEffect(() => {
		const fetchProductsForDropdown = async () => {
			const token = localStorage.getItem('token')
			const productsResponse = await axios.get(`${baseURL}products`, {
				headers: {
					Authorization: `Bearer ${token}`,
					'ngrok-skip-browser-warning': true,
				},
			})
			setProducts(productsResponse.data)
		}
		if (isModalOpen) {
			fetchProductsForDropdown()
		} else {
			setProducts([])
		}
	}, [isModalOpen])

	return (
		<div className="p-6">
			<div className="flex w-full justify-between items-center py-3">
				<h1 className="text-2xl">Warehouse Products</h1>
				<div className="flex gap-6">
					<span
						className="text-xl underline hover:scale-110 text-blue-600 cursor-pointer"
						onClick={() => navigate('/products')}
					>
						Products
					</span>
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
						<th className="py-2">Product Name</th>
						<th className="py-2">Product SKU</th>
						<th className="py-2">Quantity</th>
						<th className="py-2">Action</th>
					</tr>
				</thead>
				<tbody>
					{warehouseProducts?.length > 0 &&
						warehouseProducts.map((warehouseProduct) => (
							<tr
								key={warehouseProduct.id}
								className="bg-gray-200"
							>
								<td className="py-2 text-center">
									{warehouseProduct.name}
								</td>
								<td className="py-2 text-center">
									{warehouseProduct.sku}
								</td>
								<td className="py-2 text-center">
									{warehouseProduct.pivot.quantity}
								</td>

								<td className="flex py-2 justify-center underline text-blue-600 gap-3">
									<span
										className="hover:scale-110 cursor-pointer"
										onClick={() => {
											setWarehouseProductData({
												id: warehouseProduct.id,
												product_id:
													warehouseProduct.pivot
														.product_id,
												warehouse_id: warehouseID,
												quantity:
													warehouseProduct.pivot
														.quantity,
											})
											setIsModalOpen(true)
										}}
									>
										Edit
									</span>
									<span
										className="hover:scale-110 cursor-pointer"
										onClick={() => {
											setWarehouseProductData({
												id: warehouseProduct.id,
												product_id:
													warehouseProduct.pivot
														.product_id,
												product_name:
													warehouseProduct.name,
												warehouse_id: warehouseID,
												quantity:
													warehouseProduct.pivot
														.quantity,
											})
											setIsDeleteWarehouseProductModalOpen(
												true
											)
										}}
									>
										Delete
									</span>
								</td>
							</tr>
						))}
					{warehouseProducts?.length === 0 && (
						<tr className="bg-gray-200 border-b border-gray-300">
							<td
								colSpan={'4'}
								className="py-2 text-center"
							>
								{'Inventory is Empty!'}
							</td>
						</tr>
					)}
				</tbody>
			</table>

			{/* Add/Edit Warehouse Product Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
					<div className="bg-white rounded-lg p-6">
						<div className="flex w-full justify-between">
							<h2 className="text-xl mb-4">{`${
								!warehouseProductData?.id ? 'Add' : 'Edit'
							} Warehouse`}</h2>
							<span
								className="text-xl mb-4 hover:scale-125 font-bold cursor-pointer items-center"
								onClick={() => {
									setIsModalOpen(false)
									setWarehouseProductData({
										id: '',
										product_id: '',
										warehouse_id: warehouseID,
										quantity: '',
									})
								}}
							>
								X
							</span>
						</div>

						<select
							id="warehpuse-product-dropdown"
							disabled={warehouseProductData.id}
							value={warehouseProductData.product_id}
							onChange={(e) =>
								setWarehouseProductData({
									...warehouseProductData,
									product_id: e.target.value,
								})
							}
							className="w-full mb-4 p-[0.6rem] bg-white border rounded-lg"
						>
							<option
								value=""
								disabled
							>
								Select A Product
							</option>
							{products.map((product) => (
								<option
									key={product.id}
									value={product.id}
								>
									{product.name}
								</option>
							))}
						</select>
						<input
							type="text"
							disabled
							className="w-full mb-4 p-2 border rounded-lg"
							placeholder="Warehouse"
							value={warehouseName}
						/>
						<input
							type="text"
							className="w-full mb-4 p-2 border rounded-lg"
							placeholder="Quantity"
							value={warehouseProductData.quantity}
							onChange={(e) =>
								setWarehouseProductData({
									...warehouseProductData,
									quantity: e.target.value,
								})
							}
						/>
						<button
							className="w-full p-2 bg-green-700 text-white rounded-lg"
							onClick={handleAddOrEditWarehouse}
						>
							Save
						</button>
					</div>
				</div>
			)}
			{/* Delete Product Modal */}
			{isDeleteWarehouseProductModalOpen && (
				<div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
					<div className="bg-white rounded-lg p-6 w-[30%]">
						<div className="flex w-full justify-between">
							<h2 className="text-xl">{'Delete Warehouse'}</h2>
							<span
								className="text-xl hover:scale-125 font-bold cursor-pointer items-center"
								onClick={() => {
									setIsDeleteWarehouseProductModalOpen(false)
									setWarehouseProductData({
										id: '',
										product_id: '',
										product_name: '',
										warehouse_id: warehouseID,
										quantity: '',
									})
								}}
							>
								X
							</span>
						</div>
						<p className="py-5">{`Are you sure you want to delete ${warehouseProductData.product_name}?`}</p>

						<div className="flex gap-3">
							<button
								className="w-full p-2 bg-red-700 text-white rounded-lg"
								onClick={handleDeleteWarehouse}
							>
								Yes
							</button>
							<button
								className="w-full p-2 bg-gray-400 text-black rounded-lg"
								onClick={() => {
									setIsDeleteWarehouseProductModalOpen(false)
									setWarehouseProductData({
										id: '',
										product_id: '',
										product_name: '',
										warehouse_id: warehouseID,
										quantity: '',
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

export default WarehouseInventory
