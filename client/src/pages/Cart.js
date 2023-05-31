import React,{useState,useEffect} from 'react'
import Layout from '../components/Layout/Layout'
import { useCart } from '../context/cart'
import { useAuth } from '../context/auth'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import DropIn from "braintree-web-drop-in-react"
import  toast  from 'react-hot-toast'
const Cart = () => {
    const [auth,setAuth] = useAuth()
    const [cart,setCart] = useCart()
    const navigate = useNavigate()
    const [clientToken,setClientToken] = useState("")
    const [instance,setInstance] = useState("")
    const [loading,setLoading] = useState(false)
    const totalPrice = ()=>{
        try {
            let total = 0;
            cart?.map(item => {total = total+item.price})
            return total
        } catch (error) {
            console.log(error)
        }
    }
    const removeCartItem = (pid)=>{
        try {
            let myCart = [...cart]
            let index  = myCart.findIndex(item=>item._id===pid)
            myCart.splice(index,1)
            setCart(myCart)
            localStorage.setItem("cart",JSON.stringify(myCart))
        } catch (error) {
            console.log(error)
        }
    }

    const getToken = async()=>{
        try {
            const {data} =await axios.get(`${process.env.REACT_APP_API}/api/v1/product/braintree/token`)
            // console.log(data?.clientToken+"sidcjdcj  CLIENT")
            setClientToken(data?.clientToken)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getToken()
    },[auth?.token])

    const handlePayment = async() =>{
        try {
            setLoading(true)
            const {nonce} = await instance.requestPaymentMethod()
            const {data} = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/braintree/payment`,{
                nonce,cart
            })
            setLoading(false)
            localStorage.removeItem("cart")
            setCart([])
            navigate("/dashboard/user/orders")
            toast.success("payment completed")
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
  return (
    <Layout>
      <div className="container">
        <div className="row">
            <div className="col-md-12">
                <h1 className="text-center bg-light p-2 mb-1">
                    {`Hello ${auth?.token&&auth?.user?.name}`}
                </h1>
                <h4 className='text-center' >
                    {cart?.length>1?`you have ${cart.length} items in your cart ${auth?.token?" ":"please login to chechout"}`:"your cart is empty"}
                </h4>
            </div>
        </div>
        <div className="row">
            <div className="col-md-6">
                {
                    cart.map(p=>(
                        <div className="row m-2 mb-2 card flex-row">
                            <div className="col-md-4">
                            <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}

                  />
                            </div>
                            <div className="col-md-8">
                                <h4>{p.name}</h4>
                                <p>{p.description.substring(0,30)}</p>
                                <p>Price : ${p.price}</p>
                                <button className='btn btn-danger mb-1' onClick={()=>removeCartItem(p._id)}>Remove</button>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="col-md-4 text-center ">
                <h2>Cart summary</h2>
                <p>Total | checkout | payment</p>
                <hr />
                <h4> Total: ${totalPrice()}</h4>
                {auth?.user?.address ? (
                    <>
                    <div className="mb-3">
                        <h4>Current Address</h4>
                        <h5> {auth?.user?.address} </h5>
                        <button className='btn btn-outline-warning'
                        onClick={()=>navigate('/dashboard/user/profile')}
                        > Update Address </button>
                    </div>
                    </>
                ):(
                    <div className="mb-3">
                        {
                            auth?.token?(
                                <button className='btn btn-outline-warning' onClick={()=>navigate('/dashboard/user/profile')}> Update Address </button>
                            ):
                            (
                                <button className='btn btn-outline-warning' onClick={()=>navigate('/login',{
                                    state:"/cart"
                                })} >Please Login</button>
                            )
                        }
                    </div>
                )}
                <div className="mt-2">
                    {!clientToken || 
                    !cart?.length ? (""):(
                        <>
                             <DropIn
                    options={{
                        authorization:clientToken,
                        paypal:{
                            flow:'vault'
                        }
                    }}
                    onInstance={instanse=>setInstance(instanse)}
                    />

                    
                    <button className="btn btn-primary" onClick={handlePayment} 
                   // disabled = {!clientToken || !loading || !instance || !auth?.user?.address}
                    >
                        {loading?"Processing ... ":"Make Payment"}
                    </button>
                        </>
                    )
                    }
                   
                </div>
            </div>
        </div>
      </div>
    </Layout>
  )
}

export default Cart
