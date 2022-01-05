import React,{useEffect,useState} from 'react';
import { Link,useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { url } from '../../services/utils';
import MoreButton from "../shared/MoreButton";
import PageHeader from '../shared/PageHeader'
import Pagination from '../../components/shared/Pagination'
import BlockLoader from '../../components/blocks/BlockLoader'

//data stubs
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'


//application
import {
    handleGetAllCategories,
    createCategoryReset,
    updateOneCategoryReset
} from "../../store/category"

function useQuery () {
    // return new URLSearchParams(location.search)
    return new URLSearchParams(useLocation().search)
}
export default function CategoriesList ( { history } ) {
    
    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
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
    

    const allCategories = useSelector( state => state.allCategories )
    const { loading, error, categories, page: currentPage, count } = allCategories;
    
    const createCategory = useSelector( state => state.createCategory );
    const { success } = createCategory;

    const updateCategory = useSelector( state => state.updateCategory );
    const {success:updateCategorySuccess } = updateCategory;
    

    const dispatch=useDispatch()
    useEffect( () => {
        dispatch( handleGetAllCategories(filterObj, limit, sort, page) )
    }, [ dispatch, name,page] )
    

    //RESET CREATE
     useEffect( () => {
        if ( success ) {
            dispatch(createCategoryReset())
        }
    }, [dispatch,success] )
    
    //RESET UPDATE
    useEffect( () => {
        if ( updateCategorySuccess){
            dispatch(updateOneCategoryReset())
        }
    }, [updateCategorySuccess] )
    
    //search handler
     const searchByNameHandler = ( name ) => {
        if ( query) {
            if ( query.get( 'name' ) && query.get( 'name' ).trim() ) {
                    query.set( 'name', name );
                    history.push(`/dashboard/categories?${query}`)                
            } else {
                query.delete( 'name' );
                history.push(`/dashboard/categories?${query}&name=${name}`)
            }
        }
        else {
            history.push(`/dashboard/categories?name=${name}`)
        }
    }

    //pagination handler
    const handleStepsPushHandler = ( page ) => {
        if ( query) {
            if ( query.get( 'page' ) && query.get( 'page' ).trim() ) {
                    query.set( 'page', page );
                    history.push(`/dashboard/categories?${query}`)                
            } else {
                history.push(`/dashboard/categories?${query}&page=${page}`)
            }
        }
        else {
            history.push(`/dashboard/categories?page=${page}`)
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
                        <th>{messages.items}</th>
                        <th>{messages.createdAt}</th>
                        <th className="w-min" data-orderable="false" />
                    </tr>
                </thead>
                <tbody>
                    {categories && categories.map( ( category, categoryIdx ) => (
                        <tr key={categoryIdx}>
                            <td style={{ position: 'relative' }}>
                                <input type="checkbox" className="form-check-input m-0 fs-exact-16 d-block" aria-label="..." />
                            </td>
                            <td>
                                <div className="d-flex align-items-center" style={{ marginLeft: "30px" }}>
                                    <Link to={url.categoryDashboard( category )} className="me-4">
                                        <div className="sa-symbol sa-symbol--shape--rounded sa-symbol--size--lg">
                                            <img src={`/uploads/imgs/categories/${ category.photo }`} alt="" />
                                        </div>
                                    </Link>
                                    <div>
                                        <Link to={url.categoryDashboard( category )} className="text-reset">{category.name}</Link>
                                        
                                    </div>
                                </div>
                            </td>
                            <td>
                                {category.subCategories && category.subCategories.length}
                            </td>
                            <td>
                                {new Date( category.createdAt ).toDateString()}
                            </td>
                            <td>
                                <MoreButton id={`category-context-menu-${ categoryIdx }`} categoryId={category._id} />
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
                            title={messages.categories}
                            actions={[
                                <Link key="reset" style={{display:!query.toString().trim()&&'none'}} to='/dashboard/categories' className="btn btn-secondary me-3">
                                {messages.resetFilters}
                            </Link>,
                                <Link key="new_category" to="/dashboard/categories-add" className="btn btn-primary">
                                    {messages.AddNewCategory}
                                </Link>,
                            ]}
                            breadcrumb={[
                                {title: `${messages.dashboard}`, url: '/dashboard'},
                                {title: messages.categories, url: ''},
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
