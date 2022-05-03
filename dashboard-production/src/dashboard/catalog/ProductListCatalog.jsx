//react
import React, { useEffect,useState } from 'react'

// third party
import {useLocation,Link} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';

// import 'simplebar'; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
// import 'simplebar/dist/simplebar.css';



//components
import PageHeader from '../shared/PageHeader'
import Price from '../shared/Price'
import MoreButton from '../shared/MoreButton'
import Pagination from '../../components/shared/Pagination'
import FilterSideBar from './../shared/FilterSideBar'

//sevices
import { url } from '../../services/utils';
import effectLayutSidebar from './../utils/layoutSidebar'

//application
import { handleGetAllProducts,addProductReset,updateProductReset,handleDeleteProductReset } from './../../store/product'
import { handleGetAllCategories } from "../../store/category"
import { getAllBrands } from "../../store/brand";
import { ArrowRoundedUp13x8Svg,ArrowRoundedDown12x7Svg } from '../../svg';

//data stubs
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'


function useQuery () {
    // return new URLSearchParams(location.search)
    return new URLSearchParams(useLocation().search)
}

function ProductListCatalog ( { history } ) {

    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )

    
    const limit = 20;
    // const sort = '-createdAt';
    const query = useQuery();
    const name = query.get( 'name' ) || ''
    const visibility = query.get( 'visibility' )||''
    const category = query.get( 'c' ) || ''
    const brand = query.get( 'brand' ) || ''
    const rating = query.get( 'r' ) || ''
    const subCategory=query.get('s')||''
    let page = query.get( 'p' ) || 1;
    
    const [sort, setSort] = useState( ' ' );
    // const [visibility,setVisibility]=useState('All')

    const dispatch = useDispatch();

    const filterObj = {
        name,
        // category:['613ea18f92f31f4cb076f7eb','6101683ffd46fb416ca8ddfa'],
        category,
        rating,
        subCategory: '',
        brand,
        visibility
    }
    
    const userLogin = useSelector( ( state ) => state.userLogin );
    const { userInfo } = userLogin;

    const allProducts = useSelector( state => state.allProducts );
    const { loading, products, error, page: currentPage, count,category: selectedcategory } = allProducts;

    const allCategories = useSelector( state => state.allCategories )
    const { loading:loadingCategories,error:loadingCategoriesError, categories } = allCategories;
    
     const allBrands = useSelector( state => state.allBrands )
    const { loading: loadingBrands, error: loadingBrandsError, brands } = allBrands;
    
    const addProduct = useSelector( state => state.addProduct );
    const { success: AddProductSuccess } = addProduct;
    
    const updateProduct = useSelector( ( state ) => state.updateProduct );
    const { success: updateSuccess } = updateProduct;

    const deleteProduct = useSelector( state => state.deleteProduct )
    const { success:deleteProductSuccess } = deleteProduct;

    
    
    //Layout Sidebar Effect
    useEffect( () => {
        effectLayutSidebar();
    }, [loading, loadingCategories,loadingBrands] )
    
    //load categories
    useEffect( () => {
        if ( !categories ) {
            dispatch( handleGetAllCategories() )
        }
        if ( selectedcategory && selectedcategory._id !== category ) {
            dispatch( handleGetAllCategories() )
        }
    }, [dispatch,category] )
    
    //load brands
    useEffect( () => {
        if ( !brands ) {
            dispatch( getAllBrands() )
         }
    }, [dispatch] )
    

    //reset add product
    useEffect( () => {
        if ( AddProductSuccess ) {
            dispatch(addProductReset())
        }
    }, [dispatch,AddProductSuccess] )
    
    //reset update product
    useEffect( () => {
        if ( updateSuccess ) {
            dispatch(updateProductReset())
        }
    }, [dispatch, updateSuccess] )
    
     //reset delete product
    useEffect( () => {
        if ( deleteProductSuccess ) {
            dispatch(handleDeleteProductReset())
            dispatch( handleGetAllProducts( filterObj, limit, sort, page ) );
        }
    }, [dispatch, deleteProductSuccess] )
    

    
    // useEffect( () => {

    //     if ( !userInfo ) {
    //         history.push( '/login' )
    //     }

    //     dispatch( handleGetAllProducts( filterObj, limit, sort, page ) )

    //     if ( isNaN( page ) ) {
    //         alert( 'Error Loading Page' )
    //         page = 1;
    //         history.push( `/products/list?p=1` )
    //     }
    // }, [dispatch, page, sort] );

    useEffect( () => {
        dispatch( handleGetAllProducts( filterObj, limit, sort, page ) );

    }, [dispatch, name, category, rating, subCategory, page, brand,visibility] );
    
    //pagination handler
    const handleStepsPushHandler = ( page ) => {
        if ( query) {
            if ( query.get( 'p' ) && query.get( 'p' ).trim() ) {
                    query.set( 'p', page );
                    history.push(`/dashboard/products-list?${query}`)                
            } else {
                history.push(`/dashboard/products-list?${query}&p=${page}`)
            }
        }
        else {
            history.push(`/dashboard/products-list?p=${page}`)
        }
    }
    
    //pagination handler
    const searchByNameHandler = ( name ) => {
        if ( query) {
            if ( query.get( 'name' ) && query.get( 'name' ).trim() ) {
                    query.set( 'name', name );
                    history.push(`/dashboard/products-list?${query}`)                
            } else {
                query.delete( 'name' );
                history.push(`/dashboard/products-list?${query}&name=${name}`)
            }
        }
        else {
            history.push(`/dashboard/products-list?name=${name}`)
        }
    }

    //visibility push handler
     const VisibilityPushHandler = ( visibilityStatus='' ) => {
        if ( query) {
            if ( query.get( 'visibility' ) && query.get( 'visibility' ).trim() ) {
                    query.set( 'visibility', visibilityStatus );
                    history.push(`/dashboard/products-list?${query}`)                
            } else {
                query.delete( 'visibility' );
                history.push(`/dashboard/products-list?${query}&visibility=${visibilityStatus}`)
            }
        }
        else {
            history.push(`/dashboard/products-list?visibility=${visibilityStatus}`)
        }
    }
    
    // const debouncer = ( func,value ) => {
    //     let debouncTimer;
    //     clearTimeout( debouncTimer )
    //     debouncTimer=setTimeout(() => {
    //         func(value)
    //     }, 500);
    // }

    const getNextPageHandler = (e) => {
            e.preventDefault()
            // dispatch( handleGetAllProducts(filterObj,limit,sort, Number( currentPage ) + 1 ) )
        if ( query ) {
            if ( query.get( 'p' ) && query.get( 'p' ).trim() ) {
                    query.set( 'p', Number( currentPage ) + 1 );
                    history.push(`/products/list?${query}`)                
            } else {
                history.push(`/products/list?${query}&p=${Number( currentPage ) + 1}`)
            }
        }
        else {
            history.push(`/products/list?p=${Number( currentPage ) + 1}`)
        }
    };

    const getPreviousageHandler = ( e ) => {
            e.preventDefault();
            // if ( currentPage > 1 ) dispatch( handleGetAllProducts(filterObj,limit,sort, Number( currentPage ) - 1 ) )
        if ( query ) {
            if ( query.get( 'p' ) && query.get( 'p' ).trim() ) {
                    query.set( 'p', Number( currentPage ) - 1 );
                    history.push(`/products/list?${query}`)                
            } else {
                history.push(`/products/list?${query}&p=${Number( currentPage ) - 1}`)
            }
        }
        else {
            history.push(`/products/list?p=${Number( currentPage ) - 1}`)
        }
    }

    // const getSortedHandler = ( e, ...sortFiels ) => {
    //     e.preventDefault();
    //     dispatch(handleGetAllProducts(filterObj,10,`${sortFiels.join()}`,currentPage))
    // }

    // category Push handler
    const categoryPushHandler = (e, val) => {
    e.preventDefault();
    if (query) {
      if (query.get("c") && query.get("c").trim()) {
        if (e.target.checked) {
          query.set("c", val);
          history.push(`/dashboard/products-list?${query}`);
        } else {
          query.delete("c");
          history.push(`/dashboard/products-list?${query}`);
        }
      } else {
        history.push(`/dashboard/products-list?${query}&c=${val}`);
      }
    } else {
      history.push(`/dashboard/products-list?c=${val}`);
    }
    };
    
    // category Push handler
    const brandPushHandler = (e, val) => {
    e.preventDefault();
    if (query) {
      if (query.get("brand") && query.get("brand").trim()) {
        if (e.target.checked) {
          query.set("brand", val);
          history.push(`/dashboard/products-list?${query}`);
        } else {
          query.delete("brand");
          history.push(`/dashboard/products-list?${query}`);
        }
      } else {
        history.push(`/dashboard/products-list?${query}&brand=${val}`);
      }
    } else {
      history.push(`/dashboard/products-list?brand=${val}`);
    }
  };
    
    const getSortedHandler = ( e, sortField ) => {
        e.preventDefault();
        
        if ( sort === sortField ) {
            setSort( '' );
        } else {
            setSort( sortField );
        }

        if ( query ) {
            if ( query.get( 'p' ) && query.get( 'p' ).trim() ) {
                    query.set( 'p',1 );
                    history.push(`/products/list?${query}`)                
            } else {
                history.push(`/products/list?${query}&p=1`)
            }
        }
        else {
            history.push(`/products/list?p=1`)
        }
    };

    /////////////////////////////////
    const stockStyle = (status) => (
        {
            'in-stock': 'badge-sa-success',
            'out-of-stock': 'badge-sa-danger',
            'on-backorder': 'badge-sa-warning',
            'preorder': 'badge-sa-primary',
        }[status]
    );

    const filters = [
        {
            key: 'price',
            title: 'Price',
            type: 'range',
            min: 0,
            max: 2000,
            from: 0,
            to: 2000,
        },
        {
            key: 'categories',
            title: 'Categories',
            type: 'check',
            // items: [
            //     {label: 'Power tools', checked: true},
            //     {label: 'Hand tools', checked: false},
            //     {label: 'Machine tools', checked: true},
            //     {label: 'Power machinery', checked: false},
            //     {label: 'Measurement', checked: false},
            // ],
            items:categories?[...categories]:[]
        },
        // {
        //     key: 'product_type',
        //     title: 'Product type',
        //     type: 'radio',
        //     items: [
        //         {label: 'Simple', checked: true},
        //         {label: 'Variable', checked: false},
        //         {label: 'Digital', checked: false},
        //     ],
        // },
        {
            key: 'visibility',
            title: 'visibility',
            type: 'radio',
            items: [
                {label: 'All', value: ''},
                {label: 'visible', value: 'published'},
                {label: 'hidden', value: 'hidden'},
            ],
        },
        {
            key: 'brands',
            title: 'Brands',
            type: 'check',
            items:brands?brands:[]
            // items: [
            //     {label: 'Brandix', checked: false},
            //     {label: 'FastWheels', checked: true},
            //     {label: 'FuelCorp', checked: true},
            //     {label: 'RedGate', checked: false},
            //     {label: 'Specter', checked: false},
            //     {label: 'TurboElectric', checked: false},
            // ],
        },
    ];
    
    const sidebar = (
        <>
            <div className="sa-layout__sidebar-header">
                <div className="sa-layout__sidebar-title">{messages.filters}</div>
                <button
                    type="button"
                    className="sa-close sa-layout__sidebar-close"
                    aria-label="Close"
                    data-sa-layout-sidebar-close=""
                />
            </div>
            <div className="sa-layout__sidebar-body sa-filters" data-simplebar>
                <ul className="sa-filters__list"  >
                    {filters.map( ( filter, filterIdx ) => (
                        <li key={filterIdx} className="sa-filters__item">
                            <div className="sa-filters__item-title">{filter.title}</div>
                            <div className="sa-filters__item-body">
                                {['check', 'radio'].includes( filter.type ) && (
                                    <ul className="list-unstyled m-0 mt-n2">
                                        {filter.items?.map( ( item, itemIdx ) => (
                                            <li key={itemIdx}>
                                                <label className="d-flex align-items-center pt-2">
                                                    {filter.type === 'check' && (
                                                        <>
                                                            {
                                                                filter.key === 'categories' ? (
                                                                    <input type="checkbox" className="form-check-input m-0 me-3 fs-exact-16" defaultChecked={(selectedcategory&&item._id===selectedcategory._id)&&true} style={{ position: 'relative' }} onClick={e => categoryPushHandler( e, item._id )} />
                                                                
                                                                ) : filter.key === 'brands' ? (
                                                                    <input type="checkbox" className="form-check-input m-0 me-3 fs-exact-16" defaultChecked={item.checked} style={{ position: 'relative' }} onClick={e => brandPushHandler( e, item._id )} />
                                                                
                                                                    ) : <input type="checkbox" className="form-check-input m-0 me-3 fs-exact-16" defaultChecked={item.checked} style={{ position: 'relative' }} />
                                                                
                                                            }
                                                          
                                                        </>
                                                    )}
                                                    {filter.type === 'radio' && (
                                                    <>
                                                        {
                                                            filter.key === 'visibility' ? (
                                                                <input type="radio" value={item.value} className="form-check-input m-0 me-3 fs-exact-16" onClick={e=>VisibilityPushHandler(e.target.value)} defaultChecked={item.value.toLocaleLowerCase()===visibility.toLocaleLowerCase()} name={`filter-${ filter.key }`} style={{ position: 'relative' }} />
                                                            ) : (
                                                                    <input type="radio" className="form-check-input m-0 me-3 fs-exact-16" defaultChecked={item.checked} name={`filter-${ filter.key }`} style={{ position: 'relative' }} />
                                                            )
                                                        }
                                                    </>
                                                    )}

                                                    {item.name ? item.name : item.label}
                                                </label>
                                            </li>
                                        ) )}
                                    </ul>
                                )}
                                {filter.type === 'range' && (
                                    <div
                                        className="sa-filter-range"
                                        data-min={filter.min}
                                        data-max={filter.max}
                                        data-from={filter.from}
                                        data-to={filter.to}
                                    >
                                        <div className="sa-filter-range__slider" />

                                        <input type="hidden" value={filter.from} className="sa-filter-range__input-from" />
                                        <input type="hidden" value={filter.to} className="sa-filter-range__input-to" />
                                    </div>
                                )}
                            </div>
                        </li>
                    ) )}
                </ul>
            </div>
        </>
    );

    const table = (
        <div className="saw-table__body sa-widget-table text-nowrap w-100" data-simplebar>
            <table className="w-100">
                <thead>
                    <tr>
                        <th className="w-min" data-orderable="false" style={{position:'relative'}}>
                            <input type="checkbox" className="form-check-input m-0 fs-exact-16 d-block" aria-label="..." />
                        </th>
                        <th className="min-w-20x" style={{ paddingLeft: "30px" }}>
                            {/* <span>
                                <ArrowRoundedUp13x8Svg  />
                            </span> */}
                            {messages.product}
                            {/* <span>
                                <ArrowRoundedDown12x7Svg  />
                            </span> */}
                        </th>
                        <th>{messages.category}</th>
                        <th>{messages.subCategory}</th>
                        <th>{messages.brand}</th>
                        <th>{messages.price}</th>
                        <th className="w-min" data-orderable="false" />
                    </tr>
                </thead>
                <tbody>
                    {products && products.map( ( product, productIdx ) => (
                        <tr key={productIdx}>
                            <td style={{ position: 'relative' }}>
                                <input type="checkbox" className="form-check-input m-0 fs-exact-16 d-block" aria-label="..." />
                            </td>
                            <td>
                                <div className="d-flex align-items-center" style={{ marginLeft: '20px' }}>
                                    <Link to={`/dashboard/products/${product._id}`} className="me-4">
                                        <div className="sa-symbol sa-symbol--shape--rounded sa-symbol--size--lg">
                                            <img src={`/uploads/imgs/products/${ product.photo }`} size={40} />
                                        </div>
                                    </Link>
                                    <div>
                                        <Link to={`/dashboard/products/${product._id}`} className="text-reset">{product.name.slice( 0, 40 )}</Link>
                                        <div className="sa-meta mt-0">
                                            <ul className="sa-meta__list">
                                                <li className="sa-meta__item">
                                                    ID: <span title="Click to copy product ID" className="st-copy">{product._id}</span>
                                                </li>
                                                {/* <li className="sa-meta__item">
                                                SKU: <span title="Click to copy product SKU" className="st-copy">{product.sku}</span>
                                            </li> */}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div>{product.category && product.category.name}</div>
                                {/* <Link onClick={e=>e.preventDefault()} className="text-reset">{product.category && product.category.name}</Link> */}
                            </td>
                            <td>
                                <div>{product.subCategory && product.subCategory.name}</div>
                                {/* <Link onClick={e=>e.preventDefault()} className="text-reset">{product.subCategory && product.subCategory.name}</Link> */}
                            </td>
                            <td>
                                <div className={`badge ${(product.brand&&product.brand)?'badge-sa-success':'badge-sa-secondary'}`}>
                                    {product.brand?product.brand.name:'not specified'}
                                </div>
                            </td>
                            <td>
                                <Price value={product.price?product.price:100} />
                            </td>
                            <td>
                                <MoreButton id={`product-context-menu-${ productIdx }`} productId={product._id} />
                            </td>
                        </tr>
                    ) )}
                </tbody>
        
            </table>
                
        </div>
    );

    const toolbar = (
        <div class="sa-inbox-toolbar">
            {/* put pagination here */}
            <Pagination  current={currentPage} total={Math.ceil(count / limit)} onPageChange={handleStepsPushHandler} />
            <div class="flex-grow-1"></div>
            <div class="sa-inbox-toolbar__text">7 of 512</div>
           {/* Add Limit box here */}
            <div class="me-n2"></div>
        </div>
    );

    const content = (
        <div className="card">
            <div className="p-4">
                <div className="row g-4">
                    <div className="col-auto sa-layout__filters-button">
                        <button className="btn btn-sa-muted btn-sa-icon fs-exact-16" data-sa-layout-sidebar-open="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">
                                <path
                                    d="M7,14v-2h9v2H7z M14,7h2v2h-2V7z M12.5,6C12.8,6,13,6.2,13,6.5v3c0,0.3-0.2,0.5-0.5,0.5h-2 C10.2,10,10,9.8,10,9.5v-3C10,6.2,10.2,6,10.5,6H12.5z M7,2h9v2H7V2z M5.5,5h-2C3.2,5,3,4.8,3,4.5v-3C3,1.2,3.2,1,3.5,1h2 C5.8,1,6,1.2,6,1.5v3C6,4.8,5.8,5,5.5,5z M0,2h2v2H0V2z M9,9H0V7h9V9z M2,14H0v-2h2V14z M3.5,11h2C5.8,11,6,11.2,6,11.5v3 C6,14.8,5.8,15,5.5,15h-2C3.2,15,3,14.8,3,14.5v-3C3,11.2,3.2,11,3.5,11z"
                                ></path>
                            </svg>
                        </button>
                    </div>
                    <div className="col">
                        <input
                            type="text"
                            placeholder={messages.searchProductMsg}
                            className="form-control form-control--search mx-auto"
                            id="table-search"
                            onKeyUp={e=>searchByNameHandler(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="sa-divider" ></div>
            {table}
            {toolbar}
                

        </div>
    );

    

    return (
        <React.Fragment>
            <div id="top" className="sa-app__body">
                <div className="mx-xxl-3 px-4 px-sm-5">
                    <PageHeader
                        title={messages.products}
                        actions={[
                            <Link key="reset" style={{display:!query.toString().trim()&&'none'}} to='/dashboard/products-list' className="btn btn-secondary me-3">
                                {messages.resetFilters}
                            </Link>,
                            <Link key="new_product" to='/dashboard/products-add' className="btn btn-primary">
                                {messages.newProduct}
                            </Link>,
                        ]}
                        breadcrumb={[
                            { title: `${messages.dashboard}`, url: '/dashboard' },
                            { title: `${messages.products}`, url: '' },
                        ]}
                    />
                </div>
                <div className="mx-xxl-3 px-4 px-sm-5 pb-6">
                    <div className="sa-layout">
                        <div className="sa-layout__backdrop" data-sa-layout-sidebar-close="" />
                        <div className="sa-layout__sidebar">
                            {sidebar}
                        </div>
                        <div className="sa-layout__content">
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default ProductListCatalog
