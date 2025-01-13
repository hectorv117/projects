import React from 'react'
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'

const Signup = () => {
    const navigate = useNavigate();

    const [errorMsg, setErrorMsg] = useState("")

    const handlesubmit = async (event) => {
        event.preventDefault();

        const fakeUsers = {
            "hector@gmail.com": "1234"
        }

        const email = event.target[0].value
        const pswd = event.target[1].value
        console.log(email, 'email');
        console.log(pswd, 'pswd');


        if (!email.includes('@')) {
            setErrorMsg('Invalid email')
            return
        }
        if (pswd.length === 0 || pswd.length > 30) {
            setErrorMsg('Invalid password')
            return
        }
        //check if email is in fake db of users
        if (!Object.keys(fakeUsers).includes(email)) {
            setErrorMsg('User not found')
            return
        }
        //if email is in fake db check if password matches
        else if (fakeUsers[email] !== pswd) {
            setErrorMsg('Incorrect email or password')
            return
        }
        await navigate('/search', { replace: true });
    }
    return (
        <div className='bg-neutral-100 text-slate-700'>
            <div className=' absolute z-0 bg-cover bg-balloons bg-no-repeat w-full md:w-1/2 h-screen right-0'></div>
            <div class="flex z-10 container flex-wrap flex-row ml-5 pt-12 min-h-screen" >
                <div className='hidden md:flex container flex-col w-1/2'>
                    {/* <img src={require('../images/globe.png')} alt="globe" class="z-20 justify-self-center w-3/4 h-3/4" /> */}
                    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-48 h-48">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.716.607 5.18 1.64" />
                    </svg> */}
                    {/* 
                    <h1 class="text-4xl pt-12 font-bold">Stress Free Traveling</h1>
                    <p class="pt-5  pr-14 mr-20 text-left l-0">At one stop travel we offer  </p> */}
                    {/* <h1 class="mb-4 mt-20 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                        Stress Free Traveling </h1> */}

                    <h1 class="mb-4 mt-20 text-5xl font-extrabold text-gray-900 dark:text-white "><span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Stress Free</span> Traveling</h1>
                    <p class="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">Here at One Stop Travel you can make traveling a lot easier by  quickly purchasing one of our custom tailored kits with all the traveling essentials for your destination</p>

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-96 h-96 ml-20 stroke-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.716.607 5.18 1.64" />
                    </svg>

                </div>
                <div className="flex flex-col justify-self-center backdrop-blur-xl bg-slate-200/50 minw-4/12 h-3/4 p-5 ml-20 rounded-sm drop-shadow-sm  ">
                    <h1 class="poppins text-center text-4xl p-8 text-gray">One Stop Travel</h1>
                    <form onSubmit={handlesubmit} className="flex flex-col  items-center">
                        {
                            errorMsg && <h2 className='text-red-500 text-lg pb-2'>{errorMsg}</h2>
                        }
                        <input placeholder="Email" type="text" className=" w-5/6 mb-4 pl-2 rounded-sm h-9" />
                        <input placeholder="Password" type="text" className="w-5/6 mb-4 pl-2 rounded-sm h-9" />
                        <button type="submit" className="text-center align-middle bg-turqse2 hover:bg-lblue3 text-white rounded-sm w-5/6 h-10  my-5">Sign In</button>
                        <p class=" mx-auto mt-1">Or</p>
                        <button class="bg-slate-500 hover:bg-red-500 text-white rounded-sm w-5/6 h-10 mt-5 ">
                            <img src={require('../images/google.png')} class="w-5 h-5 inline float-none mr-3" alt="" />
                            Continue with Google</button>
                        <button class="bg-dblue3 hover:bg-dblue1 text-white rounded-sm w-5/6 h-10  my-5">
                            <img src={require('../images/meta.png')} class="w-5 h-5 inline float-none mr-3" alt="" />
                            Continue with Meta</button>
                    </form>
                    <span class="self-center pl-4 text-sm"> Don't Have An Account?  <Link class="underline text-red-500" to='/signup' >Sign up</Link> </span>



                </div >
            </div>

        </div>
    )
}

export default Signup