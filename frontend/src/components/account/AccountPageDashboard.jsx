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
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'

import {
    getUserDetails
} from '../../store/user';
import {getMyOrders} from '../../store/order'



function AccountPageDashboard ( { history } ) {
     const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )

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
                <title>{`${messages.myAccount}`}</title>
            </Helmet>

            {user&& (<div className="dashboard__profile card profile-card">
                <div className="card-body profile-card__body">
                    <div className="profile-card__avatar">
                        <img src="/uploads/imgs/users/user_avatar.png" alt="" />
                    </div>
                    <div className="profile-card__name">{ user.name}</div>
                    <div className="profile-card__email">{ user.email}</div>
                    <div className="profile-card__edit">
                        <Link to="profile" className="btn btn-secondary btn-sm">{ messages.editProfile}</Link>
                    </div>
                </div>
            </div> )}
            
            {address && (
                <div className="dashboard__address card address-card address-card--featured">
                    {address.default && <div className="address-card__badge">{ messages.defaultAddress}</div>}
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
                            <div className="address-card__row-title">{ messages.phoneNumber}</div>
                        <div className="address-card__row-content">{address.phoneNumber}</div>
                    </div>
                    <div className="address-card__row">
                            <div className="address-card__row-title">{ messages.emailAddress}</div>
                        <div className="address-card__row-content">{user.email}</div>
                    </div>
                    <div className="address-card__footer">
                            <Link to={`/account/addresses/${ address._id }`}>{ messages.edit}</Link>
                    </div>
                </div>
            </div>
            
            )}
            <div className="dashboard__orders card">
                <div className="card-header">
                    <h5>{ messages.recentOrders}</h5>
                </div>
                <div className="card-divider" />
                <div className="card-table">
                    <div className="table-responsive-sm">
                        <table>
                            <thead>
                                <tr>
                                    <th>{messages.orderNumber}</th>
                                    <th>{messages.createdAt_order}</th>
                                    <th>{ messages.orderStatus}</th>
                                    <th>{ messages.total}</th>
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