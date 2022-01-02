// react
import React, { useCallback,useEffect, useReducer, useState } from 'react';

// third-party
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { Helmet } from 'react-helmet-async';

// application
import BlockLoader from '../blocks/BlockLoader';
import CategorySidebar from './CategorySidebar';
import CategorySidebarItem from './CategorySidebarItem';
import PageHeader from '../shared/PageHeader';
import ProductsView from './ProductsView';
import shopApi from '../../api/shop';
import WidgetFilters from '../widgets/WidgetFilters';
import WidgetProducts from '../widgets/WidgetProducts';
import { sidebarClose } from '../../store/sidebar';
import {
    getRecentProducts,
    handleGetAllProducts
} from '../../store/product'

import {
    getSearchCategories,
    getSuggestedSearchProducts
} from "../../store/homePage"

import { handleGetAllCategorySubCategories } from '../../store/subCategory'
import {getAllBrands} from '../../store/brand'




// data stubs
import theme from '../../data/theme';
import { url, getCategoryParents } from '../../services/utils';



function useQuery() {
  // return new URLSearchParams(location.search)
  return new URLSearchParams(useLocation().search);
}

function ShopPageCategory ( props ) {
    const {
        columns,
        viewMode,
        sidebarPosition,
        location,
        history
    } = props;
    //////////////////////////////
    const query = useQuery();
  const name = query.get("name") || "";
    const category = query.get( "c" ) || "";
    const brand = query.get( 'brand' ) || '';
  const rating = query.get("r") || "";
  const subCategory = query.get("s") || "";
    const page = query.get( "p" ) || 1;
    
  // const [page,setPage]=useState(query.get( 'p' ) || 1)
    // const [layout, setLayout] = useState( propsLayout );
    const [sort, setSort] = useState( '-createdAt' );
    const [limit, setLimit] = useState( 18 );
    

  const allProducts = useSelector((state) => state.allProducts);
  const {
    loading:productsLoading,
    products:productsList,
    error,
    page: currentPage,
    count,
    category: categoryFound,
  } = allProducts;
    
    const filterObj = {
    name,
    category,
    rating,
    subCategory,
    brand
    };
    

    //MY WORK
    const dispatch = useDispatch();
    useEffect( () => {
        dispatch( handleGetAllProducts( filterObj, limit, sort, page ) );
    }, [dispatch, name, category, rating, subCategory, page,sort,limit,brand] );

    const sortHanler = ( e ) => {
    e.preventDefault();
        // dispatch( handleGetAllProducts( filterObj, limit, e.target.value, 1 ) )
        setSort(e.target.value)
    };

    const limitHandler = (e) => {
        e.preventDefault();
        setLimit( e.target.value );
    }

    const handleStepsPushHandler = ( p) => {
    if (query) {
      if (query.get("p") && query.get("p").trim()) {
        query.set("p", p);
        history.push(`/shop/catalog?${query}`);
      } else {
        history.push(`/shop/catalog?${query}&p=${p}`);
      }
    } else {
      history.push(`/shop/catalog?p=${p}`);
    }
    // setPage( p );
  };


    const handleResetFilters = useCallback( () => {
        history.push( '/shop/catalog' )
    }, [] );

    ///////////////////////////////////////

    //CATEGORIES
    const searchCategories = useSelector( state => state.searchCategories );
    const { categories } = searchCategories;

    //SUB CATEGORIES
    const allCategorySubCategories = useSelector( state => state.allCategorySubCategories )
    const { subCategories } = allCategorySubCategories;
    
    //BRANDS
    const allBrands = useSelector( state => state.allBrands )
    const {brands,success } = allBrands;

    //load categories
    useEffect( () => {
        if ( !categories ) {
            dispatch( getSearchCategories() )
        }
    }, [dispatch, categories] )
    
    //load subcategories
    useEffect( () => {
        if ( category && category.trim()!=='' ) {
            dispatch(handleGetAllCategorySubCategories(category))
        }
    }, [category] )
    
    //load brands
    useEffect( () => {
        if ( !brands ) {
            dispatch(getAllBrands())
        }
    }, [] )

    const brandPushHandler = (e, val) => {
        e.preventDefault();
        window.scrollTo( {
            top: 0,
            behavior:'smooth'
        })
    if (query) {
      if (query.get("brand") ) {
        if (e.target.checked) {
          query.set("brand", val);
          history.push(`/shop/catalog?${query}`);
        } else {
          query.delete("brand");
          history.push(`/shop/catalog?${query}`);
        }
      } else {
        history.push(`/shop/catalog?${query}&brand=${val}`);
      }
    } else {
      history.push(`/shop/catalog?brand=${val}`);
        }
    };
    

    // category Push handler
    const categoryPushHandler = ( e, val ) => {
        e.preventDefault();
        if ( query ) {
            if ( query.get( "s" ) ) {
                query.delete( 's' )
            }

            if ( query.get( "c" ) && query.get( "c" ).trim() ) {
                
                query.set( "c", val );
                history.push( `/shop/catalog?${ query }` );
                
            } else {
                history.push( `/shop/catalog?${ query }&c=${ val }` );
            }
        } else {
            history.push( `/shop/catalog?c=${ val }` );
        }
    };

    // category Push handler
    const subCategoryPushHandler = (e, val) => {
    e.preventDefault();
    if (query) {
      if (query.get("s") && query.get("s").trim()) {
        
          query.set("s", val);
          history.push(`/shop/catalog?${query}`);
        
      } else {
        history.push(`/shop/catalog?${query}&s=${val}`);
      }
    } else {
      history.push(`/shop/catalog?s=${val}`);
    }
    };

    const ratingPushHandler = (e, val) => {
        e.preventDefault();
        window.scrollTo( {
            top: 60,
            behavior:'smooth'
        })
    if (query) {
      if (query.get("r") ) {
        if (e.target.checked) {
          query.set("r", val);
          history.push(`/shop/catalog?${query}`);
        } else {
          query.delete("r");
          history.push(`/shop/catalog?${query}`);
        }
      } else {
        history.push(`/shop/catalog?${query}&r=${val}`);
      }
    } else {
      history.push(`/shop/catalog?r=${val}`);
        }
    };
    

    ///////////////////////////////////////////////////
    
    const offcanvas = columns === 3 ? 'mobile' : 'always';
    // Latest Products
    const recentProducts = useSelector( state => state.recentProducts );
    const { products: latestProducts, success: recentProductsSuccess, error: recentProductsError } = recentProducts;
   
    
    // Load latest products.
    useEffect( () => {
        dispatch( getRecentProducts({limit:7}) );
    }, [offcanvas]);

    const breadcrumb = [
        { title: 'الصفحة الرئيسية', url: url.home() },
        { title: 'المتجر', url: url.catalog() },
    ];
    let pageTitle = 'المتجر';
    let content;

  
    const productsView = (
        <ProductsView
            options={{}}
            filters={{}}
            dispatch={dispatch}
            layout={viewMode}
            grid={`grid-${columns}-${columns > 3 ? 'full' : 'sidebar'}`}
            offcanvas={offcanvas}
            productsList={productsList}
            productsLoading={productsLoading}
            currentPage={currentPage}
            allProducts={allProducts}
            sortHanler={sortHanler}
            limit={limit}
            sort={sort}
            limitHandler={limitHandler}
            count={count}
            handleStepsPushHandler={handleStepsPushHandler}
            handleResetFilters={handleResetFilters}
        />
    );

    const sidebarComponent = (
        <CategorySidebar offcanvas={offcanvas}>
            <CategorySidebarItem>
                <WidgetFilters
                    title="Filters"
                    offcanvas={offcanvas}
                    dispatch={dispatch}
                    subCategories={subCategories}
                    categories={categories}
                    brands={brands}
                    category={category}
                    subCategory={subCategory}
                    brand={brand}
                    brandPushHandler={brandPushHandler}
                    categoryPushHandler={categoryPushHandler}
                    handleResetFilters={handleResetFilters}
                    subCategoryPushHandler={subCategoryPushHandler}
                    ratingPushHandler={ratingPushHandler}
                    rating={rating}
                />
            </CategorySidebarItem>
            {offcanvas !== 'always' && (
                <CategorySidebarItem className="d-none d-lg-block">
                    <WidgetProducts title="أحدث المنتجات" products={latestProducts} />
                </CategorySidebarItem>
            )}
        </CategorySidebar>
    );

    if (columns > 3) {
        content = (
            <div className="container">
                <div className="block">{productsView}</div>
                {sidebarComponent}
            </div>
        );
    } else {
        const sidebar = (
            <div className="shop-layout__sidebar">
                {sidebarComponent}
            </div>
        );

        content = (
            <div className="container">
                <div className={`shop-layout shop-layout--sidebar--${sidebarPosition}`}>
                    {sidebarPosition === 'start' && sidebar}
                    <div className="shop-layout__content">
                        <div className="block">{productsView}</div>
                    </div>
                    {sidebarPosition === 'end' && sidebar}
                </div>
            </div>
        );
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>{`المتجر`}</title>
            </Helmet>

            <PageHeader header={pageTitle} breadcrumb={breadcrumb} />

            {content}
        </React.Fragment>
    );
};

ShopPageCategory.propTypes = {
    /**
     * Category slug.
     */
    categorySlug: PropTypes.string,
    /**
     * number of product columns (default: 3)
     */
    columns: PropTypes.number,
    /**
     * mode of viewing the list of products (default: 'grid')
     * one of ['grid', 'grid-with-features', 'list']
     */
    viewMode: PropTypes.oneOf(['grid', 'grid-with-features', 'list']),
    /**
     * sidebar position (default: 'start')
     * one of ['start', 'end']
     * for LTR scripts "start" is "left" and "end" is "right"
     */
    sidebarPosition: PropTypes.oneOf(['start', 'end']),
};

ShopPageCategory.defaultProps = {
    columns: 3,
    viewMode: 'grid',
    sidebarPosition: 'start',
};

const mapStateToProps = (state) => ({
    sidebarState: state.sidebar,
    page: state.category,
});

const mapDispatchToProps = () => ({
    sidebarClose,
});

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageCategory);
