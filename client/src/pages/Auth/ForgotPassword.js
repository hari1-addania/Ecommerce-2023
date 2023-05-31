import React , {useState}from 'react'
import Layout from '../../components/Layout/Layout'
import toast from "react-hot-toast"
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import "../../styles/AuthStyles.css"
import { useAuth } from '../../context/auth'
const ForgotPassword = () => {
    
    const [email,setEmail] = useState("")
    const [question,setQuestion] = useState("")
    const [newPassword,setNewPassword] = useState("")
    

    const navigate = useNavigate()

    const handleSubmit= async(e)=>{
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgot-password`,{
                
                email,
                newPassword,
                question
                
            })
            if(res.data.success){
                toast.success(res.data.message)
            
               
                navigate( '/login')
            }else{
                toast.error(res.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error("somethisng went wrong")
        }
    }
  return (
    <Layout>
      <div className="form-container">
        <h1>Reset Password</h1>

        
      <form onSubmit={handleSubmit}>
  

  <div className="mb-3">
    
    <input type="email" className="form-control" id="exampleInputEmail1" placeholder='Email'
    value={email}
    onChange={(e)=>setEmail(e.target.value)}
    required
    />
  </div>

  

  <div className="mb-3">
    
    <input type="password" className="form-control" id="exampleInputPassword1"placeholder='New Password'
    value={newPassword}
    onChange={(e)=>setNewPassword(e.target.value)}
    required
    />
  </div>

  <div className="mb-3">
    
    <input type="text" className="form-control" id="exampleInputPassword1"placeholder='Enter Hobby'
    value={question}
    onChange={(e)=>setQuestion(e.target.value)}
    required
    />
  </div>

 
    
  <button type="submit" className="btn btn-primary">Reset</button>
</form>
      </div>
    </Layout>
  )
}

export default ForgotPassword
