import React, { useState, useRef } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {

  const navigate = useNavigate()

  const ref = useRef();

  const [bookname, setBookname] = useState('')
  const [bookauthor, setBookAuthor] = useState('')
  const [bookgenre, setBookgenre] = useState('')
  const [bookprice, setBookprice] = useState('')

  const handleAddBook = (e) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "bookname": bookname,
      "bookauthor": bookauthor,
      "bookprice": bookprice,
      "bookgenre": bookgenre,
      "role": localStorage.getItem('role')
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://localhost:3000/api/v1/books/addbook", requestOptions)
      .then((response) => response.json())
      .then((result) => {

        ref.current.innerHTML = '<span class="loader"></span>';

        setTimeout(() => {
          if (result.success) {
            alert(result.message);
          }
          else {
            alert(result.message);
          }
        }, 2000);

        setTimeout(() => {
          ref.current.innerHTML = '+ Add';
        }, 1000);

        setBookname('');
        setBookAuthor('');
        setBookgenre('');
        setBookprice('');
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    if (token) {
      navigate('/dashboard')
    }
    else {
      navigate('/login')
    }
  }, [])

  return (
    <div className='min-h-[91vh] bg-slate-300 text-lg font-medium'>
      {localStorage.getItem('role') === 'admin' ?
        <section className='flex flex-col gap-4 justify-center items-center'>
          <h1 className='text-5xl font-medium mt-5 text-center'>Dashboard</h1>
          <p className='text-center font-medium text-lg'>Welcome to the dashboard. Here you can add, update, delete books and manage users.</p>
          <form onSubmit={handleAddBook} className='flex flex-col justify-center items-center gap-4'>
            <input onChange={(e) => setBookname(e.target.value)} value={bookname} className='px-4 py-2 w-[30vw] rounded-md' id='bookname' name='bookname' type="text" placeholder='Book Name' required />
            <input onChange={(e) => setBookAuthor(e.target.value)} value={bookauthor} className='px-4 py-2 w-[30vw] rounded-md' id='bookauthor' name='bookauthor' type="text" placeholder='Author Name' required />
            <input onChange={(e) => setBookgenre(e.target.value)} value={bookgenre} className='px-4 py-2 w-[30vw] rounded-md' id='genre' name='genre' type="text" placeholder='Genre' required />
            <input onChange={(e) => setBookprice(e.target.value)} value={bookprice} className='px-4 py-2 w-[30vw] rounded-md' id='price' name='price' type="number" placeholder='Price' required />



            <button ref={ref} type="submit" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-md px-5 py-2.5 text-center me-2 mb-2">+ Add</button>

          </form>

          {/* <table className='flex justify-center items-center flex-col border border-black w-[80%]'>
              <th className='flex gap-48 justify-center items-center border border-black w-full'>
                <td>Book Name</td>
                <td>Author</td>
                <td>Genre</td>
              <td>Price</td>
              <td>Actions</td>
              </th>
            <tbody>
              <tr className='flex justify-between items-center border border-black w-full'>
                <td>Harry potter</td>
                <td>J.k rowling</td>
                <td>Mystery</td>
                <td>200</td>
                <td>Actions</td>
              </tr>
            </tbody>

          </table> */}

        </section>
        :
        <section className='flex flex-col gap-4 justify-center items-center'>
          <h1 className='text-5xl font-medium mt-5 text-center'>Dashboard</h1>
          <p className='text-center font-medium text-lg'>Welcome to the dashboard. Here you can manage your books, borrow books and return books.</p>
        </section>
      }
    </div>
  )
}

export default Dashboard
