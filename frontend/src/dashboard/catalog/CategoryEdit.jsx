//react
import React, { useEffect,useState } from 'react';

//third party
import classnames from 'classnames';
import PropType from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


//components
import BlockLoader from '../../components/blocks/BlockLoader';
import PageHeader from '../shared/PageHeader'
import Card from '../shared/Card'
import ReactQuill from 'react-quill'

//application
import './../utils/containerQry'

//actions
import { getOneCategory, updateOneCategory } from "../../store/category";


export default function CategoryEdit ( { history,match } ) {
    const categoryId = match.params.id;
   
    //store
    const getCategory = useSelector( state => state.getCategory )
    const { loading, category, error } = getCategory

    const updateCategory = useSelector( state => state.updateCategory );
    const {error:updateCategoryError,success } = updateCategory;
    
    //state
    const [name, setName] = useState();
    const [photo, setPhoto] = useState();
    const [photoName,setPhotoName]=useState()
    const [slug, setSlug] = useState();
    const [description, setDescription] = useState( '' )
    const [pageTitle, setPageTitle] = useState()
    const [metaDescription, setMetaDescription] = useState()    

    const dispatch = useDispatch()
     //side scripts
    useEffect( () => {
        window.stroyka.containerQuery();
    }, [loading] );

    //load Category
    useEffect( () => {
        dispatch( getOneCategory( categoryId ) );
        // if ( !category ) {

        // } else if (category._id!==categoryId) {
        //     dispatch( getOneCategory( categoryId ) );

        // } 
    }, [dispatch, categoryId] )

    //redirect
    useEffect( () => {
        if ( success ) {
            history.push('/dashboard/categories')
        }
    },[success])
    
    
    //Handlers
    const submitHandler = ( e ) => {
        e.preventDefault();
        const categoryForm = new FormData();
        if(name) categoryForm.append( "name", name );
        if ( photo ) categoryForm.append( "photo", photo );
        if ( slug ) categoryForm.append( 'slug', slug );
        if ( description ) categoryForm.append( 'description', description );
        if ( pageTitle ) categoryForm.append( 'pageTitle', pageTitle )
        if ( metaDescription ) categoryForm.append( 'metaDescription', metaDescription );
        dispatch( updateOneCategory(categoryId, categoryForm ) );
    };

    const removeSelectedImage = ( e ) => {
        e.preventDefault()
        setPhoto();
        setPhotoName()
    };

    //focus file ref
    const fileRef = React.createRef();
    const clickFileInput = ( e ) => {
        e.preventDefault();
        fileRef.current.click();
    }


    const buttonClasses = classnames( 'btn btn-primary', {
        'disabled': !(name||photo||slug||description||pageTitle||metaDescription)
    })
    
    const main = ( category && category.name ) && (
        <>
            <Card title="Basic information">
                <div className="mb-4">
                    <label htmlFor="form-category/name" className="form-label">
                        Name
                    </label>
                    <input type="text" className="form-control" id="form-category/name" defaultValue={category.name}
                        value={name}
                        onChange={e => setName( e.target.value )}
                    />
                    {updateCategoryError &&
                      JSON.parse(updateCategoryError).name &&
                      (JSON.parse(updateCategoryError).name.toLowerCase().trim() ===
                      "category should have a name" ? (
                        <div id="form-product/slug-help" className="form-text text-danger">* يجب تحديد الاسم *</div>
                      ) : JSON.parse(updateCategoryError).name.toLowerCase().trim() ===
                        "name is already exist".toLowerCase() ? (
                        <div id="form-product/slug-help" className="form-text text-danger">
                          * هذه الفئة موجودة بالفعل *
                        </div>
                      ) : (
                        <div id="form-product/slug-help" className="form-text text-danger">
                          * اسم الفئة يجب الا يقل عن 3 حروف *
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
                        value={photoName}
                        onChange={e => {
                            setPhoto( e.target.files[0] )
                            setPhotoName( e.target.value )
                        }}
                    />
                    {updateCategoryError && JSON.parse(updateCategoryError).photo && (
                       <div id="form-product/slug-help" className="form-text text-danger">* يجب تحديد صورة المنتج *</div>
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
                            defaultValue={category.slug}
                            value={slug}
                            onChange={e => setSlug( e.target.value )}
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
                    <ReactQuill
                        theme='snow'
                        // defaultValue={category.description}
                        value={description?description:category.description}
                        onChange={setDescription}
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
                        defaultValue={category.pageTitle}
                        value={pageTitle}
                        onChange={e => setPageTitle( e.target.value )}
                    />
                </div>
                <div>
                    <label htmlFor="form-category/seo-description" className="form-label">
                        Meta description
                    </label>
                    <textarea
                        id="form-category/seo-description"
                        className="form-control"
                        rows={5}
                        defaultValue={category.metaDescription}
                        value={metaDescription}
                        onChange={e => setMetaDescription( e.target.value )}
                    />
                     {updateCategoryError &&
                      JSON.parse(updateCategoryError).metaDescription &&
                      (JSON.parse(updateCategoryError).metaDescription.toLowerCase().trim() ===
                      "seo description is required" ? (
                        <div id="form-product/slug-help" className="form-text text-danger">* يجب تحديد الاسم *</div>
                      ) : (
                        <div id="form-product/slug-help" className="form-text text-danger">
                          * اسم الفئة يجب الا يقل عن 20 حروف *
                        </div>
                      ))}
                </div>
            </Card>
        </>
    );

    const sidebar = category && (
        <>
            <Card title="Image" className="w-100 mt-5">
                <div className="border p-4 d-flex justify-content-center">
                    <div className="max-w-20x">
                        {photo
                            ? <img src={URL.createObjectURL( photo )} className="w-100 h-auto" alt=""/>
                            : <img src={`/uploads/imgs/categories/${ category.photo }`} size={16 * 20} className="w-100 h-auto" alt=""/>
                        }
                    </div>
                </div>
                <div className="mt-4 mb-n2">
                    
                    {photo && (<Link onClick={e=>clickFileInput(e)} className="me-3 pe-2">Replace image</Link>) }
                    {!photo && (<Link onClick={e=>clickFileInput(e)} className="me-3 pe-2">Change image</Link>) }
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
                            title="Edit Category"
                            actions={[
                                // <a key="duplicate" href="#" className="btn btn-secondary me-3">
                                //     Duplicate
                                // </a>,
                                <Link key="save" onClick={e=>submitHandler(e)} className={buttonClasses}>
                                    Update
                                </Link>,
                            ]}
                            breadcrumb={[
                                {title: 'Dashboard', url: '/dashboard'},
                                {title: 'Categories', url: '/dashboard/categories'},
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