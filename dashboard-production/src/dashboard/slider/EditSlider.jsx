//React
import React, { useEffect,useState } from 'react';

//third party
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';

//components
import PageHeader from '../shared/PageHeader'
import Card from '../shared/Card'

//scripts / utils
import './../utils/containerQry'

//actions
import {
    addSliderItemHandler,
    getOneSliderItemHandler,
    editSliderItemHandler
}from '../../store/slider'

//data stubs
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'
import classNames from 'classnames';



export default function EditSlider ( { history, match } ) {
    const sliderId = match.params.id;

    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )

    const editSlider = useSelector( (state) => state.editSlider )
    const { success,loading:editLoading } = editSlider;

    const oneSlider = useSelector( state => state.oneSlider )
    const { success: getSliderSuccess, loading, error, slider } = oneSlider;
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )

    //size manage script
    useEffect( () => {
        window.stroyka.containerQuery();
    }, [loading] );

    useEffect( () => {
        if ( success ) {
            history.push( '/dashboard/sliders' )
        }
    }, [success, history] );

    useEffect( () => {
        dispatch(getOneSliderItemHandler(sliderId))
    },[])

    
    const [photo, setPhoto] = useState('');
    const[phonePhoto,setPhonePhoto]=useState('')
    // const [photoName,setPhotoName]=useState('')
    const [redirect, setRedirect] = useState('');
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');


    const dispatch = useDispatch();
    
    //focus file ref
    const fileRef = React.createRef();
    const clickFileInput = ( e ) => {
        e.preventDefault();
        fileRef.current.click();
    }

    const submitHandler = ( e ) => {
        e.preventDefault();
        const SliderForm = new FormData();
        if(redirect) SliderForm.append( "redirect", redirect );
        if ( photo ) SliderForm.append( "photo", photo );
        if ( phonePhoto ) SliderForm.append( "phonePhoto", phonePhoto );
        if ( description ) SliderForm.append( 'description', description );
        if ( title ) SliderForm.append( 'title', title );
        
        dispatch( editSliderItemHandler(sliderId,SliderForm) );
    };

    const removeSelectedImage = ( e ) => {
        e.preventDefault()
        setPhoto( null );
    };

    const main =slider&& (
        <>
            <Card title={messages.basicInformation}>
                <div className="mb-4">
                    <label for="formFile-1" class="form-label">{messages.desktopImage} (840*395) <span>*</span> </label>
                    <input
                        ref={fileRef}
                        type="file"
                        class="form-control"
                        id="formFile-1"
                        // value={photoName}
                        onChange={e => {
                            setPhoto( e.target.files[0] )
                            // setPhotoName( e.target.value )
                        }}
                    />
                </div>
                <div className="mb-4">
                    <label for="formFile-1" class="form-label">{messages.mobileImage} (510*395) <span>*</span> </label>
                    <input
                        ref={fileRef}
                        type="file"
                        class="form-control"
                        id="formFile-1"
                        // value={photoName}
                        onChange={e => {
                            setPhonePhoto( e.target.files[0] )
                        }}
                    />
                </div>
                 <div className="mb-4">
                    <label htmlFor="form-category/name" className="form-label">
                        {messages.redirectLink} 
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="form-category/name"
                        placeholder={messages.redirectLink}
                        defaultValue={slider.redirect}
                        value={redirect}
                        onChange={e => setRedirect( e.target.value )}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="form-category/description" className="form-label">
                        {messages.SliderTitle}
                    </label>
                      <input
                        type="text"
                        className="form-control"
                        id="form-category/name"
                        placeholder={messages.SliderTitle}
                        defaultValue={slider.title}
                        value={title}
                        onChange={e => setTitle( e.target.value )}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="form-category/description" className="form-label">
                        {messages.overviewText}
                    </label>
                     <textarea
                        id="form-category/description"
                        className="sa-quill-control form-control"
                        rows={8}
                        placeholder={locale === 'ar' && 'وصف تعريفى / نبذة مختصرة عن الصورة '}
                        defaultValue={slider.description}
                        value={description}
                        onChange={e=>setDescription(e.target.value)}
                    />
                </div>
            </Card>
        </>
    );

    const sidebar = (
        <>
            <Card title={messages.image} className="w-100">
                <div className="border p-4 d-flex justify-content-center">
                    <div className="max-w-20x">
                        {
                            photo
                                ? <img src={URL.createObjectURL( photo )} className="w-100 h-auto" alt="" />
                                : slider &&  <img src={`/uploads/imgs/slider/${ slider.photo }`} className="w-100 h-auto" alt="" />
                        }
                        
                    </div>
                </div>
                <div className="mt-4 mb-n2">
                    { ( <Link onClick={e => clickFileInput( e )} className="me-3 pe-2">{messages.replaceImage}</Link> )}
                    {photo && ( <Link onClick={e => removeSelectedImage( e )} className="text-danger me-3 pe-2">{messages.removeImage}</Link> )}
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
                            title={messages.newSlider}
                            actions={[
                                <Link key="save" onClick={e => submitHandler( e )} className={classNames( 'btn btn-primary ', {
                                    'disabled':loading || editLoading
                                })}>
                                    {messages.save}
                                </Link>,
                            ]}
                            breadcrumb={[
                                {title: messages.dashboard, url: '/dashboard'},
                                {title: messages.slider, url: '/dashboard/sliders'},
                                {title: messages.addSlider, url: ''},
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