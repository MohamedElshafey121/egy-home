// react
import React, { useEffect,useState } from 'react';

// third-party
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {useSelector,useDispatch} from 'react-redux'

// application
import Pagination from '../shared/Pagination';

// data stubs
import dataOrders from '../../data/accountOrders';
import theme from '../../data/theme';
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'

import {getMyOrders} from '../../store/order'


export default function AccountPageOrders (){
    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )

    const myOrderList  = useSelector( state => state.myOrderList );
    const { orders, success, error } = myOrderList;

    const [page, setPage] = useState( 1 );
    const limit = 5;
    const [orderList,setOrderList]=useState(orders&&orders.length?orders:[])
    
    const dispatch = useDispatch();
    useEffect( () => {
        if ( !orders || ( !success && !error ) ) {
            dispatch( getMyOrders() )
        }
    }, [dispatch, orders, success, error,page] );



    const handlePageChange = (page) => {
        setPage(page);
    };

        // const { page, orders } = this.state;

    const ordersList =  orders&&orders.slice((page-1)*limit, page*limit).map( ( order ) => (
        <tr key={order._id}>
            <td><Link to={`/account/orders/${order._id}`}>{`#${ order._id }`}</Link></td>
            <td>{new Date(order.createdAt).toDateString()}</td>
            {/* <td>{order.status}</td> */}
            <td>{order.isPaid ? 'Paid' : 'On hold'}</td>
            <td>{order.totalPrice}</td>
        </tr>
    ) );

    return (
        <div className="card">
            <Helmet>
                <title>{`${ messages.orderHistory }`}</title>
            </Helmet>

            <div className="card-header">
                <h5>{ messages.orderHistory}</h5>
            </div>
            <div className="card-divider" />
            <div className="card-table">
                <div className="table-responsive-sm">
                    <table>
                        <thead>
                            <tr>
                                <th>{ messages.orderNumber}</th>
                                <th>{ messages.createdAt_order}</th>
                                <th>{ messages.orderStatus}</th>
                                <th>{ messages.total}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordersList}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="card-divider" />
            <div className="card-footer">
                {orders&&<Pagination current={page} total={Math.ceil(orders.length/limit)} onPageChange={handlePageChange} />}
            </div>
        </div>
    );
};

