import {  useEffect, useState } from 'react'
import Search from './components/Search'
import Signup from './components/Signup'
import Kitpage from './components/Kitpage'
import Login from './components/Login'
import Checkout from './components/Checkout'
import { CartContext } from './contexts/CartContext'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import commerce from './lib/commerce';
import OrderHistory from './components/OrderHistory'
import Review from './components/Review'
import Confirmation from './components/Confirmation'
import CartItems from './components/CartItems'

const App = () => {

  const [cart, setCart] = useState({})
  const [purchasedItems, setPurchasedItems] = useState([]);
  

  const fetchCart = async () => {
    setCart(await commerce.cart.retrieve())
  }

  const addToCart = async (id, quantity) => {
    const { cart } = await commerce.cart.add(id, quantity);
    setCart(cart);
  }

  const removeKitFromCart = async (id) => {
    const { cart } = await commerce.cart.remove(id);
    setCart(cart)
  }

  const updateQty = async (id, qty) => {
    const { cart } = await commerce.cart.update(id, { qty });
    setCart(cart)
  }

  const emptyCart = async () => {
    const { cart } = commerce.cart.empty();
    setCart(cart)
  }


  return (

    <>
    

      <CartContext.Provider value={{ cart, setCart, fetchCart, addToCart, removeKitFromCart, updateQty, emptyCart, purchasedItems, setPurchasedItems }}>
        <Routes>
          <Route exact path='/search' element={<Search />} > </Route>
          <Route exact path='/signup' element={<Signup />}> </Route>
          <Route exact path='/login' element={<Login />}> </Route>
          <Route exact path='/kit' element={<Kitpage />}> </Route>
          <Route exact path='/checkout' element={<Checkout />}> </Route>
          <Route exact path='/orders' element={<OrderHistory />}> </Route>
          <Route exact path='/review' element={<Review />}> </Route>
          <Route exact path='/confirmation' element={<Confirmation />}> </Route>
          <Route exact path='/cartitems' element={<CartItems />}> </Route>



        </Routes>
      </CartContext.Provider>
      </>

  )
}

export default App