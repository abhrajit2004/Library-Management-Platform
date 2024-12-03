import React, { useState, useRef } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from './Modal'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function downloadFile(fileName, fileContent) {
  const blob = new Blob([fileContent], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();

  window.URL.revokeObjectURL(url); // Free up memory
}

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

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/books/getbooks`, requestOptions)
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
      "bookimage": bookimage,
      "role": localStorage.getItem('role')
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/books/addbook`, requestOptions)
      .then((response) => response.json())
      .then((result) => {

        setBookname('');
        setBookAuthor('');
        setBookgenre('');
        setBookimage('');
        setBookprice('');

        
        setTimeout(() => {
          if (result.success) {
            toast.success(result.message);
            fetchBooks();
          }
          else {
            toast.error(result.message);
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

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/books/deletebook/${id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          toast.success(result.message);
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

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/books/updatebook/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setIsModalOpen(false);
        toast.success(result.message);
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

  const borrowBook = (id) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "issuedTo": localStorage.getItem('email')
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/issues/issuebook/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          downloadFile('bitlib_receipt.txt', `${result.newIssue.status + ' id ' + result.newIssue._id + '\n' + 'bookId ' + result.newIssue.bookId + '\n' + result.newIssue.bookname + '\n' + result.newIssue.bookauthor + '\n' + result.newIssue.status + ' by ' + localStorage.getItem('email') + '\n' + result.newIssue.status + ' on ' + result.newIssue.issuedDate.split('T')[0]}`);
          toast.success(result.message)
        }
        else {
          toast.error(result.message)
        }
      })
      .catch((error) => console.error(error));
  }

  const returnBook = (id) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "issuedTo": localStorage.getItem('email'),
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/issues/returnbook/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          downloadFile('bitlib_receipt.txt', `${result.newIssue.status + ' id ' + result.newIssue._id + '\n' + 'bookId ' + result.newIssue.bookId + '\n' + result.newIssue.bookname + '\n' + result.newIssue.bookauthor + '\n' + result.newIssue.status + ' by ' + localStorage.getItem('email') + '\n' + result.newIssue.status + ' on ' + result.newIssue.issuedDate.split('T')[0]}`);
          toast.success(result.message)
        }
        else {
          toast.error(result.message)
        }
      })
      .catch((error) => console.error(error));
  }

  const handleClick = () => {
    window.location.reload();
  }

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
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className='md:min-h-[91vh] min-h-screen bg-slate-300 text-lg font-medium'>
        {localStorage.getItem('role') === 'admin' ?
          <section className='flex flex-col gap-4 justify-center items-center'>
            <h1 className='text-5xl font-medium mt-5 text-center'>Dashboard</h1>
            <p className='text-center font-medium text-lg'>Welcome to the dashboard. Here you can add, update, delete books and manage users.</p>
            <form onSubmit={handleAddBook} className='flex flex-col justify-center items-center gap-4'>
              <input onChange={(e) => setBookname(e.target.value)} value={bookname} className='px-4 py-2 w-[80vw] md:w-[30vw] rounded-md' id='bookname' name='bookname' type="text" placeholder='Book Name' required />
              <input onChange={(e) => setBookAuthor(e.target.value)} value={bookauthor} className='px-4 py-2 w-[80vw] md:w-[30vw] rounded-md' id='bookauthor' name='bookauthor' type="text" placeholder='Author Name' required />
              <input onChange={(e) => setBookgenre(e.target.value)} value={bookgenre} className='px-4 py-2 w-[80vw] md:w-[30vw] rounded-md' id='genre' name='genre' type="text" placeholder='Genre' required />
              <input onChange={(e) => setBookimage(e.target.value)} value={bookimage} className='px-4 py-2 w-[80vw] md:w-[30vw] rounded-md' id='bookimage' name='bookimage' type="text" placeholder='Book Image' required />
              <input onChange={(e) => setBookprice(e.target.value)} value={bookprice} className='px-4 py-2 w-[80vw] md:w-[30vw] rounded-md' id='price' name='price' type="number" placeholder='Price' required />



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
            <button onClick={() => handleClick()} className='text-white bg-blue-700 px-4 py-2 rounded-lg font-medium text-lg absolute md:top-24 top-4 right-2 md:right-6'>Refresh Page</button>

            <p className='text-center font-medium text-lg mx-4 md:mx-0'>Welcome to the dashboard. Here you can manage your books, borrow books and return books.</p>
            <div className="cards flex justify-center items-center flex-wrap mx-4 gap-6 my-7">
              {booksArray.length === 0 && <p className='text-center font-medium text-lg'>No books available</p>}
              {booksArray.length > 0 && booksArray.map((book, index) => {
                return <div className="card flex justify-center items-center" key={index}>
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
                      <div className="mt-4 flex gap-4">
                        <button onClick={() => { borrowBook(book._id); }} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                          Borrow
                        </button>
                        <button onClick={() => returnBook(book._id)} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                          Return
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
    </>
  )
}

export default Dashboard