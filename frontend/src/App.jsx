import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BuyCredit from './pages/BuyCredit'
import Results from './pages/Results'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <div className='px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-blue-50'>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buy-credit" element={<BuyCredit />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </div>
  )
}

export default App