import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import StockTransfer from './StockTransfer'
import { useNavigate } from 'react-router-dom'

const Warehouses = () => {
	const baseURL = import.meta.env.VITE_API_URL
	const navigate = useNavigate()
	const [products, setProducts] = useState([])
	const [warehouses, setWarehouses] = useState([])

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isDeleteWarehouseModalOpen, setIsDeleteWarehouseModalOpen] =
		useState(false)
	const [isStockTransferModalOpen, setIsStockTransferModalOpen] =
		useState(false)
	const [warehouseData, setWarehouseData] = useState({
		name: '',
		location: '',
	})
	const [transferDetails, setTransferDetails] = useState({
		product: '',
		fromWarehouse: '',
		toWarehouse: '',
		quantity: 0,
	})

	const fetchWarehouses = useCallback(async () => {
		const token = localStorage.getItem('token')
		const response = await axios.get(`${baseURL}warehouse`, {
			headers: {
				Authorization: `Bearer ${token}`,
				'ngrok-skip-browser-warning': true,
			},
		})
		setWarehouses(response.data)
	}, [])

	const handleAddOrEditWarehouse = useCallback(async () => {
		const token = localStorage.getItem('token')
		if (warehouseData.id) {
			await axios.put(
				`${baseURL}warehouse/${warehouseData.id}`,
				warehouseData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'ngrok-skip-browser-warning': true,
					},
				}
			)
		} else {
			await axios.post(`${baseURL}warehouse`, warehouseData, {
				headers: {
					Authorization: `Bearer ${token}`,
					'ngrok-skip-browser-warning': true,
				},
			})
		}
		setIsModalOpen(false)
		setWarehouseData({ id: '', name: '', location: '' })
		fetchWarehouses()
	}, [warehouseData])

	const handleDeleteWarehouse = useCallback(async () => {
		const token = localStorage.getItem('token')
		await axios.delete(`${baseURL}warehouse/${warehouseData.id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
				'ngrok-skip-browser-warning': true,
			},
		})
		setIsDeleteWarehouseModalOpen(false)
		setWarehouseData({ id: '', name: '', location: '' })
		fetchWarehouses()
	}, [warehouseData])

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
		if (isStockTransferModalOpen) {
			fetchProductsForDropdown()
		} else {
			setProducts([])
		}
	}, [isStockTransferModalOpen])

	return (
		<div className="p-6">
			<div className="flex w-full justify-between items-center py-3">
				<h1 className="text-2xl">Warehouses</h1>
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
				Add Warehouse
			</button>
			<button
				className="mb-4 p-2 ml-2 bg-blue-600 text-white rounded-lg"
				onClick={() => setIsStockTransferModalOpen(true)}
			>
				Transfer Stock
			</button>
			<table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
				<thead className="bg-blue-200">
					<tr>
						<th className="py-2">Name</th>
						<th className="py-2">Location</th>
						<th className="py-2">Action</th>
					</tr>
				</thead>
				<tbody>
					{warehouses?.length > 0 &&
						warehouses.map((warehouse) => (
							<tr
								key={warehouse.id}
								className="bg-gray-200"
							>
								<td className="py-2 text-center">
									{warehouse.name}
								</td>
								<td className="py-2 text-center">
									{warehouse.location}
								</td>

								<td className="flex py-2 justify-center underline text-blue-600 gap-3">
									<span
										className="hover:scale-110 cursor-pointer"
										onClick={() =>
											navigate(
												`/warehouses/${warehouse.id}/inventory`
											)
										}
									>
										View
									</span>
									<span
										className="hover:scale-110 cursor-pointer"
										onClick={() => {
											setWarehouseData({
												id: warehouse.id,
												name: warehouse.name,
												location: warehouse.location,
											})
											setIsModalOpen(true)
										}}
									>
										Edit
									</span>
									<span
										className="hover:scale-110 cursor-pointer"
										onClick={() => {
											setWarehouseData({
												id: warehouse.id,
												name: warehouse.name,
												location: warehouse.location,
											})
											setIsDeleteWarehouseModalOpen(true)
										}}
									>
										Delete
									</span>
								</td>
							</tr>
						))}
					{warehouses?.length === 0 && (
						<tr className="bg-gray-200 border-b border-gray-300">
							<td
								colSpan={'3'}
								className="py-2 text-center"
							>
								{'No Warehouses Found!'}
							</td>
						</tr>
					)}
				</tbody>
			</table>

			{/* Add/Edit Warehouse Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
					<div className="bg-white rounded-lg p-6">
						<div className="flex w-full justify-between">
							<h2 className="text-xl mb-4">{`${
								!warehouseData?.id ? 'Add' : 'Edit'
							} Warehouse`}</h2>
							<span
								className="text-xl mb-4 hover:scale-125 font-bold cursor-pointer items-center"
								onClick={() => {
									setIsModalOpen(false)
									setWarehouseData({
										name: '',
										location: '',
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
							value={warehouseData.name}
							onChange={(e) =>
								setWarehouseData({
									...warehouseData,
									name: e.target.value,
								})
							}
						/>
						<input
							type="text"
							className="w-full mb-4 p-2 border rounded-lg"
							placeholder="Location"
							value={warehouseData.location}
							onChange={(e) =>
								setWarehouseData({
									...warehouseData,
									location: e.target.value,
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
			{/* Delete Supplier Modal */}
			{isDeleteWarehouseModalOpen && (
				<div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
					<div className="bg-white rounded-lg p-6 w-[30%]">
						<div className="flex w-full justify-between">
							<h2 className="text-xl">{'Delete Warehouse'}</h2>
							<span
								className="text-xl hover:scale-125 font-bold cursor-pointer items-center"
								onClick={() => {
									setIsDeleteWarehouseModalOpen(false)
									setWarehouseData({
										id: '',
										name: '',
										location: '',
									})
								}}
							>
								X
							</span>
						</div>
						<p className="py-5">{`Are you sure you want to delete ${warehouseData.name}?`}</p>

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
									setIsDeleteWarehouseModalOpen(false)
									setWarehouseData({
										id: '',
										name: '',
										location: '',
									})
								}}
							>
								No
							</button>
						</div>
					</div>
				</div>
			)}
			{/* Stock Transfer Modal */}
			{isStockTransferModalOpen && (
				<StockTransfer
					setIsStockTransferModalOpen={setIsStockTransferModalOpen}
					products={products}
					warehouses={warehouses}
				/>
			)}
		</div>
	)
}

export default Warehouses
