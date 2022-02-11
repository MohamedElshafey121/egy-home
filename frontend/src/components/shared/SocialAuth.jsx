import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function SocialAuth () {
  async function callLoginGoogle () {
    await axios.get( '/auth/google',{headers:{"Access-Control-Allow-Origin": "*"}} );
  }
  return (
      <div style={{width:'20%',textAlign:'center',margin:' 100px auto'}}>
      {/* <div className="g-signin2 " data-onsuccess="onSignIn"> */}
      <button onClick={e => {
        e.preventDefault();
        callLoginGoogle()
        }}>Click Me</button>
      {/* </div> */}
          </div>
    )
}
