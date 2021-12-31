//React
import React, { useEffect,useState } from 'react';

//third party
import classnames from 'classnames';
import PropType from 'prop-types';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';

//components
import PageHeader from '../shared/PageHeader'
import Card from '../shared/Card'
import BlockLoader from '../../components/blocks/BlockLoader';

//scripts / utils
import './../utils/containerQry'

//actions
import {
    getAllPermissions
}from '../../store/permissions'
import {
    getOneRoles,
    addPermissionToRoleHandler,
    resetAddRoleToPermission,
    removePermissionFromRoleHandler,
    removePermissionFromRoleReset,
    updateRoleDescription

} from './../../store/roles';
import { toast } from 'react-toastify';



export default function RoleEdit ( { history,match } ) {
    const roleId = match.params.id;

    //Load Permissions
    const allPermissions = useSelector( state => state.allPermissions )
    const { loading: loadingPermissions, error: loadingPermissionsError, permissions:permissionsList } = allPermissions;

    //select role
    const roleDetails = useSelector( state => state.roleDetails )
    const { loading: loadingRole, role, error: errorLoadingRole } = roleDetails;

    //add permssion to role 
    const addPermissionToRole = useSelector( state => state.addPermissionToRole )
    const { success: addRolePermissionSuccess } = addPermissionToRole;
    
    //remove permission from role
    const removePermissionFromRole = useSelector( state => state.removePermissionFromRole );
    const { success:removeRoleSuccess } = removePermissionFromRole;

    const [description, setDescription] = useState('')
    const [addNewOpen, setAddNewOpen] = useState( false );
    const [permissionId,setPermissionId]=useState(null)
    
   

    //size manage script
    useEffect( () => {
        window.stroyka.containerQuery();
    }, [loadingRole] );

    const dispatch = useDispatch();

    //dispatchRole
    useEffect( () => {
        if ( roleId ) {
            dispatch(getOneRoles(roleId))
        }
    },[])

    // useEffect( () => {
    //     if ( success ) {
    //         history.push( "/dashboard/roles-list" );
    //     }
    // }, [success, history] );

    //dispatch permissions
    useEffect( () => {
        if ( !permissionsList ) {
            dispatch(getAllPermissions())
        }
    }, [permissionsList] )

    //add/remove role action
    useEffect( () => {
        if ( addRolePermissionSuccess ) {
            setAddNewOpen(false)
            dispatch( resetAddRoleToPermission() )
            dispatch( getOneRoles( roleId ) )
        }

        if ( removeRoleSuccess ) {
            dispatch( removePermissionFromRoleReset() )
            dispatch( getOneRoles( roleId ) )
        }
        
    },[addRolePermissionSuccess,removeRoleSuccess])
    
    const addPermissionHandler = () => {
        if ( !permissionId ) {
            toast.warning('يجب تحديد صلاحية أولا',{theme:'colored'})
        } else {
            dispatch(addPermissionToRoleHandler(roleId,permissionId))
        }
    }

    const removeRoleHandler = (permissionId) => {
        dispatch(removePermissionFromRoleHandler(roleId,permissionId))
    }

    const updateDescriptionHandler = ( e ) => {
        e.preventDefault();
        if ( description.trim().length<1 ) {
            toast.warning(' يجب إضافة وصف جديد أولا ',{theme:'colored'})
        } else {
            dispatch(updateRoleDescription(roleId,description))
        }
    }
  


    const addNewPermissionSection = permissionsList && (
        <tbody>
            <tr>
                <td>
                    <select
                        type="text"
                        className="form-control"
                        onChange={e=>setPermissionId(e.target.value)}
                    >
                        <option selected disabled> Select Permission</option>
                        {permissionsList.map( ( permission,permissionIdx ) => (
                            <option
                                disabled={ (role && role.permissions)&&role.permissions.find(el=>el._id===permission._id)}
                                value={permission._id} key={permissionIdx}
                            > {permission.name}</option>
                        ) )}
                    </select>
                </td>
                <td>
                    <button
                        className="btn btn-sa-muted btn-sm mx-n3"
                        type="button"
                        aria-label="Delete image"
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="Add Permission"
                        style={{ minWidth: '50px' }}
                        onClick={addPermissionHandler}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            width="14"
                            height="14"
                            viewBox="-2 -2 14 14"
                        >
                            <path
                                fill="%233d464d"
                                d="M10,2.4L4.5,8L1,4.5l1.4-1.4l2.1,2.1L8.6,1L10,2.4z"
                            ></path>
                        </svg>
                    </button>
                    <button
                        className="btn btn-sa-muted btn-sm mx-n3"
                        type="button"
                        aria-label="Delete Feature"
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="Cancel"
                        style={{minWidth:'50px'}}
                        onClick={e => setAddNewOpen(false)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="currentColor"
                        >
                            <path
                                d="M10.8,10.8L10.8,10.8c-0.4,0.4-1,0.4-1.4,0L6,7.4l-3.4,3.4c-0.4,0.4-1,0.4-1.4,0l0,0c-0.4-0.4-0.4-1,0-1.4L4.6,6L1.2,2.6 c-0.4-0.4-0.4-1,0-1.4l0,0c0.4-0.4,1-0.4,1.4,0L6,4.6l3.4-3.4c0.4-0.4,1-0.4,1.4,0l0,0c0.4,0.4,0.4,1,0,1.4L7.4,6l3.4,3.4 C11.2,9.8,11.2,10.4,10.8,10.8z"
                            ></path>
                        </svg>
                    </button>
                                        
                </td>
            </tr>
                                
        </tbody>
    );


    const roleExistPermissions = ( role && role.permissions ) && (
        <Card
            title="Permissions"
            className="mt-5"
            body={
                <div className="mt-n5">
                    <input
                        // ref={specificationRef}
                        type="file"
                        className="form-control"
                        style={{ display: 'none' }}
                        id="formFile-1"
                        // onChange={e => setSpecificationPhoto( e.target.files[0] )}
                    />
                    <div className="sa-divider" />
                    <div className="table-responsive">
                        <table className="sa-table">
                            <thead>
                                <tr>
                                    <th className="w-min"> {role.permissions.length>0 ?'Permission':'No permissions added yet'} </th>
                                    <th className="w-min" />
                                </tr>
                            </thead>
                            <tbody>
                                {role.permissions.map( ( permission, imageIdx ) => (
                                    <tr key={imageIdx}>
                                        <td>
                                            {permission.name}
                                        </td>
                                       <td>
                                            <button
                                                className="btn btn-sa-muted btn-sm mx-n3"
                                                type="button"
                                                aria-label="Delete Feature"
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="right"
                                                title="Remove Permission"
                                                onClick={e => removeRoleHandler(permission._id)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 12 12"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        d="M10.8,10.8L10.8,10.8c-0.4,0.4-1,0.4-1.4,0L6,7.4l-3.4,3.4c-0.4,0.4-1,0.4-1.4,0l0,0c-0.4-0.4-0.4-1,0-1.4L4.6,6L1.2,2.6 c-0.4-0.4-0.4-1,0-1.4l0,0c0.4-0.4,1-0.4,1.4,0L6,4.6l3.4-3.4c0.4-0.4,1-0.4,1.4,0l0,0c0.4,0.4,0.4,1,0,1.4L7.4,6l3.4,3.4 C11.2,9.8,11.2,10.4,10.8,10.8z"
                                                    ></path>
                                                </svg>
                                            </button>
                                        </td>
                                        
                                    </tr>
                                ) )}

                                
                            </tbody>
                            {addNewOpen&& addNewPermissionSection }
                            </table>
                    </div>
                    <div className="sa-divider" />
                    <div className={classnames('px-5 py-4 my-2',{'d-none':addNewOpen})}>
                        <button className='btn btn-secondary' onClick={( e ) => { setAddNewOpen(true) }}>Add New Feature</button>
                    </div>
                </div>
            }
        />
    );

    
     const sidebar = permissionsList&&(
        <>
            <Card title="Permissions" className="w-100">
                {permissionsList.map( (permission,permissionIdx) => (
                    <label className=" mb-0 d-block mb-3" key={permissionIdx}>
                        {/* <input type="checkbox" className="form-check-input m-2" value={permission._id} onChange={e=>setPermissionHandler(e)}/> */}
                        <span className="form-check-label">{permission.name}</span>
                    </label>
                ) )}
                <div className="form-text">
                    Select a permissions that you need to assign to this Role.
                </div>
            </Card>
        </>
    );

      const main = role && (
        <>
            <Card title="Basic information">
                <div className="mb-4">
                    <label htmlFor="form-category/name" className="form-label">
                        Name <span>*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="form-category/name"
                        placeholder='Category Name'
                        defaultValue={role.name}
                        disabled
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="form-category/name" className="form-label">
                        Description <span>*</span>
                    </label>
                    <textarea
                        className="form-control"
                        id="form-category/name"
                        placeholder='Category Name'
                        rows='4'
                        defaultValue={role.description && role.description}
                        value={description}
                        onChange={e => setDescription( e.target.value )}
                    ></textarea>
                </div>
                <div className='mb-4'>
                    <button key="save" to="/" onClick={e => updateDescriptionHandler( e )} className="btn btn-primary">
                        Save
                    </button>
                </div>
            </Card>
            {roleExistPermissions}

        </>
    );


    if ( loadingRole ) {
        return <BlockLoader/>
    }

    return (
        <React.Fragment>
            <div id="top" className="sa-app__body">
                <div className="mx-sm-2 px-2 px-sm-3 px-xxl-4 pb-6">
                    <div className="container container--max--xl">
                        <PageHeader
                            title="Edit Role"
                            // actions={[
                            //     // <a key="duplicate" href="#" className="btn btn-secondary me-3">
                            //     //     Duplicate
                            //     // </a>,
                            //     <Link key="save" to="/"  className="btn btn-primary">
                            //         Save
                            //     </Link>,
                            // ]}
                            breadcrumb={[
                                { title: 'Dashboard', url: '/dashboard' },
                                { title: 'Roles', url: '/dashboard/roles-list' },
                                { title: 'Edit Role', url: '' },
                            ]}
                        />
                        <div
                            className="sa-entity-layout"
                            data-sa-container-query={JSON.stringify( { 920: 'sa-entity-layout--size--md', 1100: 'sa-entity-layout--size--lg' } )}
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