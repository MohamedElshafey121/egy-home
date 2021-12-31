import React,{useEffect,useState} from 'react';
import { Link,useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { url } from '../../services/utils';
import MoreButton from "../shared/MoreButton";
import PageHeader from '../shared/PageHeader'
import Pagination from '../../components/shared/Pagination'
import BlockLoader from '../../components/blocks/BlockLoader'

//application
import {
    handleGetAllCategories,
    createCategoryReset,
    updateOneCategoryReset
} from "../../store/category"
import{getAllRoles,resetCreateRole} from '../../store/roles'

function useQuery () {
    // return new URLSearchParams(location.search)
    return new URLSearchParams(useLocation().search)
}
export default function RoleList ({history}) {
    //query
    const query = useQuery();
    const name = query.get( 'name' ) || ''
    const limit = 20;
    const page = query.get( 'page' ) || 1;
    const [sort, setSort] = useState( ' ' );
    const filterObj = {name}
    
    
    //select roles
    const allRoles = useSelector( state => state.allRoles )
    const { roles, loading, error, page: currentPage, count } = allRoles;
    
    const createRole = useSelector( ( state ) => state.createRole );
    const {  success } = createRole;

    

    const dispatch = useDispatch()
    //load roles
    useEffect( () => {
        dispatch(getAllRoles())
    },[])

    useEffect( () => {
        dispatch( handleGetAllCategories(filterObj, limit, sort, page) )
    }, [ dispatch, name,page] )
    

    // RESET CREATE
     useEffect( () => {
        if ( success ) {
            dispatch(resetCreateRole())
        }
    }, [dispatch,success] )
    
    
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
                        {/* <th className="w-min" data-orderable="false" style={{ position: 'relative' }}>
                            <input type="checkbox" className="form-check-input m-0 fs-exact-16 d-block" aria-label="..." />
                        </th> */}
                        {/* <th className="min-w-15x" style={{ paddingLeft: "30px" }}>Name</th> */}
                        <th className="min-w-15x" >Name</th>
                        <th>Permissions</th>
                        {/* <th>Items</th> */}
                        <th>created At</th>
                        <th className="w-min" data-orderable="false" />
                    </tr>
                </thead>
                <tbody>
                    {roles && roles.map( ( role, roleIdx ) => (
                        <tr key={roleIdx}>
                            
                            <td>
                                <Link to={`/dashboard/roles/${ role._id }`}>
                                {role.name}
                                </Link>
                            </td>
                            
                            <td>
                                {role.name.toLowerCase()==='admin'?"جميع الصلاحيات":role.permissions.length}
                            </td>
                            <td>
                                {new Date( role.createdAt ).toDateString()}
                            </td>
                            <td>
                                <MoreButton id={`category-context-menu-${ roleIdx }`} roleIdx={role._id} />
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
                            title="Roles"
                            actions={[
                                <Link key="new_category" to="/dashboard/roles-add" className="btn btn-primary">
                                    New Role
                                </Link>,
                            ]}
                            breadcrumb={[
                                {title: 'Dashboard', url: '/dashboard'},
                                {title: 'Roles', url: ''},
                            ]}
                        />

                        <div className="card">
                            <div className="p-4">
                                <input
                                    onKeyUp={e=>searchByNameHandler(e.target.value)}
                                    type="text"
                                    placeholder="Start typing to search for categories"
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
