import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import Kitreviews from './Kitreviews'
import { useState, useEffect, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CartContext } from '../contexts/CartContext';
import { Carousel } from 'flowbite-react'
const Kitpage = () => {

    const { addToCart } = useContext(CartContext)
    const location = useLocation();
    const [urls, setUrls] = useState([])
    const data = location.state.kit.obj
    console.log('obj', data);

    const geturls = async () => {
        let assets = await data.assets
        console.log('assets', assets);
        setUrls(assets)
        console.log('urlss', urls);
    }

    useEffect(() => {
        geturls();
    }, [])
    return (
        <>


            <Navbar />
            <div class="flex flex-row flex-wrap mt-10 min-h-2/3 ">


                <div className="  h-3/4 w-3/4 md:w-1/2 mt-20 h-full">
                   
                    {/* <Carousel > */}
                        {

                            urls.map((u, i) => {
                                console.log('u', u);
                                console.log('i', i);
                                let url = u.url
                                if (i===0)
                                    return(
                                    <img
                                    key={i}
                                        src={url}
                                        class="  object-fill ml-5 w-full h-96"
                                        alt="..." />
                                )
                        })
                        }

                    {/* </Carousel> */}



                </div>

                <div class="flex flex-col mt-20 md:pl-20 pl-10 font-poppins">
                    <h3 class=" font-light text-xs text-slate-400">SUMMER KIT '22</h3>
                    <h1 class="font-bold text-5xl py-2 ">{data.name}</h1>

                    <div class=" relative flex items-center pb-4 pt-2">
                        <svg aria-hidden="true" class="w-5 h-5 text-yellow-400" fill="black" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>First star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <svg aria-hidden="true" class="w-5 h-5 text-yellow-400" fill="black" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Second star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <svg aria-hidden="true" class="w-5 h-5 text-yellow-400" fill="black" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Third star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <svg aria-hidden="true" class="w-5 h-5 text-yellow-400" fill="black" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fourth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <svg aria-hidden="true" class="w-5 h-5 text-gray-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fifth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <p class="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">4.95 out of 5</p>
                        <h2 class=" absolute right-0 text-2xl font-bold text-lblue3">{data.price.formatted_with_symbol}</h2>
                    </div>

                    <ul class="list-disc list-inside text-center text-lg  py-10" dangerouslySetInnerHTML={{ __html: data.description }}>
                        {/* <div  dangerouslySetInnerHTML={{__html: data.description}} /> */}
                    </ul>
                    <div class="flex flex-row space-x-5">

                        <Link to='/checkout' class="rounded-md w-1/2 h-12 bg-lblue3 hover:bg-lblue2 text-center align-middle pt-3"> Buy Now</Link>
                        <button class="rounded-md w-1/2 h-12 bg-slate-300 hover:bg-slate-200 " onClick={() => {
                            addToCart(data.id, 1)
                        }}> Add To Cart</button>
                    </div>

                </div>
                <script src="https://unpkg.com/flowbite@1.5.4/dist/flowbite.js"></script>
                <Kitreviews id={data.id} />
            </div>
            <Footer />
        </>
    )
}

export default Kitpage