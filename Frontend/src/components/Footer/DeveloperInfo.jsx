import axios from 'axios'
import { Activity } from 'lucide-react'
import React from 'react'

const gitProfileFetch = async () =>{
    const dataobj = await axios.get("https://github.com/kapilsingh09")
    console.log(dataobj);
    

}
const DeveloperInfo = () => {
    gitProfileFetch()
  return (
    <div>
      
    </div>
  )
}

export default DeveloperInfo
