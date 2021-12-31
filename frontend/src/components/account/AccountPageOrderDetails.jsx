// react
import React,{useEffect,useState} from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux'

// data stubs
import theme from '../../data/theme';
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'

import Currency from '../shared/Currency';


import {
    getOrder,
    cancelOrderHandler
} from '../../store/order'


export default function AccountPageOrderDetails ( { match } ) {
    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )
    const orderId = match.params.orderId;

    const order = useSelector( state => state.order );
    const { order: userOrder, loading } = order;
    
    const cart = useSelector( ( state ) => state.cart );
    const {  paymentMethod } = cart;
    

    const userLogin = useSelector( ( state ) => state.userLogin );
    const { userInfo } = userLogin;

    const cancelOrder = useSelector( state => state.cancelOrder );
    const { loading:loadingCancelOrder, success:cancelOrderSuccess, error } = cancelOrder;
    
    const dispatch = useDispatch();
    useEffect( () => {
        if ( userOrder && userOrder._id ) {
            if ( userOrder._id !== orderId ) {
                dispatch( getOrder( orderId ) )
            }
           
        } else {
            dispatch( getOrder( orderId ) )
        }

      
    }, [dispatch, userInfo, userOrder] );

    const cancelHandler = ( e ) => {
        e.preventDefault();
        dispatch(cancelOrderHandler(orderId))
    }

    
    const content = (userOrder&& userOrder.orderItems) &&  userOrder.orderItems.map( ( item ) => (
        <tr key={item._id}>
            <td>{item.name} × { item.qty}</td>
            <td><Currency value={item.qty * item.price}/> </td>
        </tr>
    ) );

    const orderStatus = ( status ) => {
        return {
            ordered: messages.orderUnderReview,
            onhold: messages.orderOnWay,
            canceled: messages.orderCanceled,
            refused: messages.orderRefused,
            completed:messages.orderCompelete
        }[status]
    }

    const orderStatusMsg = ( status ) => {
        return {
            ordered:messages.orderUnderReviewMsg,
            onhold: messages.orderOnWayMsg,
            canceled: messages.orderCanceledMsg,
            refused: messages.orderRefusedMsg,
            completed:messages.orderCompeleteMsg
        }[status]
    }
    
    return (
        <React.Fragment>
            <Helmet>
                <title>{messages.orderDetails}</title>
            </Helmet>

            <div className="card">
                <div className="order-header">
                    <div className="order-header__actions">
                        {( userOrder && userOrder.status === 'ordered' ) && <button
                            className="btn btn-xs btn-danger ml-2"
                            onClick={(e)=>cancelHandler(e)}
                        >{messages.cancelOrder}</button>}
                        <Link to="/account/orders" className="btn btn-xs btn-secondary">{messages.backToOrderList}</Link>
                    </div>
                    <h5 className="order-header__title">{messages.orderNumber}: { userOrder&& userOrder._id}</h5>
                    <div className="order-header__subtitle">
                        {messages.wasPlacedOn}
                        {' '}
                        <mark className="order-header__date">{userOrder&&(new Date(userOrder.createdAt).toDateString())}</mark>
                        <br />
                        
                        <mark className="order-header__status">{userOrder && orderStatusMsg(userOrder.status.trim())}</mark>
                        .
                    </div>
                    <div className="order-header__subtitle ">
                        {messages.cancelOrderInstructions}
                    </div>
                </div>
                
                {userOrder && (
                    <React.Fragment>
                        <div className="card-divider" />
                        <div className="card-table">
                    <div className="table-responsive-sm">
                        <table>
                            <thead>
                                <tr>
                                    <th>{messages.product}</th>
                                    <th>{messages.total}</th>
                                </tr>
                            </thead>
                            <tbody className="card-table__body card-table__body--merge-rows">
                                {content}
                            </tbody>
                            <tbody className="card-table__body card-table__body--merge-rows">
                                <tr>
                                    <th>{messages.subtotal}</th>
                                    <td> <Currency value={userOrder.itemsPrice}/></td>
                                </tr>
                                <tr>
                                    <th>{messages.shipping} </th>
                                    <td><Currency value={userOrder.shippingPrice}/></td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>{messages.total}</th>
                                    <td><Currency value={userOrder.totalPrice}/></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            
                    </React.Fragment>
                )}
                </div>

            <div className="row mt-3 no-gutters mx-n2">
                {
                    userOrder&&userOrder.shippingAddress && (
                        <div className="col-sm-6 col-12 px-2">
                            <div className="card address-card address-card--featured">
                                <div className="address-card__body">
                                    <div className="address-card__badge address-card__badge--muted">{messages.shippingAddress}</div>
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
                                        <div className="address-card__row-title">{messages.phoneNumber}</div>
                                        <div className="address-card__row-content">{userOrder&& userOrder.phone}</div>
                                    </div>
                                    <div className="address-card__row">
                                        <div className="address-card__row-title">{messages.emailAddress}</div>
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
