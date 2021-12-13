import React, { useEffect, useState } from 'react';
import Price from "../shared/Price";
import PageHeader from "../shared/PageHeader";
import MoreButton from "../shared/MoreButton";
import { url } from '../../services/utils';
import { Link,useLocation } from 'react-router-dom';
import Pagination from '../../components/shared/Pagination'
import { useSelector, useDispatch } from 'react-redux'
import { getOrderslist } from '../../store/order'


function useQuery () {
    // return new URLSearchParams(location.search)
    return new URLSearchParams(useLocation().search)
}
export default function OrderList ( { history } ) {
     //query
    const query = useQuery();
    const name = query.get( 'name' ) || ''
    const limit = 20;
    const page = query.get( 'page' ) || 1;
    const [sort, setSort] = useState( ' ' );
    const filterObj = { name }
    
    const userLogin = useSelector( ( state ) => state.userLogin );
    const { userInfo } = userLogin;

    const orderList  = useSelector( state => state.orderList );
    const { orders, success, error } = orderList;

    const dispatch = useDispatch();
    useEffect( () => {
        if ( !userInfo ) {
            history.push( '/login' )
        }
        // else {
        //     if ( !orders || ( !success && !error ) ) {
        //         dispatch( getOrderslist() )
        //     }
        // }
    }, [dispatch, history, userInfo, orders, success, error] )

    useEffect( () => {
        dispatch( getOrderslist(filterObj, limit, sort, page) )
    },[dispatch, name,page])

   
    const paidStyle = (status) => (
        {
            'Yes': 'badge-sa-success',
            'No': 'badge-sa-secondary',
            'Partial': 'badge-sa-warning',
        }[status]
    );

    const statusStyle = (status) => (
        {
            'ordered': 'badge-sa-danger',
            'onhold': 'badge-sa-primary',
            'delayed': 'badge-sa-warning',
            'completed': 'badge-sa-success',
            'canceled': 'badge-sa-secondary',
            'refused': 'badge-sa-secondary',
        }[status]
    );

    
    const table = (
        <div className="saw-table__body sa-widget-table text-nowrap w-100" data-simplebar>
            <table className="w-100">
                <thead>
                    <tr>
                        <th className="w-min" data-orderable="false" style={{position:'relative'}}>
                            <input type="checkbox" className="form-check-input m-0 fs-exact-16 d-block" aria-label="..." />
                        </th>
                        <th style={{ paddingLeft: "30px" }}>Number</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Paid</th>
                        <th>Status</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th className="w-min" data-orderable="false" />
                    </tr>
                </thead>
                <tbody>
                    {orders&& orders.map( ( order, orderIdx ) => (
                        <tr key={orderIdx}>
                            <td style={{position:'relative'}}>
                                <input type="checkbox" className="form-check-input m-0 fs-exact-16 d-block" aria-label="..." />
                            </td>
                            <td>
                                <Link style={{ paddingLeft: "20px" }} to={url.orderDashboard( order )} className="text-reset">#{order._id}</Link>
                            </td>
                            <td>{new Date(order.createdAt).toDateString()}</td>
                            <td>
                                {order.user.name}
                                {/* <a href={url.customer( order.customer )} className="text-reset">{order.customer}</a> */}
                            </td>
                            <td>
                                <div className="d-flex fs-6">
                                    <div className={`badge ${ paidStyle( order.isPaid?'Yes':'No' ) }`}>
                                        {/* {order.isPaid} */}
                                        {order.isPaid?'Yes':'No'}
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex fs-6">
                                    <div className={`badge ${ statusStyle( order.status ) }`}>
                                        {order.status}
                                    </div>
                                </div>
                            </td>
                            <td>{order.orderItems.length} items</td>
                            <td><Price value={order.totalPrice} /></td>
                            <td><MoreButton id={`order-context-menu-${ orderIdx }`} orderId={order._id} /></td>
                        </tr>
                    ) )}
                </tbody>
            </table>
        </div>
    );

    const toolbar = (
        <div class="sa-inbox-toolbar">
            {/* put pagination here */}
            <Pagination current={2} total={3} />
            <div class="flex-grow-1"></div>
            <div class="sa-inbox-toolbar__text">7 of 512</div>
           {/* Add Limit box here */}
            <div class="me-n2"></div>
        </div>
    );

    return (
        <React.Fragment>
            <div id="top" class="sa-app__body">
                <div className="mx-sm-2 px-2 px-sm-3 px-xxl-4 pb-6">
                    <div className="container">
                        <PageHeader
                            title="Orders"
                            actions={[
                                <Link key="new_order" to='/dashboard/orders/213' className="btn btn-primary">
                                    New order
                                </Link>,
                            ]}
                            breadcrumb={[
                                {title: 'Dashboard', url: '/dashboard/'},
                                {title: 'Orders', url: ''},
                            ]}
                        />

                        <div className="card">
                            <div className="p-4">
                                <input
                                    type="text"
                                    placeholder="Start typing to search for orders"
                                    className="form-control form-control--search mx-auto"
                                    id="table-search"
                                />
                            </div>

                            <div className="sa-divider" />

                            {table}
                            {toolbar}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
