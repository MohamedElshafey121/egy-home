// react
import React, { useCallback, useState,useEffect } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect, useDispatch, useSelector } from 'react-redux';
//my work
import { useLocation, withRouter } from 'react-router-dom';


//data stubs
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'


// application
import Pagination from '../shared/Pagination';
import ProductCard from '../shared/ProductCard';
import {
    Filters16Svg,
    LayoutGrid16x16Svg,
    LayoutGridWithDetails16x16Svg,
    LayoutList16x16Svg,
} from '../../svg';
import { sidebarOpen } from '../../store/sidebar';

function ProductsView ( props ) {
    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )

    const {
        layout: propsLayout, //important
        offcanvas,
        sidebarOpen,
        productsList,
        productsLoading,
        currentPage,
        allProducts,
        sortHanler,
        limit,
        sort,
        limitHandler,
        count,
        handleStepsPushHandler,
        handleResetFilters
    } = props;

    // const limit = 50;
//   const sort = "-createdAt";
//   const query = useQuery();
//   const name = query.get("name") || "";
//     const category = query.get( "c" ) || "";
//     const brand = query.get( 'brand' ) || '';
//   const rating = query.get("r") || "";
//   const subCategory = query.get("s") || "";
//   const page = query.get("p") || 1;
//   // const [page,setPage]=useState(query.get( 'p' ) || 1)
    const [layout, setLayout] = useState( propsLayout );
//     const [sort, setSort] = useState( '-createdAt' );
//     const [limit, setLimit] = useState( 18 );
    

//   const allProducts = useSelector((state) => state.allProducts);
//   const {
//     loading:productsLoading,
//     products:productsList,
//     error,
//     page: currentPage,
//     count,
//     category: categoryFound,
//   } = allProducts;
    
//     const filterObj = {
//     name,
//     category,
//     rating,
//         subCategory,
//     brand
//     };
    

//     //MY WORK
//     const dispatch = useDispatch();
//     useEffect( () => {
//         dispatch( handleGetAllProducts( filterObj, limit, sort, page ) );
//     }, [dispatch, name, category, rating, subCategory, page,sort,limit,brand] );

//     const sortHanler = ( e ) => {
//     e.preventDefault();
//         // dispatch( handleGetAllProducts( filterObj, limit, e.target.value, 1 ) )
//         setSort(e.target.value)
//     };

//     const limitHandler = (e) => {
//         e.preventDefault();
//         setLimit( e.target.value );
//     }

//     const handleStepsPushHandler = ( p) => {
//     if (query) {
//       if (query.get("p") && query.get("p").trim()) {
//         query.set("p", p);
//         history.push(`/shop/catalog?${query}`);
//       } else {
//         history.push(`/shop/catalog?${query}&p=${p}`);
//       }
//     } else {
//       history.push(`/shop/catalog?p=${p}`);
//     }
//     // setPage( p );
//   };


//     // const handlePageChange = useSetOption('page', parseFloat, dispatch);
//     // const handleSortChange = useSetOption('sort', (event) => event.target.value, dispatch);
//     // const handleLimitChange = useSetOption('limit', (event) => parseFloat(event.target.value), dispatch);

