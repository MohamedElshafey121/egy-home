// react
import React, { useCallback, useState,useEffect } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect, useDispatch, useSelector } from 'react-redux';
//my work
import { useLocation,withRouter} from 'react-router-dom';


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

import { handleGetAllProducts } from "../../store/product";

function useSetOption(option, filter, dispatch) {
    const callback = useCallback(filter, []);

    return useCallback((data) => {
        dispatch({
            type: 'SET_OPTION_VALUE',
            option,
            value: callback(data),
        });
    }, [option, callback, dispatch]);
}


//Important
function useQuery() {
  // return new URLSearchParams(location.search)
  return new URLSearchParams(useLocation().search);
}

function ProductsView(props) {
    const {
        // productsList,
        history,
        options,
        filters,
        // dispatch,
        layout: propsLayout, //important
        offcanvas,
        sidebarOpen,
    } = props;

    // const limit = 50;
//   const sort = "-createdAt";
  const query = useQuery();
  const name = query.get("name") || "";
  const category = query.get("c") || "";
  const rating = query.get("r") || "";
  const subCategory = query.get("s") || "";
  const page = query.get("p") || 1;
  // const [page,setPage]=useState(query.get( 'p' ) || 1)
    const [layout, setLayout] = useState( propsLayout );
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
    };
    

    //MY WORK
    const dispatch = useDispatch();
    useEffect( () => {
        dispatch( handleGetAllProducts( filterObj, limit, sort, page ) );
    }, [dispatch, name, category, rating, subCategory, page,sort,limit] );

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


    // const handlePageChange = useSetOption('page', parseFloat, dispatch);
    // const handleSortChange = useSetOption('sort', (event) => event.target.value, dispatch);
    // const handleLimitChange = useSetOption('limit', (event) => parseFloat(event.target.value), dispatch);

    const handleResetFilters = useCallback(() => {
        dispatch({ type: 'RESET_FILTERS' });
    }, [dispatch]);

    const filtersCount = Object.keys( filters ).map( ( x ) => filters[x] ).filter( ( x ) => x ).length;

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
            <ProductCard product={product} />
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
                                <span className="filters-button__title">Filters</span>
                                {!!filtersCount && <span className="filters-button__counter">{filtersCount}</span>}
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
                            Showing
                            {
                                Number( currentPage ) === 1
                                    ? '1 - '
                                    : !isNaN( ( Number( currentPage ) - 1 ) * limit )
                                        ? `${(( Number( currentPage ) - 1 ) * limit)+1} — `
                                        :'' 
                            }
                            {!isNaN( Number( currentPage ) * limit ) && Number( currentPage ) * limit}
                                                                {allProducts.count &&(<> of <span>{allProducts.count}</span></>)}


                            {/* {`Showing ${productsList.from}—${productsList.to} of ${count} products`} */}
                        </div>
                        <div className="view-options__divider" />
                        <div className="view-options__control">
                            <label htmlFor="view-options-sort">Sort By</label>
                            <div>
                                <select
                                    id="view-options-sort"
                                    className="form-control form-control-sm"
                                    value={sort}
                                    onChange={( e ) => sortHanler( e )}
                                >
                                    <option value="-createdAt">Default</option>
                                    <option value="name">Name</option>
                                    <option value="price">Price</option>
                                </select>
                            </div>
                        </div>
                        <div className="view-options__control">
                            <label htmlFor="view-options-limit">Show</label>
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

                <div className="products-view__pagination">
                    <Pagination
                        current={currentPage}
                        siblings={2}
                        total={Math.ceil(count / limit)}
                        onPageChange={handleStepsPushHandler}
                    />
                </div>
            </div>
        );
    } else {
        content = (
            <div className="products-view__empty">
                <div className="products-view__empty-title">No matching items</div>
                <div className="products-view__empty-subtitle">Try resetting the filters</div>
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleResetFilters}
                >
                    Reset filters
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
