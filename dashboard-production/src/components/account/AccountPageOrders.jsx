// react
import React, { useEffect,useState } from 'react';

// third-party
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// application
import Pagination from '../shared/Pagination';

// data stubs
import dataOrders from '../../data/accountOrders';
import theme from '../../data/theme';
import {useSelector,useDispatch} from 'react-redux'

import {getMyOrders} from '../../store/order'


export default function AccountPageOrders (){
    // constructor(props) {
    //     super(props);

    //     this.state = {
    //         orders: dataOrders,
    //         page: 1,
    //     };
    // }
    const page = 1;

    const myOrderList  = useSelector( state => state.myOrderList );
    const { orders, success, error } = myOrderList;
    
    const dispatch = useDispatch();
    useEffect( () => {
        if ( !orders || ( !success && !error ) ) {
            dispatch( getMyOrders() )
        }
    }, [dispatch, orders, success, error] );


    const handlePageChange = (page) => {
        this.setState(() => ({ page }));
    };

        // const { page, orders } = this.state;

    const ordersList = orders && orders.map( ( order ) => (
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
                <title>{`Order History — ${ theme.name }`}</title>
            </Helmet>

            <div className="card-header">
                <h5>Order History</h5>
            </div>
            <div className="card-divider" />
            <div className="card-table">
                <div className="table-responsive-sm">
                    <table>
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Total</th>
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
                <Pagination current={page} total={3} onPageChange={handlePageChange} />
            </div>
        </div>
    );
};

