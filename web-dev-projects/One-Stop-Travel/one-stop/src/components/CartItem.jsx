import React from 'react'

const CartItem = ({name, price, image, qty}) => {
    console.log('in hereee', name);
    return (
        <div className='w-full p-5 mt-5 rounded-sm bg-neutral-100 flex flex-col'>
            <div className='flex felx-row w-full space-x-2'>

            <img src={image} className='w-48 h-48' alt="" />


            <div className='flex flex-col w-full h-full p-2'>
                <h1 className='text-2xl font-bold'>{name} </h1>
                <span className='ml-20 mt-2 font-normal text-lblue3 text-lg '>{price}</span>


            <div className='flex flex-row justify-center pt-20'>
                <button><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>

            
                </button>
                <div className='  mx-3'>{qty}</div>
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                    </svg>

                </button>
            </div>
            </div>
            </div>



        </div>
    )
}

export default CartItem