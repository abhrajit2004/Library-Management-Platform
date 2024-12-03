import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'


const Home = () => {

  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [role, setRole] = useState('')

  const fetchUser = () => {
    const myHeaders = new Headers();

    myHeaders.append("auth-token", localStorage.getItem('auth-token'));
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "email": localStorage.getItem('email'),
      "role": localStorage.getItem('role')  
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/getuser`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setName(result.user.name)
        setRole(result.user.role)
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    if (!token) {
      navigate('/login')
    }

    fetchUser()
  }, [])

  return (
    <main className='bg-slate-300 min-h-screen md:min-h-[91vh]'>
      <section className='flex justify-center items-center gap-10 flex-col md:p-36'>
        <h1 className='md:text-5xl text-4xl font-medium md:mx-10 mt-32 md:mt-0 text-center'>Welcome {name} on BitLib : A Library Management Platform</h1>
        <p className='md:w-[40vw] mx-10 md:mx-0 text-center font-medium text-xl md:text-md'>As a user, you can borrow or return books and as an admin, you can add, update or delete books with a proper borrowing history system.</p>
        <div className='buttons flex justify-center items-center gap-4'>
          <Link to={"/dashboard"}><button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-lg px-5 py-2.5 text-center me-2 mb-2 font-medium">Start Here</button></Link>
          <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-lg px-5 py-2.5 text-center me-2 mb-2 font-medium">Know more</button>
        </div>
      </section>
    </main>
  )
}

export default Home
