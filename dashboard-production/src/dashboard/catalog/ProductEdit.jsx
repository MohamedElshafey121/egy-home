//react
import React, { useEffect,useState } from 'react';

//third party
import { Link } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import classnames from 'classnames';
import PropType from 'prop-types';
import ReactQuill from 'react-quill'

//scripts
import './../utils/containerQry'

//components
import Card from '../shared/Card';
import PageHeader from '../shared/PageHeader'
import BlockLoader from '../../components/blocks/BlockLoader';
import ReactSelect  from '../shared/Select';


//application
import { handleGetAllSubCategories } from '../../store/subCategory'
import { handleGetAllCategories } from '../../store/category'
import {
    handleGetOneProduct,
    handleUpdateProduct,
    handleUpdateProductSpecification,
    handleDeleteProductSpecification,
    deleteProductSpecificationReset,
    handleAddProductSpecification,
    resetAddSpecification
} from '../../store/product';
import { getAllBrands } from "../../store/brand";

// import {
//     handleAddProductSpecification,
//     ADD_PRODUCT_SPECIFICATION_RESET,
//     handleUpdateProductSpecification,
//     handleGetOneProductSpecification,
//     GET_ONE_PRODUCT_SPECIFICATION_RESET,
//     GET_ONE_PRODUCT_SUCCESS,
//     UPDATE_PRODUCT_SPECIFICATION_RESET,
//     GET_ONE_PRODUCT_SPECIFICATION_REQUEST
// } from '../action/product'


