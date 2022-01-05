//react
import React, { useEffect,useState } from 'react';

//third-party
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

//components
import PageHeader from '../shared/PageHeader'
import MoreButton from "../shared/MoreButton";
import BlockLoader from '../../components/blocks/BlockLoader'

//utils/services
import { url } from '../../services/utils';
import './../utils/containerQry'

//actions
import {
    getUserDetails,
    changeUserRoleHandler,
    changeUserRoleReset,
    changeUserCategoriesHandler,
    changeUserCategoriesReset
} from '../../store/user'
import { getUserOrders } from '../../store/order'
import { getAllRoles } from '../../store/roles'
import {
    handleGetAllCategories,
} from "../../store/category"

//data stubs
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'




export default function CustomerData ({match}) {
    const userId = match.params.id;

    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )


    //states
    const[changRoleOpen,setChangRoleOpen]=useState(false)
    const [changCategoryOpen, setChangCategoryOpen] = useState( false );
    const [roleId, setRoleId] = useState( '' )
    const [categoryId, setCategoryId] = useState( '' )
    
    //logged in user
    const userLogin = useSelector(state=>state.userLogin);
    const { userInfo } = userLogin;
    

    //user details
    const userDetails = useSelector( state => state.userDetails )
    const { loading, user, error } = userDetails;
    const { address: addresses } = user;

    //Roles
    const allRoles = useSelector( state => state.allRoles )
    const { roles } = allRoles;

    //categories
    const allCategories = useSelector( state => state.allCategories )
    const {  categories } = allCategories;
    
    
    //user orders list
    const userOrdersList = useSelector( state => state.userOrdersList )
    const { loading: loadingOrders, orders, error: loadingOrdersError } = userOrdersList;
    
    //change user role
    const changeUserRole = useSelector( state => state.changeUserRole )
    const { success } = changeUserRole;


    //change user role
    const changeUserCategory = useSelector( state => state.changeUserCategory )
    const { success:changeCategoryUserSuccess } = changeUserCategory;


    useEffect( () => {
        window.stroyka.containerQuery();
    }, [loading] );

    const dispatch=useDispatch()
    //load user data
    useEffect( () => {
        dispatch(getUserDetails(userId))
    }, [] )
    
    //load user orders list
    useEffect( () => {
        dispatch(getUserOrders(userId))
    }, [] )

    //load roles
    useEffect( () => {
        if ( !roles ) {
            dispatch(getAllRoles())
        }
    }, [] )

    //load categories
     useEffect( () => {
        dispatch( handleGetAllCategories({}, 1000) )
    }, [ dispatch] )

    //load data after success
    useEffect( () => {
        if ( success  ) {
            setChangRoleOpen(false)
            dispatch( getUserDetails( userId ) )
            dispatch(changeUserRoleReset())
        }

        if ( changeCategoryUserSuccess ) {
            setChangCategoryOpen(false)
            dispatch( getUserDetails( userId ) )
            dispatch(changeUserCategoriesReset())
        }
        
    },[success,changeCategoryUserSuccess])
    
    //HANDLERS
    const changeRole = ( e ) => {
        e.preventDefault();
        dispatch(changeUserRoleHandler(user._id,roleId))
    }

     const changeCategory = ( e ) => {
        e.preventDefault();
        dispatch(changeUserCategoriesHandler(user._id,categoryId))
    }
    //Handle Open change
    const handleOpenRoleChange = () => {
        setChangRoleOpen( true );
        window.scrollTo( {
            top: Number( document.body.scrollHeight ) + 50,
            behavior: 'smooth'
        } )
        if ( changCategoryOpen ) {
            setChangCategoryOpen( false )
        }
    };

    const handleOpenCategoryChange = () => {
        setChangCategoryOpen( true );
        window.scrollTo( {
            top: Number( document.body.scrollHeight ) + 50,
            behavior: 'smooth'
        } )
        if ( changRoleOpen ) {
            setChangRoleOpen( false )
        }
    };

    const main = (
        <>
            {/* <div className="sa-card-area">
                <textarea className="sa-card-area__area" rows={2} placeholder="Notes about customer" />
                <div className="sa-card-area__card">
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
            </div> */}

            <div className="card mt-5">
                <div className="card-body px-5 py-4 d-flex align-items-center justify-content-between">
                    <h2 className="mb-0 fs-exact-18 me-4">{messages.orders}</h2>
                    {
                        ( orders && orders.length > 0 )
                            ? ( <div className="text-muted fs-exact-14 text-end">
                                {messages.totalSpent} {
                                    orders.reduce( ( acc, item ) => acc + item.totalPrice, 0 )
                                } {messages.EGP} {messages.on} {orders.length} orders
                            </div> )
                            : ( <div className="text-muted fs-exact-14 text-end">
                                {messages.noOrdersyet}
                            </div> )
                    }
                </div>
                <div className="table-responsive">
                    <table className="sa-table text-nowrap">
                        <tbody>
                            {(orders && orders.length>0)? orders.map( ( order, orderIdx ) => {
                                return (
                                    // ( orderIdx < 4 ) &&
                                    <tr key={orderIdx}>
                                        <td>
                                            <Link to={`/dashboard/orders/${order._id}`}>{order._id}</Link>
                                        </td>
                                        <td>{new Date( order.createdAt ).toDateString()}</td>
                                        <td>{order.status}</td>
                                        <td>{order.orderItems.length} {messages.orderItems}</td>
                                        <td> {order.totalPrice} {messages.EGP} </td>
                                    </tr>
                                )
                            }
                            ) : (
                                    <tr>
                                        <td>
                                            {messages.thisCustomerHasNoOrders}
                                            </td>
                                        </tr>
                             )}
                        </tbody>
                    </table>
                </div>
                {/* {( orders && orders.length > 4 ) && (
                    <>
                        <div className="sa-divider" />
                        <div className="px-5 py-4 text-center">
                            <a href={url.order( { _id: 2 } )}>View all {orders.length} orders</a>
                        </div>
                    </>
                )} */}
            </div>

            <div className="card mt-5">
                <div className="card-body px-5 py-4 d-flex align-items-center justify-content-between">
                    <h2 className="mb-0 fs-exact-18 me-4">{messages.addresses}</h2>
                    {
                        ( addresses && addresses.length < 1 ) && (
                            <div className="text-muted fs-exact-14">
                                <span>{messages.notHaveAddressesyet}</span>
                            </div>
                        )
                    }
                    
                </div>

                {addresses && addresses.map( ( address, addressIdx ) => (
                    <React.Fragment key={addressIdx}>
                        <div className="sa-divider" />
                        <div className="px-5 py-3 my-2 d-flex align-items-center justify-content-between">
                            <div>
                                <div>{address.firstName} {address.firstName}</div>
                                <div className="text-muted fs-exact-14 mt-1">
                                    {/* {address.address} */}
                                    {address.governate}
                                    <br />
                                    {address.city}
                                    <br />
                                    {address.area}
                                    ,
                                    {address.address}
                                </div>
                            </div>
                            <div>
                                <MoreButton id={`address-context-menu-${ addressIdx }`} />
                            </div>
                        </div>
                    </React.Fragment>
                ) )}
            </div>
        </>
    );

    const changeRoleForm = roles&&( <div className="card mt-5">
        <div className="card-body d-flex flex-column align-items-center">
            <div className="w-100">
                <dl className="list-unstyled m-0 mt-4">
                    <dt className="fs-exact-14 fw-medium mb-5" >{messages.changeRole}</dt>
                    <form>
                        <div className='form-group'>
                            <label for='user-role'>{messages.userRole}</label>
                            <select className='form-control' onChange={(e)=>setRoleId(e.target.value)}>
                                <option selected disabled> {messages.selectRole}</option>
                                {roles.map( ( role ) => (
                                    <option key={role._id} value={role._id}> { role.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className='form-group mt-3'>
                            <button className='btn btn-primary' onClick={ changeRole}>{messages.save}</button>
                            <button
                                className='btn btn-secondary m-3'
                                onClick={e=>setChangRoleOpen(false)}
                            >{messages.cancel}</button>
                        </div>
                    </form>
                </dl>
            </div>
        </div>
    </div>
    );

    const changeCategoryForm =categories&& ( <div className="card mt-5">
        <div className="card-body d-flex flex-column align-items-center">
            <div className="w-100">
                <dl className="list-unstyled m-0 mt-4">
                    <dt className="fs-exact-14 fw-medium mb-5" >{messages.changeCategory}</dt>
                    <form>
                        <div className='form-group'>
                            <label for='user-role'>{ messages.categories}</label>
                            <select className='form-control' onChange={e=>setCategoryId(e.target.value)}>
                                <option selected disabled> {messages.categorySelect}</option>
                                {categories.map( ( category,categoryIdx ) => (
                                    <option value={category._id} key={categoryIdx}>{ category.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className='form-group mt-3'>
                            <button
                                className='btn btn-primary'
                                onClick={changeCategory}
                            >{messages.save}</button>
                            <button
                                className='btn btn-secondary m-3'
                                onClick={()=>setChangCategoryOpen(false)}
                            >{messages.cancel}</button>
                        </div>
                    </form>
                </dl>
            </div>
        </div>
    </div>
    );

    const sidebar = user && (
        <>
            <div className="card">
                <div className="card-body d-flex flex-column align-items-center">

                    <div className="pt-3">
                        <div className="sa-symbol sa-symbol--shape--circle" style={{ '--sa-symbol--size': '6rem' }}>
                            {/* <img src="http://placehold.it/700x700" /> */}
                            <img src="/uploads/imgs/users/user_avatar.png" size={40} />
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <div className="fs-exact-16 fw-medium">{user.name} <br/> ({user.role})</div>
                        <div className="fs-exact-13 text-muted">
                            <div className="mt-1"><a href="">{user.email}</a></div>
                            {/* <div className="mt-1">+38 (094) 730-24-25</div> */}
                        </div>
                    </div>

                    <div className="sa-divider my-5" />

                    <div className="w-100">
                        <dl className="list-unstyled m-0">
                            {
                                ( orders && orders.length > 0 ) ? (
                                    <>
                                        <dt className="fs-exact-14 fw-medium">{messages.lastOrder}</dt>
                                        <dd className="fs-exact-13 text-muted mb-0 mt-1"> {new Date( orders[0].createdAt ).toDateString()} – <a href={url.order( { _id: 1 } )}>#{orders[0]._id}</a></dd>
                                    </>
                                ) : (
                                    <dt className="fs-exact-14 fw-medium">{messages.noOrdersyet}</dt>
                                )
                            }
                        </dl>
                        {
                            ( orders && orders.length > 0 ) && (
                                <dl className="list-unstyled m-0 mt-4">
                                    <dt className="fs-exact-14 fw-medium">{messages.averageOrderValue}</dt>
                                    <dd className="fs-exact-13 text-muted mb-0 mt-1">
                                        {orders.reduce( ( acc, item ) => acc + item.totalPrice, 0 ) / orders.length} {messages.EGP}
                                    </dd>
                                </dl>
                            )
                        }
                        {
                            user && (
                                <dl className="list-unstyled m-0 mt-4">
                                    <dt className="fs-exact-14 fw-medium">{messages.registered}</dt>
                                    <dd className="fs-exact-13 text-muted mb-0 mt-1">{new Date( user.createdAt ).toDateString()}</dd>
                                </dl>
                            )
                        }
                        <dl className="list-unstyled m-0 mt-4">
                            <dt className="fs-exact-14 fw-medium">{messages.emailMarketing}</dt>
                            <dd className="fs-exact-13 text-muted mb-0 mt-1">{messages.subscribed}</dd>
                        </dl>

                        {/* User Role */}
                       { <dl className="list-unstyled m-0 mt-4">
                            <dt className="fs-exact-14 fw-medium d-block w-50" style={{ float: 'left', }}>{messages.role}</dt>
                           {(user._id!==userInfo._id)&&( <dt className="fs-exact-14 fw-normal d-block w-50" style={{ float: 'left', textAlign: 'right' }}>
                                <button
                                    className='btn btn-secondary'
                                    style={{ backgroundColor: '#fff', color: 'blue', border: 'none', fontWeight: 'normal' }}
                                    onClick={handleOpenRoleChange}
                                    disabled={changRoleOpen}
                                >{messages.update}</button>
                            </dt>)}
                            <dd className="fs-exact-13 text-muted mb-0 mt-1">{user.role}</dd>
                        </dl>}

                        {/* Assign Category */}
                        <dl className="list-unstyled m-0 mt-4">
                            <dt className="fs-exact-14 fw-medium d-block w-50" style={{ float: 'left', }}>{messages.category}</dt>
                            {(user._id!==userInfo._id)&&(<dt className="fs-exact-14 fw-normal d-block w-50" style={{ float: 'left', textAlign: 'right' }}>
                                <button
                                    className='btn btn-secondary'
                                    style={{ backgroundColor: '#fff', color: 'blue', border: 'none', fontWeight: 'normal' }}
                                    onClick={handleOpenCategoryChange}
                                    disabled={changCategoryOpen}
                                >{messages.update}</button>
                            </dt>)}
                            <dd className="fs-exact-13 text-muted mb-0 mt-1">
                                {
                                    user.role === 'admin'
                                        ? 'All'
                                        : ( user.categories && user.categories.name )
                                            ? user.categories.name
                                            : 'No Category assigned yet'
                                    }
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        
           
            
            {/* Start Actions */}
            {changRoleOpen && changeRoleForm}
            {changCategoryOpen && changeCategoryForm}
            {/* End Actions */}
        </>
    );

    if ( loading ) {
        return <BlockLoader/>
    }

    return (
        <React.Fragment>
            <div id="top" class="sa-app__body">
                <div className="mx-sm-2 px-2 px-sm-3 px-xxl-4 pb-6">
                    <div className="container container--max--xl">
                        <PageHeader
                            title={user&&user.name}
                            // actions={[
                            //     <a key="delete" href="#" className="btn btn-secondary me-3">
                            //         Delete
                            //     </a>,
                            //     <a key="edit" href="#" className="btn btn-primary">
                            //         Edit
                            //     </a>,
                            // ]}
                            breadcrumb={[
                                { title: messages.dashboard, url: '/dashboard'  },
                                { title: messages.customers, url: '/dashboard/customers-list'  },
                                { title: `${user?user.name:''}`, url: ''  }
                            ]}
                        />
                        <div
                            className="sa-entity-layout"
                            data-sa-container-query={JSON.stringify( { 920: 'sa-entity-layout--size--md' } )}
                        >
                            <div className="sa-entity-layout__body">
                                <div className="sa-entity-layout__sidebar">
                                    {sidebar}
                                </div>
                                <div className="sa-entity-layout__main">
                                    {main}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
