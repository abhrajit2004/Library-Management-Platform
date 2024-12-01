import './App.css'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useEffect, useState } from 'react'

function App() {

  const [isloggedin, setIsloggedin] = useState(false);

  useEffect(()=>{
    const token = localStorage.getItem('auth-token');
    if(token){
      setIsloggedin(true);
    }
    else{
      setIsloggedin(false);
    }
  })

  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Navbar isloggedin={isloggedin} /><Home /></>
    },
    {
      path: "/dashboard",
      element: <><Navbar  isloggedin={isloggedin} /><Dashboard /></>
    },
    {
      path: "/login",
      element: <><Navbar /><Login isloggedin={isloggedin} /></>
    }
  ]
  )

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
