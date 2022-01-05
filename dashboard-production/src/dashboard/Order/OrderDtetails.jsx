//react
import React, { useEffect,useState } from 'react';

//components
import Price from "../shared/Price";
import PageHeader from '../shared/PageHeader'
import BlockLoader from '../../components/blocks/BlockLoader'

//utils
import { url } from '../../services/utils';
import './../utils/containerQry'

//third-party
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import classNames from 'classnames'

//data stubs
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'


//application
import { getOrder,updateOrder,adminUpdateOrderReset } from "../../store/order";

// const messages = {
    // orderUnderReview: "طلبك تحت المراجعة ",
    // orderUnderReviewMsg: " طلبك تحت المراجعة وسيتم  إرسال بريد الكترونى فى حال التأكيد او الرفض",
    // orderCompelete: "تم التسليك",
    // orderCompeleteMsg: "",
    // orderRefused: "تم رفض الطلب",
    // orderRefusedMsg: "لقد قام أحد المسئولين برفض طلبك لعدم وجود بيانات كافيه عن عنوان التوصيل او أسباب آخرى",
    // orderCanceled: "تم الإلغاء",
    // orderCanceledMsg: "لقم قمت بإلغاء الطلب ",
    // orderOnWay: "جارى الشحن",
    // orderOnWayMsg: "مندوبنا فى الطريق اليك ",
// }

