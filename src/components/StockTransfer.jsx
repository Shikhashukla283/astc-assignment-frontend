import axios from 'axios'
import React, { useState } from 'react'

const StockTransfer = ({
	setIsStockTransferModalOpen,
	products,
	warehouses,
}) => {
	const baseURL = import.meta.env.VITE_API_URL
	const [transferDetails, setTransferDetails] = useState({
		product_id: '',
		from_warehouse_id: '',
		to_warehouse_id: '',
		quantity: '',
	})

	const handleStockTransfer = async () => {
		const token = localStorage.getItem('token')
		await axios.post(`${baseURL}transfer-stock`, transferDetails, {
			headers: {
				Authorization: `Bearer ${token}`,
				'ngrok-skip-browser-warning': true,
			},
		})
		setIsStockTransferModalOpen(false)
	}

	return (
		<div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
			<div className="bg-white rounded-lg p-6 w-[30%]">
				<div className="flex w-full justify-between">
					<h2 className="text-xl mb-4">Transfer Stocks</h2>
					<span
						className="text-xl mb-4 hover:scale-125 font-bold cursor-pointer items-center"
						onClick={() => {
							setIsStockTransferModalOpen(false)
							setTransferDetails({
								product_id: '',
								from_warehouse_id: '',
								to_warehouse_id: '',
								quantity: '',
							})
						}}
					>
						X
					</span>
				</div>
				<select
					id="products-dropdown"
					value={transferDetails.product_id}
					onChange={(e) =>
						setTransferDetails({
							...transferDetails,
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
				<select
					id="from-warehouse-dropdown"
					value={transferDetails.from_warehouse_id}
					onChange={(e) =>
						setTransferDetails({
							...transferDetails,
							from_warehouse_id: e.target.value,
						})
					}
					className="w-full mb-4 p-[0.6rem] bg-white border rounded-lg"
				>
					<option
						value=""
						disabled
					>
						Select From Warehouse
					</option>
					{warehouses.map((warehouse) => (
						<option
							key={warehouse.id}
							value={warehouse.id}
						>
							{warehouse.name}
						</option>
					))}
				</select>
				<select
					id="from-warehouse-dropdown"
					value={transferDetails.to_warehouse_id}
					onChange={(e) =>
						setTransferDetails({
							...transferDetails,
							to_warehouse_id: e.target.value,
						})
					}
					className="w-full mb-4 p-[0.6rem] bg-white border rounded-lg"
				>
					<option
						value=""
						disabled
					>
						Select To Warehouse
					</option>
					{warehouses.map((warehouse) => (
						<option
							key={warehouse.id}
							value={warehouse.id}
						>
							{warehouse.name}
						</option>
					))}
				</select>
				<input
					type="text"
					className="w-full mb-4 p-2 border rounded-lg"
					placeholder="Quantity"
					value={transferDetails.quantity}
					onChange={(e) =>
						setTransferDetails({
							...transferDetails,
							quantity: e.target.value,
						})
					}
				/>
				<button
					className="w-full p-2 bg-green-700 text-white rounded-lg"
					onClick={handleStockTransfer}
				>
					Save
				</button>
			</div>
		</div>
	)
}

export default StockTransfer
