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
    getOneBrand,
    updateBrandHnadler
}from '../../store/brand'



export default function BrandEdit ({history,match}) {
   const brandId=match.params.id;

    //get brand 
    const updateBrand = useSelector( ( state ) => state.updateBrand );
    const { success, error } = updateBrand;

    const getBrand = useSelector( ( state ) => state.getBrand )
    const {loading:loadingBrand,brand,error:gettingBrandError } = getBrand;

    const [name, setName] = useState();
    const [photo, setPhoto] = useState();
    const [photoName,setPhotoName]=useState()
    const [description, setDescription] = useState();

     //size manage script
    useEffect( () => {
        window.stroyka.containerQuery();
    }, [loadingBrand] );


    const dispatch = useDispatch();

    //load brand
    useEffect( () => {
        // if ( brandId ) {
        dispatch( getOneBrand( brandId ) );
        // }
    },[])

    //check successful update
    useEffect( () => {
        if ( success ) {
            history.push( "/dashboard/brands" );
        }
    }, [success, history] );

    //focus file ref
    const fileRef = React.createRef();
    const clickFileInput = ( e ) => {
        e.preventDefault();
        fileRef.current.click();
    }

    const submitHandler = ( e ) => {
        e.preventDefault();
        const brandForm = new FormData();
        if(name) brandForm.append( "name", name );
        if ( photo ) brandForm.append( "photo", photo );
        if ( description ) brandForm.append( 'description', description );
       
        dispatch( updateBrandHnadler(brandId,brandForm) );
    };

    const removeSelectedImage = ( e ) => {
        e.preventDefault()
        setPhoto( null );
        setPhotoName('')
    };

    const main = (
        <>
            {brand && (
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
                        defaultValue={brand.name}
                        value={name}
                        onChange={e => setName( e.target.value )}
                    />
                </div>
                <div className="mb-4">
                    <label for="formFile-1" class="form-label">Image <span>*</span> </label>
                    <input
                        ref={fileRef}
                        type="file"
                        class="form-control"
                        id="formFile-1"
                        value={photoName}
                        onChange={e => {
                            setPhoto( e.target.files[0] )
                            setPhotoName( e.target.value )
                        }}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="form-category/description" className="form-label">
                        Description
                    </label>
                     <textarea
                        id="form-category/description"
                        className="sa-quill-control form-control"
                        rows={8}
                            placeholder="Category Description"
                            defaultValue={brand.description}
                        value={description}
                        onChange={e=>setDescription(e.target.value)}
                    />
                </div>
            </Card>
        
            )}
        </>
    );

    const sidebar = (
        <>
            <Card title="Image" className="w-100">
                <div className="border p-4 d-flex justify-content-center">
                    <div className="max-w-20x">
                        {
                            photo
                                ? <img src={URL.createObjectURL( photo )} className="w-100 h-auto" alt="" />
                                : <img src='http://placehold.it/700x700' className="w-100 h-auto" alt="" />
                        }
                        
                    </div>
                </div>
                <div className="mt-4 mb-n2">
                    {photo && ( <Link onClick={e => clickFileInput( e )} className="me-3 pe-2">Replace image</Link> )}
                    {photo && ( <Link onClick={e => removeSelectedImage( e )} className="text-danger me-3 pe-2">Remove image</Link> )}
                </div>
            </Card>
        </>
    );
    
    if ( loadingBrand ) {
        return <BlockLoader/>
    }

    return (
        <React.Fragment>
            <div id="top" className="sa-app__body">
                <div className="mx-sm-2 px-2 px-sm-3 px-xxl-4 pb-6">
                    <div className="container container--max--xl">
                        <PageHeader
                            title="Edit Brand"
                            actions={[
                                // <a key="duplicate" href="#" className="btn btn-secondary me-3">
                                //     Duplicate
                                // </a>,
                                <Link key="save" onClick={e=>submitHandler(e)} className="btn btn-primary">
                                    Save
                                </Link>,
                            ]}
                            breadcrumb={[
                                {title: 'Dashboard', url: '/dashboard'},
                                {title: 'Categories', url: '/dashboard/categories'},
                                {title: 'Add Category', url: ''},
                            ]}
                        />
                        <div
                            className="sa-entity-layout"
                            data-sa-container-query={JSON.stringify({920: 'sa-entity-layout--size--md', 1100: 'sa-entity-layout--size--lg'})}
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