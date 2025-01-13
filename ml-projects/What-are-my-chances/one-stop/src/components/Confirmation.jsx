import Navbar from './Navbar';
import Footer from './Footer'
import { React, useContext, useEffect } from 'react'
import { CartContext } from '../contexts/CartContext';

const Confirmation = () => {
  const { purchasedItems } = useContext(CartContext)
  console.log('purchased items', purchasedItems);
  return (
    <>
      <Navbar />

      <div className='flex flex-col text-center justify-center min-h-screen '>
        <h1 className='text-4xl p-5'>Order has been successfully placed!</h1>
        <h1 className='text-2xl'>Confirmation # 1243430297472</h1>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-48 stroke-emerald-400 h-48 self-center">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

      </div>
      <Footer />
    </>
  )
}

export default Confirmation