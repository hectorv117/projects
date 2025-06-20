import {React, useContext, useEffect} from 'react'
import { CartContext } from '../contexts/CartContext';
import CartItem from './CartItem';
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar';



const CartItems = () => {
  const navigate = useNavigate();
    const {cart, fetchCart, emptyCart, purchasedItems, setPurchasedItems} = useContext(CartContext)
    useEffect(() => {
        console.log(cart);
      fetchCart();
    }, [cart])


   
  return (

    <>
    

    <div className='w-1/2 p-5  flex flex-col h-max '>

   {
    cart ? cart.line_items.map((prod)=>(
        <CartItem id={prod.product_id} name={prod.name} price={prod.price.formatted_with_symbol} image={prod.image.url} qty={prod.quantity} />
  )) : null
   }

    <div className='flex flex-col mt-10 space-y-2'>

    <h1 className='text-2xl font-bold'>Total: {cart ? cart.subtotal.formatted_with_symbol : null}</h1>
    <div className='flex flex-row space-x-3'>
    {/* <button onClick={purchase} className='bg-slate-400 rounded-md w-1/2 h-10 text-white '> Purchase</button> */}
    <button onClick={emptyCart} className='bg-red-500 w-full h-12 rounded-md text-white hover:bg-red-400'> Empty Cart</button>
    </div>
    </div>
    </div>
    </>
  )
}

export default CartItems