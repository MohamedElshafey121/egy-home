//react
import React,{useEffect,useState} from 'react';

//third-party
import { useSelector, useDispatch } from 'react-redux';
import { Link,useLocation } from 'react-router-dom';


//components
import Price from "../shared/Price";
import PageHeader from '../shared/PageHeader'
import MoreButton from "../shared/MoreButton";
import Pagination from '../../components/shared/Pagination'
import BlockLoader from '../../components/blocks/BlockLoader'
import classNames from 'classnames';


//utils
import { url } from '../../services/utils';
import effectLayutSidebar from '../utils/layoutSidebar'


//application
import {getAllUsers} from '../../store/user'

function useQuery () {
    // return new URLSearchParams(location.search)
    return new URLSearchParams(useLocation().search)
}

export default function CustomerListTwo ({history}) {
    const query = useQuery();
    const name = query.get( 'name' ) || ''
    const limit = 20;
    const page = query.get( 'page' ) || 1;
    const [sort, setSort] = useState( ' ' );

    const filterObj = {name}
    
    
    const allusers = useSelector( state => state.allusers )
    const { loading, users, error, page:currentPage, count } = allusers;
    
     //Layout Sidebar Effect
    useEffect( () => {
        effectLayutSidebar(); 
    }, [loading, loading] )
    
    const dispatch = useDispatch();
    //load users
    useEffect( () => {
        dispatch(getAllUsers(filterObj, limit, sort, page))
    }, [name, page] )
    
    //search handler
     const searchByNameHandler = ( name ) => {
        if ( query) {
            if ( query.get( 'name' ) && query.get( 'name' ).trim() ) {
                    query.set( 'name', name );
                    history.push(`/dashboard/customers-list?${query}`)                
            } else {
                query.delete( 'name' );
                history.push(`/dashboard/customers-list?${query}&name=${name}`)
            }
        }
        else {
            history.push(`/dashboard/customers-list?name=${name}`)
        }
    }

    //pagination handler
    const handleStepsPushHandler = ( page ) => {
        if ( query) {
            if ( query.get( 'page' ) && query.get( 'page' ).trim() ) {
                    query.set( 'page', page );
                    history.push(`/dashboard/customers-list?${query}`)                
            } else {
                history.push(`/dashboard/customers-list?${query}&page=${page}`)
            }
        }
        else {
            history.push(`/dashboard/customers-list?page=${page}`)
        }
    }

  const filters = [
        {
            key: 'price',
            title: 'Price',
            type: 'range',
            min: 0,
            max: 2000,
            from: 0,
            to: 2000,
        },
        {
            key: 'categories',
            title: 'Categories',
            type: 'check',
            // items: [
            //     {label: 'Power tools', checked: true},
            //     {label: 'Hand tools', checked: false},
            //     {label: 'Machine tools', checked: true},
            //     {label: 'Power machinery', checked: false},
            //     {label: 'Measurement', checked: false},
            // ],
            items:[]
        },
        // {
        //     key: 'product_type',
        //     title: 'Product type',
        //     type: 'radio',
        //     items: [
        //         {label: 'Simple', checked: true},
        //         {label: 'Variable', checked: false},
        //         {label: 'Digital', checked: false},
        //     ],
        // },
        {
            key: 'visibility',
            title: 'visibility',
            type: 'radio',
            items: [
                {label: 'All', value: ''},
                {label: 'visible', value: 'published'},
                {label: 'hidden', value: 'hidden'},
            ],
        },
        {
            key: 'brands',
            title: 'Brands',
            type: 'check',
            items: [
                {label: 'Brandix', checked: false},
                {label: 'FastWheels', checked: true},
                {label: 'FuelCorp', checked: true},
                {label: 'RedGate', checked: false},
                {label: 'Specter', checked: false},
                {label: 'TurboElectric', checked: false},
            ],
        },
    ];
    
    const sidebar = (
        <>
            <div className="sa-layout__sidebar-header">
                <div className="sa-layout__sidebar-title">Filters</div>
                <button
                    type="button"
                    className="sa-close sa-layout__sidebar-close"
                    aria-label="Close"
                    data-sa-layout-sidebar-close=""
                />
            </div>
            <div className="sa-layout__sidebar-body sa-filters" data-simplebar>
                <ul className="sa-filters__list"  >
                    {filters.map( ( filter, filterIdx ) => (
                        <li key={filterIdx} className="sa-filters__item">
                            <div className="sa-filters__item-title">{filter.title}</div>
                            <div className="sa-filters__item-body">
                                {['check', 'radio'].includes( filter.type ) && (
                                    <ul className="list-unstyled m-0 mt-n2">
                                        {filter.items?.map( ( item, itemIdx ) => (
                                            <li key={itemIdx}>
                                                <label className="d-flex align-items-center pt-2">
                                                    {filter.type === 'check' && (
                                                        <>
                                                            {
                                                                filter.key === 'categories' ? (
                                                                    <input type="checkbox" className="form-check-input m-0 me-3 fs-exact-16"  style={{ position: 'relative' }} />
                                                                
                                                                ) : filter.key === 'brands' ? (
                                                                    <input type="checkbox" className="form-check-input m-0 me-3 fs-exact-16" defaultChecked={item.checked} style={{ position: 'relative' }}/>
                                                                
                                                                    ) : <input type="checkbox" className="form-check-input m-0 me-3 fs-exact-16" defaultChecked={item.checked} style={{ position: 'relative' }} />
                                                                
                                                            }
                                                          
                                                        </>
                                                    )}
                                                    {filter.type === 'radio' && (
                                                    <>
                                                        {
                                                            filter.key === 'visibility' ? (
                                                                <input type="radio" value={item.value} className="form-check-input m-0 me-3 fs-exact-16" name={`filter-${ filter.key }`} style={{ position: 'relative' }} />
                                                            ) : (
                                                                    <input type="radio" className="form-check-input m-0 me-3 fs-exact-16" defaultChecked={item.checked} name={`filter-${ filter.key }`} style={{ position: 'relative' }} />
                                                            )
                                                        }
                                                    </>
                                                    )}

                                                    {item.name ? item.name : item.label}
                                                </label>
                                            </li>
                                        ) )}
                                    </ul>
                                )}
                                {filter.type === 'range' && (
                                    <div
                                        className="sa-filter-range"
                                        data-min={filter.min}
                                        data-max={filter.max}
                                        data-from={filter.from}
                                        data-to={filter.to}
                                    >
                                        <div className="sa-filter-range__slider" />

                                        <input type="hidden" value={filter.from} className="sa-filter-range__input-from" />
                                        <input type="hidden" value={filter.to} className="sa-filter-range__input-to" />
                                    </div>
                                )}
                            </div>
                        </li>
                    ) )}
                </ul>
            </div>
        </>
    );

    const table = (
        <div className="saw-table__body sa-widget-table text-nowrap w-100" data-simplebar>
            <table className="w-100">
                <thead>
                    <tr>
                        <th className="w-min" data-orderable="false" style={{position:'relative'}}>
                            <input type="checkbox" className="form-check-input m-0 fs-exact-16 d-block" aria-label="..." />
                        </th>
                        <th className="min-w-20x" style={{ paddingLeft: "30px" }}>
                            {/* <span>
                                <ArrowRoundedUp13x8Svg  />
                            </span> */}
                            user
                            {/* <span>
                                <ArrowRoundedDown12x7Svg  />
                            </span> */}
                        </th>
                        <th>Email</th>
                        <th>Role</th>
                        <th className="w-min" data-orderable="false" />
                    </tr>
                </thead>
                <tbody>
                    {users && users.map( ( customer, customerIdx ) => (
                        <tr key={customerIdx}>
                            <td style={{ position: 'relative' }}>
                                <input type="checkbox" className="form-check-input m-0 fs-exact-16 d-block" aria-label="..." />
                            </td>
                            <td>
                                <div className="d-flex align-items-center" style={{ marginLeft: '20px' }}>
                                    <Link to={`/dashboard/customers/${customer._id}`} className="me-4">
                                        <div className="sa-symbol sa-symbol--shape--rounded sa-symbol--size--lg">
                                            <img src="/uploads/imgs/users/user_avatar.png" size={40} />
                                        </div>
                                    </Link>
                                    <div>
                                        <Link to={`/dashboard/customers/${ customer._id }`} className="text-reset">{customer.name}</Link>
                                         <div className="sa-meta mt-0">
                                            <ul className="sa-meta__list">
                                                <li className="sa-meta__item">
                                                    Registered: <span title="Click to copy product ID" className="st-copy">{new Date(customer.createdAt).toDateString()} {customer.createdAt} </span>
                                                </li>
                                               
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div>{ customer.name}</div>
                            </td>
                            <td>
                                <div>{ customer.role}</div>
                            </td>
                            
                            <td>
                                <MoreButton id={`product-context-menu-${ customerIdx }`} customerId={customer._id}/>
                            </td>
                        </tr>
                    ) )}
                </tbody>
        
            </table>
                
        </div>
    );

    const toolbar = (
        <div class="sa-inbox-toolbar">
            {/* put pagination here */}
            <Pagination current={currentPage} total={Math.ceil(count / limit) } onPageChange={handleStepsPushHandler} />
            <div class="flex-grow-1"></div>
            <div class="sa-inbox-toolbar__text">7 of 512</div>
           {/* Add Limit box here */}
            <div class="me-n2"></div>
        </div>
    );

    const content = (
        <div className="card">
            <div className="p-4">
                <div className="row g-4">
                    <div className="col-auto sa-layout__filters-button">
                        <button className="btn btn-sa-muted btn-sa-icon fs-exact-16" data-sa-layout-sidebar-open="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">
                                <path
                                    d="M7,14v-2h9v2H7z M14,7h2v2h-2V7z M12.5,6C12.8,6,13,6.2,13,6.5v3c0,0.3-0.2,0.5-0.5,0.5h-2 C10.2,10,10,9.8,10,9.5v-3C10,6.2,10.2,6,10.5,6H12.5z M7,2h9v2H7V2z M5.5,5h-2C3.2,5,3,4.8,3,4.5v-3C3,1.2,3.2,1,3.5,1h2 C5.8,1,6,1.2,6,1.5v3C6,4.8,5.8,5,5.5,5z M0,2h2v2H0V2z M9,9H0V7h9V9z M2,14H0v-2h2V14z M3.5,11h2C5.8,11,6,11.2,6,11.5v3 C6,14.8,5.8,15,5.5,15h-2C3.2,15,3,14.8,3,14.5v-3C3,11.2,3.2,11,3.5,11z"
                                ></path>
                            </svg>
                        </button>
                    </div>
                    <div className="col">
                        <input
                            type="text"
                            placeholder="Start typing to search for products"
                            className="form-control form-control--search mx-auto"
                            id="table-search"
                            onKeyUp={e=>searchByNameHandler(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="sa-divider" ></div>
            {table}
            {toolbar}
                

        </div>
    );

    

    return (
        <React.Fragment>
            <div id="top" className="sa-app__body">
                <div className="mx-xxl-3 px-4 px-sm-5">
                    <PageHeader
                        title="Customers"
                        actions={[
                            // <a key="import" href="#" className="btn btn-secondary me-3">
                            //     Import
                            // </a>,
                            <Link key="new_product" to='/dashboard/products-add' className="btn btn-primary">
                                New product
                            </Link>,
                        ]}
                        breadcrumb={[
                            { title: 'Dashboard', url: '/dashboard' },
                            { title: 'Customers', url: '' },
                        ]}
                    />
                </div>
                <div className="mx-xxl-3 px-4 px-sm-5 pb-6">
                    <div className="sa-layout">
                        <div className="sa-layout__backdrop" data-sa-layout-sidebar-close="" />
                        <div className="sa-layout__sidebar">
                            {sidebar}
                        </div>
                        <div className="sa-layout__content">
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
