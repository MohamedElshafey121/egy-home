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

//scripts / utils
import './../utils/containerQry'

//actions
import {
    getAllPermissions
}from '../../store/permissions'
import {createNewRole} from './../../store/roles'



export default function RoleAdd ({history}) {
    //size manage script
    useEffect( () => {
        window.stroyka.containerQuery();
    }, [] );


    //Load Permissions
    const allPermissions = useSelector( state => state.allPermissions )
    const { loading: loadingPermissions, error: loadingPermissionsError, permissions:permissionsList } = allPermissions;

    //category create Start
    const createRole = useSelector( ( state ) => state.createRole );
    const { loading, success, error } = createRole;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('')
    const [permissions, setPermissions] = useState( [] )
    
    const setPermissionHandler = ( e ) => {
        const newPermission = e.target.value;
        let newPermssionsList;

        if ( e.target.checked ) {
            setPermissions( [...permissions, newPermission] )
        } else {
            newPermssionsList = permissions.filter( el => el !== newPermission );
            setPermissions([...newPermssionsList])
        }
    }

    const dispatch = useDispatch();
    useEffect( () => {
        if ( success ) {
            history.push( "/dashboard/roles-list" );
        }
    }, [success, history] );

    //dispatch permissions
    useEffect( () => {
        if ( !permissionsList ) {
            dispatch(getAllPermissions())
        }
    },[permissionsList])
  
    const submitHandler = ( e ) => {
        e.preventDefault();
        dispatch( createNewRole( {
            name: name.trim(),
            description:description.trim(),
            permissions
        } ) )
    };

    
    const main = (
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
                        value={name}
                        onChange={e => setName( e.target.value )}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="form-category/name" className="form-label">
                        Description <span>*</span>
                    </label>
                    <textarea
                        type="text"
                        className="form-control"
                        id="form-category/name"
                        placeholder='Category Name'
                        rows='4'
                        value={description}
                        onChange={e => setDescription( e.target.value )}
                    ></textarea>
                </div>
                <div className='mb-4'>
                    <Link key="save" to="/" onClick={e => submitHandler( e )} className="btn btn-primary">
                        Save
                    </Link>
                </div>
            </Card>
        </>
    );

    const sidebar = permissionsList&&(
        <>
            <Card title="Permissions" className="w-100">
                {permissionsList.map( (permission,permissionIdx) => (
                    <label className=" mb-0 d-block mb-3" key={permissionIdx}>
                        <input type="checkbox" className="form-check-input m-2" value={permission._id} onChange={e=>setPermissionHandler(e)}/>
                        <span className="form-check-label">{permission.name}</span>
                    </label>
                ) )}
                <div className="form-text">
                    Select a permissions that you need to assign to this Role.
                </div>
            </Card>
        </>
    );

  return (
        <React.Fragment>
            <div id="top" className="sa-app__body">
                <div className="mx-sm-2 px-2 px-sm-3 px-xxl-4 pb-6">
                    <div className="container container--max--xl">
                        <PageHeader
                            title="Add New Role"
                            // actions={[
                            //     // <a key="duplicate" href="#" className="btn btn-secondary me-3">
                            //     //     Duplicate
                            //     // </a>,
                            //     <Link key="save" to="/" onClick={e => submitHandler( e )} className="btn btn-primary">
                            //         Save
                            //     </Link>,
                            // ]}
                            breadcrumb={[
                                { title: 'Dashboard', url: '/dashboard' },
                                { title: 'Roles', url: '/dashboard/roles-list' },
                                { title: 'Add Role', url: '' },
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