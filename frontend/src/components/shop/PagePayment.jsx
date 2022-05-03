// react
import React, { useEffect,useState } from 'react';

// third-party
import { connect,useDispatch,useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Link, Redirect } from 'react-router-dom';
import { toast } from "react-toastify";


// application
import Collapse from '../shared/Collapse';
import Currency from '../shared/Currency';
import PageHeader from '../shared/PageHeader';
import { Check9x7Svg } from '../../svg';

// data stubs
import payments from '../../data/shopPayments';
import order from '../../data/accountOrderDetails';
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'
import governates from '../../data/governates'
import cities from '../../data/cities'


import {
    saveShippingAddress,
    saveUserShippingAddress,
    removeFromCart,
    emptyUserCart
} from '../../store/cart'

import {handleOnlinePayment} from '../../store/payment'

import {
    getUserDetails,
    addNewUserAddress,
    getAddressDetails,
    addUserAddressReset
} from '../../store/user'
import{createOrder} from '../../store/order'


function PagePayment ( props ) {

    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )
    
    
    const { cart,userInfo,addAddress,addressDetails,history } =props;
    const { cartItems } = cart;
    const userDetails=useSelector(state=>state.userDetails)
    const {user} = userDetails;

    const orderCreate = useSelector((state) => state.orderCreate);
    const { error, success, order } = orderCreate;
    
    // const payments =payments
    const breadcrumb = [
            { title: `${messages.home}`, url: '' },
            { title: `${messages.shoppingCart}`, url: '/shop/cart' },
            { title: `${messages.proceedToCheckout}`, url: '' },
        ];
        
    const [payment, setPayment] = useState( 'bank' );

    //ADDRESS STATES
    const [selectedAddress, setSelectedAddress] = useState( null )
    const[checkTerms,setCheckTerms]=useState(false)

    //calculate prices
    cart.itemPrices = cartItems ? ( cartItems.reduce( ( acc, item ) => acc + item.price * item.qty, 0 ) ):0;
    cart.shippingPrice = cart.itemPrices > 100 ? ( 60 * cartItems.length ) : 0;
    cart.totalPrice = Number( cart.itemPrices ) + Number( cart.shippingPrice );

    const dispatch = useDispatch();
    useEffect( () => {
        if ( !userInfo ) {
            return <Redirect to="/shop/cart"/>
        } else {
            if ( !user || !user.name ) {
                dispatch( getUserDetails( 'profile' ) );
            } 
        }
        if (cartItems && cartItems.length < 1) {
            return <Redirect to="/shop/cart" />;
        }
       
    }, [user, userInfo, dispatch,checkTerms] )
    
    //CREATE ORDER SUCCESS
    useEffect( () => {
        if ( success ) {
            history.push(`/shop/checkout/success/${order._id}`)
        }

        if ( error ) {
            toast.error(' خطأ أثناء إنشاء طلبك يرجى المحاوله مرة آخرى لاحقاً ',{theme:'colored'})
        }
    },[success])

    const handlePaymentChange = (event) => {
        if (event.target.checked) {
            setPayment({ payment: event.target.value });
        }
    };


    //handle Toggle term check
    const checkTermToggle = () => {
        setCheckTerms(!checkTerms)
    }

    //CREATE ORDER HANDLER
    const createOrderHandler = ( e ) => {
        e.preventDefault();
        if ( !selectedAddress || !addressDetails || !addressDetails.firstName ) {
            toast.error( 'قم بتحديد عنوان او أضف عنوان جديد', { theme: 'colored' } )
        } else {
            dispatch(
                createOrder( {
                    orderItems: cartItems,
                    shippingAddress: cart.shippingAddress,
                    phone: cart.shippingAddress.phoneNumber,
                    // paymentMethod: cart.paymentMethod.method,
                    itemsPrice: cart.itemPrices,
                    shippingPrice: cart.shippingPrice,
                    totalPrice: cart.totalPrice,
                } )
            );
        }
    };

    const renderTotals=()=> {
        return (
            <React.Fragment>
                <tbody className="checkout__totals-subtotals">
                    <tr>
                        <th>{ messages.subtotal}</th>
                        <td><Currency value={cart.itemPrices} /></td>
                    </tr>
                     <tr>
                        <th>{ messages.shipping}</th>
                        <td><Currency value={cart.shippingPrice} /></td>
                    </tr>
                </tbody>
            </React.Fragment>
        );
    }

    const renderCart=()=> {
        const items = cartItems && cartItems.map( ( item ) => (
            <tr key={item.id}>
                <td>{`${ item.name } × ${ item.qty }`}</td>
                <td><Currency value={( item.qty * item.price )} /></td>
            </tr>
        ) );

        return (
            <table className="checkout__totals">
                <thead className="checkout__totals-header">
                    <tr>
                        <th>{ messages.product}</th>
                        <th>{ messages.total}</th>
                    </tr>
                </thead>
                <tbody className="checkout__totals-products">
                    {items}
                </tbody>
                {renderTotals()}
                <tfoot className="checkout__totals-footer">
                    <tr>
                        <th>{ messages.total}</th>
                        <td><Currency value={cart.totalPrice} /></td>
                    </tr>
                </tfoot>
            </table>
        );
    }

    const directBankTransfer = ( { setItemRef, setContentRef } ) => (
        <li className="payment-methods__item" ref={setItemRef}>
            <label className="payment-methods__item-header">
                <span className="payment-methods__item-radio input-radio">
                    <span className="input-radio__body">
                        <input
                            type="radio"
                            className="input-radio__input"
                            name="checkout_payment_method"
                            value={payment.key}
                            // checked={currentPayment === payment.key}
                            onChange={handlePaymentChange}
                        />
                        <span className="input-radio__circle" />
                    </span>
                </span>
                <span className="payment-methods__item-title">{payment.title}</span>
            </label>
            <div className="payment-methods__item-container" style={{ height: 'auto' }} ref={setContentRef}>
                {payment.key === 'cash' && <div className="payment-methods__item-description text-muted">{payment.description}</div>}
                {payment.key === "opay" && <div className="payment-methods__item-description text-muted" style={{ backgroundColor: '#fff' }}>
                    <div className="form-row mt-4">
                        <div className="form-group col-md-12">
                            <label htmlFor="pay-name-on-card">Name On Card <span>*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                id="pay-name-on-card"
                            />
                        </div>
                        <div className="form-group col-md-12">
                            <label htmlFor="pay-card-number">Card Number <span>*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                id="pay-card-number"
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="pay-card-expiration">Expiration <span>*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                id="pay-card-expiration"
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="pay-card-cvv">CVV <span>*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                id="pay-card-cvv"
                            />
                        </div>
                                
                        <div className='form-group col-md-12'>
                            <button type="button" className="btn btn-block btn-success cart__update-button"
                                onClick={e => {
                                    e.preventDefault();
                                    alert('')
                                    dispatch(handleOnlinePayment())
                                }}
                            >
                                pay
                            </button>
                        </div>
                    </div>

                </div>
                }
            </div>
        </li>
    );

    
    // let paymentsMethods;
    const renderPaymentsList=()=> {
        const { payment: currentPayment } = payment

        const paymentsMethods =payments&& payments.map((payment) => {
            const renderPayment = ( { setItemRef, setContentRef } ) => (
                <li className="payment-methods__item" ref={setItemRef}>
                    <label className="payment-methods__item-header">
                        <span className="payment-methods__item-radio input-radio">
                            <span className="input-radio__body">
                                <input
                                    type="radio"
                                    className="input-radio__input"
                                    name="checkout_payment_method"
                                    value={payment.key}
                                    checked={currentPayment === payment.key}
                                    onChange={handlePaymentChange}
                                />
                                <span className="input-radio__circle" />
                            </span>
                        </span>
                        <span className="payment-methods__item-title">{payment.title}</span>
                    </label>
                    <div className="payment-methods__item-container" style={{ height: 'auto' }} ref={setContentRef}>
                        {payment.key === 'cash' && <div className="payment-methods__item-description text-muted">{payment.description}</div>}
                        {payment.key === "opay" && <div className="payment-methods__item-description text-muted" style={{ backgroundColor: '#fff' }}>
                            <div className="form-row mt-4">
                                <div className="form-group col-md-12">
                                    <label htmlFor="pay-name-on-card">Name On Card <span>*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="pay-name-on-card"
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="pay-card-number">Card Number <span>*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="pay-card-number"
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label htmlFor="pay-card-expiration">Expiration <span>*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="pay-card-expiration"
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label htmlFor="pay-card-cvv">CVV <span>*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="pay-card-cvv"
                                    />
                                </div>
                                
                                <div className='form-group col-md-12'>
                                    <button type="button" className="btn btn-block btn-success cart__update-button"
                                        onClick={e => {
                                    e.preventDefault();
                                    dispatch(handleOnlinePayment())
                                }}
                                    >
                                        pay
                                    </button>
                                </div>
                            </div>

                        </div>
                        }
                    </div>
                </li>
            );

            return (
                <Collapse
                    key={payment.key}
                    open={currentPayment === payment.key}
                    toggleClass="payment-methods__item--active"
                    render={renderPayment}
                />
            );
        });

        return (
            <div className="payment-methods">
                <ul className="payment-methods__list">
                    {paymentsMethods}
                </ul>
            </div>
        );
    }

    
    const addressList = () => {
        let addressMenu;
        ( user.address && user.address.length > 0 ) && (
            addressMenu =
            ( <div className="col-sm-12 col-md-12 col-lg-12 col-12 px-2 mb-3">
                      
                <div className="card address-card">
                    <div className="address-card__body">
                        <div className="address-card__name">
                            {`${ user.address[0].firstName } ${ user.address[0].lastName }`}
                        </div>
                        <div className="address-card__row m-1">
                            {user.address[0].governate}
                            <br />
                            {user.address[0].city}
                            <br />
                            {user.address[0].area}
                            ,
                            {user.address[0].address}
                        </div>
                        <div className="address-card__row m-1">
                            <div className="address-card__row-title">{messages.addressType}</div>
                            <div className="address-card__row-content">{user.address[0].type}</div>
                        </div>
                        <div className="address-card__row m-1">
                            <div className="address-card__row-title">{messages.phoneNumber}</div>
                            <div className="address-card__row-content">{user.address[0].phoneNumber}</div>
                        </div>
                        <div className="address-card__row m-1">
                            <div className="address-card__row-title">{messages.emailAddress}</div>
                            <div className="address-card__row-content">{user.email}</div>
                        </div>
                    </div>
                </div>
            </div>
            )
        );
        return addressMenu ? addressMenu : ''
    };

    const messageBlock = ( message,label ) => (
        <div className="col-12 mb-3">
            <div className={`alert alert-lg alert-${label}`}>
                {message}
            </div>
        </div>
    );

    const addAddressForm = (
        <div className="col-12 col-lg-6 col-xl-7">
            <div className="row mb-3 p-2">
                {/*Exist Address Start  */}
                { addressList()}
                {/* Exist Address End */}
            </div>
            <div className="card mb-lg-0">
                <div className="card-body">
                    <h3 className="card-title">حدد وسيلة الدفع</h3>
                    {/* addPaymentsHere */}
                                    {renderPaymentsList()}

                   
                </div>
                                
            </div>
        </div>
    );


    return (
        <React.Fragment>
            <Helmet>
                <title>{` ${ messages.proceedToCheckout}`}</title>
            </Helmet>

            <PageHeader header={messages.proceedToCheckout} breadcrumb={breadcrumb} />

            <div className="checkout block">
                <div className="container">
                    <div className="row">

                        {/* Add New Address Form Start */}
                        { addAddressForm}
                        
                        <div className="col-12 col-lg-6 col-xl-5 mt-4 mt-lg-0">
                            <div className="card mb-0">
                                <div className="card-body">
                                    <h3 className="card-title">{ messages.yourOrder}</h3>
                                    {renderCart()}
                                    {/* {renderPaymentsList()} */}
                                    <div className="checkout__agree form-group">
                                        <div className="form-check">
                                            <span className="form-check-input input-check">
                                                <span className="input-check__body">
                                                    <input className="input-check__input" type="checkbox" id="checkout-terms" checked={checkTerms?true:false} onClick={checkTermToggle} />
                                                    <span className="input-check__box" />
                                                    <Check9x7Svg className="input-check__icon" />
                                                </span>
                                            </span>
                                            <label className="form-check-label" htmlFor="checkout-terms">
                                                {messages.termsRead}
                                                {" "}
                                                <Link to="/site/terms" target="_blank">{ messages.termsAndCondition}</Link>
                                                *
                                            </label>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-xl btn-block "
                                        disabled={checkTerms?false:true}
                                        onClick={e=>createOrderHandler(e)}
                                    >{ messages.placeOrder}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

const mapStateToProps = ( state ) => {
    const userLogin = state.userLogin;
    const { userInfo } = userLogin;
    return {
        cart: userInfo ? state.userCart : state.cart,
        userInfo,
        userDetail: state.userDetails,
        addAddress: state.addAddress,
        addressDetails:state.addressDetails
    }
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PagePayment);
