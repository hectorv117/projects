import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import '../index.css'
import { useEffect, useContext, useState } from 'react'
import { CartContext } from '../contexts/CartContext';
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from '../firebase-config'
import { useLocation } from 'react-router-dom'

const Review = () => {

    const location = useLocation()
    const { img, id, name } = location.state
    const error = "The title and body must include english words.";
    console.log('locsation.state', location.state);
    const firstprod = doc(db, 'reviews', id)
    const [rating, setRating] = useState(0);
    const [msg, setMsg] = useState('')

    console.log('iddd', id);
    const addReview = async (event) => {
        event.preventDefault();
        let title = false
        let body = false
        const first_name = event.target[0].value
        const large_input = event.target[1].value
        console.log('rating', rating);
        //testcases

        var length = first_name.length;
        for (let i = 0; i < length; i++) {
            if (first_name.substring(i, i + 1) === "a" || first_name.substring(i, i + 1) === "e" || first_name.substring(i, i + 1) === "i" || first_name.substring(i, i + 1) === "o" || first_name.substring(i, i + 1) === "u" || first_name.substring(i, i + 1) === "y") {
                title = true;
            }
        }
        length = large_input.length
        for (let i = 0; i < length; i++) {
            if (large_input.substring(i, i + 1) === "a" || large_input.substring(i, i + 1) === "e" || large_input.substring(i, i + 1) === "i" || large_input.substring(i, i + 1) === "o" || large_input.substring(i, i + 1) === "u" || large_input.substring(i, i + 1) === "y") {
                body = true;
            }
        }
        if (!title || !body) {
            alert(error);
            return
        }
        else if (rating == 0) {
            alert("Please give a star rating.");
            return
        }
        else {
            await updateDoc(firstprod, {
                reviews_array: arrayUnion({
                    title: first_name,
                    body: large_input,
                    rating: rating
                })
            })
            setMsg('Thank you for your feedback!')
        }


    }

    return (
        <>
            <Navbar />
            <div className=' pt-20 flex flex-col'>
                <h1 className='text-center text-4xl p-5 font-bold'>Create Review</h1>
                <div className='flex flex-row ml-48 p-5 w-3/4'>
                    <img src={img} className="w-80 h-72" alt="" />
                    <h1 className='text-4xl  ml-20 mt-20'>{name}</h1>
                </div>

                <div class="flex flex-col w-3/4  ml-10 font-poppins h-screen  content-center p-5 ml-48 ">
                    <hr />
                    {
                    msg ? <h1 className='text-center text-4xl p-5 mt-20 font-light'>{msg}</h1>
                    : 
                    <>
                    <h1 className='text-xl py-3'>Overall Rating</h1>
                    <div class="flex flex-row space-x-10 pb-10">
                        <div className="star-rating place-self-center ">
                            {[...Array(5)].map((star, index) => {
                                index += 1;
                                return (
                                    <button
                                        type="starButton"
                                        key={index}
                                        className={index <= rating ? "on" : "off"}
                                        onClick={() => setRating(index)}
                                    >
                                        <span className="star">&#9733;</span>
                                    </button>
                                );
                            })}
                        </div>

                    </div>
                    <hr />
              
                    <form onSubmit={addReview}>
                        <div class="flex flex-col pt-5">
                            <div>
                                <label for="first_name" class="block mb-2 text-xl font-medium text-gray-900 dark:text-white">Add a headline</label>
                                <input type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Headline" required />
                            </div>
                        </div>

                        <div class="mb-6">
                            <label for="large-input" class="block mb-2 text-xl font-medium text-gray-900 dark:text-white pt-5">Write your review</label>
                            <input type="text" id="large-input" class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>

                        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md w-full sm:w-auto px-5 py-2.5 text-center ">Submit</button>
                    </form>
                    </>
                   }
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Review