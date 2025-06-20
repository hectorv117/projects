import {React, useContext, useEffect} from 'react'
import { CartContext } from '../contexts/CartContext';
import Navbar from './Navbar'
import OrderItem from './OrderItem'
import Footer from './Footer'

const OrderHistory = () => {
  const {purchasedItems} = useContext(CartContext)
  console.log('purchased', purchasedItems);
  return (
    <>
    <Navbar/>
    <div className='pt-20 flex flex-col  h-screen'>
        <h1 className='text-4xl font bold text-center'>Your Orders</h1>
        <div className='flex flex-col w-full  justify-center space-y-5 p-5'>
       {
        purchasedItems && purchasedItems.map((prod)=>(
          <OrderItem id={prod.product_id} name={prod.name} price={prod.price.formatted_with_symbol} image={prod.image.url} qty={prod.quantity}/>
        ))
       }
        </div>

    </div>
    <Footer/>
    </>
  )
}

export default OrderHistory 