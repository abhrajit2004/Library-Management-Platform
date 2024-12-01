import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const Login = ({ isloggedin }) => {

    const [role, setRole] = useState('Choose Role');

    const [isLogin, setIsLogin] = useState(true);

    const logref = useRef();
    const signref = useRef();


    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleAccount = () => {
        setIsLogin(!isLogin);
    }

    const handleLogin = () => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "email": email,
            "password": password,
            "role": role
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("http://localhost:3000/api/v1/auth/login", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                logref.current.innerHTML = '<span class="loader"></span>';
                setTimeout(() => {
                    if (result.success) {
                        localStorage.setItem("auth-token", result.authToken);
                        localStorage.setItem("role", result.user.role);
                        localStorage.setItem("email", result.user.email);
                        navigate('/');
                    }
                    else {
                        alert(result.message);
                    }
                }, 2000);
            })
            .catch((error) => console.error(error));
    }

    const handleSignup = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "name": name,
            "email": email,
            "password": password,
            "role": role
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("http://localhost:3000/api/v1/auth/register", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                signref.current.innerHTML = '<span class="loader"></span>';
                setTimeout(() => {
                    if (result.success) {
                        localStorage.setItem("auth-token", result.authToken);
                        localStorage.setItem("role", role);
                        localStorage.setItem("email", email);
                        navigate('/');
                    }
                    else {
                        alert(result.message);
                    }
                }, 2000);
            })
            .catch((error) => console.error(error));
    }

    useEffect(() => {

        const token = localStorage.getItem('auth-token');
        if (token) {
            navigate('/');
        }

    }, [])


    return (
        <div className='bg-slate-200 min-h-[91vh] flex flex-col gap-5 justify-start items-center font-medium text-lg'>
            {!isLogin ? <h1 className='text-5xl font-bold my-10'>Sign Up</h1> : <h1 className='text-5xl font-bold my-10'>Log In</h1>}
            <form className='flex flex-col justify-center items-center gap-4'>
                {!isLogin && <input onChange={(e) => setName(e.target.value)} value={name} className='px-4 py-2 w-[30vw] rounded-md' id='name' name='name' type="text" placeholder='Name' required />}
                <input onChange={(e) => setEmail(e.target.value)} value={email} className='px-4 py-2 w-[30vw] rounded-md' id='email' name='email' type="email" placeholder='Email' required />
                <input onChange={(e) => setPassword(e.target.value)} value={password} className='px-4 py-2 w-[30vw] rounded-md' id='password' name='password' type="password" placeholder='Password' required />

                <select value={role} onChange={(e) => setRole(e.target.value)} id="roles" className=" border border-gray-30 rounded-lg 0 block w-full p-2.5">
                    <option disabled>Choose Role</option>
                    <option value="admin">admin</option>
                    <option value="user">user</option>
                </select>
                <div className="buttons flex flex-col justify-center items-center gap-4">
                    {isLogin ?
                        <button ref={logref} onClick={handleLogin} type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-md px-5 py-2.5 text-center me-2 mb-2">Login</button>
                        :
                        <button ref={signref} onClick={handleSignup} type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-md px-5 py-2.5 text-center me-2 mb-2">Sign Up</button>
                    }

                    {isLogin ?
                        <button onClick={handleAccount} type="button" className="text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-green-800 font-medium rounded-lg text-md px-5 py-2.5 text-center me-2 mb-2">Don't have any account?</button>
                        :
                        <button onClick={handleAccount} type="button" className="text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-green-800 font-medium rounded-lg text-md px-5 py-2.5 text-center me-2 mb-2">Already have any account?</button>
                    }



                </div>


            </form>
        </div>
    )
}

export default Login
