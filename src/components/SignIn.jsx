import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const SignIn = () => {
	const baseURL = import.meta.env.VITE_API_URL
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const navigate = useNavigate()

	const handleSignIn = async () => {
		try {
			const response = await axios.post(`${baseURL}login`, {
				email,
				password,
			})
			localStorage.setItem('token', response.data.token)
			navigate('/products')
		} catch (error) {
			console.error('Error signing in', error)
		}
	}

	return (
		<div className="flex w-full justify-center items-center h-screen bg-gray-100">
			<div className="flex flex-col rounded-lg p-6 max-w-sm bg-white shadow-lg">
				<h2 className="text-2xl font-bold mb-4">Sign In</h2>
				<input
					type="email"
					className="w-full mb-4 p-2 border rounded-lg"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="password"
					className="w-full mb-4 p-2 border rounded-lg"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button
					className="w-full p-2 bg-blue-600 text-white rounded-lg"
					onClick={handleSignIn}
				>
					Sign In
				</button>
			</div>
		</div>
	)
}

export default SignIn
