import React, { useState } from 'react'
import axios from 'axios'

const Signup = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/signup',
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      setMessage(res.data.message)
      setError('')
      console.log(res.data)

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
      setMessage('')
      console.error(err.response?.data)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />

        <button 
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Signup
        </button>

        {/* Success Message */}
        {message && (
          <p className="text-green-600 mt-3 text-sm">{message}</p>
        )}

        {/* Error Message */}
        {error && (
          <p className="text-red-600 mt-3 text-sm">{error}</p>
        )}
      </form>

    </div>
  )
}

export default Signup