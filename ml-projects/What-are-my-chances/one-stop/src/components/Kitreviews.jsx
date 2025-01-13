import React from 'react'
import { useState, useEffect, useContext, useCallback } from 'react'
import Kitreview from './Kitreview'
import {db} from '../firebase-config'
import {doc, collection, getDoc, getDocs} from 'firebase/firestore'

const Kitreviews = ({id}) => {
    const [reviews, setReviews] = useState([])


   useEffect(()=>{
    const getReviews = async () =>{ 
        try {
            
            const data = await getDocs(collection(db, "reviews"));
            console.log('data',data);
            data.forEach((doc)=>{
                if(doc.id === id){
                    setReviews(doc.data().reviews_array)
                }
                console.log(doc.id, '=>', doc.data());
            })
        } catch (error) {
            console.log(error);
        }
    }
    getReviews();
   },[])
    
    


    return (
        <div className='flex flex-col mt-10 p-4 overflow-y-scroll w-screen space-y-5 self-center items-center bg-neutral-100 rounded-sm'>
            <h1 className='text-2xl font-bold'>Reviews</h1>
            {
            reviews.map( (review)=>(
                <>
                <Kitreview title={review.title} body={review.body} rating={review.rating} />
                </>

            ))
            }

            </div>
    )
}

export default Kitreviews