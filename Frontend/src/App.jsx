import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Onboarding from './Components/Onboarding/Onboarding'
import Login from './Components/LoginRegister/Login'
import Register from './Components/LoginRegister/Register'
import Home from './Components/Home/Home'
import DetailCoffee from './Components/DetailCoffe/DetailCoffe'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Onboarding />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/home' element={<Home />} />
        <Route path='/menu/:id' element={<DetailCoffee />} />
      </Routes>
    </BrowserRouter>
  )
}
