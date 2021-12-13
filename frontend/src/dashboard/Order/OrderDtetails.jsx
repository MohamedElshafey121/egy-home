import React,{useEffect} from 'react';
// import Image from "../components/Image";
import Price from "../shared/Price";
import PageHeader from '../shared/PageHeader'
import { url } from '../../services/utils';
import './../utils/containerQry'
import { useSelector, useDispatch } from 'react-redux'
import { getOrder } from "../../store/order";
import { Link } from 'react-router-dom';



export default function OrderDetails ({match}) {
    // const imageSize = 16 * 2.5;
    const imageSize = 40;

    //load necessary scripts
    useEffect( () => {
        window.stroyka.containerQuery();
    }, [] );

    const orderId = match.params.id;
  const order = useSelector((state) => state.order);
    const { order: userOrder, loading } = order;
    
  const dispatch = useDispatch();
    //load Order
    useEffect( () => {
        dispatch( getOrder( orderId ) );
    }, [] );

    const paidStyle = ( status ) => (
        {
            'Yes': 'badge-sa-success',
            'No': 'badge-sa-secondary',
        }[status]
    );

    //order items
    const items = ( userOrder && userOrder.orderItems ) && userOrder.orderItems.map( ( item, itemIdx ) => (
        <tr key={itemIdx}>
            <td className="min-w-20x">
                <div className="d-flex align-items-center">
                    {/* <Image src={item.image} size={imageSize} className="me-4" /> */}
                    <img src={`/uploads/imgs/products/${ item.photo }`} className="me-4" style={{ width: '40px' }} />
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
                    <td colSpan={3}>Subtotal</td>
                    <td className="text-end"><Price value={userOrder.itemsPrice} /></td>
                </tr>
                <tr>
                    <td colSpan={3}>
                        Shipping
                        <div className="text-muted fs-exact-13">via Egy-Home</div>
                    </td>
                    <td className="text-end"><Price value={userOrder.shippingPrice} /></td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td colSpan={3}>Total</td>
                    <td className="text-end"><Price value={userOrder.totalPrice} /></td>
                </tr>
            </tbody>
                    
        </React.Fragment>
    );

    const main = (
        <>
            <div className="sa-card-area">
                <textarea className="sa-card-area__area" rows={2} placeholder="Notes about order" />
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
                    <h2 className="mb-0 fs-exact-18 me-4">Items</h2>
                    <div className="text-muted fs-exact-14">
                        <a href="#">Edit items</a>
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

            <div className="card mt-5">
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

            <div className="card mt-5">
                <div className="card-body px-5 py-4 d-flex align-items-center justify-content-between">
                    <h2 className="mb-0 fs-exact-18 me-4">Balance</h2>
                </div>
                <table className="sa-table">
                    <tbody className="sa-table__group">
                        <tr>
                            <td>Order Total</td>
                            <td className="text-end"><Price value={5882} /></td>
                        </tr>
                        <tr>
                            <td>Return Total</td>
                            <td className="text-end"><Price value={0} /></td>
                        </tr>
                    </tbody>
                    <tbody className="sa-table__group">
                        <tr>
                            <td>Paid by customer</td>
                            <td className="text-end"><Price value={-80} /></td>
                        </tr>
                        <tr>
                            <td>Refunded</td>
                            <td className="text-end"><Price value={0} /></td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <td>Balance <span className="text-muted">(customer owes you)</span></td>
                            <td className="text-end"><Price value={5802} /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );

    const sidebarCustomer = ( ( userOrder && userOrder.user ) && (
        <div className="card">
            <div className="card-body d-flex align-items-center justify-content-between pb-0 pt-4">
                <h2 className="fs-exact-16 mb-0">Customer</h2>
                <a href="#" className="fs-exact-14">Edit</a>
            </div>
            <div className="card-body d-flex align-items-center pt-4">
                <div className="sa-symbol sa-symbol--shape--circle sa-symbol--size--lg">
                    {/* <Image src="images/customers/customer-1.jpg" size={imageSize} /> */}
                    <img src="images/customers/customer-1.jpg" size={40} />
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
                    <h2 className="fs-exact-16 mb-0">Contact person</h2>
                    <a href="#" className="fs-exact-14">Edit</a>
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
                <h2 className="fs-exact-16 mb-0">Shipping Address</h2>
                <a href="#" className="fs-exact-14">Edit</a>
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
        </>
    );

    return (
        <React.Fragment>
            <div id="top" class="sa-app__body">
                <div className="mx-sm-2 px-2 px-sm-3 px-xxl-4 pb-6">
                    <div className="container container--max--xl">
                        <PageHeader
                            title={userOrder&&userOrder._id?`Order #${userOrder._id}`:''}
                            actions={[
                                <Link to={`/dashboard/orders-invoice/${userOrder&&userOrder._id?userOrder._id:''}`} key="invoice" className="btn btn-secondary me-3">
                                    invoice
                                </Link>,
                                <a key="refuse" href="#" className="btn btn-danger me-3">
                                    refuse
                                </a>,
                                <a key="ensure" href="#" className="btn btn-success me-3">
                                    ensure
                                </a>
                                
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
                                    <div className="sa-page-meta__item">{ userOrder &&(userOrder.orderItems.length)} items</div>
                                    <div className="sa-page-meta__item">{userOrder && (
                                        <Price value={userOrder.totalPrice}/>
                                    )}</div>
                                    <div className="sa-page-meta__item d-flex align-items-center fs-6">
                                        <span className={`badge ${ paidStyle( userOrder && userOrder.isPaid ? 'Yes' : 'No' ) }`}>
                                            {userOrder&&userOrder.isPaid ?'Paid':'Not Paid'}
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
