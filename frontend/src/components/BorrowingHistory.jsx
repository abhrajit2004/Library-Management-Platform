import React, { useRef } from 'react'
import { useState, useEffect } from 'react';

const BorrowingHistory = () => {

    const [history, setHistory] = useState([]);
    const ref = useRef();

    const getBorrowingHistory = () => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/issues/getissueshistory`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                ref.current.innerHTML = '<span class="loader"></span>';
                setTimeout(() => {
                    setHistory(result.history);
                }, 2000);

                setTimeout(() => {
                    ref.current.innerHTML = 'Refresh Page';
                }, 2000);
            })
            .catch((error) => console.error(error));
    }

    useEffect(() => {
        getBorrowingHistory();
    }, [])


    return (
        <div className='min-h-[91vh] bg-slate-300 flex flex-col justify-start items-center py-4'>

            <button ref={ref} onClick={() => window.location.reload()} className='text-white bg-blue-700 px-4 py-2 rounded-xl font-medium text-lg'>Refresh Page</button>

            <div className="cards flex flex-col justify-center items-center text-base font-medium py-4 gap-2">
                {history.length > 0 && history.map((issue, index) => {
                    return <div className="card bg-white rounded-md px-4 py-4 max-w-xl" key={index}>
                        {issue.issuedTo} {issue.status} {issue.bookname} by {issue.bookauthor} on {issue.issuedDate.split('T')[0]}
                    </div>
                })}

            </div>
        </div>
    )
}

export default BorrowingHistory
