import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Kit = ({ obj }) => {

  const [kit, setKit] = useState({ obj })

  return (

    <Link to='/kit' state={{ kit: kit }} >

      <div class="relative flex flex-col container  rounded-sm  hover:scale-105 delay-75 ">
        <img class="h-80 min-h-full " src={obj.assets[0].url} alt="" />
        <h1 class="  text-center text-xl pt-2 p-1 font-normal"> {obj.name}</h1>
        <p class=" text-center text-slate-400 pl-1 font-light"> SUMMER KIT 22' </p>
        <p class=" text-center text-md font-light"> {obj.price.formatted_with_symbol}</p>
      </div>
    </Link>


  )
}

export default Kit