export default function OrderDetails ({match}) {
    const orderId = match.params.id;

    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )


    const[orderNotes,setOrderNotes]=useState()
    const order = useSelector( ( state ) => state.order );
    const { order: userOrder, loading: loadingOrder } = order;

    const adminUpdateOrder = useSelector( state => state.adminUpdateOrder )
    const {success:updateOrderSuccess } = adminUpdateOrder;
    
    //load necessary scripts
    useEffect( () => {
        window.stroyka.containerQuery();
    }, [loadingOrder] );


  const dispatch = useDispatch();
    //load Order
    useEffect( () => {
        dispatch( getOrder( orderId ) );
    }, [] );
    
    //reload product after update
    useEffect( () => {
        if ( updateOrderSuccess ) {
            dispatch( adminUpdateOrderReset() )
            dispatch(getOrder(orderId))
        }
    },[updateOrderSuccess])

    //HANDLERS
    //ON HOLD
    const setOrderAsOnHold = (e) => {
        e.preventDefault();
        if ( orderNotes && orderNotes.trim() ) {
            dispatch( updateOrder( orderId, {status: 'onhold',adminNotes: orderNotes} ) )
        } else {
            dispatch( updateOrder( orderId, {status: 'onhold'} ) );
        }
    }

    //CANCELED 
    const setOrderAsCanceled = (e) => {
        e.preventDefault();
        if ( orderNotes && orderNotes.trim() ) {
            dispatch( updateOrder( orderId, {status: 'canceled',adminNotes: orderNotes} ) )
        } else {
            dispatch( updateOrder( orderId, {status: 'canceled'} ) );
        }
    }

    // REFUSED
    const setOrderAsRefused = ( e ) => {
        e.preventDefault();
        if ( orderNotes && orderNotes.trim() ) {
            dispatch( updateOrder( orderId, {status:'refused',adminNotes:orderNotes} ) );
        } else {
            toast.warning('You should provide refusion reason',{theme:'colored'})
        }

    };

    // COMPLETED
    const setOrderAsCompleted = (e) => {
        e.preventDefault();
        if ( orderNotes && orderNotes.trim() ) {
            dispatch( updateOrder( orderId, {status: 'completed',adminNotes: orderNotes} ) )
        } else {
            dispatch( updateOrder( orderId, {status: 'completed'} ) );
        }
    }

    //ADD ORDER NOTES
    const addOrderNotes = (e) => {
        e.preventDefault();
        if ( orderNotes && orderNotes.trim() ) {
            dispatch( updateOrder( orderId, {adminNotes: orderNotes} ) )
        } else {
           toast.warning('يجب إضافة ملاحظات أولا',{theme:'colored'})
        }
    }

    const paidStyle = ( status ) => (
        {
            'Yes': 'badge-sa-success',
            'No': 'badge-sa-secondary',
        }[status]
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

    //order items
    const items = ( userOrder && userOrder.orderItems ) && userOrder.orderItems.map( ( item, itemIdx ) => (
        <tr key={itemIdx}>
            <td className="min-w-20x">
                <div className="d-flex align-items-center">
                    <img src={`/uploads/imgs/products/${ item.photo }`} className="me-4" style={{ width: '40px',margin:'0 10px' }} alt="" />
                    <a href={url.order( item )} className="text-reset">
                        {item.name}
                    </a>
                </div>
            </td>
            <td className="text-end">
                <Price value={item.price} />
            </td>
            <td className="text-end">
                {item.qty}
            </td>
            <td className="text-end">
                <Price value={item.qty * item.price} />
            </td>
        </tr>
    ) );

    //subtotal, shipping and total price
    const prices = ( userOrder && userOrder.itemsPrice ) && (
        <React.Fragment>
            <tbody className="sa-table__group">
                <tr>
                    <td colSpan={3}>{messages.subtotal}</td>
                    <td className="text-end"><Price value={userOrder.itemsPrice} /></td>
                </tr>
                <tr>
                    <td colSpan={3}>
                        {messages.shipping}
                        <div className="text-muted fs-exact-13">{messages.via} Egy-Home</div>
                    </td>
                    <td className="text-end"><Price value={userOrder.shippingPrice} /></td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td colSpan={3}>{messages.totalPrice}</td>
                    <td className="text-end"><Price value={userOrder.totalPrice} /></td>
                </tr>
            </tbody>
                    
        </React.Fragment>
    );

    const transactions = ( <div className="card mt-5">
        <div className="card-body px-5 py-4 d-flex align-items-center justify-content-between">
            <h2 className="mb-0 fs-exact-18 me-4">Transactions</h2>
            <div className="text-muted fs-exact-14">
                <a href="#">Add transaction</a>
            </div>
        </div>
        <div className="table-responsive">
            <table className="sa-table text-nowrap">
                <tbody>
                    <tr>
                        <td>
                            Payment
                            <div className="text-muted fs-exact-13">via PayPal</div>
                        </td>
                        <td>October 7, 2020</td>
                        <td className="text-end"><Price value={2000} /></td>
                    </tr>
                    <tr>
                        <td>
                            Payment
                            <div className="text-muted fs-exact-13">from account balance</div>
                        </td>
                        <td>November 2, 2020</td>
                        <td className="text-end"><Price value={50} /></td>
                    </tr>
                    <tr>
                        <td>
                            Refund
                            <div className="text-muted fs-exact-13">to PayPal</div>
                        </td>
                        <td>December 10, 2020</td>
                        <td className="text-end text-danger"><Price value={-325} /></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    );

    const orderActions = userOrder && (
        <div className="card mt-5">
            <div className="card-body">
                {userOrder.status === 'ordered' && (
                    <React.Fragment>
                        <button key="onhold" className="btn btn-primary me-3" onClick={e=>setOrderAsOnHold(e)} >
                            {messages.acceptOrder}
                        </button>
                        <button key="refuse" className="btn btn-secondary me-3" onClick={e=>setOrderAsRefused(e)} >
                            {messages.refuseOrder}
                        </button>
                    </React.Fragment>
                
                )}

                {userOrder.status === 'onhold' && (
                    <React.Fragment>
                        <button key="completed" className="btn btn-primary me-3" onClick={e=>setOrderAsCompleted(e)}  >
                            {messages.orderCompelete}
                        </button>
                        <button key="canceled" className="btn btn-secondary me-3" onClick={e=>setOrderAsCanceled(e)} >
                            {messages.cancelOrder}
                        </button>
                    </React.Fragment>
                
                )}
            </div>
        </div>
    );

    const main = (
        <>
            <div className="sa-card-area">
                <textarea
                    className="sa-card-area__area"
                    rows={2}
                    placeholder={messages.orderNotes}
                    onChange={e => setOrderNotes( e.target.value )}
                    value={orderNotes}
                    defaultValue={(userOrder && userOrder.adminNotes)&&userOrder.adminNotes}
                />
                <div className="sa-card-area__card">
                    {/* {svg('feather/edit')} */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-edit"
                    >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </div>
            </div>

            <div className="card mt-5">
                <div className="card-body px-5 py-4 d-flex align-items-center justify-content-between">
                    <h2 className="mb-0 fs-exact-18 me-4">{messages.orderItems}</h2>
                    <div className="text-muted fs-exact-14">
                        {/* <a href="#">Edit items</a> */}
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="sa-table">
                        <tbody>
                            {items}
                        </tbody>
                        {prices}
                    </table>
                </div>
            </div>

            {/* {transactions} */}

            {userOrder&& (
                userOrder.status === 'ordered' ||
                userOrder.status === 'onhold' 
            ) && orderActions}
        </>
    );

    const sidebarCustomer = ( ( userOrder && userOrder.user ) && (
        <div className="card">
            <div className="card-body d-flex align-items-center justify-content-between pb-0 pt-4">
                <h2 className="fs-exact-16 mb-0">{messages.customer}</h2>
                {/* <a href="#" className="fs-exact-14">Edit</a> */}
            </div>
            <div className="card-body d-flex align-items-center pt-4">
                <div className="sa-symbol sa-symbol--shape--circle sa-symbol--size--lg">
                    <img src="/uploads/imgs/users/user_avatar.png"  />
                </div>
                <div className="ms-3 ps-2">
                    <div className="fs-exact-14 fw-medium">
                        {userOrder.user.name}
                    </div>
                    {/* <div className="fs-exact-13 text-muted">
                        This is a first order
                    </div> */}
                </div>
            </div>
        </div>
    )
    );

    const sidebarContactPerson = ( ( userOrder && userOrder.user ) && (
        <div className="card mt-5">
                <div className="card-body d-flex align-items-center justify-content-between pb-0 pt-4">
                    <h2 className="fs-exact-16 mb-0">{messages.contactPerson}</h2>
                    {/* <a href="#" className="fs-exact-14">Edit</a> */}
                </div>
                <div className="card-body pt-4 fs-exact-14">
                    <div>
                        {userOrder.user.name}
                    </div>
                    <div className="mt-1">
                    <a href="#">{ userOrder.user.email}</a>
                    </div>
                    <div className="text-muted mt-1">
                        {userOrder.user.phoneNumber}
                    </div>
                </div>
            </div>
    ) )
    
    const SidebarShippingAddress = ( userOrder && (
        <div className="card mt-5">
            <div className="card-body d-flex align-items-center justify-content-between pb-0 pt-4">
                <h2 className="fs-exact-16 mb-0">{messages.shippingAddress}</h2>
                {/* <a href="#" className="fs-exact-14">Edit</a> */}
            </div>
            <div className="card-body pt-4 fs-exact-14">
                {userOrder.shippingAddress.firstName} {userOrder.shippingAddress.lastName}<br />
                {userOrder.shippingAddress.governate}<br />
                {userOrder.shippingAddress.city}<br />
                {userOrder.shippingAddress.area}
                        ,
                {userOrder.shippingAddress.address}<br/>
                {userOrder.phone}
            </div>
        </div>
    ) );

    const SidebarShippingAddressNotes = ( userOrder && (
        userOrder.shippingAddress.orderNotes && (
            <div className="card mt-5">
            <div className="card-body d-flex align-items-center justify-content-between pb-0 pt-4">
                <h2 className="fs-exact-16 mb-0">{messages.shippingAddressNotes}</h2>
            </div>
            <div className="card-body pt-4 fs-exact-14">
                {userOrder.shippingAddress.orderNotes} 
            </div>
        </div>
        )
    ) );

    //NOT USED
    // const sideBarBillingAddress=(<div className="card mt-5">
    //             <div className="card-body d-flex align-items-center justify-content-between pb-0 pt-4">
    //                 <h2 className="fs-exact-16 mb-0">Billing Address</h2>
    //                 <a href="#" className="fs-exact-14">Edit</a>
    //             </div>
    //             <div className="card-body pt-4 fs-exact-14">
    //                 Jessica Moore<br />
    //                 Random Federation<br />
    //                 115302, Moscow<br />
    //                 ul. Varshavskaya, 15-2-178
    //             </div>
    //         </div>
    //     )

    const sidebar = (
        <>
            {sidebarCustomer}
            {sidebarContactPerson}
            {SidebarShippingAddress}
            {SidebarShippingAddressNotes}
        </>
    );

    if ( loadingOrder ) {
        return <BlockLoader/>
    }

    return (
        <React.Fragment>
            <div id="top" class="sa-app__body">
                <div className="mx-sm-2 px-2 px-sm-3 px-xxl-4 pb-6">
                    <div className="container container--max--xl">
                        <PageHeader
                            title={userOrder&&userOrder._id?`Order #${userOrder._id}`:''}
                            actions={[
                                <Link to={`/dashboard/orders-invoice/${userOrder&&userOrder._id?userOrder._id:''}`} key="invoice" className="btn btn-secondary me-3">
                                    {messages.invoice}
                                </Link>,
                                <button
                                    key="refuse"
                                    // className="btn btn-primary me-3"
                                    disabled={!orderNotes && true}
                                    onClick={e => addOrderNotes( e )}
                                    className={classNames( 'btn btn-primary me-3', {
                                        'd-none':userOrder&&(userOrder.status === 'completed' || userOrder.status === 'refused' || userOrder.status === 'canceled')
                                    })}
                                >
                                    {messages.update}
                                </button>,
                            ]}
                            breadcrumb={[
                                {title: 'Dashboard', url: '/dashboard'},
                                {title: 'Orders', url: '/dashboard/orders-list'},
                                ({title: `Order #${(userOrder && userOrder._id)&&userOrder._id}`, url: ''})
                            ]}
                        />

                        <div className="sa-page-meta mb-5">
                            <div className="sa-page-meta__body">
                                <div className="sa-page-meta__list">
                                    <div className="sa-page-meta__item"> {( userOrder && userOrder.createdAt ) && (
                                        new Date(userOrder.createdAt).toDateString()
                                    )} </div>
                                    <div className="sa-page-meta__item">{ userOrder &&(userOrder.orderItems.length)} {messages.orderItems}</div>
                                    <div className="sa-page-meta__item">{userOrder && (
                                        <Price value={userOrder.totalPrice}/>
                                    )}</div>
                                    <div className="sa-page-meta__item d-flex align-items-center fs-6">
                                        <span className={`badge ${ paidStyle( userOrder && userOrder.isPaid ? 'Yes' : 'No' ) }`}>
                                            {userOrder&&userOrder.isPaid ?'Paid':'Not Paid'}
                                        </span>
                                    </div>

                                     <div className="sa-page-meta__item d-flex align-items-center fs-6">
                                        <span className={`badge ${ paidStyle( userOrder && userOrder.isPaid ? 'Yes' : 'No' ) }`}>
                                            {userOrder&&orderStatus(userOrder.status)}
                                        </span>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div
                            className="sa-entity-layout"
                            // data-sa-container-query={JSON.stringify( { 920: 'sa-entity-layout--size--md' } )}
                            data-sa-container-query={JSON.stringify( { 920: 'sa-entity-layout--size--md' } )}
                            
                        >
                            <div className="sa-entity-layout__body">
                                <div className="sa-entity-layout__main">
                                    {main}
                                </div>
                                <div className="sa-entity-layout__sidebar">
                                    {sidebar}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
