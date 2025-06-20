import {React, useContext} from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import CartItems from './CartItems'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CartContext } from '../contexts/CartContext';

const Checkout = () => { 
    const navigate = useNavigate();
    const {cart, purchasedItems, setPurchasedItems, emptyCart} = useContext(CartContext)

    const [billingMsg, setBillingMsg] = useState('Save')
    const [paymentMsg, setPaymentMsg] = useState('Add Payment Method')
    const [passed, setPassed] = useState(false)
    const [passed2, setPassed2] = useState(true)
    const [bgcolor, setBgColor] = useState('bg-gray-50')
    const [buttonColor, setButtonColor] = useState('bg-dblue1')
    const [btnclr, setBtnClr] = useState('bg-dblue1')

    const billing = (e) => {
        e.preventDefault()
        setBillingMsg('Saved')
        setPassed(true)
        setBgColor('bg-gray-200')
        setButtonColor('bg-turqse1')
    }

    const payment = (e) =>{
        e.preventDefault()
        setBtnClr('bg-turqse1')
        setPaymentMsg('Added')
        if(passed){
            setPassed2(false)
        }

    }



    const purchase=()=>{
        if(cart){
          cart.line_items.map((kit)=>{
            setPurchasedItems(curr=>[...curr, kit])
          })
          emptyCart()
          navigate('/confirmation')
        }
      }

    return (
        <>
            <Navbar />
            <div class="flex flex-row space-x-10 mt-20 mb-56 h-screen">
                <div class="flex flex-col w-2/3 ml-10 mt-10 font-poppins">
                <h1 className='text-center text-2xl pb-5'>Checkout</h1>
                    <h1 class="pb-3 ">Billing Details</h1>
                    {
                    <form onSubmit={billing} action="" class="space-y-5 relative">
                        <div class="flex flex-row space-x-3">
                            <input disabled={passed} type="text" id="first_name"
                                class= {` ${bgcolor} border border-gray-300 text-gray-900 text-sm rounded-sm  block w-full p-2.5 `}
                                placeholder="First Name" maxlength="40" pattern="[A-Za-z]{1,40}" required />


                            <input disabled={passed} type="text" id="last_name"
                                class={` ${bgcolor} border border-gray-300 text-gray-900 text-sm rounded-sm  block w-full p-2.5 `}
                                placeholder="Last Name" maxlength="40" pattern="[A-Za-z]{1,40}" required />
                        </div>


                        <input disabled={passed} type="text" id="first_name"
                            class={` ${bgcolor} border border-gray-300 text-gray-900 text-sm rounded-sm  block w-full p-2.5 `}
                            placeholder="Address" required />
                        <div class="flex flex-row space-x-3">

                            <input disabled={passed} type="text" id="first_name"
                                class={` ${bgcolor} border border-gray-300 text-gray-900 text-sm rounded-sm  block w-full p-2.5 `}
                                placeholder="Zip Code" pattern="[0-9]{5}" required />

                        </div>
                        <button
                            type='submit' class={` absolute mt-5 w-1/4 h-10 ${buttonColor} text-center text-white rounded-lg right-0 hover:bg-turqse3`}>
                            {
                                billingMsg
                            }
                        </button>

                    </form> 
                    }

                    <div class=" relative flex flex-col mt-10 ">

                        <h1 class="pb-3">Payment Method</h1>

                        <form onSubmit={payment} action="relative w-1/2">
                            <div class="flex flex-row space-x-2 w-1/2 font-poppins">
                                <div class="flex items-center pl-4 rounded border border-gray-200 dark:border-gray-700 w-1/2">
                                    <input id="bordered-radio-1" type="radio" value="" name="bordered-radio"
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label for="bordered-radio-1"
                                        class="py-4 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300" >Credit
                                        Card</label>
                                </div>
                                <div class="flex items-center pl-4 rounded border border-gray-200 dark:border-gray-700 w-1/2">
                                    <input checked id="" type="radio" value="" name="bordered-radio"
                                        class="w-4 h-4  bg-gray-100 border-gray-300  " />
                                    <label for="bordered-radio-2"
                                        class="py-4 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300">Debit
                                        Card</label>
                                </div>
                            </div>

                            <div class="relative z-0 mb-6 w-full group">
                                <input type="tel" name="card-number" id="floating_email"
                                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-lblue3 peer"
                                    placeholder=" " pattern="[0-9]{15,16}" required />


                                <label for="card-number"
                                    class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-lblue3 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Card
                                    Number</label>

                            </div>
                            <div class="flex flex-row space-x-3">
                                <div class="relative z-0 mb-6  group w-1/2">
                                    <input type="tel" name="floating_email" id="floating_email"
                                        class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-lblue3 focus:outline-none focus:ring-0 focus:border-lblue3 peer"
                                        placeholder=" " required />
                                    <label for="floating_email"
                                        class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-lblue3 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6" pattern="[0-9]{3,4}">Security
                                        Code</label>
                                </div>

                                <div class="relative z-0 mb-6  group w-1/2">
                                    <input type="date" name="floating_email" id="floating_email"
                                        class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-lblue3 peer"
                                        placeholder=" " required />
                                    <label for="floating_email"
                                        class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-lblue3 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Experation
                                        Date</label>
                                </div>
                             

                            </div>


                            <button type='submit'
                                class={` absolute mt-5 w-1/3 h-10 ${btnclr} text-center text-white rounded-lg right-0 hover:bg-turqse3`}>
                                {paymentMsg}</button>

                        </form>

                    </div>
                    <button onClick={purchase} disabled={passed2} className='h-12 bg-gray-300 rounded-sm  mt-28 w-full '>Purchase</button>
                </div>

            <CartItems/>

            </div>

            <Footer />

        </>
    )
}
/*
const returnFN = () => {
    return document.getElementById("first_name");
}

module.exports = Checkout;*/
export default Checkout