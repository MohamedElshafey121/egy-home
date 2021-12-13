// react
import React,{useEffect} from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux'

// data stubs
import theme from '../../data/theme';

import {
    getOrder
} from '../../store/order'


export default function AccountPageOrderDetails ( { match } ) {
    const orderId = match.params.orderId;

    const order = useSelector( state => state.order );
    const { order: userOrder, loading } = order;
    
    const cart = useSelector( ( state ) => state.cart );
    const {  paymentMethod } = cart;
    

    const userLogin = useSelector( ( state ) => state.userLogin );
    const { userInfo } = userLogin;
    
    const dispatch = useDispatch();
    useEffect( () => {
        if ( userOrder && userOrder._id ) {
            if ( userOrder._id !== orderId ) {
                dispatch( getOrder( orderId ) )
            }
            // else {
            //     const shippingAddressFromLocalStorage = JSON.parse( localStorage.getItem( 'shippingAddress' ) );
            //     const paymentMethodFromLocalStorage = JSON.parse( localStorage.getItem( 'paymentMethod' ) );
            //     if ( shippingAddressFromLocalStorage ) {
            //         localStorage.removeItem( 'shippingAddress' );
            //     }
            //     if ( paymentMethodFromLocalStorage ) {
            //         localStorage.removeItem('paymentMethod')
            //     }
            // }
        } else {
            dispatch( getOrder( orderId ) )
        }

        // if ( paymentMethod ) {
        //     //reset cart
        //     dispatch({type:RESET_CART})
        // }
            
        
    }, [dispatch, userInfo, userOrder] );

    
    const content = (userOrder&& userOrder.orderItems) &&  userOrder.orderItems.map( ( item ) => (
        <tr key={item._id}>
            <td>{item.name} × { item.qty}</td>
            <td>EGP {item.qty * item.price} </td>
        </tr>
    ) );
    
    return (
        <React.Fragment>
            <Helmet>
                <title>{`Order Details — ${ theme.name }`}</title>
            </Helmet>

            <div className="card">
                <div className="order-header">
                    <div className="order-header__actions">
                        <Link to="/account/orders" className="btn btn-xs btn-secondary">Back to list</Link>
                    </div>
                    <h5 className="order-header__title">Order #{ userOrder&& userOrder._id}</h5>
                    <div className="order-header__subtitle">
                        Was placed on
                        {' '}
                        <mark className="order-header__date">{userOrder&&(new Date(userOrder.createdAt).toDateString())}</mark>
                        {' '}
                        and is currently
                        {' '}
                        <mark className="order-header__status">On hold</mark>
                        .
                    </div>
                </div>
                <div className="card-divider" />
                <div className="card-table">
                    <div className="table-responsive-sm">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody className="card-table__body card-table__body--merge-rows">
                                {content}
                            </tbody>
                            <tbody className="card-table__body card-table__body--merge-rows">
                                <tr>
                                    <th>Subtotal</th>
                                    <td>EGP {userOrder&& userOrder.itemsPrice}</td>
                                </tr>
                                <tr>
                                    <th>Shipping </th>
                                    <td>EGP {userOrder&& userOrder.shippingPrice}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>Total</th>
                                    <td>EGP {userOrder && userOrder.totalPrice}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            <div className="row mt-3 no-gutters mx-n2">
                {
                    userOrder&&userOrder.shippingAddress && (
                        <div className="col-sm-6 col-12 px-2">
                            <div className="card address-card address-card--featured">
                                <div className="address-card__body">
                                    <div className="address-card__badge address-card__badge--muted">Shipping Address</div>
                                    <div className="address-card__name">{`${ userOrder.shippingAddress.firstName } ${ userOrder.shippingAddress.lastName }`}</div>
                                    <div className="address-card__row">
                                        {userOrder.shippingAddress.governate}
                                        <br />
                                        {userOrder.shippingAddress.city}
                                        <br />
                                        {userOrder.shippingAddress.area}
                                        ,
                                        {userOrder.shippingAddress.address}
                                    </div>
                                    <div className="address-card__row">
                                        <div className="address-card__row-title">Phone Number</div>
                                        <div className="address-card__row-content">{userOrder&& userOrder.phone}</div>
                                    </div>
                                    <div className="address-card__row">
                                        <div className="address-card__row-title">Email Address</div>
                                        <div className="address-card__row-content">{ userInfo.email}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                
                    )
                }
                {/* <div className="col-sm-6 col-12 px-2 mt-sm-0 mt-3">
                    <div className="card address-card address-card--featured">
                        <div className="address-card__body">
                            <div className="address-card__badge address-card__badge--muted">Billing Address</div>
                            <div className="address-card__name">Helena Garcia</div>
                            <div className="address-card__row">
                                Random Federation
                                <br />
                                115302, Moscow
                                <br />
                                ul. Varshavskaya, 15-2-178
                            </div>
                            <div className="address-card__row">
                                <div className="address-card__row-title">Phone Number</div>
                                <div className="address-card__row-content">38 972 588-42-36</div>
                            </div>
                            <div className="address-card__row">
                                <div className="address-card__row-title">Email Address</div>
                                <div className="address-card__row-content">stroyka@example.com</div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </React.Fragment>
    );
}
