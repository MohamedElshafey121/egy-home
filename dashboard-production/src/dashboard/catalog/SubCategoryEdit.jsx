//react
import React, { useEffect, useState } from 'react';

//third-party
import classnames from 'classnames';
import PropType from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

// Component
import PageHeader from '../shared/PageHeader'
import BlockLoader from '../../components/blocks/BlockLoader';
import Card from '../shared/Card';
import ReactQuill from 'react-quill'

//site scripts / services
import './../utils/containerQry'

//actions / application
import { handleGetAllCategories } from "../../store/category";
import { getOneSubcategory,updateOneCategory } from "../../store/subCategory";

//data stubs
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'



export default function SubCategoryEdit ( { match, history } ) {
    
    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )

    const fileRef = React.createRef();
    const subCategoryId = match.params.id;

    //store
    const allCategories = useSelector( ( state ) => state.allCategories );
    const { error, categories, loading } = allCategories;

    const getSubcategory = useSelector( ( state ) => state.getSubcategory )
    const { loading: loadingSubcategory, subCategory, error: loadingSubcategoryError } = getSubcategory
    
    const updateSubcategory = useSelector( ( state ) => state.updateSubcategory );
    const {success,error:updateSubcategoryError } = updateSubcategory;
    
    //state
    const [name, setName] = useState();
    const [category, setCategory] = useState();
    const [photo, setPhoto] = useState();
    const [slug, setSlug] = useState();
    const [description, setDescription] = useState( '' )
    const [pageTitle, setPageTitle] = useState()
    const [metaDescription, setMetaDescription] = useState()  

    //load site scripts
    useEffect( () => {
        window.stroyka.containerQuery();
    }, [loading,loadingSubcategory] );

    const dispatch=useDispatch()
    useEffect( () => {
        //load categories
        dispatch( handleGetAllCategories() );
        //load subCategory
        dispatch(getOneSubcategory(subCategoryId))
    }, [dispatch] );

    useEffect( () => {
        if ( success ) {
            history.push( '/dashboard/subcategories' )
        }
    }, [history, success] );

    //focus file ref
    const clickFileInput = ( e ) => {
        e.preventDefault();
        fileRef.current.click();
    }

    const removeSelectedImage = ( e ) => {
        e.preventDefault()
        setPhoto();
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

        dispatch( updateOneCategory(subCategoryId,subcategoryForm) );
    };
    
    
    const main = subCategory && (
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
                        defaultValue={subCategory.name}
                        value={name}
                        onChange={e => setName( e.target.value )}
                    />
                    {updateSubcategoryError &&
                        JSON.parse( updateSubcategoryError ).name &&
                        ( JSON.parse( updateSubcategoryError ).name.toLowerCase().trim() ===
                            "SubCategory should have a name".toLowerCase().trim() ? (
                            <div id="form-product/slug-help" className="form-text text-danger">* يجب تحديد اسم الفئة *</div>
                        ) : JSON.parse( updateSubcategoryError )
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
                    {updateSubcategoryError && JSON.parse( updateSubcategoryError ).photo && (
                        <div id="form-product/slug-help" className="form-text text-danger">* يجب تحديد صورة *</div>
                    )}
                </div>
                
                <div className="mb-4">
                    <label htmlFor="form-category/description" className="form-label">
                        {messages.description}
                    </label>
                    <textarea
                        id="form-category/description"
                        className="sa-quill-control form-control"
                        rows={8}
                        defaultValue={subCategory.description}
                        value={description}
                        onChange={e => setDescription( e.target.value )}
                    />
                </div>
            </Card>
        </>
    );

    const sidebar = (
        <>
            {(categories && subCategory) && (
                <Card title={messages.parentCategory} className="w-100 mt-5">
                    <select className="sa-select2 form-select" onChange={e=>setCategory(e.target.value)} value={subCategory.category}>
                        {categories.map( ( category, categoryIdx ) => (
                            <option key={categoryIdx} value={category._id}>{category.name}</option>
                        ) )}
                    </select>
                    <div className="form-text">
                        {messages.categorySelectMsg}
                    </div>
                </Card>
            )}
            {
                subCategory && (
                    <Card title={messages.image} className="w-100 mt-5">
                <div className="border p-4 d-flex justify-content-center">
                    <div className="max-w-20x">
                        {(subCategory.photo && !photo)&& <img src={`/uploads/imgs/subcategories/${ subCategory.photo }`} size={16 * 20} className="w-100 h-auto" alt="" />}
                        {photo && <img src={URL.createObjectURL(photo)} size={16 * 20} className="w-100 h-auto" alt="" />}
                    </div>
                </div>
                <div className="mt-4 mb-n2">
                    {photo && (<Link onClick={e=>clickFileInput(e)} className="me-3 pe-2">{messages.replaceImage}</Link>) }
                    {!photo && (<Link onClick={e=>clickFileInput(e)} className="me-3 pe-2">{messages.changeImage}</Link>) }
                    {photo && ( <Link onClick={e => removeSelectedImage( e )} className="text-danger me-3 pe-2">{messages.removeImage}</Link> )}
                
                </div>
            </Card>
        
                )
            }
        </>
    );

    if ( loading || loadingSubcategory) {
        return <BlockLoader/>
    }

    const buttonClasses = classnames( 'btn btn-primary', {
        'disabled': !(name||photo||slug||description||pageTitle||metaDescription)
    } )
    
    return (
        <React.Fragment>
            <div id="top" className="sa-app__body">
                <div className="mx-sm-2 px-2 px-sm-3 px-xxl-4 pb-6">
                    <div className="container container--max--xl">
                        <PageHeader
                            title={messages.editSubcategory}
                            actions={[
                                // <a key="duplicate" href="#" className="btn btn-secondary me-3">
                                //     Duplicate
                                // </a>,
                                <Link key="save" onClick={e=>submitHandler(e)} className={buttonClasses}>
                                    {messages.save}
                                </Link>,
                            ]}
                            breadcrumb={[
                                {title: messages.dashboard, url: '/dashboard'},
                                {title: messages.subCategories, url: '/dashboard/subcategories'},
                                {title: messages.editCategory, url: ''},
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