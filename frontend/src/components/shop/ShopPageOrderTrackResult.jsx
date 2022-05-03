// react
import React,{useEffect,useState} from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import {toast} from 'react-toastify'

// application
import Currency from '../shared/Currency';
import { Check100Svg } from '../../svg';
import { getOrder, cancelOrder,resetCheckTrack } from "../../store/order";
import BlockLoader from '../blocks/BlockLoader';


// data stubs
import orderDummy from '../../data/accountOrderDetails';
import theme from '../../data/theme';
import { url } from '../../services/utils';
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'

export default function ShopPageOrderTrackResult ( { history, match } ) {
    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )

    const orderId = match.params.id;
    const order = useSelector((state) => state.order);
    const { order: userOrder, loading, error } = order;
    
    const checkTrackOrder = useSelector((state) => state.checkTrackOrder);
    const {  success:trackSuccess } = checkTrackOrder;


    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userCart = useSelector((state) => state.userCart);
  const { paymentMethod } = userCart;
    
  const dispatch = useDispatch();
 useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }

    if (userOrder && userOrder._id) {
      if (userOrder._id !== orderId) {
        dispatch(getOrder(orderId));
      } else {
        const shippingAddressFromLocalStorage = JSON.parse(
          localStorage.getItem("shippingAddress")
        );
        const paymentMethodFromLocalStorage = JSON.parse(
          localStorage.getItem("paymentMethod")
        );
        if (shippingAddressFromLocalStorage) {
          localStorage.removeItem("shippingAddress");
        }
        if (paymentMethodFromLocalStorage) {
          localStorage.removeItem("paymentMethod");
        }
        }
        
    } else {
      dispatch(getOrder(orderId));
     }
     
     if ( error ) {
         history.push('/')
     }
     

    if (paymentMethod) {
      //reset cart
    //   dispatch({ type: RESET_CART });
    }
 }, [dispatch, history, userInfo, userOrder, paymentMethod, error] );
    
    useEffect( () => {
        if ( trackSuccess ) {
            dispatch(resetCheckTrack())
        }
    },[])
    
    const items = (userOrder && userOrder.orderItems.map((item) => {

        return (
            <tr>
                <td className="order-list__column-image">
                    <div className="product-image">
                        <Link to={`/shop/products/${item.product}`} className="product-image__body">
                            <img className="product-image__img" src={ `/uploads/imgs/products/${item.photo}`} alt="" />
                        </Link>
                    </div>
                </td>
                <td className="order-list__column-product">
                    <Link to={url.product(item)}>{item.name}</Link>
                </td>
                <td className="order-list__column-quantity" data-title="Qty:">{item.qty}</td>
                <td className="order-list__column-total"><Currency value={(item.price * item.qty)} /></td>
            </tr>
        );
    }));

    const headerOrderPage = ( userOrder && (
        <div className="order-success__meta">
            <ul className="order-success__meta-list">
                <li className="order-success__meta-item">
                    <span className="order-success__meta-title">{ messages.orderNumber} :</span>
                    <span className="order-success__meta-value">{`${ userOrder._id }`}</span>
                </li>
                <li className="order-success__meta-item">
                    <span className="order-success__meta-title">{messages.createdAt_order} :</span>
                    <span className="order-success__meta-value">{new Date(userOrder.createdAt).toDateString()}</span>
                </li>
                <li className="order-success__meta-item">
                    <span className="order-success__meta-title">{messages.total} :</span>
                    <span className="order-success__meta-value"><Currency value={userOrder.totalPrice} /></span>
                </li>
                <li className="order-success__meta-item">
                    <span className="order-success__meta-title">{ messages.paymentMethod} :</span>
                    <span className="order-success__meta-value">{userOrder.paymentMethod}</span>
                </li>
            </ul>
        </div> )
    );

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
    

    if ( loading ) {
        return <BlockLoader/>
    }

    return (
        <div className="block order-success">
            <Helmet>
                <title>{messages.trackOrder}</title>
                <meta name="description" content="يمكنك تتبع حالة طلبك لمعرفة التطور فى عمليه الشحن فقط من خلال الرقم التعريفى بالطلب" />
            </Helmet>

            <div className="container">
                <div className="order-success__body">
                    <div className="order-success__header">
                        <Check100Svg className="order-success__icon" />
                        <h1 className="order-success__title">{userOrder&& orderStatus(userOrder.status.trim())} </h1>
                        <div className="order-success__subtitle">{userOrder && orderStatusMsg(userOrder.status.trim())} </div>
                        <div className="order-success__actions">
                            <Link to="/" className="btn btn-xs btn-secondary">{ messages.goToHome}</Link>
                        </div>
                    </div>

                    {headerOrderPage}
                    
                    <div className="card">
                        <div className="order-list">
                            <table>
                                <thead className="order-list__header">
                                    <tr>
                                        <th className="order-list__column-label" colSpan="2">{ messages.product}</th>
                                        <th className="order-list__column-quantity">{ messages.quantity}</th>
                                        <th className="order-list__column-total">{messages.total}</th>
                                    </tr>
                                </thead>
                                <tbody className="order-list__products">
                                    {items}
                                </tbody>
                                {userOrder && (
                                    <>
                                    <tbody className="order-list__subtotals">
                                        <tr>
                                                <th className="order-list__column-label" colSpan="3">{ messages.subtotal}</th>
                                            <td className="order-list__column-total"><Currency value={userOrder.itemsPrice} /></td>
                                        </tr>
                                        <tr>
            <th className="order-list__column-label" colSpan="3">{messages.shipping}</th>
            <td className="order-list__column-total"><Currency value={userOrder.shippingPrice} /></td>
        </tr>
                                    </tbody>
                                    <tfoot className="order-list__footer">
                                    <tr>
                                        <th className="order-list__column-label" colSpan="3">{messages.total}</th>
                                        <td className="order-list__column-total"><Currency value={userOrder.totalPrice} /></td>
                                    </tr>
                                        </tfoot>
                                        </>
                                )}
                                
                            </table>
                        </div>
                    </div>

                    <div className="row mt-3 no-gutters mx-n2">
                        {(userOrder&& userOrder.shippingAddress) && (
                            <div className="col-sm-12 col-12 px-2">
                            <div className="card address-card">
                                <div className="address-card__body">
                                    <div className="address-card__badge address-card__badge--muted">
                                        {messages.shippingAddress}
                                    </div>
                                    <div className="address-card__name">
                                        {`${userOrder.shippingAddress.firstName} ${userOrder.shippingAddress.lastName}`}
                                    </div>
                                    <div className="address-card__row">
                                        {userOrder.shippingAddress.governate}
                                        <br />
                                        {`${userOrder.shippingAddress.city}, ${userOrder.shippingAddress.area}`}
                                        <br />
                                        {userOrder.shippingAddress.address}
                                    </div>
                                    <div className="address-card__row">
                                        <div className="address-card__row-title">{messages.addressType}</div>
                                        <div className="address-card__row-content">{userOrder.shippingAddress.type}</div>
                                        </div>
                                        <div className="address-card__row">
                                        <div className="address-card__row-title">{messages.phoneNumber}</div>
                                        <div className="address-card__row-content">{userOrder.phone}</div>
                                    </div>
                                    <div className="address-card__row">
                                        <div className="address-card__row-title">{messages.emailAddress}</div>
                                        <div className="address-card__row-content">{userInfo.email}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
