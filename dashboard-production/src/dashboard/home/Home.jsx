//react
import React,{useState,useEffect} from 'react'

//third party
import classnames from "classnames";
import {useSelector,useDispatch} from 'react-redux'

//components
import PageHeader from '../shared/PageHeader'
import WidgetHeader from './WidgetHeader';
import Price from '../shared/Price'
import BlockLoader from './../../components/blocks/BlockLoader'

//application
import { url } from '../../services/utils';
import {
    getRecentProducts,
} from '../../store/product';

import {
    getTopCategories
} from '../../store/category';

import {
    getRecentOrders
}from '../../store/order'
import { Link } from 'react-router-dom';



function Home () {

    const dispatch = useDispatch()
    const recentProducts = useSelector( state => state.recentProducts );
    const { products: latestProducts, loading: loadingRecentProducts, error: recentProductsError } = recentProducts;
    
    const mainCategories = useSelector( state => state.mainCategories )
    const { loading: loadingCategories, categories, error } = mainCategories
    
    const recentOrders = useSelector( state => state.recentOrders )
    const{orders,loading}=recentOrders
    
    
    // Load latest products.
    useEffect( () => {
        dispatch( getRecentProducts({limit:7}) );
    }, [] );


    //Load recent categories
     useEffect( () => {
        // if ( !categories & ) {
            dispatch(getTopCategories(8))
        // }
     }, [] )
    
    
    //load recent orders
    useEffect( () => {
        dispatch(getRecentOrders())
    },[])
    

    const breadcrumb = [
        { title: 'Dashboard', url: '' },
    ];
    

    //data online
    const statusStyle = (status) => (
        {
            'Canceled': 'badge-sa-danger',
            'Pending': 'badge-sa-primary',
            'Completed': 'badge-sa-success',
            'Hold': 'badge-sa-warning',
        }[status]
    );

    const indicatorsData = [
        {
            title: 'Total sells',
            value: '$00.00',
            // delta: '34.7%',
            // deltaDirection: 'rise',
            // caption: 'Compared to April 2021',
        },
        {
            title: 'Average order value',
            value: '$00.00',
            // delta: '12.0%',
            // deltaDirection: 'fall',
            // caption: 'Compared to April 2021',
        },
        {
            title: 'Total orders',
            value: '$00.00',
            // delta: '27.9%',
            // deltaDirection: 'rise',
            // caption: 'Compared to April 2021',
        },
    ];
    
    
    const recentProductsList = latestProducts && (
        <div className="col-12 col-lg-6 d-flex">
                
            <div className="card flex-grow-1">
                <div className="card-body">
                    <WidgetHeader title="Recent Products" type='products' />
                </div>

                <ul className="list-group list-group-flush">
                    {latestProducts.map( ( product, productIdx ) => (
                        <li
                            key={productIdx}
                            className="list-group-item py-2"
                        >
                            <div className="d-flex align-items-center py-3">
                                <Link onClick={e=>e.preventDefault()} className="me-4">
                                    <div className="sa-symbol sa-symbol--shape--rounded sa-symbol--size--lg">
                                        <img src={`/uploads/imgs/products/${ product.photo }`} alt="" />
                                    </div>
                                </Link>
                                <div className="d-flex align-items-center flex-grow-1 flex-wrap">
                                    <div className="col">
                                        <Link onClick={e=>e.preventDefault()} className="text-reset fs-exact-14">{product.name}</Link>
                                        <div className="text-muted fs-exact-13">
                                            {product.category.name}
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-auto">
                                        <p>{new Date( product.createdAt ).toDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ) )}
                </ul>
            </div>
        </div>
                 
    );


    const categoriesList = categories && (
        <div className="col-12 col-lg-6 d-flex">
                
            <div className="card flex-grow-1">
                <div className="card-body">
                    <WidgetHeader title="Recent Categories" type='category' />
                </div>

                <ul className="list-group list-group-flush">
                    {categories.map( ( category, categoryIdx ) => (
                        <li
                            key={categoryIdx}
                            className="list-group-item py-2"
                        >
                            <div className="d-flex align-items-center py-3">
                                <Link onClick={e=>e.preventDefault()} className="me-4">
                                    <div className="sa-symbol sa-symbol--shape--rounded sa-symbol--size--lg">
                                        <img src={`/uploads/imgs/categories/${ category.photo }`} alt="" />
                                    </div>
                                </Link>
                                <div className="d-flex align-items-center flex-grow-1 flex-wrap">
                                    <div className="col">
                                        <Link onClick={e=>e.preventDefault()} className="text-reset fs-exact-14">{category.name}</Link>
                                        <div className="text-muted fs-exact-13">
                                            {/* {product.category.name} */}
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-auto">
                                        <p>{new Date( category.createdAt ).toDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ) )}
                </ul>
            </div>
        </div>           
    );

    const recentOrderList = orders && (
        <div className="col-12 col-xxl-12 d-flex">
            <div className="card flex-grow-1 saw-table">
                <WidgetHeader title="Recent orders" className="saw-table__header" />
                <div className="saw-table__body sa-widget-table text-nowrap">
                    <table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Customer</th>
                                <th>items</th>
                                <th>Date</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map( ( order, orderIdx ) => (
                                <tr key={orderIdx}>
                                    <td>#<Link to={`/dashboard/orders/${order._id}`} className="text-reset"> {order._id}</Link></td>
                                    <td>
                                        <Link to={`/dashboard/customers/${order.user._id}`} className="text-reset">
                                        {order.user.name}              
                                        </Link>                         
                                    </td>
                                    <td>
                                      <div className="sa-symbol__text">{order.orderItems.length}</div>
                                    </td>
                                    <td>
                                        {new Date( order.createdAt ).toDateString()}
                                    </td>
                                    <td>{order.totalPrice}</td>
                                </tr>
                            ) )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <div id="top" class="sa-app__body px-2 px-lg-4">

            <div className="container pb-6">
                <PageHeader
                    title="Dashboard"
                    breadcrumb={breadcrumb}
                    // actions={[
                    //     <select key="date" className="form-select me-3">
                    //         <option selected>7 October, 2021</option>
                    //     </select>,
                    //     <a key="export" href="#" className="btn btn-primary">
                    //         Export
                    //     </a>,
                    // ]}
                />

                <div className="row g-4 g-xl-5">
                    {indicatorsData.map( ( indicator, indicatorIdx ) => (
                        <div key={indicatorIdx} className="col-12 col-md-4 d-flex">
                            <div
                                className="card saw-indicator flex-grow-1"
                                data-sa-container-query={JSON.stringify( { 340: 'saw-indicator--size--lg' } )}
                            >
                                <WidgetHeader title={indicator.title} className="saw-indicator__header" />
                                <div className="saw-indicator__body">
                                    <div className="saw-indicator__value">{indicator.value}</div>
                                    <div className={classnames( 'saw-indicator__delta', { 'saw-indicator__delta--rise': indicator.deltaDirection === 'rise', 'saw-indicator__delta--fall': indicator.deltaDirection === 'fall' } )}>
                                        <div className="saw-indicator__delta-direction">
                                            {/* {svg( indicator.deltaDirection === 'rise' ? 'stroyka/arrow-rise' : 'stroyka/arrow-fall' )} */}
                                            {/* <svg xmlns="http://www.w3.org/2000/svg" width="3" height="13" fill="currentColor">
                                                <path
                                                    d="M1.5,8C0.7,8,0,7.3,0,6.5S0.7,5,1.5,5S3,5.7,3,6.5S2.3,8,1.5,8z M1.5,3C0.7,3,0,2.3,0,1.5S0.7,0,1.5,0 S3,0.7,3,1.5S2.3,3,1.5,3z M1.5,10C2.3,10,3,10.7,3,11.5S2.3,13,1.5,13S0,12.3,0,11.5S0.7,10,1.5,10z"
                                                ></path>
                                            </svg> */}
                                        </div>
                                        <div className="saw-indicator__delta-value">{indicator.delta}</div>
                                    </div>
                                    <div className="saw-indicator__caption">{indicator.caption}</div>
                                </div>
                            </div>
                        </div>
                    ) )}

                    {orders && recentOrderList}
                    {latestProducts && recentProductsList}
                    {loadingRecentProducts && <BlockLoader />}
                    {categoriesList && categoriesList}
                    {loadingCategories && <BlockLoader/>}
                 
                </div>
            </div>
        </div>
    );
}

export default Home
