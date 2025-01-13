import React from 'react'
import Kit from './Kit'
import Navbar from './Navbar'
import commerce from '../lib/commerce';
import { useState, useEffect } from "react";
import Footer from './Footer'




const Search = () => {



    const [kits, setKits] = useState([]);
    const [results, setResults] = useState([]);
    const [resMsg, setResMsg] = useState("")

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault()
        const query = e.target[0].value.toLowerCase()
        setResults([])
        setResMsg("")
        if (query.length === 0){return}
        setResMsg(`No results for ${query} ...`)
        kits.map((product) => {
            let kitName = product.name.toLowerCase();
            if (kitName.includes(query)) {
                setResults(curr => [...curr, product])
                setResMsg('Results')
            }
        })
    }

    const fetchProducts = () => {
        commerce.products.list().then((products) => {
            setKits(products.data);
            console.log('kit ids', kits);
        }).catch((error) => {
            console.log('There was an error fetching the products', error)
        });
    }
    return (
        <body className=' w-full min-h-screen absolute'>
            <Navbar />


            <div class="flex flex-col h-30 w-full mt-20 justify-center">
                <h1 class="text-center text-4xl p-5 font-poppins">Search For Kits</h1>
                <form onSubmit={handleSubmit} action="" className='flex flex-row self-center w-full justify-center'>
                    <input type="text" class=" w-2/3 h-20 rounded-md pl-3 right-0 border border-lblue3" placeholder="Search For a Kit" />
                    <button type='submit' class="inline-block overflow-visible ">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 m-3">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </button>
                </form>
            </div>

            <div className='flex flex-col m-10'>
                {
                    resMsg && <div className='flex flex-col  mb-52'>
                        <h1 title='resMsg' class="text-center text-2xl p-5 pb-8">{resMsg}</h1>
                        <div className='grid grid-cols-4 grid-row-1 gap-3 flex flex-wrap min-h-1/3'>
                            {
                                results && results.map((kit) => (
                                    <Kit obj={kit} />))
                            }
                        </div>
                    </div>
                }

                <h1 class="text-center text-4xl p-5 pb-8">Popular</h1>
                <div className='grid sm:grid-cols-3 grid-cols-1 gap-8 flex flex-wrap  p-5 min-h-3/4'>
                    {
                        kits.map((product) => (
                            <Kit obj={product} />
                        ))

                    }
                </div>
            </div>
            <Footer />
        </body>
    )
}

export default Search