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



export default function SubCategoryEdit ({match,history}) {
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
    
    
    const main = subCategory &&(
        <>
            <Card title="Basic information">
                <div className="mb-4">
                    <label htmlFor="form-category/name" className="form-label">
                        Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="form-category/name"
                        defaultValue={subCategory.name}
                        value={name}
                        onChange={e=>setName(e.target.value)}
                    />
                     {updateSubcategoryError &&
                      JSON.parse(updateSubcategoryError).name &&
                      (JSON.parse(updateSubcategoryError).name.toLowerCase().trim() ===
                      "SubCategory should have a name".toLowerCase().trim() ? (
                       <div id="form-product/slug-help" className="form-text text-danger">* يجب تحديد اسم الفئة *</div>
                      ) : JSON.parse(updateSubcategoryError)
                          .name.toLowerCase()
                          .trim() ===
                        "This Name is Not Valid".toLowerCase().trim() ? (
                       <div id="form-product/slug-help" className="form-text text-danger">* الفئة موجودة بالفعل *</div>
                      ) : (
                       <div id="form-product/slug-help" className="form-text text-danger">
                          * طول الفئة يجب الا يقل عن 3 حروف *
                        </div>
                      ))}
                </div>
                <div className="mb-4">
                    <label for="formFile-1" class="form-label">Image</label>
                    <input
                        ref={fileRef}
                        type="file"
                        class="form-control"
                        id="formFile-1"
                        onChange={e=>setPhoto(e.target.files[0])}
                    />
                     {updateSubcategoryError && JSON.parse(updateSubcategoryError).photo && (
                     <div id="form-product/slug-help" className="form-text text-danger">* يجب تحديد صورة *</div>
                    )}
                </div>
                
                <div className="mb-4">
                    <label htmlFor="form-category/slug" className="form-label">
                        Slug
                    </label>
                    <div className="input-group input-group--sa-slug">
                        <span className="input-group-text" id="form-category/slug-addon">
                            https://example.com/catalog/
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            id="form-category/slug"
                            aria-describedby="form-category/slug-addon form-category/slug-help"
                            defaultValue={subCategory.slug}
                             value={slug}
                            onChange={e=>setSlug(e.target.value)}
                        />
                    </div>
                    <div id="form-category/slug-help" className="form-text">
                        Unique human-readable category identifier. No longer than 255 characters.
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="form-category/description" className="form-label">
                        Description
                    </label>
                    <textarea
                        id="form-category/description"
                        className="sa-quill-control form-control"
                        rows={8}
                        defaultValue={subCategory.description}
                         value={description}
                        onChange={e=>setDescription(e.target.value)}
                    />
                </div>
            </Card>

            <Card
                title="Search engine optimization"
                help="Provide information that will help improve the snippet and bring your category to the top of search engines."
                className="mt-5"
            >
                <div className="mb-4">
                    <label htmlFor="form-category/seo-title" className="form-label">
                        Page title
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="form-category/seo-title"
                        defaultValue={subCategory.pageTitle}
                        value={pageTitle}
                        onChange={e=>setPageTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="form-category/seo-description" className="form-label">
                        Meta description
                    </label>
                    <textarea
                        id="form-category/seo-description"
                        className="form-control"
                        rows={4}
                        defaultValue={subCategory.metaDescription}
                        value={metaDescription}
                        onChange={e => setMetaDescription( e.target.value )}
                        
                    />
                </div>
            </Card>
        </>
    );

    const sidebar = (
        <>
            {(categories && subCategory) && (
                <Card title="Parent category" className="w-100 mt-5">
                    <select className="sa-select2 form-select" onChange={e=>setCategory(e.target.value)} value={subCategory.category}>
                        {categories.map( ( category, categoryIdx ) => (
                            <option key={categoryIdx} value={category._id}>{category.name}</option>
                        ) )}
                    </select>
                    <div className="form-text">
                        Select a category that will be the parent of the current one.
                    </div>
                </Card>
            )}
            {
                subCategory && (
                    <Card title="Image" className="w-100 mt-5">
                <div className="border p-4 d-flex justify-content-center">
                    <div className="max-w-20x">
                        <img src={`/uploads/imgs/subcategories/${ subCategory.photo }`} size={16 * 20} className="w-100 h-auto" />
                    </div>
                </div>
                <div className="mt-4 mb-n2">
                    {photo && (<Link onClick={e=>clickFileInput(e)} className="me-3 pe-2">Replace image</Link>) }
                    {!photo && (<Link onClick={e=>clickFileInput(e)} className="me-3 pe-2">Change image</Link>) }
                    {photo && ( <Link onClick={e => removeSelectedImage( e )} className="text-danger me-3 pe-2">Remove image</Link> )}
                
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
                            title="Edit Sub Category"
                            actions={[
                                // <a key="duplicate" href="#" className="btn btn-secondary me-3">
                                //     Duplicate
                                // </a>,
                                <Link key="save" onClick={e=>submitHandler(e)} className={buttonClasses}>
                                    Save
                                </Link>,
                            ]}
                            breadcrumb={[
                                {title: 'Dashboard', url: '/dashboard'},
                                {title: 'Categories', url: '/dashboard/subcategories'},
                                {title: 'Edit Category', url: ''},
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