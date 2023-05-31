import {useState,useContext,createContext ,useEffect} from "react"


const CartContext = createContext();
const CartProvider = ({children})=>{
    const [cart,setCart] = useState([])
    useEffect(()=>{
        let ExistingCartItems = localStorage.getItem("cart")
        if( ExistingCartItems)setCart(JSON.parse(ExistingCartItems))
    },[])
    return(
        <CartContext.Provider value={[cart,setCart]} >
            {children}
        </CartContext.Provider>
    )
}

const useCart = ()=>useContext(CartContext)

export{useCart,CartProvider}