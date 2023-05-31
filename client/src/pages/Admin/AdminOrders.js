import { Select } from 'antd';
import React, { useState, useEffect } from 'react';
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from 'moment';
import { useAuth } from '../../context/auth';

const {Option} = Select
const AdminOrders = () => {
  const [status, setStatus] = useState([
    'Not Process',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancel',
  ]);
  const [changeStatus, setChangeStatus] = useState('');

  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/all-orders`);
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async(orderId,value)=>{
   try {
    const {data} = axios.put(`${process.env.REACT_APP_API}/api/v1/auth/order-status/${orderId}`,{status:value})
    getOrders();
   } catch (error) {
    console.log(error)
   }
  }
  return (
    <Layout>
      <div className='row'>
        <div className='col-md-3'>
          <AdminMenu />
        </div>
        <div className='col-md-9'>
          <h1 className='text-center'>All orders</h1>
          {orders?.map((o, i) => {
            return (
              <div className='border shadow' key={o._id}>
                <table className='table'>
                  <thead>
                    <tr>
                      <th scope='col'>#</th>
                      <th scope='col'>Status</th>
                      <th scope='col'>Buyer</th>
                      <th scope='col'>Date</th>
                      <th scope='col'>Payment</th>
                      <th scope='col'>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{i + 1}</td>
                      <td>
                        <Select bordered={false} onChange={(val)=>handleChange(o._id,val)} defaultValue={o?.status}>
                            {status.map((s,i)=>(
                              <Option key={i} value={s} >{s}</Option>
                            ))}
                        </Select>
                      </td>
                      <td>{o?.buyer?.name}</td>
                      <td>{moment(o?.createdAt).fromNow()}</td>
                      <td>{o?.payment.success ? 'success' : 'failed'}</td>
                      <td>{o?.products?.length}</td>
                    </tr>
                  </tbody>
                </table>
                <div className='container'>
                  {o?.products?.map((p, i) => (
                    <div className='row m-2 mb-2 card flex-row' key={p._id}>
                      <div className='col-md-4'>
                        <img
                          src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                          className='card-img-top'
                          alt={p.name}
                        />
                      </div>
                      <div className='col-md-8'>
                        <h4>{p.name}</h4>
                        <p>{p.description.substring(0, 30)}</p>
                        <p>Price: ${p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