export default function ProductEdit ( { match,history } ) {
    const productId = match.params.id;
    const fileRef = React.createRef();
    const specificationRef = React.createRef();

    //store
    const productDeatils = useSelector((state) => state.productDeatils);
    const { product, success: getProductSuccess, loading } = productDeatils;
    
    const allCategories = useSelector( state => state.allCategories )
    const { loading:loadingcategries, error, categories } = allCategories;


    const allSubCategories = useSelector( state => state.allSubCategories )
    const { error: subCategoriesError, SubCategories } = allSubCategories;

    const allBrands = useSelector((state) => state.allBrands);
  const {
    loading: loadingBrands,
    brands,
    error: getBrandsError,
  } = allBrands;

  const updateProduct = useSelector((state) => state.updateProduct);
    const { success: updateSuccess, error: updateProductError } = updateProduct;
    
    const deleteProductSpecification = useSelector( state => state.deleteProductSpecification )
    const {loading:delteSpecLoading,success:deletingSpecSuccess,error:errorDeletingSpec } = deleteProductSpecification;

    const addProductSpecification = useSelector( state => state.addProductSpecification )
    const {loading:addSpecificationLoading,success,error:addSpecificationError } = addProductSpecification;

    //states
    const [name, setName] = useState();
    const [slug, setSlug] = useState();
    const [sku, setSKU] = useState();
    const [description, setDescription] = useState( '' )
    const[shortDescription,setShortDescription]=useState()
    const[price,setPrice]=useState()
    // const[oldPrice,setOldPrice]=useState()
    const[size,setSize]=useState()
    const [photo, setPhoto] = useState(  )
    const [photoName, setPhotoName] = useState( '' )
    const[visibility,setVisibility]=useState()//["published", "hidden"]
    const[color,setColor]=useState()
    const[category,setCategory]=useState()
    const[subCategory,setSubCategory]=useState()
    const [brand, setBrand] = useState()
    // const [images, setimages] = useState( [] );

    //specification state
    const [specificationPhoto, setSpecificationPhoto] = useState();
    const [specificationSize, setSpecificationSize] = useState();
    const [specificationColor, setSpecificationColor] = useState();
    const [specificationPrice, setSpecificationPrice] = useState();
    
     //load scripts
    useEffect( () => {
        window.stroyka.containerQuery();
        // $( ".sa-select2" ).select2( {
        //     width: "100%",
        // } );
    }, [loading,loadingBrands,loadingcategries] );

    const dispatch = useDispatch();
    //load product
    useEffect( () => {
        if ( productId ) {
            dispatch( handleGetOneProduct( productId ) );
        };

        if ( product ) {
            if ( product._id !== productId ) {
                dispatch( handleGetOneProduct( productId ) );
            }
            else {
                dispatch( handleGetAllSubCategories( {}, 1000, '', 1, product.category._id ) );
            }
        }

    }, [] );

    //load Categories
    useEffect( () => {
        if ( !categories ) {
            dispatch( handleGetAllCategories() );
        }
    }, [] );

    //load brands
    useEffect( () => {
        if ( !brands ) {
            dispatch( getAllBrands() );
        }
    }, [dispatch, brands] );

    //loa subCategories
    useEffect( () => {
        if ( product &&!SubCategories) {
            dispatch( handleGetAllSubCategories( {}, 1000, '', 1, product.category&&product.category._id?product.category._id:product.category ) );
        }
    }, [] )
    
    //update product success
    useEffect( () => {
        if ( updateSuccess ) {
            history.push('/dashboard/products-list')
        }
    }, [updateSuccess] )
    
    //reset delete spec
    useEffect( () => {
        if ( deletingSpecSuccess ) {
            dispatch( handleGetOneProduct( productId ) )
            dispatch( deleteProductSpecificationReset() )
        }
    }, [dispatch, deletingSpecSuccess] )
    
    //reset add specification
    useEffect( () => {
        if ( success ) {
            setSpecificationPhoto()
            setSpecificationPrice()
            setSpecificationSize()
            dispatch( handleGetOneProduct( productId ) )
            dispatch(resetAddSpecification())
        }
    },[dispatch, success])

    //handers
    const getsubCategoriesHandler = ( e ) => {
    setCategory(e.target.value);
    dispatch(handleGetAllSubCategories({},1000,'',1,e.target.value));
    };

    const deleteSpecificationHandler = ( specId ) => {
        dispatch(handleDeleteProductSpecification(productId,specId))
    }

    
    const addSpecificationSubmitHandler = (e) => {
    e.preventDefault();
    const specificationForm = new FormData();
      
    if(specificationPhoto) specificationForm.append("photo", specificationPhoto);
    if (specificationPrice) specificationForm.append("price", specificationPrice);
    if (specificationSize) specificationForm.append("size", specificationSize);
    if (specificationColor) specificationForm.append("color", specificationColor);

    dispatch(handleAddProductSpecification(product._id, specificationForm));
    };
    
    const removeBeforeUploadeSpecification = ( e ) => {
        e.preventDefault()
        setSpecificationPhoto()
        setSpecificationPrice()
        setSpecificationSize()
    }

    const updateSpecificationSubmitHandler = ( e,specificationId ) => {
        e.preventDefault();
        const specificationForm = new FormData();
        specificationForm.append('price',price)
        specificationForm.append('color',color)
        specificationForm.append( 'size', size )
        // if ( uploadedPhoto ) {
        //     specificationForm.append('photo',uploadedPhoto)
        // }

        dispatch( handleUpdateProductSpecification( productId, specificationId, specificationForm ) );
        // dispatch({type:GET_ONE_PRODUCT_SPECIFICATION_RESET})
    }


    //focus file Ref
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


    const submitHandlerAdd = ( e ) => {
        e.preventDefault();
        const productForm = new FormData();
        
        if(name) productForm.append( 'name', name );
        if ( description && description.trim() ) productForm.append( 'description', description );
        if ( shortDescription ) productForm.append( 'shortDescription', shortDescription )
        if ( sku ) productForm.append( 'sku', sku );
        if ( price ) productForm.append( 'price', Number( price ) );
        if ( size ) productForm.append( 'size', size );
        if ( color ) productForm.append( 'color', color );
        if ( category ) productForm.append( 'category', category );
        if ( subCategory ) productForm.append( 'subCategory', subCategory );
        if ( brand ) productForm.append( 'brand', brand );
        if(visibility) productForm.append('visibility',visibility)
        if ( photo ) {
            productForm.append( 'photo', photo );
        }
        dispatch( handleUpdateProduct(productId,productForm) )
    };
   
    const imageSize = 16 * 2.5;

    const images = [
        'images/products/product-16-1.jpg',
        'images/products/product-16-2.jpg',
        'images/products/product-16-3.jpg',
        'images/products/product-16-4.jpg',
    ];

    // const product = {
    //     sku: 'SCREW150',
    //     name: 'Brandix Screwdriver SCREW150',
    //     slug: 'brandix-screwdriver-screw150',
    //     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ornare, mi in ornare elementum, libero nibh lacinia urna, quis convallis lorem erat at purus. Maecenas eu varius nisi.',
    //     price: 1499,
    //     quantity: 18,
    // };

    const productSpecifications = ( product && product.Specifications ) && (
        <Card
            title="Images"
            className="mt-5"
            body={
                <div className="mt-n5">
                    <input
                        ref={specificationRef}
                        type="file"
                        className="form-control"
                        style={{ display: 'none' }}
                        id="formFile-1"
                        onChange={e => setSpecificationPhoto( e.target.files[0] )}
                    />
                    <div className="sa-divider" />
                    <div className="table-responsive">
                        <table className="sa-table">
                            <thead>
                                <tr>
                                    <th className="w-min">Image</th>
                                    <th className="min-w-10x">color</th>
                                    <th className="min-w-10x">size</th>
                                    <th className="w-min">Price</th>
                                    <th className="w-min" />
                                    <th className="w-min" />
                                </tr>
                            </thead>
                            <tbody>
                                {product.Specifications.map( ( featurs, imageIdx ) => (
                                    <tr key={imageIdx}>
                                        <td>
                                            <div className="sa-symbol sa-symbol--shape--rounded sa-symbol--size--lg">
                                                <img src={`/uploads/imgs/products/${ featurs.photo }`} size={imageSize} />
                                            </div>
                                        </td>
                                        <td>
                                            <ReactSelect value={featurs.color} id={imageIdx} isDisabled={ true}/>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                defaultValue={featurs.size}
                                                // onChange={addSpecificationSize}
                                                id={imageIdx}
                                                disabled
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control form-control-sm w-4x"
                                                defaultValue={featurs.price}
                                                disabled
                                            // id={imageIdx}
                                            // onChange={addSpecificationPrice}
                                            />
                                        </td>
                                        <td>
                                            <button
                                                id={featurs._id}
                                                // onClick={removeSpecification}
                                                className="btn btn-sa-muted btn-sm mx-n3"
                                                type="button"
                                                aria-label="Delete Feature"
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="right"
                                                title="Delete Feature"
                                                onClick={e => deleteSpecificationHandler( featurs._id )}
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
                                        <td>
                                            <button
                                                id={featurs._id}
                                                className="btn btn-sa-muted btn-sm mx-n3"
                                                type="button"
                                                aria-label="Delete image"
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="right"
                                                title="Edit Feature"
                                                disabled
                                            >
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    class="octicon octicon-checklist"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        d="M3.5 3.75a.25.25 0 01.25-.25h13.5a.25.25 0 01.25.25v10a.75.75 0 001.5 0v-10A1.75 1.75 0 0017.25 2H3.75A1.75 1.75 0 002 3.75v16.5c0 .966.784 1.75 1.75 1.75h7a.75.75 0 000-1.5h-7a.25.25 0 01-.25-.25V3.75z"
                                                    ></path>
                                                    <path
                                                        d="M6.25 7a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm-.75 4.75a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zm16.28 4.53a.75.75 0 10-1.06-1.06l-4.97 4.97-1.97-1.97a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.06 0l5.5-5.5z"
                                                    ></path>
                                                </svg>
                                            </button>
                                        </td>
                                    
                                    </tr>
                                ) )}

                                {
                                    specificationPhoto && (
                                        <tr >
                                            <td>
                                                <div className="sa-symbol sa-symbol--shape--rounded sa-symbol--size--lg">
                                                    <img src={URL.createObjectURL( specificationPhoto )} />
                                                </div>
                                            </td>
                                            <td>
                                                <ReactSelect setValue={setSpecificationColor} value={specificationColor} />

                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={specificationSize}
                                                    onChange={e => setSpecificationSize( e.target.value )}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm w-4x"
                                                    onChange={e => setSpecificationPrice( e.target.value )}
                                                    value={specificationPrice}
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sa-muted btn-sm mx-n3"
                                                    type="button"
                                                    aria-label="Delete image"
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="right"
                                                    title="Delete Feature"
                                                    onClick={removeBeforeUploadeSpecification}
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
                                            <td>
                                                <button
                                                    className="btn btn-sa-muted btn-sm mx-n3"
                                                    type="button"
                                                    aria-label="Delete image"
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="right"
                                                    title="Save Feature"
                                                    onClick={addSpecificationSubmitHandler}
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
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="sa-divider" />
                    <div className="px-5 py-4 my-2">
                        <Link onClick={( e ) => { clickSpecificationFileInput( e ); removeBeforeUploadeSpecification( e ) }}>Add New Feature</Link>
                    </div>
                </div>
            }
        />
    );

    const main =(product &&product.name)&& (
        <>
            <Card title="Basic information">
                <div className="mb-4">
                    <label htmlFor="form-product/name" className="form-label">
                        Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="form-product/name"
                        defaultValue={product.name}
                        onChange={e => setName( e.target.value )}
                        value={name}
                    />
                    {updateProductError &&
              updateProductError.match(/name/) &&
              JSON.parse(updateProductError).name &&
              (JSON.parse(updateProductError).name.toLowerCase().trim() ===
              "product name is required" ? (
                  <div id="form-product/slug-help" className="form-text text-danger">
                        * يجب تحديد الاسم *
                    </div>
                    ) : (
                             <div id="form-product/slug-help" className="form-text text-danger">
                  * اسم المنتج يجب الا يقل عن 10 حروف *
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
                        onChange={e => { setPhoto( e.target.files[0] );setPhotoName(e.target.value)}}
                    />
                    {updateProductError &&
              updateProductError.match(/photo/) &&
              JSON.parse(updateProductError).photo && (
                <div id="form-product/slug-help" className="form-text text-danger">* يجب اختيار صورة المنتج *</div>
              )}
                </div>
                 <div className="mb-4">
                    <label class="form-label">Color</label>
                    <ReactSelect setValue={setColor} value={color?color: product.color} />
                    {updateProductError &&
              updateProductError.match(/color/) &&
              JSON.parse(updateProductError).color && (
                <div id="form-product/slug-help" className="form-text text-danger">* يجب اختيار لون المنتج *</div>
              )}
                </div>
                <div className="mb-4">
                    <label htmlFor="form-product/slug" className="form-label">
                        Slug
                    </label>
                    <div className="input-group input-group--sa-slug">
                        <span className="input-group-text" id="form-product/slug-addon">
                            https://example.com/products/
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            id="form-product/slug"
                            aria-describedby="form-product/slug-addon form-product/slug-help"
                            defaultValue={product.slug}
                            value={slug}
                            onChange={e=>setSlug(e.target.value)}
                        />
                    </div>
                    <div id="form-product/slug-help" className="form-text">
                        Unique human-readable product identifier. No longer than 255 characters.
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="form-product/description" className="form-label">
                        Description
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
                        value={description?description:product.description}
                    onChange={setDescription}
                    />
                    {updateProductError &&
              updateProductError.match(/description/) &&
              JSON.parse(updateProductError).description &&
              (JSON.parse(updateProductError).description.toLowerCase().trim() ===
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
                        Short description
                    </label>
                    <textarea
                        id="form-product/short-description"
                        className="form-control"
                        rows={5}
                        defaultValue={product.shortDescription}
                        value={shortDescription}
                        onChange={e=>setShortDescription(e.target.value)}
                    />
                    {updateProductError &&
              updateProductError.match(/shortDescription/) &&
              JSON.parse(updateProductError).shortDescription &&
              (JSON.parse(updateProductError).shortDescription.toLowerCase().trim() ===
              "product short description must be provided" ? (
               <div id="form-product/slug-help" className="form-text text-danger">* يجب إضافة وصف للمنتج *</div>
              ) : (
               <div id="form-product/slug-help" className="form-text text-danger">
                  * وصف المنتج يجب الا يقل عن 30 حرف *
                </div>
              ))}
                </div>
            </Card>

            <Card title="Pricing" className="mt-5">
                <div className="row g-4">
                    <div className="col">
                        <label htmlFor="form-product/price" className="form-label">
                            Price
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="form-product/price"
                            defaultValue={product.price}
                            value={price}
                            onChange={e => setPrice( e.target.value )} />
                        {updateProductError &&
                  updateProductError.match(/price/) &&
                  JSON.parse(updateProductError).price && (
                     <div id="form-product/slug-help" className="form-text text-danger">
                      * {JSON.parse(updateProductError).price} *
                    </div>
                  )}
                    </div>
                    {/* <div className="col">
                        <label htmlFor="form-product/old-price" className="form-label">
                            Old price
                        </label>
                        <input type="number" className="form-control" id="form-product/old-price"  defaultValue={product.price}/>
                    </div> */}
                </div>
                <div className="mt-4 mb-n2">
                    <a href="#">Schedule discount</a>
                </div>
            </Card>

            <Card title="Inventory" className="mt-5">
                <div className="mb-4">
                    <label htmlFor="form-product/sku" className="form-label">
                        SKU
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="form-product/sku"
                        defaultValue={product.sku}
                        value={sku}
                        onChange={e=>setSKU(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="form-product/quantity" className="form-label">
                        Stock quantity
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="form-product/quantity"
                        defaultValue={product.countInStock}
                    />
                </div>
            </Card>

            {productSpecifications}

            
            <Card
                title="Search engine optimization"
                help="Provide information that will help improve the snippet and bring your product to the top of search engines."
                className="mt-5"
            >
                <div className="mb-4">
                    <label htmlFor="form-product/seo-title" className="form-label">
                        Page title
                    </label>
                    <input type="text" className="form-control" id="form-product/seo-title" />
                </div>
                <div>
                    <label htmlFor="form-product/seo-description" className="form-label">
                        Meta description
                    </label>
                    <textarea
                        id="form-product/seo-description"
                        className="form-control"
                        rows={2}
                    />
                </div>
            </Card>
        </>
    );

    const sidebar =(product &&product.name)&& (
        <>
                <Card title="Image" className="w-100  mb-5">
                <div className="border p-4 d-flex justify-content-center ">
                    <div className="max-w-20x">
                         {photo
                            ? <img src={URL.createObjectURL( photo )} className="w-100 h-auto" alt=""/>
                            : <img src={`/uploads/imgs/products/${ product.photo }`} className="w-100 h-auto" alt=""/>
                        }
                        
                    </div>
                </div>
                <div className="mt-4 mb-n2">
                    {photo && (<Link onClick={e=>clickFileInput(e)} className="me-3 pe-2">Replace image</Link>) }
                    {!photo && (<Link onClick={e=>clickFileInput(e)} className="me-3 pe-2">Change image</Link>) }
                    {photo && ( <Link onClick={e => removeSelectedImage( e )} className="text-danger me-3 pe-2">Remove image</Link> )}
                </div>
            </Card>
        
            <Card title="Visibility" className="w-100">
                <div className="mb-4">
                    <label className="form-check">
                        <input
                            type="radio"
                            value='published'
                            className="form-check-input"
                            name="status"
                            defaultChecked={product.visibility === 'published'}
                            onChange={e=>setVisibility(e.target.value)}
                        />
                        <span className="form-check-label">Published</span>
                    </label>
                    <label className="form-check mb-0">
                        <input
                            type="radio"
                            className="form-check-input"
                            value='hidden'
                            name="status"
                            defaultChecked={product.visibility === 'hidden'}
                            onChange={e=>setVisibility(e.target.value)}
                        />
                        <span className="form-check-label">Hidden</span>
                    </label>
                </div>
            </Card>
            {categories && (
                <Card title="Categories" className="w-100 mt-5">
                <select
                    defaultValue={product.category}
                    className="sa-select2 form-select"
                         onChange={( e ) => {
                             setCategory( e.target.value );
                             return getsubCategoriesHandler( e );
                            }}
                >
                        {categories.map( ( category ) => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                </select>

                <div className="mt-4 mb-n2">
                    <Link to='/dashboard/categories-add'>Add new category</Link>
                </div>
            </Card>
            
            )}

            {
                SubCategories && (
                    <Card title="Sub Category" className="w-100 mt-5">
                        <select
                            defaultValue={product.subCategory}
                            className="sa-select2 form-select"
                            onChange={e => setSubCategory( e.target.value )}
                        >
                            <option selected disabled>Select SubCategory</option>
                            {SubCategories.map( ( subCat, subcategoryIdx ) => (
                                <option key={subcategoryIdx} value={subCat._id}> {subCat.name} </option>
                            ) )}
                        </select>
                         {updateProductError &&
                            updateProductError.match( /SubCategory/ ) &&
                            JSON.parse( updateProductError ).SubCategory && (
                                <div id="form-product/slug-help" className="form-text text-danger">* يجب تحديد الفئة الفرعية *</div>
                            )}

                        <div className="mt-4 mb-n2">
                            <Link to='/dashboard/subcategories-add'>Add new Sub category</Link>
                        </div>
                    </Card>
            
                )
            }

            {brands && (
                <Card title="Brand" className="w-100 mt-5">
                <select className="sa-select2 form-select"  value={brand?brand:product.brand} onChange={e=>setBrand(e.target.value)}>
                        <option selected disabled>Select Brand</option>
                        {brands.map( ( brand, brandIdx ) => (
                            <option key={brandIdx} value={brand._id}>{ brand.name}</option>
                        ))}
                </select>

                <div className="mt-4 mb-n2">
                    <Link to='/dashboard/brand-add'>Add new Brand</Link>
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

     if ( loading ) {
        return <BlockLoader/>
    }

    return (
        <React.Fragment>
            <div id="top" className="sa-app__body">
                <div className="mx-sm-2 px-2 px-sm-3 px-xxl-4 pb-6">
                    <div className="container">
                        <PageHeader
                            title="Edit Product"
                            actions={[
                                // <a key="duplicate" href="#" className="btn btn-secondary me-3">
                                //     Duplicate
                                // </a>,
                                <Link key="Edit" onClick={e => submitHandlerAdd( e )} className="btn btn-primary">
                                    Save
                                </Link>,
                            ]}
                            breadcrumb={[
                                { title: 'Dashboard', url: '/dashboard' },
                                { title: 'Products', url: '/dashboard/products-list' },
                                { title: 'Edit Product', url: '' },
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