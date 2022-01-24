import React,{useEffect,useState} from 'react';
import { Link,useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { url } from '../../services/utils';
import MoreButton from "../shared/MoreButton";
import DeleteAlert from '../shared/DeleteAlert'
import PageHeader from '../shared/PageHeader'
import Pagination from '../../components/shared/Pagination'
import BlockLoader from '../../components/blocks/BlockLoader'

import {
    getAllBrands,
    createBrandReset,
    updateBrandReset,
    deleteBrandReset
} from "../../store/brand";


//data stubs
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'


function useQuery () {
    // return new URLSearchParams(location.search)
    return new URLSearchParams(useLocation().search)
}

export default function BrandsList ( { history } ) {
    
    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    const [openDeleteAlert, setOpenDeleteAlert] = useState( false )
     const [deleteItemType, setDeleteItemType] = useState( '' )
    const[deleteItemId,setDeleteItemId]=useState('')
    
    const openDeleteAlertHandler = (status) => {
        setOpenDeleteAlert(status)   
    }

    const setDeleteItemIdHandler = ( id ) => {
        setDeleteItemId(id)
    }

    const setDeleteItemTypeHandler = (type) => {
        setDeleteItemType(type)
    }
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )


     //query
    const query = useQuery();
    const name = query.get( 'name' ) || ''
    const limit = 20;
    const page = query.get( 'page' ) || 1;
    const [sort, setSort] = useState( ' ' );
    const filterObj = {name}

    
    const allBrands = useSelector( state => state.allBrands )
    const { loading,error, brands,page: currentPage, count } = allBrands;
    
    const createBrand = useSelector( state => state.createBrand );
    const { success } = createBrand;

    const updateBrand = useSelector( ( state ) => state.updateBrand );
    const { success: updateBrandSuccess } = updateBrand;
    
    const deleteBrand = useSelector( state => state.deleteBrand );
    const { success: deleteBrandSuccess } = deleteBrand;

    

    const dispatch = useDispatch()
    //load brands
    useEffect( () => {
        dispatch( getAllBrands(filterObj, limit, sort, page) )
        
    }, [ dispatch, name,page] )

    //reset delete status
    useEffect( () => {
        if ( deleteBrandSuccess ) {
            dispatch( deleteBrandReset() )
            dispatch( getAllBrands( filterObj, limit, sort, page ) )

        }
    }, [deleteBrandSuccess] );


    //RESET CREATE
     useEffect( () => {
        if ( success ) {
            dispatch(createBrandReset())
        }
    }, [success, dispatch] )
    
    //RESET UPDATE
    useEffect( () => {
        if ( updateBrandSuccess){
            dispatch(updateBrandReset())
        }
    },[dispatch, updateBrandSuccess])

    //search handler
     const searchByNameHandler = ( name ) => {
        if ( query) {
            if ( query.get( 'name' ) && query.get( 'name' ).trim() ) {
                    query.set( 'name', name );
                    history.push(`/dashboard/brands?${query}`)                
            } else {
                query.delete( 'name' );
                history.push(`/dashboard/brands?${query}&name=${name}`)
            }
        }
        else {
            history.push(`/dashboard/brands?name=${name}`)
        }
    }

    //pagination handler
    const handleStepsPushHandler = ( page ) => {
        if ( query) {
            if ( query.get( 'page' ) && query.get( 'page' ).trim() ) {
                    query.set( 'page', page );
                    history.push(`/dashboard/brands?${query}`)                
            } else {
                history.push(`/dashboard/brands?${query}&page=${page}`)
            }
        }
        else {
            history.push(`/dashboard/brands?page=${page}`)
        }
    }

    const table = (
        <div className="saw-table__body sa-widget-table text-nowrap w-100" data-simplebar style={{ overflow: 'auto' }}>
            <table className="w-100">
                <thead>
                    <tr>
                        <th className="w-min" data-orderable="false" style={{ position: 'relative' }}>
                            <input type="checkbox" className="form-check-input m-0 fs-exact-16 d-block" aria-label="..." />
                        </th>
                        <th className="min-w-15x" style={{ paddingLeft: "30px" }}>{messages.name}</th>
                        <th>{messages.createdAt}</th>
                        <th className="w-min" data-orderable="false" />
                    </tr>
                </thead>
                <tbody>
                    {brands && brands.map( ( brand, brandIdx ) => (
                        <tr key={brandIdx}>
                            <td style={{ position: 'relative' }}>
                                <input type="checkbox" className="form-check-input m-0 fs-exact-16 d-block" aria-label="..." />
                            </td>
                            <td>
                                <div className="d-flex align-items-center" style={{ marginLeft: "30px" }}>
                                    <Link to={url.brandDashboard( brand )} className="me-4">
                                        <div className="sa-symbol sa-symbol--shape--rounded sa-symbol--size--lg">
                                            <img src={`/uploads/imgs/brands/${ brand.photo }`} alt="" />
                                        </div>
                                    </Link>
                                    <div>
                                        <Link to={url.brandDashboard( brand )} className="text-reset">{brand.name}</Link>
                                    </div>
                                </div>
                            </td>
                           
                            <td>
                                {new Date( brand.createdAt ).toDateString()}
                            </td>
                            <td>
                                <MoreButton
                                    id={`category-context-menu-${ brandIdx }`} brandId={brand._id}
                                    openDeleteAlertHandler={openDeleteAlertHandler}
                                    setDeleteItemIdHandler={setDeleteItemIdHandler}
                                    setDeleteItemTypeHandler={setDeleteItemTypeHandler}
                                />
                            </td>
                        </tr>
                    ) )}

                    {loading && <BlockLoader />}
                    
                </tbody>
            </table>
        </div>
    );

    const toolbar = (
        <div class="sa-inbox-toolbar">
            {/* put pagination here */}
            <Pagination current={currentPage} total={Math.ceil(count / limit) } onPageChange={handleStepsPushHandler} />
            <div class="flex-grow-1"></div>
            <div class="sa-inbox-toolbar__text">7 {messages.of} 512</div>
           {/* Add Limit box here */}
            <div class="me-n2"></div>
        </div>
    );


    return (
        <React.Fragment>
            <DeleteAlert
                openDeleteAlert={openDeleteAlert}
                openDeleteAlertHandler={openDeleteAlertHandler}
                deleteItemType={deleteItemType}
                deleteItemId={deleteItemId}
            />
            <div id="top" class="sa-app__body">
                <div className="mx-sm-2 px-2 px-sm-3 px-xxl-4 pb-6">
                    <div className="container">
                        <PageHeader
                            title={messages.brands}
                            actions={[
                                <Link key="new_category" to="/dashboard/brand-add" className="btn btn-primary">
                                    {messages.newBrand}
                                </Link>,
                            ]}
                            breadcrumb={[
                                {title: messages.dashboard, url: '/dashboard'},
                                {title: messages.brands, url: ''},
                            ]}
                        />

                        <div className="card">
                            <div className="p-4">
                                <input
                                    onKeyUp={e=>searchByNameHandler(e.target.value)}
                                    type="text"
                                    placeholder={messages.searchCategoryMsg}
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
