import React , {useState}from 'react'
import Layout from '../../components/Layout/Layout'
import toast from "react-hot-toast"
import axios from "axios"
import { useNavigate ,useLocation} from 'react-router-dom'
import "../../styles/AuthStyles.css"
import { useAuth } from '../../context/auth'
const Login = () => {
    const [auth,setAuth] = useAuth();
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    

    const navigate = useNavigate()
    const location = useLocation()
    const handleSubmit= async(e)=>{
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/login`,{
                
                email,
                password
                
            })
            if(res.data.success){
                toast.success(res.data.message)
                setAuth({
                    ...auth,
                    user:res.data.user,
                    token:res.data.token
                })
                localStorage.setItem('auth',JSON.stringify(res.data))
                navigate( location.state||'/')
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
        <h1>Login Now</h1>

        
      <form onSubmit={handleSubmit}>
  

  <div className="mb-3">
    
    <input type="email" className="form-control" id="exampleInputEmail1" placeholder='Email'
    value={email}
    onChange={(e)=>setEmail(e.target.value)}
    required
    />
  </div>

  

  <div className="mb-3">
    
    <input type="password" className="form-control" id="exampleInputPassword1"placeholder='Password'
    value={password}
    onChange={(e)=>setPassword(e.target.value)}
    required
    />
  </div>

 
    <div className="mb-3">
    <button type="submit" className="btn btn-primary" onClick={()=>(navigate('/forgot-password'))}>Forgot Password</button>
    </div>
  <button type="submit" className="btn btn-primary">Submit</button>
</form>
      </div>

    </Layout>
  )
}

export default Login
