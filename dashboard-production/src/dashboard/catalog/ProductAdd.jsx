//react
import React, { useEffect,useState } from 'react';

//third party
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import PropType from 'prop-types';
import { select2 } from 'select2'
import { useSelector, useDispatch } from 'react-redux';
import ReactSelect  from '../shared/Select';
//scripts
import $ from 'jquery'
import './../utils/containerQry'

//components 
import BlockLoader from '../../components/blocks/BlockLoader';
import PageHeader from '../shared/PageHeader'
import Card from '../shared/Card';
import ReactQuill from 'react-quill'

//application
import { handleGetAllSubCategories } from '../../store/subCategory'
import { handleGetAllCategories } from '../../store/category'
import {
    handleAddProduct,
} from '../../store/product';

import { getAllBrands } from "../../store/brand";

//data stubs
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'
import classNames from 'classnames';


export default function ProductAdd ({history}) {
    // const [photosArray, setPhotosArray] = useState();

    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )


    //store
    const allCategories = useSelector( state => state.allCategories )
    const { loading, error, categories } = allCategories;


    const allSubCategories = useSelector( state => state.allSubCategories )
    const { error: subCategoriesError, SubCategories } = allSubCategories;

    const addProduct = useSelector( state => state.addProduct );
    let { success: AddProductSuccess, loading:addProductLoading, error: addProductError } = addProduct;

    const allBrands = useSelector((state) => state.allBrands);
  const {
    loading: loadingBrands,
    brands,
    error: getBrandsError,
  } = allBrands;

    const [specifications,setspecifications] = useState([]);
    //states
    const [name, setName] = useState();
    const [description, setDescription] = useState( '' )
    const[shortDescription,setShortDescription]=useState()
    const [price, setPrice] = useState()
    const[oldPrice,setOldPrice]=useState()
    const [size, setSize] = useState()
    const [photo, setPhoto] = useState()
    const[extraPhotos,setExtraPhotos]=useState([])
    const [photoName, setPhotoName] = useState( '' )
    const[visibility,setVisibility]=useState()//["published", "hidden"]
    const [color, setColor] = useState()
    const [colorError,setColorError]=useState(false)
    const[shape,setShape]=useState('color')
    const[category,setCategory]=useState()
    const[subCategory,setSubCategory]=useState()
    const [brand, setBrand] = useState()
    const [images, setimages] = useState( [] );
    
    const dispatch = useDispatch()

   
    //load site scripts
    useEffect( () => {
        window.stroyka.containerQuery();
    }, [loading,loadingBrands] );

    //load Categories
    useEffect( () => {
        if ( !categories ) {
            dispatch( handleGetAllCategories() );
        }
    }, [] );

    //add product success
    useEffect( () => {
        if ( AddProductSuccess ) {
            history.push('/dashboard/products-list')
        }
    },[AddProductSuccess])
    
    const getsubCategoriesHandler = ( e ) => {
    setCategory(e.target.value);
    dispatch(handleGetAllSubCategories({},1000,'',1,e.target.value));
    };
    
    //load brands
    useEffect( () => {
        if ( !brands ) {
            dispatch( getAllBrands() );
        }
    }, [dispatch, brands] );

    
    const submitHandlerAdd = ( e ) => {
        e.preventDefault();

        if ( specifications.length > 0 && !color ) {
            specifications.forEach( ( spec ) => {
                if ( !spec.color ) { spec.colorError = true };
            } );
            setColorError(true)
            return;
        }



        const productForm = new FormData();
        
        if(name) productForm.append( 'name', name );
        if ( description && description.trim() ) productForm.append( 'description', description );
        if ( shortDescription ) productForm.append( 'shortDescription', shortDescription )
        if ( price ) productForm.append( 'price', Number( price ) );
        if ( oldPrice ) productForm.append( 'oldPrice', Number( oldPrice ) );
        if ( size ) productForm.append( 'size', size );
        if ( color ) productForm.append( 'color', color );
        if(shape) productForm.append('shape',shape)
        if ( category ) productForm.append( 'category', category );
        if ( subCategory ) productForm.append( 'subCategory', subCategory );
        if ( brand ) productForm.append( 'brand', brand );
        if(visibility) productForm.append('visibility',visibility)
        if ( photo ) {
            productForm.append( 'photo', photo );
        }
        if ( specifications ) {
            productForm.append( 'Specifications', JSON.stringify( specifications ) );
        };

        if ( images.length > 0 ) { 
            images.forEach( ( image ) => {
                productForm.append( 'images', image );
            })
        }

        if ( extraPhotos.length ) {
            extraPhotos.forEach( ( image ) => {
                productForm.append('extraPhotos',image)
            })
        }
        dispatch( handleAddProduct( productForm ) )
    };


    //Handle Image Operations
    const fileRef = React.createRef();
    const specificationRef = React.createRef()
    
    const clickFileInput = ( e ) => {
        e.preventDefault();
        fileRef.current.click();
    }

    const clickSpecificationFileInput = ( e ) => {
        e.preventDefault();
        specificationRef.current.click();
    }

    const removeSelectedImage = ( e ) => {
        e.preventDefault()
        setPhoto( null );
        setPhotoName('')
    };

    const setColorHandler = ( e ) => {
        let value = e.target.value;
        setColor( value )
        if ( value.trim() && colorError ) {
            setColorError(false)   
        }
    }

    //Features (Specifications)
    //Specifications handle photo
    function handleCreateSpecification ( e ) {
        setimages( [...e.target.files] );

        let values = [];
        [...e.target.files].forEach( ( image ) => {
            values.push( { photo: image } )
        } );
        setspecifications(values)
    }
    //Specifications handle price
    function addSpecificationPrice ( e ) {
        const values = specifications;
        const id = e.target.id;
        values[id].price= e.target.value;
        setspecifications(values)
    }

    function addSpecificationColor ( Id,value ) {
        const values = specifications;
        values[Id].color= value;
        setspecifications(values)
    }

    //Specifications handle size
    function addSpecificationSize ( e ) {
        const values = specifications;
        const id = e.target.id;
        values[id].size= e.target.value;
        setspecifications(values)
    }

    
    //Remove Specification from specifications list(array)
    function removeSpecification ( event ) {
        const itemIdx = event.target.id;
        //handle Specifications
        const newSpecifications = specifications;
        newSpecifications.splice( itemIdx, 1 )
        setspecifications( newSpecifications )
        
        //handle images
        const newImages = images;
        newImages.splice( itemIdx, 1 );
        setimages( [...newImages] );
    }

    

  
    const main = (
        <>
            <Card title={ messages.basicInformation}>
                <div className="mb-4">
                    <label htmlFor="form-product/name" className="form-label">
                        {messages.name} *
                    </label>
                    <input type="text" className="form-control" id="form-product/name" value={name} onChange={e => setName( e.target.value )} />
                     {addProductError &&
              addProductError.match(/name/) &&
              JSON.parse(addProductError).name &&
              (JSON.parse(addProductError).name.toLowerCase().trim() ===
              "product name is required" ? (
                  <div id="form-product/slug-help" className="form-text text-danger">
                        * يجب تحديد الاسم *
                    </div>
                    ) : (
                             <div id="form-product/slug-help" className="form-text text-danger">
                  * اسم المنتج يجب الا يقل عن 10 حروف *
                    </div>
              ))}
                    {/* <div id="form-product/slug-help" className="form-text text-danger">
                        Unique human-readable product identifier. No longer than 255 characters.
                    </div> */}
                </div>
                <div className="mb-4">
                    <label for="formFile-1" class="form-label">{messages.image}</label>
                    <input
                        ref={fileRef}
                        type="file"
                        class="form-control"
                        id="formFile-1"
                        value={photoName}
                        onChange={e => { setPhoto( e.target.files[0] );setPhotoName(e.target.value)}}
                    />
                    {addProductError &&
              addProductError.match(/photo/) &&
              JSON.parse(addProductError).photo && (
                <div id="form-product/slug-help" className="form-text text-danger">* يجب اختيار صورة المنتج *</div>
              )}
                </div>

                 <div className="mb-4">
                    <label for="formFile-other" class="form-label">{locale==='ar'?"صور إضافية":"extra images"}</label>
                    <input
                        type="file"
                        class="form-control"
                        id="formFile-other"
                        onChange={e => { setExtraPhotos( [...e.target.files] ) }}
                        multiple
                    />
                </div>

                <div className="mb-4">
                    <label for="oProduct-color" class="form-label">{messages.color}</label>
                    {/* <ReactSelect setValue={setColor} value={color} /> */}
                    <input
                        type="text"
                        class="form-control"
                        id="oProduct-color"
                        onChange={e => { setColorHandler( e ) }}
                        value={color}
                    />
                    {
                     colorError && <div id="form-product/slug-help" className="form-text text-danger">* يجب اختيار لون المنتج *</div>
                    }                    
                  
                </div>

                <div className="mb-4">
                    <label htmlFor="form-product/size" className="form-label">
                        {messages.size} 
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="form-product/size"
                        value={size}
                        onChange={e => setSize( e.target.value )} />
                </div>

                <div className="mb-4">
                    <label htmlFor="form-product/description" className="form-label">
                        {messages.description}
                    </label>
                    <ReactQuill
                        style={{ height: '200px', marginBottom: '70px' }}
                        theme='snow'
                        modules={{
                            toolbar: [
                                ["bold", "italic", "underline", "strike"], // toggled buttons
                                ["blockquote", "code-block", "link"],

                                [{ header: 1 }, { header: 2 }], // custom button values
                                [{ list: "ordered" }, { list: "bullet" }],
                                [{ script: "sub" }, { script: "super" }], // superscript/subscript
                                [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
                                // [{ direction: "rtl" }], // text direction

                                [{ size: ["small", false, "large", "huge"] }], // custom dropdown

                                // [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                                // [{ font: [] }],
                                [{ align: [] }],

                                ["clean"], // remove formatting button
                            ],
                        }}
                        value={description}
                    onChange={setDescription}
                    />
                     {addProductError &&
              addProductError.match(/description/) &&
              JSON.parse(addProductError).description &&
              (JSON.parse(addProductError).description.toLowerCase().trim() ===
              "product description must be provided" ? (
               <div id="form-product/slug-help" className="form-text text-danger">* يجب إضافة وصف للمنتج *</div>
              ) : (
               <div id="form-product/slug-help" className="form-text text-danger">
                  * وصف المنتج يجب الا يقل عن 30 حرف *
                </div>
              ))}
                </div>
                
                <div>
                    <label htmlFor="form-product/short-description" className="form-label">
                        {messages.shortDescription}
                    </label>
                    <textarea
                        id="form-product/short-description"
                        className="form-control"
                        rows={3}
                        value={shortDescription}
                        onChange={e=>setShortDescription(e.target.value)}
                    />
                    {addProductError &&
              addProductError.match(/shortDescription/) &&
              JSON.parse(addProductError).shortDescription &&
              (JSON.parse(addProductError).shortDescription.toLowerCase().trim() ===
              "product short description must be provided" ? (
               <div id="form-product/slug-help" className="form-text text-danger">* يجب إضافة وصف للمنتج *</div>
              ) : (
               <div id="form-product/slug-help" className="form-text text-danger">
                  * وصف المنتج يجب الا يقل عن 30 حرف *
                </div>
              ))}
                </div>
            </Card>

            <Card title={messages.pricing} className="mt-5">
                <div className="row g-4">
                    <div className="col">
                        <label htmlFor="form-product/price" className="form-label">
                            {messages.price}
                        </label>
                        <input type="number" className="form-control" id="form-product/price" defaultValue={price} onChange={e => setPrice( e.target.value )} />
                        {addProductError &&
                  addProductError.match(/price/) &&
                  JSON.parse(addProductError).price && (
                     <div id="form-product/slug-help" className="form-text text-danger">
                      * {JSON.parse(addProductError).price} *
                    </div>
                  )}
                    </div>
                    <div className="col">
                        <label htmlFor="form-product/old-price" className="form-label">
                            {messages.oldPrice}
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="form-product/old-price"
                            value={oldPrice}
                            onChange={e=>setOldPrice(e.target.value)}
                        />
                    </div>
                </div>
               
            </Card>

            {/* <Card title="Inventory" className="mt-5">
                <div className="mb-4">
                    <label htmlFor="form-product/sku" className="form-label">
                        SKU (كود التخزين التعريفي)
                    </label>
                    <input type="text" className="form-control" id="form-product/sku" value={sku} onChange={e=>setSKU(e.target.value)} />
                </div>
                <div className="mb-4 pt-2">
                    <label className="form-check">
                        <input type="checkbox" className="form-check-input" />
                        <span className="form-check-label">
                            Enable stock management
                        </span>
                    </label>
                </div>
                <div>
                    <label htmlFor="form-product/quantity" className="form-label">
                        Stock quantity
                    </label>
                    <input type="number" className="form-control" id="form-product/quantity" defaultValue={product.quantity} />
                </div>
            </Card> */}

            <Card
                title={messages.otherShapes}
                className="mt-5"
                body={
                    <div className="mt-n5">
                        <input
                            multiple
                        ref={specificationRef}
                        type="file"
                        className="form-control"
                        style={{display:'none'}}
                            onChange={handleCreateSpecification}
                    />
                        <div className="sa-divider" />
                        {( specifications && specifications.length > 0 ) && (
                            <React.Fragment>
                     <div className="table-responsive">
                            <table className="sa-table">
                                <thead>
                                    <tr>
                                        <th className="w-min">{messages.image}</th>
                                        <th className="min-w-10x">{messages.color}</th>
                                        <th className="min-w-10x">{messages.size}</th>
                                        <th className="w-min">{messages.price}</th>
                                        <th className="w-min" />
                                    </tr>
                                </thead>
                                <tbody>
                                    { specifications.map( ( specifiaction, imageIdx ) => (
                                        <tr key={imageIdx}>
                                            <td>
                                                <div className="sa-symbol sa-symbol--shape--rounded sa-symbol--size--lg">
                                                    <img src={URL.createObjectURL(specifiaction.photo)}  />
                                                </div>
                                            </td>
                                            <td>
                                                {/* <ReactSelect addSpecificationColor={addSpecificationColor} Id={imageIdx} /> */}
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={specifiaction.size}
                                                    onChange={addSpecificationColor}
                                                />
                                                {(specifiaction.colorError) &&<span className="text-danger text-sm"> {locale==='ar'?"*يجب تحديد اللون *":"you should specify color "} </span>}
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    onChange={addSpecificationSize}
                                                    id={imageIdx}
                                                    value={specifiaction.size}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm w-4x"
                                                    id={imageIdx}
                                                    onChange={addSpecificationPrice}
                                                    value={specifications.price}
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    id={imageIdx}
                                                    onClick={removeSpecification}
                                                    className="btn btn-sa-muted btn-sm mx-n3"
                                                    type="button"
                                                    aria-label="Delete image"
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="right"
                                                    title="Delete image"
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
                            </table>
                        </div>
                                <div className="sa-divider" />
                                </React.Fragment>
                        )}
                        <div className="px-5 py-4 my-2">
                            <Link onClick={clickSpecificationFileInput}>{messages.addFeatures}</Link>
                        </div>
                    </div>
                }
            /> 
        </>
    );

    const sidebar = (
        <>
            {photo && (
                <Card title={messages.image} className="w-100  mb-5">
                    <div className="border p-4 d-flex justify-content-center ">
                        <div className="max-w-20x">
                            {/* {
                            photo */}
                            <img src={URL.createObjectURL( photo )} className="w-100 h-auto" alt="" />
                            {/* : <img src='http://placehold.it/700x700' className="w-100 h-auto" alt=""/>
                        } */}
                        
                        </div>
                    </div>
                    <div className="mt-4 mb-n2">
                        <Link onClick={e => clickFileInput( e )} className="me-3 pe-2">{messages.replaceImage}</Link>
                        <Link onClick={e => removeSelectedImage( e )} className="text-danger me-3 pe-2">{messages.removeImage}</Link>
                    </div>
                </Card>
            
            )}
            <Card title={messages.visibility} className="w-100">
                <div className="mb-4">
                    <label className="form-check">
                        <input type="radio" value='published' onChange={e => setVisibility( e.target.value )} className="form-check-input" name="status" defaultChecked />
                        <span className="form-check-label">{messages.puplished}</span>
                    </label>
                    <label className="form-check mb-0">
                        <input type="radio" value='hidden' onChange={e => setVisibility( e.target.value )} className="form-check-input" name="status" />
                        <span className="form-check-label">{messages.hidden}</span>
                    </label>
                   
                </div>
            </Card>

            <Card title={locale==='ar'?'الشكل':'shape'} className="w-100 mt-5">
                <div className="mb-4">
                    <label className="form-check">
                        <input type="radio" value='color' onChange={e => setShape( e.target.value )} className="form-check-input" name="shape" defaultChecked />
                        <span className="form-check-label">{locale==='ar'?"سادة":"color"}</span>
                    </label>
                    <label className="form-check mb-0">
                        <input type="radio" value='shape' onChange={e => setShape( e.target.value )} className="form-check-input" name="shape" />
                        <span className="form-check-label">{locale==='ar'?"منقوش":"shape"}</span>
                    </label>
                   
                </div>
            </Card>

            {
                categories && (
                    <Card title={messages.category} className="w-100 mt-5">
                        <select
                            className="sa-select2 form-select"
                            onChange={( e ) => {
                                getsubCategoriesHandler( e );
                                setCategory( e.target.value );
                            }}
                        >
                            <option selected disabled>{messages.category}</option>
                            {categories.map( ( cat, categoryIdx ) => (
                                <option key={categoryIdx} value={cat._id}>{cat.name}</option>
                            ) )}
                        </select>
                        {addProductError &&
                            addProductError.match( /category/ ) &&
                            JSON.parse( addProductError ).category && (
                                <div id="form-product/slug-help" className="form-text text-danger">* يجب تحديد الفئة الرئيسية *</div>
                            )}

                        <div className="mt-4 mb-n2">
                            <Link to='/dashboard/categories-add'>{messages.AddNewCategory}</Link>
                        </div>
                    </Card>

                )
            }

            {
                SubCategories && (
                    <Card title={messages.subCategory} className="w-100 mt-5">
                        <select className="sa-select2 form-select" onChange={e => setSubCategory( e.target.value )}>
                            <option selected disabled>{messages.subCategory}</option>
                            {SubCategories.map( ( subCat, subcategoryIdx ) => (
                                <option key={subcategoryIdx} value={subCat._id}> {subCat.name} </option>
                            ) )}
                        </select>
                        {addProductError &&
                            addProductError.match( /SubCategory/ ) &&
                            JSON.parse( addProductError ).SubCategory && (
                                <div id="form-product/slug-help" className="form-text text-danger">* يجب تحديد الفئة الفرعية *</div>
                            )}
                        <div className="mt-4 mb-n2">
                            <Link to='/dashboard/subcategories-add'>{messages.subCategory}</Link>
                        </div>
                    </Card>
            
                )
            }
            
            {brands && (
                <Card title={messages.brand} className="w-100 mt-5">
                    <select className="sa-select2 form-select" value={brand} onChange={e => setBrand( e.target.value )}>
                        <option selected disabled>{messages.brand}</option>
                        {brands.map( ( brand, brandIdx ) => (
                            <option key={brandIdx} value={brand._id}>{brand.name}</option>
                        ) )}
                    </select>

                    <div className="mt-4 mb-n2">
                        <Link to='/dashboard/brand-add'>{messages.addNewBrand}</Link>
                    </div>
                </Card>

            )}
            
            
            {/* <div className="card w-100 mt-5">
                                            <div className="card-body p-5">
                                                <div className="mb-5"><h2 className="mb-0 fs-exact-18">Categories</h2></div>
                                                <select className="sa-select2 form-select" multiple>
                                                    <option selected="">Power tools</option>
                                                    <option>Screwdrivers</option>
                                                    <option selected="">Chainsaws</option>
                                                    <option>Hand tools</option>
                                                    <option>Machine tools</option>
                                                    <option>Power machinery</option>
                                                    <option>Measurements</option>
                                                </select>
                                                <div className="mt-4 mb-n2"><a href="#">Add new category</a></div>
                                            </div>
                                        </div> */}
            {/* <Card title="Tags" className="w-100 mt-5">
                <select className="sa-select2 form-select" data-tags="true" multiple>
                    <option selected>Universe</option>
                    <option selected>Sputnik</option>
                    <option selected>Steel</option>
                    <option selected>Rocket</option>
                </select>
            </Card> */}
        </>
    );

    if ( loadingBrands || loading ) {
        return(<BlockLoader/>)
    }

    return (
        <React.Fragment>
            <div id="top" className="sa-app__body">
                <div className="mx-sm-2 px-2 px-sm-3 px-xxl-4 pb-6">
                    <div className="container">
                        <PageHeader
                            title={messages.addProduct}
                            actions={[
                                // <a key="duplicate" href="#" className="btn btn-secondary me-3">
                                //     Duplicate
                                // </a>,
                                <Link
                                    key="save"
                                    onClick={e => submitHandlerAdd( e )}
                                    className={classNames( "btn btn-primary ", { "disabled":addProductLoading} )} >
                                    {messages.save}
                                </Link>,
                            ]}
                            breadcrumb={[
                                { title: `${messages.dashboard}`, url: '/dashboard' },
                                { title: `${messages.products}`, url: '/dashboard/products-list' },
                                { title: `${messages.editProduct}`, url: '' },
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