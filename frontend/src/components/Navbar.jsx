import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

    const navigate = useNavigate();
    const logoutref = useRef();


    const handleLogOut = () => {
        logoutref.current.innerHTML = '<span class="loader"></span>';
        setTimeout(() => {
            localStorage.removeItem('auth-token');
            localStorage.removeItem('email');
            localStorage.removeItem('role');
            navigate('/login');
        }, 1000);
    }

    return (
        <nav className='flex justify-between items-center'>
            <Link to={"/"}>
            <div className="logo mx-4">
                <h1 className='text-4xl font-bold'>BitLib</h1>
            </div>
            </Link>
            <ul className='flex justify-end items-center gap-8 mx-4 p-4'>
                <Link to={"/"} className='cursor-pointer transition-all text-lg font-medium'>Home</Link>
                <Link to={"/dashboard"} className='cursor-pointer transition-all text-lg font-medium'>Dashboard</Link>
                <Link to={"/"} className='cursor-pointer transition-all text-lg font-medium'>About</Link>
                {localStorage.getItem('role') === 'admin' && <Link to={"/borrowinghistory"} className='cursor-pointer transition-all text-lg font-medium'>Borrowing History</Link>}
                <Link to={"/"} className='cursor-pointer transition-all text-lg font-medium'>Contact</Link>
                <li>
                    { !localStorage.getItem('auth-token') ? <button  type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-lg text-center px-4 py-2">Login / Signup</button> :
                        <button onClick={handleLogOut} ref={logoutref} type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-lg text-center px-4 py-2">Log Out</button>}
                </li>
            </ul>

        </nav>

    )
}

export default Navbar
