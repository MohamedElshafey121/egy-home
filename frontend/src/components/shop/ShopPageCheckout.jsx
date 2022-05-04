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

import classNames from 'classnames';



function ShopPageCheckout ( props ) {

    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )
    
    
    const { cart,userInfo,addAddress,addressDetails,history } =props;
    const { cartItems } = cart;
    const userDetails=useSelector(state=>state.userDetails)
    const {user} = userDetails;
    const { success: addAddressSuccess, error: addAddressError } = addAddress;
    const { address: addressDetail } = addressDetails;

    const orderCreate = useSelector((state) => state.orderCreate);
    const { error, success, order } = orderCreate;
    
    // const payments =payments
    const breadcrumb = [
            { title: `${messages.home}`, url: '' },
            { title: `${messages.shoppingCart}`, url: '/shop/cart' },
            { title: `${messages.proceedToCheckout}`, url: '' },
        ];
        
    const [payment, setPayment] = useState('');

    //ADDRESS STATES
    const [firstName, setFirstName] = useState( (userInfo&& userInfo.name)?userInfo.name:'' )
    const [lastName, setLastName] = useState( '')
    const [governate, setGovernate] = useState('' )
    const [city, setCity] = useState(  '')
    const [area, setArea] = useState(  '')
    const [address, setAddress] = useState( '' )//العنوان بالتفصيل او الشارع
    const [type, setAddressType] = useState(  '')
    const [phone, setPhone] = useState(  '')
    const [orderNotes, setOrderNotes] = useState( '' )
    const [email,setEmail]=useState(userInfo ?userInfo.email:'')
    const [addNewAddress, setAddNewAddress] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState( null )
    const[checkTerms,setCheckTerms]=useState(false)

    //calculate prices
    cart.itemPrices = cartItems ? ( cartItems.reduce( ( acc, item ) => acc + item.price * item.qty, 0 ) ):0;
    cart.shippingPrice = cart.itemPrices > 100 ? ( 50 * cartItems.length ) : 0;
    cart.totalPrice = Number( cart.itemPrices ) + Number( cart.shippingPrice );

    const dispatch = useDispatch();
    useEffect( () => {
        if ( !userInfo ) {
            localStorage.setItem("redirect","/shop/checkout")
            history.push("/account/login")
        } else {
            if ( !user || !user.name ) {
                dispatch( getUserDetails( 'profile' ) );
            } 
        }
        if (cartItems && cartItems.length < 1) {
            return <Redirect to="/shop/cart" />;
        }
       
    }, [user, userInfo, dispatch,checkTerms] )
    
    //Add Address actions
    useEffect( () => {
        if ( addAddressSuccess ) {
            toast.success( 'تم اضافة العنوان بنجاح', { theme: 'colored' } );
            dispatch( getUserDetails( "profile" ) );
            dispatch( addUserAddressReset() );
            setAddNewAddress(false)
        }
    }, [addAddressSuccess, dispatch] );
    
    //get address details to save to DB
    useEffect( () => {
        if (addressDetail && addressDetail.firstName) {
      dispatch(saveUserShippingAddress(addressDetail));
    }
    }, [selectedAddress, addressDetail] )
    
    //CREATE ORDER SUCCESS
    useEffect( () => {
        if ( success && order.paymentMethod === "cash" ) {
            history.push( `/shop/checkout/success/${ order._id }` )
        }

        if ( success && order.paymentMethod === "bank" ) {
            console.log( "...order.orderItems ", order.orderItems )
            const formdata = {
                amount: {
                    currency: "EGP",
                    total: order.totalPrice * 100,
                },
                callbackUrl: "http://egy-home.com/payment/redirectPayment",//localhost:5000
                cancelUrl: "http://egy-home.com/your-cacel-url",//127.0.0.1:3000
                country: "EG",
                expireAt: 300,
                payMethod: "BankCard",
                productList: [
                    {
                        description: "productList description",
                        imageUrl: "https://imageUrl.com",
                        name: "name",
                        price: 100,
                        productId: "610168b22639f50adc658c00",
                        quantity: 2,
                    }
                ],
                reference: order._id,
                returnUrl: `http://egy-home.com/shop/checkout/success/${ order._id }`,//localhost:3000
                userInfo: {
                    userEmail: user.email,
                    userId: user._id,
                    userMobile: order.phone,
                    userName: user.name,
                },
            }

            dispatch( handleOnlinePayment( formdata ) );
        }

        if ( error ) {
            toast.error( ' خطأ أثناء إنشاء طلبك يرجى المحاوله مرة آخرى لاحقاً ', { theme: 'colored' } )
        }
    }, [success] );

    const handlePaymentChange = ( event ) => {
        if (event.target.checked) {
            setPayment({ payment: event.target.value });
        }
    };

    //HANDLERS
    const AddNewAddressHandler = (e) => {
        e.preventDefault();
         let governateName = governates.find( gov => {
            if ( gov.id === governate ) return gov;
        } ).governorate_name_ar
        
        let cityName = cities.find( cit => {
            if ( cit.id === city ) return cit;
        } ).city_name_ar;
    dispatch(
      addNewUserAddress({
        firstName,
        lastName,
        governate:governateName,
        city:cityName,
        area,
        address,
        type,
        email,
        phoneNumber: phone,
        orderNotes,
      })
    );
    };

    //select address =>get dtailed data
    const handleSelectAddress = (e) => {
        setSelectedAddress( e.target.value );
        dispatch(getAddressDetails(e.target.value));
    }

    //handle Toggle term check
    const checkTermToggle = () => {
        setCheckTerms(!checkTerms)
    }

    //CREATE ORDER HANDLER
    const createOrderHandler = ( e ) => {
        e.preventDefault();
        if ( !selectedAddress || !addressDetail || !addressDetail.firstName ) {
            toast.error( 'قم بتحديد عنوان او أضف عنوان جديد', { theme: 'colored' } )
        } else if (!payment||!payment.payment) {
            toast.error( 'يجب تحديد وسيلة الدفع', { theme: 'colored' } )
        } else {
            
            dispatch(
                createOrder( {
                    orderItems: cartItems,
                    shippingAddress: cart.shippingAddress,
                    phone: cart.shippingAddress.phoneNumber,
                    paymentMethod: payment.payment,
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
                        <span className="payment-methods__item-title">{locale==='ar'? payment.title_ar:payment.title}</span>
                    </label>
                    <div className="payment-methods__item-container" style={{ height: 'auto' }} ref={setContentRef}>
                        <div className="payment-methods__item-description text-muted">{locale==='ar'? payment.description_ar:payment.description}</div>
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
                    {!payment&&<span className="text-danger"> يجب تحديد وسيلة الدفع قبل إكمال الطلب*</span>}
                    
                </ul>
            </div>
        );
    }

    
    const addressList = () => {
        let addressMenu;
        ( user.address && user.address.length > 0 ) && (
            addressMenu = user.address.map( ( item,idx ) => {
                return (
                    <div className="col-sm-12 col-md-12 col-lg-12 col-12 px-2 mb-3">
                                        
                        <input id={`address_${ item._id }`}
                            type="radio" name="shippingAddress"
                            onChange={e=>handleSelectAddress(e)}
                            value={item._id}
                            style={{ marginLeft: '10px', maxWidth: '10%', display: 'block', float: 'right' }}
                        ></input>
                        <label htmlFor={`address_${item._id}`} style={{ width: '90%' }}>
                            <div className="card address-card">
                                <div className="address-card__body">
                                    {item.default && (
                                        <div className="address-card__badge address-card__badge--muted">
                                        {messages.defaultAddress}
                                    </div>
                                    )}
                                    
                                    <div className="address-card__name m-0">
                                        {`${ item.firstName } ${ item.lastName }`}
                                    </div>
                                    <div className="address-card__row mt-2">
                                        {item.governate} &nbsp;,&nbsp;
                        {/* <br /> */}
                        {item.city} &nbsp;,&nbsp;
                        {/* <br /> */}
                        {item.area}
                        ,
                        {item.address}
                                    </div>
                                    <div className="address-card__row mt-1">
                                        <div className="address-card__row-title">{ messages.addressType}</div>
                                        <div className="address-card__row-content">{item.type}</div>
                                    </div>
                                    <div className="address-card__row mt-1">
                                        <div className="address-card__row-title">{ messages.phoneNumber}</div>
                                        <div className="address-card__row-content">{item.phoneNumber}</div>
                                    </div>
                                    <div className="address-card__row mt-1">
                                        <div className="address-card__row-title">{ messages.emailAddress}</div>
                                        <div className="address-card__row-content">{user.email}</div>
                                    </div>
                                </div>
                            </div>
                        
                        </label>
                    </div>
     
                )
            } )
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

    const addNewAddressForm = ( <div className="card mb-lg-0">
        <div className="card-body">
            <h3 className="card-title">{messages.addNewAddress}</h3>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label htmlFor="checkout-first-name">{messages.firstName}</label>
                    <input
                        type="text"
                        className="form-control"
                        id="checkout-first-name"
                        placeholder={messages.firstName}
                        value={firstName}
                        onChange={( e ) => setFirstName( e.target.value )}
                    />
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="checkout-last-name">{messages.lastName}</label>
                    <input
                        type="text"
                        className="form-control"
                        id="checkout-last-name"
                        placeholder={messages.lastName}
                        value={lastName}
                        onChange={( e ) => setLastName( e.target.value )}
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="checkout-governate_name"> {messages.governate}</label>
                <select id="checkout-governate_name" className="form-control"
                    value={governate}
                    onChange={( e ) => setGovernate( e.target.value )}
                >
                    {!governate && <option  >--</option>}
                    {governates && governates.map( gov => (
                        <option value={gov.id}>{locale === 'ar' ? gov.governorate_name_ar : gov.governorate_name_en}</option>
                    ) )}
                </select>
            </div>


            {governate && <div className="form-group">
                <label htmlFor="checkout-city"> {messages.city}</label>
                <select id="checkout-city" className="form-control"
                    value={city}
                    onChange={( e ) => setCity( e.target.value )}
                >
                    {!city && <option  >--</option>}
                    {cities && cities.map( city => {
                        return ( city.governorate_id === governate ) ? <option value={city.id}> {locale === 'ar' ? city.city_name_ar : city.city_name_en}</option> : ''
                    } )}
                </select>
            </div>}

                    
            <div className="form-group">
                <label htmlFor="checkout-area">{messages.area}</label>
                <input type="text"
                    className="form-control"
                    id="checkout-area"
                    placeholder={messages.area}
                    value={area}
                    onChange={( e ) => setArea( e.target.value )}
                />
            </div>
            <div className="form-group">
                <label htmlFor="checkout-street-address">{messages.streetAddress}</label>
                <input
                    type="text"
                    className="form-control"
                    id="checkout-street-address"
                    placeholder={messages.streetAddress}
                    value={address}
                    onChange={( e ) => setAddress( e.target.value )}
                />
            </div>
            <div className="form-group">
                <label htmlFor="checkout-addressType">{messages.addressType}</label>
                <select id="checkout-addressType" className="form-control"
                    value={type}
                    onChange={( e ) => setAddressType( e.target.value )}
                >
                    <option>{messages.addressType} ...</option>
                    <option value="home">{messages.homeAddress}</option>
                    <option value="work">{messages.workAddress}</option>
                </select>
            </div>
                    
                   

            <div className="form-row">
                <div className='col-md-6 col-sm-12'>
                    <label htmlFor="checkout-phone">{messages.phoneNumber}</label>
                    <input type="text" className="form-control" id="checkout-phone" placeholder={messages.phoneNumber}
                        value={phone}
                        onChange={( e ) => setPhone( e.target.value )}
                    />

                                            
                </div>
                <div className='col-md-6 col-sm-12'>
                    <label htmlFor="checkout-email">{messages.emailAddress}</label>
                    <input type="text" className="form-control" id="checkout-email" placeholder={messages.emailAddress}
                        value={email}
                        onChange={( e ) => setEmail( e.target.value )}
                    />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="checkout-comment">
                    {messages.orderNotes}
                    {' '}
                    <span className="text-muted">(إختيارى)</span>
                </label>
                <textarea id="checkout-comment" className="form-control" rows="4"
                    placeholder={messages.orderNotesPlaceholder}
                    value={orderNotes}
                    onChange={( e ) => setOrderNotes( e.target.value )}
                />
            </div>

                                    
            <div className="form-group mt-3 mb-0">
                <button className="btn btn-primary" type="button" onClick={e => AddNewAddressHandler( e )}>
                    {messages.save}
                </button>
                <button className="btn btn-defaul mr-3" type="button" onClick={e=>setAddNewAddress(false)}>
                    {messages.cancel}
                </button>
            </div>
        </div>
                                
    </div>
    );

    const addAddressForm = (
        <div className="col-12 col-lg-6 col-xl-7">
            <div className="row mb-3 p-2 mt-0">
                <div className="cart__actions mt-0">
                    <button type="button" className="btn btn-primary cart__update-button"  onClick={e=>setAddNewAddress(true)}>
                        {messages.addNewAddress}
                    </button>
                </div>
            </div>
                               
            <div className="row mb-3 p-2">
                {/*Exist Address Start  */}
                { addressList()}
                {/* Exist Address End */}
            </div>
            {addNewAddress&& addNewAddressForm}
        </div>
    );


    return (
        <React.Fragment>
            <Helmet>
                <title>{` ${ messages.proceedToCheckout }`}</title>
                
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
                                    {renderPaymentsList()}
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
                                        // onClick={e=>{dispatch(handleOnlinePayment())}}
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

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageCheckout);
