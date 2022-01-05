import React,{useEffect,useState} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { Link ,useLocation} from 'react-router-dom';
import { url } from '../../services/utils';
import MoreButton from "../shared/MoreButton";
import PageHeader from '../shared/PageHeader'
import Pagination from '../../components/shared/Pagination'

import {
    createSubcategoryReset,
    handleGetAllSubCategories,
    updateOneSubcategoryReset
}from '../../store/subCategory'
import BlockLoader from '../../components/blocks/BlockLoader';

//data stubs
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'



function useQuery () {
    // return new URLSearchParams(location.search)
    return new URLSearchParams(useLocation().search)
}


export default function SubCategoriesList ( { history } ) {
    
    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )


    const query = useQuery();
    const name = query.get( 'name' ) || ''
    const categoryId = query.get( 'category' ) || null
    const limit = 20;
    const page = query.get( 'page' ) || 1;
    const [sort, setSort] = useState( ' ' );

    const filterObj = {name}

    const allSubCategories = useSelector( state => state.allSubCategories )
    const { error, SubCategories:categories,success:loaingSubcategoriesSuccess, page: currentPage, count } = allSubCategories;
    
    const createSubCategory = useSelector( state => state.createSubCategory );
    const { success } = createSubCategory;

    const updateSubcategory = useSelector( ( state ) => state.updateSubcategory );
    const {success:updateSubcategorySuccess} = updateSubcategory;
    

    const dispatch=useDispatch()
    useEffect( () => {
        //reset create subCategory
        if ( success ) {
            dispatch(createSubcategoryReset())
        }

        //reset update subCategory
        if ( updateSubcategorySuccess ) {
            dispatch(updateOneSubcategoryReset())   
        }
        
        
    }, [success, dispatch, updateSubcategorySuccess] )
    
    //load subcategories
    useEffect( () => {
        dispatch(handleGetAllSubCategories(filterObj, limit, sort, page,categoryId))
    }, [dispatch, , name, page, categoryId] )
    
    //search handler
     const searchByNameHandler = ( name ) => {
        if ( query) {
            if ( query.get( 'name' ) && query.get( 'name' ).trim() ) {
                    query.set( 'name', name );
                    history.push(`/dashboard/subcategories?${query}`)                
            } else {
                query.delete( 'name' );
                history.push(`/dashboard/subcategories?${query}&name=${name}`)
            }
        }
        else {
            history.push(`/dashboard/subcategories?name=${name}`)
        }
    }

     //pagination handler
    const handleStepsPushHandler = ( page ) => {
        if ( query) {
            if ( query.get( 'page' ) && query.get( 'page' ).trim() ) {
                    query.set( 'page', page );
                    history.push(`/dashboard/subcategories?${query}`)                
            } else {
                history.push(`/dashboard/subcategories?${query}&page=${page}`)
            }
        }
        else {
            history.push(`/dashboard/subcategories?page=${page}`)
        }
    }

   
    const table = (
        <div className="saw-table__body sa-widget-table text-nowrap w-100" data-simplebar>
            <table className="w-100">
                <thead>
                    <tr>
                        <th className="w-min" data-orderable="false" style={{ position: 'relative' }}>
                            <input type="checkbox" className="form-check-input m-0 fs-exact-16 d-block" aria-label="..." />
                        </th>
                        <th className="min-w-15x" style={{ paddingLeft: "30px" }}>{messages.name}</th>
                        {/* <th>Items</th> */}
                        <th>{messages.parentCategory}</th>
                        <th>{messages.createdAt}</th>
                        <th className="w-min" data-orderable="false" />
                    </tr>
                </thead>
                <tbody>
                    {categories && categories.map( ( category, categoryIdx ) => {
                        const { category: parentCategory } = category;
                        return (
                            <tr key={categoryIdx}>
                                <td style={{ position: 'relative' }}>
                                    <input type="checkbox" className="form-check-input m-0 fs-exact-16 d-block" aria-label="..." />
                                </td>
                                <td>
                                    <div className="d-flex align-items-center" style={{ marginLeft: "30px" }}>
                                        <Link to={url.subcategoryDashboard( category )} className="me-4">
                                            <div className="sa-symbol sa-symbol--shape--rounded sa-symbol--size--lg">
                                                <img src={`/uploads/imgs/subcategories/${ category.photo }`} alt="" />
                                            </div>
                                        </Link>
                                        <div>
                                            <Link to={url.subcategoryDashboard( category )} className="text-reset">{category.name}</Link>
                                            
                                        </div>
                                    </div>
                                </td>
                                {/* <td>
                            {category.items}
                        </td> */}
                                <td>
                                    {parentCategory&&parentCategory.name}
                                    {/* {JSON.stringify( category.category )} */}
                                </td>
                                <td>
                                    {new Date( category.createdAt ).toDateString()}
                                </td>
                                <td>
                                    <MoreButton id={`category-context-menu-${ categoryIdx }`} subcategoryId={category._id} />
                                </td>
                            </tr>
                        )
                    })}
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

    const content = (
        <div className="card">
            <div className="p-4">
                <input
                    type="text"
                    placeholder={messages.searchCategoryMsg}
                    className="form-control form-control--search mx-auto"
                    id="table-search"
                    onChange={e => searchByNameHandler( e.target.value )}
                />
            </div>

            <div className="sa-divider" />

            {table}
            {toolbar}
        </div>
    );

    if ( loaingSubcategoriesSuccess ) {
        <BlockLoader/>
    }

    return (
        <React.Fragment>
            <div id="top" class="sa-app__body">
                <div className="mx-sm-2 px-2 px-sm-3 px-xxl-4 pb-6">
                    <div className="container">
                        <PageHeader
                            title={messages.subCategories}
                            actions={[
                                <Link key="reset" style={{display:!query.toString().trim()&&'none'}} to='/dashboard/subcategories' className="btn btn-secondary me-3">
                                {messages.resetFilters}
                            </Link>,
                                <Link key="new_category" to="/dashboard/subcategories-add" className="btn btn-primary">
                                    {messages.newSubCategory}
                                </Link>,
                            ]}
                            breadcrumb={[
                                {title: messages.dashboard, url: '/dashboard'},
                                {title: messages.subCategories, url: ''},
                            ]}
                        />

                        {content}
                       
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}