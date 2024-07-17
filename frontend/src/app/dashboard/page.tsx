'use client';

import React, { useState, useEffect } from 'react';
import CardComponent from '../../components/CardComponent';
import { Portfolio } from '../../interfaces/Portfolio';

import * as BackendApi from '../../network/api';


export default function Home() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectPortfolio, setSelectPortfolio] = useState<Portfolio>({ id: 0, name: '', quantity: 0 });
  const [userName, setUserName] = useState<null | string>(null);

  const fetchData = async () => {
    try {
      const response = await BackendApi.fetchPortfolios()
      setPortfolios(response.reverse());

      const responseUser = await BackendApi.getLoggedInUser()
      // console.log("Navbar getLoginuser", response.username)
      setUserName(responseUser.username)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  //fetch portfolios
  useEffect(() => {
    fetchData();

    // let timer;
    // timer = setInterval(() => {
    //   const sec = new Date().getSeconds();
    //   if (sec) return
    //   fetchData();
    // }, 500)

    // return () => {
    //   clearInterval(timer)
    // }


  }, []);





  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (selectPortfolio.id) {
        const response = await BackendApi.updatePortfolio(selectPortfolio.id, { name: selectPortfolio.name, quantity: selectPortfolio.quantity })
      } else {
        const response = await BackendApi.createPortfolio({ name: selectPortfolio.name, quantity: selectPortfolio.quantity })
      }

      fetchData();
      setSelectPortfolio({ id: 0, name: '', quantity: 0 });
    } catch (error) {
      console.error('Error updating portfolio:', error);
    }
  };

  //delete portfolio
  const deleteItem = async (id: number) => {
    try {
      if (!id) {
        return;
      }
      await BackendApi.deletePortfolio(id)
      setPortfolios(portfolios.filter((portfolio) => portfolio.id !== id));
    } catch (error) {
      console.error('Error deleting portfolio:', error);
    }
  };

  return (

    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="space-y-4 w-full max-w-2xl">
        {userName && (
          <>
            <h1 className="text-2xl font-bold text-gray-800 text-center">Crypto Portfolio App</h1>


            {/* Update portfolio */}
            <form onSubmit={handleSubmit} className="p-4 bg-green-100 rounded shadow">
              <input
                placeholder="ID"
                value={selectPortfolio.id != 0 ? selectPortfolio.id : ""}
                onChange={(e) => setSelectPortfolio({ ...selectPortfolio, id: Number(e.target.value) })}
                className="mb-2 w-full p-2 border border-gray-300 bg-gray-300 rounded" readOnly={true}
              />
              <input
                placeholder="Name"
                value={selectPortfolio.name}
                onChange={(e) => setSelectPortfolio({ ...selectPortfolio, name: e.target.value })}
                className="mb-2 w-full p-2 border border-gray-300 rounded" required
              />

              <input
                placeholder="Quantity" type='number'
                value={selectPortfolio.quantity ? selectPortfolio.quantity : ""}
                onChange={(e) => setSelectPortfolio({ ...selectPortfolio, quantity: Number(e.target.value) })}
                className="mb-2 w-full p-2 border border-gray-300 rounded" required
              />
              <div className='flex justify-around'>
                <button type="reset" className="w-[40%] p-2 text-white bg-blue-500 rounded hover:bg-blue-600" value="Reset"
                  onClick={() => setSelectPortfolio({ id: 0, name: '', quantity: 0 })}
                >
                  Clear
                </button>
                <button type="submit" className="w-[40%] p-2 text-white bg-green-500 rounded hover:bg-green-600">
                  Submit
                </button>
              </div>

            </form>

            {/* Display portfolios */}
            <div className="space-y-2">
              {portfolios.map((portfolio) => (
                <div key={portfolio.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                  <CardComponent portfolio={portfolio} />
                  <div className='flex space-x-1'>
                    <button onClick={() => setSelectPortfolio({ ...portfolio })} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                      Edit
                    </button>
                    <button onClick={() => deleteItem(portfolio.id)} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
                      Delete
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </>
        )}


      </div>
    </main >
  );
}