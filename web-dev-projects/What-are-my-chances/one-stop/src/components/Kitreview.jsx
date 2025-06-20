import React from 'react'

const Kitreview = ({ title, body, rating }) => {
    return (
        <div className='flex flex-col bg-neutral-200 rounded-sm  p-5 w-2/3'>
            <h1 className='flex text-xl font-bold'>{title}

                <div className="star-rating place-self-center pl-10 ">
                    {[...Array(5)].map((star, index) => {
                        index += 1;
                        return (
                            <button
                                type="starButton"
                                key={index}
                                className={index <= rating ? "on-small" : "off-small"}
                             
                            >
                                <span className="star">&#9733;</span>
                            </button>
                        );
                    })}
                </div>

            </h1>
            <p>{body}</p>

        </div>
    )
}

export default Kitreview