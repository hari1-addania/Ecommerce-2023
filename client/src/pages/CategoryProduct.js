import React ,{useState,useEffect}from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
const CategoryProduct = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [products,setProducts] = useState([])
    const [category,setCategory] = useState([])
    useEffect(()=>{
        if(params?.slug)
        getProductByCat()
    },[params?.slug])
    const getProductByCat = async()=>{
        try {
            const {data} =await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`)
            setProducts(data?.product)
            setCategory(data?.category)
            
        } catch (error) {
            console.log(error)
        }
    }
  return (

    <Layout>
      <div className="container mt-3">
        <h4 className='text-center'>{category?.name}</h4>
        <h6 className='text-center'>{products?.length} results found</h6>
        <div className="row">
        <div className="d-flex flex-wrap">
            {products?.map((p) => (
             
                <div className="card m-2" style={{ width: "18rem" }}>
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">{p.description}</p>
                    <p className="card-text">$ {p.price}</p>
                    <button className='btn btn-primary ms-1' onClick={()=>navigate(`/product/${p.slug}`)} >More details</button>
                    <button className='btn btn-secondary ms-1'>Add to Cart</button>
                  </div>
                </div>
              
            ))}
            </div>
        </div>
      </div>
    </Layout>
  )
}

export default CategoryProduct
