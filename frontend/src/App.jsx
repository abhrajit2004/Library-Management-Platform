import './App.css'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useEffect, useState } from 'react'

function App() {


  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Navbar /><Home /></>
    },
    {
      path: "/dashboard",
      element: <><Navbar /><Dashboard /></>
    },
    {
      path: "/login",
      element: <><Navbar /><Login /></>
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
