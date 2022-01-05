//React
import React, { useEffect,useState } from 'react';

//third party
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill'

//components
import PageHeader from '../shared/PageHeader'
import Card from '../shared/Card'

//scripts / utils
import './../utils/containerQry'

//data stubs
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'


//actions
import { handleCreateCategory } from "../../store/category";


export default function CategoryAdd ( { history } ) {
    
    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )


    //size manage script
    useEffect( () => {
        window.stroyka.containerQuery();
    }, [] );

    //category create Start
    const createCategory = useSelector( ( state ) => state.createCategory );
    const { loading, category, success, error } = createCategory;

    const [name, setName] = useState();
    const [photo, setPhoto] = useState();
    const [photoName,setPhotoName]=useState()
    const [slug, setSlug] = useState();
    const [description, setDescription] = useState( '' );
    const [pageTitle, setPageTitle] = useState()
    const [metaDescription, setMetaDescription] = useState()    

    const dispatch = useDispatch();
    useEffect( () => {
        if ( success ) {
            history.push( "/dashboard/categories" );
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
        const categoryForm = new FormData();
        if(name) categoryForm.append( "name", name );
        if ( photo ) categoryForm.append( "photo", photo );
        if ( slug ) categoryForm.append( 'slug', slug );
        if ( description ) categoryForm.append( 'description', description );
        if ( pageTitle ) categoryForm.append( 'pageTitle', pageTitle )
        if ( metaDescription ) categoryForm.append( 'metaDescription', metaDescription );
        dispatch( handleCreateCategory( categoryForm ) );
    };

    const removeSelectedImage = ( e ) => {
        e.preventDefault()
        setPhoto( null );
        setPhotoName('')
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
                        placeholder='Category Name'
                        value={name}
                        onChange={e => setName( e.target.value )}
                    />
                    {error &&
                        JSON.parse( error ).name &&
                        ( JSON.parse( error ).name.toLowerCase().trim() ===
                            "category should have a name" ? (
                            <div id="form-product/slug-help" className="form-text text-danger">* يجب تحديد الاسم *</div>
                        ) : JSON.parse( error ).name.toLowerCase().trim() ===
                            "name is already exist".toLowerCase() ? (
                            <div id="form-product/slug-help" className="form-text text-danger">
                                * هذه الفئة موجودة بالفعل *
                            </div>
                        ) : (
                            <div id="form-product/slug-help" className="form-text text-danger">
                                * اسم الفئة يجب الا يقل عن 3 حروف *
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
                        value={photoName}
                        onChange={e => {
                            setPhoto( e.target.files[0] )
                            setPhotoName( e.target.value )
                        }}
                    // onChange={e=>readImgSrc(e)}
                    />
                    {error && JSON.parse( error ).photo && (
                        <div id="form-product/slug-help" className="form-text text-danger">* يجب تحديد صورة المنتج *</div>
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
            <Card title={messages.image} className="w-100 mt-5">
                <div className="border p-4 d-flex justify-content-center">
                    <div className="max-w-20x">
                        {
                            photo
                                ? <img src={URL.createObjectURL( photo )} className="w-100 h-auto" alt=""/>
                                : <img src='http://placehold.it/700x700' className="w-100 h-auto" alt=""/>
                        }
                        
                    </div>
                </div>
                <div className="mt-4 mb-n2">
                    {photo && (<Link onClick={e=>clickFileInput(e)} className="me-3 pe-2">Replace image</Link>) }
                    {photo &&(<Link onClick={e=>removeSelectedImage(e)} className="text-danger me-3 pe-2">Remove image</Link>)} 
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
                            title={messages.AddNewCategory}
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
                                {title: messages.categories, url: '/dashboard/categories'},
                                {title: messages.AddNewCategory, url: ''},
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