import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './components/Home'
import About from './components/About'
import Signin from './components/Signin'
import SignUp from './components/SignUp'
import Profile from './components/Profile'
import Navbar from './components/Navbar'
import { useSelector } from "react-redux"
const App = () => {
  const { currentUser } = useSelector((state) => state.user)
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
           {currentUser ? <Route exact path='/' element={<Home />} /> : <Route exact path='/' element={<Signin />} />}
          <Route exact path='/about' element={<About />} />
          <Route exact path='/sign-in' element={<Signin />} />
          <Route exact path='/sign-up' element={<SignUp />} />
          <Route exact path='/profile' element={<Profile />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App