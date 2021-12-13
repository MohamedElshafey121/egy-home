// react
import React,{useEffect,useState} from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import { Link,withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

//blocks
import BlockLoader from '../blocks/BlockLoader';

// data stubs
import allOrders from '../../data/accountOrders';
import theme from '../../data/theme';

import {
    getUserDetails
} from '../../store/user';
import {getMyOrders} from '../../store/order'



function AccountPageDashboard ({history}) {
    const userLogin = useSelector( ( state ) => state.userLogin );
    const { userInfo } = userLogin;

    const userDetails = useSelector( ( state ) => state.userDetails );
    const { loading, user, error } = userDetails;
    const { address: userAddresses } = user;

    const myOrderList  = useSelector( state => state.myOrderList );
    const { orders:allOrders, success, error:getOrdersError } = myOrderList;

    const dispatch = useDispatch();

    //Load UserDetails with Addresses
    useEffect( () => {
        if ( !user || !user.name ) {
            dispatch( getUserDetails( 'profile' ) );
        }
        
    }, [dispatch, history, userInfo, user] );

    //Load user Orders
    useEffect( () => {
        if ( !userInfo ) {
            history.push( '/login' )
        } else {
            if ( !allOrders || ( !success && !error ) ) {
                dispatch( getMyOrders() )
            }
        }
    }, [dispatch, history, userInfo, allOrders, success, getOrdersError] )

    


    const address =(userAddresses) && userAddresses.find( ( address ) => address.default );

    // const address=addresses[0]
    if ( address ) {
        console.log( 'address => ',address );
    }
    const orders =allOrders&& allOrders.slice(0, 3).map((order) => (
        <tr key={order._id}>
            <td>
                <Link to="/account/orders/5">
                    #
                    {order._id}
                </Link>
            </td>
            <td>{new Date(order.createdAt).toDateString()}</td>
            <td>{order.isPaid ?'Paid' :'On hold'}</td>
            <td>{order.totalPrice}</td>
        </tr>
    ) );
    
    if ( loading ) {
        return <BlockLoader/>
    }

    return (
        <div className="dashboard">
            <Helmet>
                <title>{`My Account — ${theme.name}`}</title>
            </Helmet>

            {user&& (<div className="dashboard__profile card profile-card">
                <div className="card-body profile-card__body">
                    <div className="profile-card__avatar">
                        <img src="images/avatars/avatar-3.jpg" alt="" />
                    </div>
                    <div className="profile-card__name">{ user.name}</div>
                    <div className="profile-card__email">{ user.email}</div>
                    <div className="profile-card__edit">
                        <Link to="profile" className="btn btn-secondary btn-sm">Edit Profile</Link>
                    </div>
                </div>
            </div> )}
            
            {address && (
                <div className="dashboard__address card address-card address-card--featured">
                {address.default && <div className="address-card__badge">Default Address</div>}
                <div className="address-card__body">
                    <div className="address-card__name">{`${address.firstName} ${address.lastName}`}</div>
                    <div className="address-card__row">
                        {address.governate}
                        <br />
                        {address.city}
                        <br />
                        {address.area}
                        ,
                        {address.address}
                    </div>
                    <div className="address-card__row">
                        <div className="address-card__row-title">Phone Number</div>
                        <div className="address-card__row-content">{address.phoneNumber}</div>
                    </div>
                    <div className="address-card__row">
                        <div className="address-card__row-title">Email Address</div>
                        <div className="address-card__row-content">{user.email}</div>
                    </div>
                    <div className="address-card__footer">
                        <Link to={`/account/addresses/${address._id}`}>Edit Address</Link>
                    </div>
                </div>
            </div>
            
            )}
            <div className="dashboard__orders card">
                <div className="card-header">
                    <h5>Recent Orders</h5>
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
                                {orders}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withRouter(AccountPageDashboard)