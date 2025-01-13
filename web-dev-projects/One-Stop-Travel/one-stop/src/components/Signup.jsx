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
            setErrorMsg('invalid email')
            return
        }
        if (pswd.length === 0 || pswd.length > 30) {
            setErrorMsg('invalid password')
            return
        }
        //check if email is in fake db of users
        if (!Object.keys(fakeUsers).includes(email)) {
            setErrorMsg('user not found')
            return
        }
        //if email is in fake db check if password matches
        else if (fakeUsers[email] !== pswd) {
            setErrorMsg('incorrect email or pswd')
            return
        }
        await navigate('/search', { replace: true });
    }
    return (
        <div className='bg-neutral-100 text-slate-700'>
            <div className=' absolute z-0 bg-cover bg-balloons bg-no-repeat w-full md:w-1/2 h-screen right-0'></div>
            <div class="flex z-10 container flex-wrap flex-row justify-center pt-12 min-h-screen" >
                <div className='hidden md:flex container flex-col w-1/2'>
                    <img src={require('../images/globe.png')} alt="globe" class="z-20 justify-self-center w-3/4 h-3/4" />
                    <h1 class="text-4xl pt-12 font-bold">Blah blah blah</h1>
                    <p class="pt-5  pr-14 mr-16 text-left l-0">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1</p>
                </div>
                <div className="flex flex-col justify-self-center backdrop-blur-xl bg-slate-200/50 minw-4/12 h-3/4 p-5  rounded-sm drop-shadow-sm  ">
                    <h1 class="poppins text-center text-4xl p-8 text-gray">One Stop Travel</h1>
                    <form onSubmit={handlesubmit} className="flex flex-col  items-center">
                        {
                            errorMsg && <h2>{errorMsg}</h2>
                        }
                        <input placeholder="Email" type="text" className=" w-5/6 mb-4 pl-2 rounded-sm h-9" />
                        <input placeholder="Password" type="text" className="w-5/6 mb-4 pl-2 rounded-sm h-9" />
                        <button type="submit" className="text-center align-middle bg-turqse2 hover:bg-lblue3 text-white rounded-sm w-5/6 h-10  my-5">Sign Up</button>
                        <p class=" mx-auto mt-1">Or</p>
                        <button class="bg-slate-500 hover:bg-red-500 text-white rounded-sm w-5/6 h-10 mt-5 ">
                            <img src={require('../images/google.png')} class="w-5 h-5 inline float-none mr-3" alt="" />
                            Continue with Google</button>
                        <button class="bg-dblue3 hover:bg-dblue1 text-white rounded-sm w-5/6 h-10  my-5">
                            <img src={require('../images/meta.png')} class="w-5 h-5 inline float-none mr-3" alt="" />
                            Continue with Meta</button>
                    </form>
                    <span class="self-center pl-4 text-sm"> Already Have An Account?  <Link class="underline text-red-500" to='/login' >Sign In</Link> </span>



                </div >
            </div>

        </div>
    )
}

export default Signup