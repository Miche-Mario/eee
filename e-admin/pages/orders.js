import Layout from "@/components/layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdePage() {
    const [orders, setOrders] = useState([])
    useEffect(() => {
        axios.get('/api/orders').then(res => {
            setOrders(res.data) 
        })
    }, [])
    return (
        <Layout>
            <h1>Orders</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Paid</th>
                        <th>Receipient</th>
                        <th>Products</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orders.map((order) => (
                            <tr>
                                <td>{order.createdAt.replace('T', ' ').substring(0, 19)}</td>
                                <td className={order.paid? 'text-green-600' : 'text-red-500'}>{order.paid ? 'YES' : 'NO'}</td>
                                <td>
                                    {order.name} {order.email} <br/> 
                                    {order.city} {order.postalCode} {order.country}<br/>
                                    {order.streetAdress}
                                </td>
                                <td>
                                    {
                                        order.line_items.map(l => (
                                            <>
                                                {l.price_data?.product_data?.name} x {l?.quantity}<br/>
                                            </>
                                        ))
                                    }
                                </td>

                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </Layout>
    )
}