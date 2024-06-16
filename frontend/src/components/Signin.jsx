import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { signInStart, signInFailure, singInSuccess, changeError } from '../redux/user/userSlice.js'
import { useDispatch, useSelector } from 'react-redux'
import OAuth from "./OAuth.jsx"

const Signin = () => {

  const [formData, setformData] = useState({})
  // const [loading, setloading] = useState(false)
  // const [error, setError] = useState(false)
  const { loading, error } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleChange = (e) => {
    setformData({ ...formData, [e.target.id]: e.target.value })
    dispatch(changeError())

  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // setloading(true);
      // setError(false)
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data)
      // setloading(false)

      if (data.success == false) {
        // setError(true) 
        console.log(data);
        dispatch(signInFailure(data))
        return
      }

      dispatch(singInSuccess(data))
      navigate('/')
    } catch (error) {
      // console.log(error)
      // setloading(false)
      // setError(true)
      console.error(error)
      dispatch(signInFailure(error))
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign in</h1>
      <form onSubmit={handleSubmit}
        className='flex flex-col gap-4'>

        <input
          type='email'
          placeholder='Email'
          id='email'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
          required={true}
        />
        <input
          type='password'
          placeholder='Password'
          id='password'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
          required={true}
        />
        <button disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'loading...' : 'sign in'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont  have  an account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-500'>Sign up</span>
        </Link>
      </div>
      <p className='text-red-500 mt-5'>
        {error ? error.message || 'Something went wrong!' : ''}
      </p>
    </div>
  )
}

export default Signin