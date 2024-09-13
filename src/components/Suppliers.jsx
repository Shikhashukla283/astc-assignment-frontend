import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Suppliers = () => {
	const baseURL = import.meta.env.VITE_API_URL
	const navigate = useNavigate()
	const [suppliers, setSuppliers] = useState([])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isDeleteSupplierModalOpen, setIsDeleteSupplierModalOpen] =
		useState(false)
	const [supplierData, setSupplierData] = useState({
		name: '',
		contact_info: '',
	})

	const fetchSuppliers = useCallback(async () => {
		const token = localStorage.getItem('token')
		const response = await axios.get(`${baseURL}supplier`, {
			headers: {
				Authorization: `Bearer ${token}`,
				'ngrok-skip-browser-warning': true,
			},
		})
		setSuppliers(response.data)
	}, [])

	const handleAddOrEditSupplier = useCallback(async () => {
		const token = localStorage.getItem('token')
		if (supplierData.id) {
			await axios.put(
				`${baseURL}supplier/${supplierData.id}`,
				supplierData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'ngrok-skip-browser-warning': true,
					},
				}
			)
		} else {
			await axios.post(`${baseURL}supplier`, supplierData, {
				headers: {
					Authorization: `Bearer ${token}`,
					'ngrok-skip-browser-warning': true,
				},
			})
		}
		setIsModalOpen(false)
		setSupplierData({ id: '', name: '', contact_info: '' })
		fetchSuppliers()
	}, [supplierData])

	const handleDeleteSupplier = useCallback(async () => {
		const token = localStorage.getItem('token')
		await axios.delete(`${baseURL}supplier/${supplierData.id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
				'ngrok-skip-browser-warning': true,
			},
		})
		setIsDeleteSupplierModalOpen(false)
		setSupplierData({ id: '', name: '', contact_info: '' })
		fetchSuppliers()
	}, [supplierData])

	useEffect(() => {
		fetchSuppliers()
	}, [])

	return (
		<div className="p-6">
			<div className="flex w-full justify-between items-center py-3">
				<h1 className="text-2xl">Suppliers</h1>
				<div className="flex gap-6">
					<span
						className="text-xl underline hover:scale-110 text-blue-600 cursor-pointer"
						onClick={() => navigate('/products')}
					>
						Products
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
				Add Supplier
			</button>
			<table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
				<thead className="bg-blue-200">
					<tr>
						<th className="py-2">Name</th>
						<th className="py-2">Contact</th>
						<th className="py-2">Action</th>
					</tr>
				</thead>
				<tbody>
					{suppliers?.length > 0 &&
						suppliers.map((supplier) => (
							<tr
								key={supplier.id}
								className="bg-gray-200"
							>
								<td className="py-2 text-center">
									{supplier.name}
								</td>
								<td className="py-2 text-center">
									{supplier.contact_info}
								</td>
								<td className="flex py-2 justify-center underline text-blue-600 gap-3">
									<span
										className="hover:scale-110 cursor-pointer"
										onClick={() => {
											setSupplierData({
												id: supplier.id,
												name: supplier.name,
												contact_info:
													supplier.contact_info,
											})
											setIsModalOpen(true)
										}}
									>
										Edit
									</span>
									<span
										className="hover:scale-110 cursor-pointer"
										onClick={() => {
											setSupplierData({
												id: supplier.id,
												name: supplier.name,
												contact_info:
													supplier.contact_info,
											})
											setIsDeleteSupplierModalOpen(true)
										}}
									>
										Delete
									</span>
								</td>
							</tr>
						))}
					{suppliers?.length === 0 && (
						<tr className="bg-gray-200 border-b border-gray-300">
							<td
								colSpan={'3'}
								className="py-2 text-center"
							>
								{'No Suppliers Found!'}
							</td>
						</tr>
					)}
				</tbody>
			</table>

			{/* Add/Edit Supplier Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
					<div className="bg-white rounded-lg p-6">
						<div className="flex w-full justify-between">
							<h2 className="text-xl mb-4">{`${
								!supplierData?.id ? 'Add' : 'Edit'
							} Supplier`}</h2>
							<span
								className="text-xl mb-4 hover:scale-125 font-bold cursor-pointer items-center"
								onClick={() => {
									setIsModalOpen(false)
									setSupplierData({
										name: '',
										contact_info: '',
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
							value={supplierData.name}
							onChange={(e) =>
								setSupplierData({
									...supplierData,
									name: e.target.value,
								})
							}
						/>
						<input
							type="text"
							className="w-full mb-4 p-2 border rounded-lg"
							placeholder="Contact"
							value={supplierData.contact_info}
							onChange={(e) =>
								setSupplierData({
									...supplierData,
									contact_info: e.target.value,
								})
							}
						/>
						<button
							className="w-full p-2 bg-green-700 text-white rounded-lg"
							onClick={handleAddOrEditSupplier}
						>
							Save
						</button>
					</div>
				</div>
			)}
			{/* Delete Supplier Modal */}
			{isDeleteSupplierModalOpen && (
				<div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
					<div className="bg-white rounded-lg p-6 w-[30%]">
						<div className="flex w-full justify-between">
							<h2 className="text-xl">{'Delete Supplier'}</h2>
							<span
								className="text-xl hover:scale-125 font-bold cursor-pointer items-center"
								onClick={() => {
									setIsDeleteSupplierModalOpen(false)
									setSupplierData({
										id: '',
										name: '',
										contact_info: '',
									})
								}}
							>
								X
							</span>
						</div>
						<p className="py-5">{`Are you sure you want to delete ${supplierData.name}?`}</p>

						<div className="flex gap-3">
							<button
								className="w-full p-2 bg-red-700 text-white rounded-lg"
								onClick={handleDeleteSupplier}
							>
								Yes
							</button>
							<button
								className="w-full p-2 bg-gray-400 text-black rounded-lg"
								onClick={() => {
									setIsDeleteSupplierModalOpen(false)
									setSupplierData({
										id: '',
										name: '',
										contact_info: '',
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

export default Suppliers