//     const handleResetFilters = useCallback(() => {
//         // dispatch({ type: 'RESET_FILTERS' });
//         history.push('/shop/catalog')
//     }, []);

    // const filtersCount = Object.keys( filters ).map( ( x ) => filters[x] ).filter( ( x ) => x ).length;

    //View Modes important
    let viewModes = [
        { key: 'grid', title: 'Grid', icon: <LayoutGrid16x16Svg /> },
        { key: 'grid-with-features', title: 'Grid With Features', icon: <LayoutGridWithDetails16x16Svg /> },
        { key: 'list', title: 'List', icon: <LayoutList16x16Svg /> },
    ];

    //Change the View Modee ['grid','list']
    viewModes = viewModes.map((viewMode) => {
        const className = classNames('layout-switcher__button', {
            'layout-switcher__button--active': layout === viewMode.key,
        });

        return (
            <button
                key={viewMode.key}
                title={viewMode.title}
                type="button"
                className={className}
                onClick={() => setLayout(viewMode.key)}
            >
                {viewMode.icon}
            </button>
        );
    });

    const productsListItems = productsList && ( productsList.map( ( product ) => (
        <div key={product._id} className="products-list__item">
            <ProductCard product={product} layout={layout} />
        </div>
    ) ) );

    const rootClasses = classNames('products-view', {
        'products-view--loading': productsLoading,
    });

    const viewOptionsClasses = classNames('view-options', {
        'view-options--offcanvas--always': offcanvas === 'always',
        'view-options--offcanvas--mobile': offcanvas === 'mobile',
    });

    let content;

    if (productsListItems && productsListItems.length > 0) {
        content = (
            <div className="products-view__content">
                {/* Start Filter and change Views Setion */}
                <div className="products-view__options">
                    <div className={viewOptionsClasses}>
                        <div className="view-options__filters-button">
                            <button type="button" className="filters-button" onClick={() => sidebarOpen()}>
                                <Filters16Svg className="filters-button__icon" />
                                <span className="filters-button__title">{messages.filters}</span>
                                {/* {!!filtersCount && <span className="filters-button__counter">{'filtersCount'}</span>} */}
                            </button>
                        </div>
                        <div className="view-options__layout">
                            <div className="layout-switcher">
                                <div className="layout-switcher__list">
                                    {viewModes}
                                </div>
                            </div>
                        </div>
                        <div className="view-options__legend">
                            {messages.showing}
                            {
                                Number( currentPage ) === 1
                                    ? '1 - '
                                    : !isNaN( ( Number( currentPage ) - 1 ) * limit )
                                        ? `${(( Number( currentPage ) - 1 ) * limit)+1} — `
                                        :'' 
                            }
                            {!isNaN( Number( currentPage ) * limit ) && Number( currentPage ) * limit}
                                                                {allProducts.count &&(<> {messages.of} <span>{allProducts.count}</span></>)}


                            {/* {`Showing ${productsList.from}—${productsList.to} of ${count} products`} */}
                        </div>
                        <div className="view-options__divider" />
                        <div className="view-options__control">
                            <label htmlFor="view-options-sort">{messages.sortBy}</label>
                            <div>
                                <select
                                    id="view-options-sort"
                                    className="form-control form-control-sm"
                                    value={sort}
                                    onChange={( e ) => sortHanler( e )}
                                >
                                    <option value="-createdAt">{messages.default}</option>
                                    <option value="name">{messages.name}</option>
                                    <option value="price">{messages.price}</option>
                                </select>
                            </div>
                        </div>
                        <div className="view-options__control">
                            <label htmlFor="view-options-limit">{messages.show}</label>
                            <div>
                                <select
                                    id="view-options-limit"
                                    className="form-control form-control-sm"
                                    value={limit}
                                    onChange={e => limitHandler( e )}
                                >
                                    <option value="12">12</option>
                                    <option value="18">18</option>
                                    <option value="24">24</option>
                                    <option value="30">30</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End Filter and change Views Setion */}

                {/* Start List of Products */}
                <div
                    className="products-view__list products-list"
                    data-layout={layout !== 'list' ? 'grid-3-sidebar' : layout}
                    data-with-features={layout === 'grid-with-features' ? 'true' : 'false'}
                >
                    <div className="products-list__body">
                        {productsListItems}
                    </div>
                </div>

                {count > limit &&
                    ( <div className="products-view__pagination">
                    <Pagination
                        current={currentPage}
                        siblings={2}
                        total={Math.ceil(count / limit)}
                        onPageChange={handleStepsPushHandler}
                    />
                </div> )
                }

                {count < limit && (
                    <div className="products-view__pagination text-center">
                        No more products
                    </div>
                )}
            </div>
        );
    } else {
        content = (
            <div className="products-view__empty">
                <div className="products-view__empty-title">{messages.noResult}</div>
                <div className="products-view__empty-subtitle">{ messages.noResultMsg}</div>
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleResetFilters}
                >
                    {messages.resetFilters}
                </button>
            </div>
        );
    }

    return (
        <div className={rootClasses}>
            <div className="products-view__loader" />
            {!productsLoading&&(content)}
        </div>
    );
}

ProductsView.propTypes = {
    /**
     * Indicates that products is loading.
     */
    /**
     * ProductsList object.
     */
    productsList: PropTypes.object,
    /**
     * Products list options.
     */
    options: PropTypes.object,
    /**
     * Products list filters.
     */
    filters: PropTypes.object,
    /**
     * Category page dispatcher.
     */
    dispatch: PropTypes.func,
    /**
     * products list layout (default: 'grid')
     * one of ['grid', 'grid-with-features', 'list']
     */
    layout: PropTypes.oneOf(['grid', 'grid-with-features', 'list']),
    /**
     * products list layout (default: 'grid')
     * one of ['grid-3-sidebar', 'grid-4-full', 'grid-5-full']
     */
    grid: PropTypes.oneOf(['grid-3-sidebar', 'grid-4-full', 'grid-5-full']),
    /**
     * indicates when sidebar should be off canvas
     */
    offcanvas: PropTypes.oneOf(['always', 'mobile']),
};

ProductsView.defaultProps = {
    layout: 'grid',
    offcanvas: 'mobile',
};

const mapDispatchToProps = {
    sidebarOpen,
};

export default withRouter(connect(
    () => ({}),
    mapDispatchToProps,
)(ProductsView));
