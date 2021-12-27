// react
import React, { useEffect, useReducer, useState } from 'react';

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
}from '../../store/product'


// data stubs
import theme from '../../data/theme';
import { url, getCategoryParents } from '../../services/utils';

//get filters (query params) //limit, page, sort
function parseQueryOptions(location) {
    const query = queryString.parse(location);
    const optionValues = {};

    if (typeof query.page === 'string') {
        optionValues.page = parseFloat(query.page);
    }
    if (typeof query.limit === 'string') {
        optionValues.limit = parseFloat(query.limit);
    }
    if (typeof query.sort === 'string') {
        optionValues.sort = query.sort;
    }

    return optionValues;
}

//filter color and brands
function parseQueryFilters(location) {
    const query = queryString.parse(location);
    const filterValues = {};

    Object.keys(query).forEach((param) => {
        const mr = param.match(/^filter_([-_A-Za-z0-9]+)$/);

        if (!mr) {
            return;
        }

        const filterSlug = mr[1];

        filterValues[filterSlug] = query[param];
    });

    return filterValues;
}

function parseQuery(location) {
    return [
        parseQueryOptions(location),
        parseQueryFilters(location),
    ];
}

function buildQuery(options, filters) {
    const params = {};

    if (options.page !== 1) {
        params.page = options.page;
    }

    if (options.limit !== 12) {
        params.limit = options.limit;
    }

    if (options.sort !== 'default') {
        params.sort = options.sort;
    }

    Object.keys(filters).filter((x) => x !== 'category' && !!filters[x]).forEach((filterSlug) => {
        params[`filter_${filterSlug}`] = filters[filterSlug];
    });

    return queryString.stringify(params, { encode: false });
}

// const initialState = {
//     init: false,
//     /**
//      * Indicates that the category is loading.
//      */
//     categoryIsLoading: true,
//     /**
//      * Category object.
//      */
//     category: null,
//     /**
//      * Indicates that the products list is loading.
//      */
//     productsListIsLoading: true,
//     /**
//      * Products list.
//      */
//     productsList: null,
//     /**
//      * Products list options.
//      *
//      * options.page:  number - Current page.
//      * options.limit: number - Items per page.
//      * options.sort:  string - Sort algorithm.
//      */
//     options: {},
//     /**
//      * Products list filters.
//      *
//      * filters[FILTER_SLUG]: string - filter value.
//      */
//     filters: {},
// };

//Important
function useQuery() {
  // return new URLSearchParams(location.search)
  return new URLSearchParams(useLocation().search);
}

function ShopPageCategory ( props ) {
    const {
        categorySlug,
        columns,
        viewMode,
        sidebarPosition,
        location
    } = props;
    // const query = queryString.parse( location );
    // console.log('query ',query)


      // const limit = 50;
//   const sort = "-createdAt";
  const query = useQuery();
  const name = query.get("name") || "";
  const category = query.get("c") || "";
  const rating = query.get("r") || "";
  const subCategory = query.get("s") || "";
    const page = query.get( "p" ) || 1;
     const [sort, setSort] = useState( '-createdAt' );
    const [limit, setLimit] = useState( 18 );
    
    const filterObj = {
    name,
    category,
    rating,
    subCategory,
    };
  

    const offcanvas = columns === 3 ? 'mobile' : 'always';
    // Latest Products
    const dispatch = useDispatch();
    const recentProducts = useSelector( state => state.recentProducts );
    const { products: latestProducts, success: recentProductsSuccess, error: recentProductsError } = recentProducts;
    
    //products List
    const allProducts = useSelector((state) => state.allProducts);
  const {
    loading:productsListIsLoading,
    products:productsList,
    error,
    page: currentPage,
    count,
    category: categoryFound,
  } = allProducts;
   

    // Replace current url.
    // useEffect(() => {
    //     const query = buildQuery(state.options, state.filters);
    //     const location = `${window.location.pathname}${query ? '?' : ''}${query}`;

    //     window.history.replaceState(null, '', location);
    // }, [state.options, state.filters]);

    // Load category.
    useEffect(() => {
        let request;
        let canceled = false;

        dispatch({ type: 'RESET', categorySlug });

        if (categorySlug) {
            request = shopApi.getCategoryBySlug(categorySlug);
        } else {
            request = Promise.resolve(null);
        }

        request.then((category) => {
            if (canceled) {
                return;
            }

            dispatch({ type: 'FETCH_CATEGORY_SUCCESS', category });
        });

        return () => {
            canceled = true;
        };
    }, [dispatch, categorySlug]);

    // Load products.
    useEffect( () => {
        dispatch( handleGetAllProducts( filterObj, limit, sort, page ) );
    }, [dispatch, name, category, rating, subCategory, page,sort,limit] );

    
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

    // if (state.category) {
    //     getCategoryParents(state.category).forEach((parent) => {
    //         breadcrumb.push({ title: parent.name, url: url.category(parent) });
    //     });

    //     breadcrumb.push({ title: state.category.name, url: url.category(state.category) });

    //     pageTitle = state.category.name;
    // }

    const productsView = (
        <ProductsView
            isLoading={productsListIsLoading}
            productsList={productsList}
            // options={state.options}
            options={{}}
            // filters={state.filters}
            filters={{}}
            dispatch={dispatch}
            layout={viewMode}
            grid={`grid-${columns}-${columns > 3 ? 'full' : 'sidebar'}`}
            offcanvas={offcanvas}
        />
    );

    const sidebarComponent = (
        <CategorySidebar offcanvas={offcanvas}>
            <CategorySidebarItem>
                <WidgetFilters
                    title="Filters"
                    offcanvas={offcanvas}
                    // filters={state.productsList.filters}
                    filters={[]}
                    // values={state.filters}
                    values={{}}
                    dispatch={dispatch}
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
}

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
