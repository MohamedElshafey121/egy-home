
//react
import React, { useEffect, useState } from 'react';

//third-party
import { useSelector,useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

//components
import Card from '../shared/Card';
import PageHeader from '../shared/PageHeader'
import BlockLoader from '../../components/blocks/BlockLoader';
import ReactQuill from 'react-quill'


//site scripts
import './../utils/containerQry'

//actions / application
import { handleGetAllCategories } from "../../store/category";
import { handleCreateSubCategory } from '../../store/subCategory';


//data stubs
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'


export default function SubCategoryAdd ( { history } ) {
    
    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )

    const fileRef = React.createRef();
    //store
    const allCategories = useSelector( ( state ) => state.allCategories );
    const { error, categories,loading} = allCategories;

    const createSubCategory = useSelector( ( state ) => state.createSubCategory );
    const { success, error: createSubError } = createSubCategory;

    //state
    const [name, setName] = useState();
    const [category, setCategory] = useState();
    const [photo, setPhoto] = useState();
    const [slug, setSlug] = useState();
    const [description, setDescription] = useState( '' )
    const [pageTitle, setPageTitle] = useState()
    const [metaDescription, setMetaDescription] = useState()  

    const dispatch = useDispatch();
    //site scripts
    useEffect( () => {
        window.stroyka.containerQuery();
    }, [loading] );

    //load categories
    useEffect( () => {
        // if ( !categories ) {
            dispatch( handleGetAllCategories() );
        // }
    }, [  dispatch] );

    //check success
    useEffect( () => {
        if ( success ) {
            history.push( "/dashboard/subCategories" );
        }
    }, [success, history] );


    //focus file ref
    const clickFileInput = ( e ) => {
        e.preventDefault();
        fileRef.current.click();
    }
    
    //add sub handler
    const submitHandler = ( e ) => {
        e.preventDefault();
        const subcategoryForm = new FormData();
        if(name) subcategoryForm.append( "name", name );
        if ( photo ) subcategoryForm.append( "photo", photo );
        if ( category ) subcategoryForm.append( "category", category );
        if ( slug ) subcategoryForm.append( 'slug', slug );
        if ( description ) subcategoryForm.append( 'description', description );
        if ( pageTitle ) subcategoryForm.append( 'pageTitle', pageTitle )
        if ( metaDescription ) subcategoryForm.append( 'metaDescription', metaDescription );

        dispatch( handleCreateSubCategory( subcategoryForm ) );
    };

    const removeSelectedImage = ( e ) => {
        e.preventDefault()
        setPhoto( null );
    };

    const main = (
        <>
            <Card title={messages.basicInformation}>
                <div className="mb-4">
                    <label htmlFor="form-category/name" className="form-label">
                        {messages.name}
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="form-category/name"
                        placeholder='SubCategory Name'
                        value={name}
                        onChange={e => setName( e.target.value )}
                    />
                    {createSubError &&
                        JSON.parse( createSubError ).name &&
                        ( JSON.parse( createSubError ).name.toLowerCase().trim() ===
                            "SubCategory should have a name".toLowerCase().trim() ? (
                            <div id="form-product/slug-help" className="form-text text-danger">* يجب تحديد اسم الفئة *</div>
                        ) : JSON.parse( createSubError )
                            .name.toLowerCase()
                            .trim() ===
                            "This Name is Not Valid".toLowerCase().trim() ? (
                            <div id="form-product/slug-help" className="form-text text-danger">* الفئة موجودة بالفعل *</div>
                        ) : (
                            <div id="form-product/slug-help" className="form-text text-danger">
                                * طول الفئة يجب الا يقل عن 3 حروف *
                            </div>
                        ) )}
                </div>
                <div className="mb-4">
                    <label for="formFile-1" class="form-label">{messages.image}</label>
                    <input
                        ref={fileRef}
                        type="file"
                        class="form-control"
                        id="formFile-1"
                        onChange={e => setPhoto( e.target.files[0] )}
                    />
                    {createSubError && JSON.parse( createSubError ).photo && (
                        <div id="form-product/slug-help" className="form-text text-danger">* يجب تحديد صورة *</div>
                    )}
                </div>
                
                <div className="mb-4">
                    <label htmlFor="form-category/description" className="form-label">
                        {messages.description}
                    </label>
                   
                    <ReactQuill
                        style={{ height: '200px', marginBottom: '70px' }}
                        theme='snow'
                        value={description}
                        onChange={setDescription}
                    />
                </div>
            </Card>
        </>
    );

    const sidebar = (
        <>
            {categories && (
                <Card title={messages.parentCategory} className="w-100">
                    <select className="sa-select2 form-select" onChange={e => {
                        return setCategory(e.target.value)
                    }}>
                        <option disabled selected value='' > {messages.categorySelect} </option>
                        {categories.map( ( category, categoryIdx ) => (
                            <option key={categoryIdx} value={category._id}>{ category.name}</option>
                        ) )}
                    </select>
                    <div className="form-text">
                        {messages.categorySelectMsg}
                    </div>
                </Card>
            )}
            <Card title={messages.image} className="w-100 mt-5">
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

    if ( loading ) {
        return <BlockLoader/>
    }
    return (
        <React.Fragment>
            <div id="top" className="sa-app__body">
                <div className="mx-sm-2 px-2 px-sm-3 px-xxl-4 pb-6">
                    <div className="container container--max--xl">
                        <PageHeader
                            title={messages.addSubCategory}
                            actions={[
                                // <a key="duplicate" href="#" className="btn btn-secondary me-3">
                                //     Duplicate
                                // </a>,
                                <Link key="save" onClick={e=>submitHandler(e)} className="btn btn-primary">
                                    {messages.save}
                                </Link>,
                            ]}
                            breadcrumb={[
                                {title: messages.dashboard, url: '/dashboard'},
                                {title: messages.subCategories, url: '/dashboard/subcategories'},
                                {title: messages.addSubCategory, url: ''},
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