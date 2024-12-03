import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

    const navigate = useNavigate();
    const logoutref = useRef();
    const hamburgerRef = useRef();

    const handleLogOut = () => {
        logoutref.current.innerHTML = '<span class="loader"></span>';
        setTimeout(() => {
            localStorage.removeItem('auth-token');
            localStorage.removeItem('email');
            localStorage.removeItem('role');
            navigate('/login');
        }, 1000);
    }

    const handleHamburger = () => {
        if(hamburgerRef.current.classList.contains('hidden')){
            hamburgerRef.current.classList.remove('hidden');
            hamburgerRef.current.classList.add('flex');
            hamburgerRef.current.classList.add('flex-col');
            hamburgerRef.current.classList.add('justify-center');
            hamburgerRef.current.classList.add('items-center');
        }
        else{
            hamburgerRef.current.classList.add('hidden');
            hamburgerRef.current.classList.remove('flex');
            hamburgerRef.current.classList.remove('flex-col');
            hamburgerRef.current.classList.add('justify-center');
            hamburgerRef.current.classList.add('items-center');
        }
    }

    return (
        <nav className='flex flex-col md:flex-row justify-between items-center py-4 md:py-0'>
            <Link to={"/"}>
            <div className="logo mx-4">
                <h1 className='text-4xl font-bold'>BitLib</h1>
            </div>
            </Link>
            <img onClick={()=>handleHamburger()} src="/hamburger.png" height={30} width={30} className='absolute left-2 top-4 md:hidden'  alt="" />
            <ul ref={hamburgerRef} className='md:flex md:justify-end md:items-center gap-8 mx-4 p-4 md:flex-row hidden'>
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
