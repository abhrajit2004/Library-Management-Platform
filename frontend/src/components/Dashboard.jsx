import React, { useState, useRef } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from './Modal'

const Dashboard = () => {

  const navigate = useNavigate()

  const ref = useRef();

  const [bookname, setBookname] = useState('')
  const [bookauthor, setBookAuthor] = useState('')
  const [bookgenre, setBookgenre] = useState('')
  const [bookprice, setBookprice] = useState('')
  const [bookimage, setBookimage] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const [booksArray, setBooksArray] = useState([])

  const fetchBooks = () => {

    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch("http://localhost:3000/api/v1/books/getbooks", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setBooksArray(result.books)
      })
      .catch((error) => console.error(error));
  }

  const handleAddBook = (e) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "bookname": bookname,
      "bookauthor": bookauthor,
      "bookprice": bookprice,
      "bookgenre": bookgenre,
      "bookimage" : bookimage,
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

        // ref.current.innerHTML = '<span class="loader"></span>';

        // setTimeout(() => {
        //   ref.current.innerHTML = '+ Add';
        // }, 1000);

        setBookname('');
        setBookAuthor('');
        setBookgenre('');
        setBookimage('');
        setBookprice('');

        fetchBooks();

        setTimeout(() => {
          if (result.success) {
            alert(result.message);
          }
          else {
            alert(result.message);
          }
        }, 2000);
      })
      .catch((error) => console.error(error));
  }

  const handleDeleteBook = (id) => {

    const answer = confirm('Are you sure you want to delete this book?');

    if (answer) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow"
      };

      fetch(`http://localhost:3000/api/v1/books/deletebook/${id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result.message)
          fetchBooks()
        })
        .catch((error) => console.error(error));
    }

  }

  const handleUpdateBook = (e, id) => {
    e.preventDefault();
    const myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "bookname": selectedBook.bookname,
      "bookauthor": selectedBook.bookauthor,
      "bookprice": selectedBook.bookprice,
      "bookgenre": selectedBook.bookgenre,
      "bookimage": selectedBook.bookimage
    });

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`http://localhost:3000/api/v1/books/updatebook/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setIsModalOpen(false);
        fetchBooks();
      })
      .catch((error) => console.error(error));
  }

  const handleInputChange = (e, field) => {

    setSelectedBook((prevBook) => ({
      ...prevBook,
      [field]: e.target.value,
    }));
  };


  useEffect(() => {
    fetchBooks()
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
            <input onChange={(e) => setBookimage(e.target.value)} value={bookimage} className='px-4 py-2 w-[30vw] rounded-md' id='bookimage' name='bookimage' type="text" placeholder='Book Image' required />
            <input onChange={(e) => setBookprice(e.target.value)} value={bookprice} className='px-4 py-2 w-[30vw] rounded-md' id='price' name='price' type="number" placeholder='Price' required />



            <button ref={ref} type="submit" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-md px-5 py-2.5 text-center me-2 mb-2">+ Add</button>

          </form>

          {booksArray.length === 0 && <p className='text-center font-medium text-lg'>No books available</p>}

          {booksArray.length > 0 &&
            <table className='table-auto w-[80%] rounded-md overflow-hidden mb-36'>
              <thead className='bg-slate-800 text-white'>
                <tr>
                  <th className='py-2'>Book Name</th>
                  <th className='py-2'>Author</th>
                  <th className='py-2'>Genre</th>
                  <th className='py-2'>Price</th>
                  <th className='py-2'>Actions</th>
                </tr>
              </thead>
              <tbody className='bg-slate-200'>
                {booksArray.length != 0 && booksArray.map((book, index) => {
                  return <tr key={index}>
                    <td className='py-2 text-center border border-black'>
                      {book.bookname}
                    </td>
                    <td className='py-2 text-center border border-black'>
                      {book.bookauthor}
                    </td>
                    <td className='py-2 text-center border border-black'>
                      {book.bookgenre}
                    </td>
                    <td className='py-2 text-center border border-black'>
                      {book.bookprice}
                    </td>
                    <td className='py-2 text-center border border-black'>
                      <span onClick={() => {
                        setSelectedBook(book);
                        setIsModalOpen(true);
                      }} className='cursor-pointer mx-1'>
                        <lord-icon style={{ "width": "25px", "height": "25px" }} src="https://cdn.lordicon.com/gwlusjdu.json" trigger="hover">
                        </lord-icon>
                      </span>
                      <Modal isOpen={isModalOpen} onClose={() => {
                        setIsModalOpen(false);
                        setSelectedBook(null);
                      }}>
                        <h1 className='text-4xl'>Edit Details</h1>
                        <form onSubmit={(e) => handleUpdateBook(e, selectedBook?._id)} className='flex flex-col justify-center items-center gap-4 mt-8'>
                          <input onChange={(e) => handleInputChange(e, 'bookname')} value={selectedBook?.bookname || ''} className='px-4 py-2 rounded-md border border-black w-full' id='bookname' name='bookname' type="text" placeholder='Book Name' required />
                          <input onChange={(e) => handleInputChange(e, 'bookauthor')} value={selectedBook?.bookauthor || ''} className='px-4 py-2 border border-black rounded-md w-full' id='bookauthor' name='bookauthor' type="text" placeholder='Author Name' required />
                          <input onChange={(e) => handleInputChange(e, 'bookgenre')} value={selectedBook?.bookgenre || ''} className='px-4 py-2 border border-black rounded-md w-full' id='genre' name='genre' type="text" placeholder='Genre' required />
                          <input onChange={(e) => handleInputChange(e, 'bookimage')} value={selectedBook?.bookimage || ''} className='px-4 py-2 border border-black rounded-md w-full' id='bookimage' name='bookimage' type="text" placeholder='Book Image Link' required />
                          <input onChange={(e) => handleInputChange(e, 'bookprice')} value={selectedBook?.bookprice || ''} className='px-4 py-2 border border-black rounded-md w-full' id='price' name='price' type="number" placeholder='Price' required />

                          <button type="submit" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-md px-5 py-2.5 text-center me-2 mb-2">Update</button>
                        </form>
                      </Modal>
                      <span onClick={() => handleDeleteBook(book._id)} className='cursor-pointer mx-1'>
                        <lord-icon src="https://cdn.lordicon.com/skkahier.json"
                          trigger="hover"
                          style={{ "width": "25px", "height": "25px" }}>
                        </lord-icon>
                      </span>
                    </td>
                  </tr>
                })
                }

              </tbody>
            </table>
          }

        </section>
        :
        <section className='flex flex-col gap-4 justify-center items-center'>
          <h1 className='text-5xl font-medium mt-5 text-center'>Dashboard</h1>
          <p className='text-center font-medium text-lg'>Welcome to the dashboard. Here you can manage your books, borrow books and return books.</p>

          <div className="cards flex justify-center items-center flex-wrap mx-4 gap-6 my-7">
            {booksArray.length > 0 && booksArray.map((book, index) => {
              return   <div className="card flex items-center justify-center" key={index}>
              <div className="max-w-sm w-full bg-white shadow-lg rounded-lg overflow-hidden">
                <img
                  src={book.bookimage}
                  alt="Card Image"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800">{book.bookname}</h2>
                  <p className="text-gray-600 mt-2">
                   {book.bookauthor}
                  </p>
                  <div className="mt-4">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                      Borrow
                    </button>
                  </div>
                </div>
              </div>
            </div>
            })
            }
          
           
          </div>
        </section>
      }
    </div>
  )
}

export default Dashboard
