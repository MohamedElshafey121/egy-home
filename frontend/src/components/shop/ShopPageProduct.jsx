// react
import React, { useEffect, useState } from 'react';

// third-party
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import{useSelector,useDispatch} from 'react-redux'

// application
import PageHeader from '../shared/PageHeader';
import Product from '../shared/Product';
import ProductTabs from './ProductTabs';
import shopApi from '../../api/shop';
import { url } from '../../services/utils';

//data-stubs
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'


// blocks
import BlockLoader from '../blocks/BlockLoader';
import BlockProductsCarousel from '../blocks/BlockProductsCarousel';

// widgets
import WidgetCategories from '../widgets/WidgetCategories';
import WidgetProducts from '../widgets/WidgetProducts';

// data stubs
import categories from '../../data/shopWidgetCategories';
import theme from '../../data/theme';

import {
    handleGetOneProduct,
    getRelatedProducts
} from '../../store/product'
import { Redirect } from 'react-router-dom';


function ShopPageProduct ( props ) {
    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )

    const { productId, layout, sidebarPosition,history } = props;
    
    const productDeatils = useSelector( (state) => state.productDeatils );
    const { loading: isLoading, product, error } = productDeatils;
    
    const relatedProducts = useSelector((state) => state.relatedProducts);
    const {
        products,
        success: relatedProductsSuccess,
        error: relatedProductsError,
    } = relatedProducts;
    const dispatch = useDispatch();

    //Load Product
    useEffect( () => {
        // alert(productId)
        dispatch( handleGetOneProduct( productId ) );
    }, [dispatch, productId] )
    
    //Load Related Products
    useEffect( () => {
        dispatch(getRelatedProducts(productId))
    }, [dispatch, productId] )
    
    // useEffect( () => {
    //     if ( error ) {
    //         alert(error)
    //         history.push('/')
    //     }
    // },[error])
   
    if (isLoading) {
        return <BlockLoader />;
    }

    const breadcrumb = [
        { title: 'Home', url: url.home() },
        { title: 'Shop', url: url.catalog() },
        { title: product? product.name:"", url: product? url.product(product):"" },
    ];

    let content;

    if ( product && !error ) {
        if ( layout === 'sidebar' ) {
            content = (
                <div className="container">
                    <div className={`shop-layout shop-layout--sidebar--${ sidebarPosition }`}>
                        <div className=" shop-layout__content">
                            <div className=" block">
                                <Product product={product} layout={layout} />
                                <ProductTabs withSidebar description={product.description} />
                            </div>

                            {( products && products.length > 0 ) && (
                                <BlockProductsCarousel
                                    title="Related Products"
                                    layout="grid-4-sm"
                                    products={products}
                                    withSidebar
                                />
                            )}
                        </div>
                    </div>
                </div>
            );
        } else {
            content = (
                <React.Fragment>
                    <div className="block">
                        <div className="container">
                            <Product product={product} layout={layout} />
                            <ProductTabs productId={product._id} description={product.description} />
                        </div>
                    </div>

                    {( products && products.length > 0 ) && (
                        <BlockProductsCarousel
                            title="منتجات ذات صلة"
                            layout="grid-5"
                            products={products}
                        />
                    )}
                </React.Fragment>
            );
        }
    }else {
        content = (
            <div className="products-view__empty">
                <div className="products-view__empty-title">{messages.noResult}</div>
                <div className="products-view__empty-subtitle">{messages.noResultMsg}</div>
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={()=>history.push('/shop/catalog')}
                >
                    {messages.resetFilters}
                </button>
            </div>
        );
    }


    return (
        <React.Fragment>
            <Helmet>
                <title>{`${product ?product.name :theme.name}`}</title>
            </Helmet>

            {(product && !error)&&<PageHeader breadcrumb={breadcrumb} />}

            {content}
        </React.Fragment>
    );
}

ShopPageProduct.propTypes = {
    /** Product slug. */
    productId: PropTypes.string,
    /** one of ['standard', 'sidebar', 'columnar', 'quickview'] (default: 'standard') */
    layout: PropTypes.oneOf(['standard', 'sidebar', 'columnar', 'quickview']),
    /**
     * sidebar position (default: 'start')
     * one of ['start', 'end']
     * for LTR scripts "start" is "left" and "end" is "right"
     */
    sidebarPosition: PropTypes.oneOf(['start', 'end']),
};

ShopPageProduct.defaultProps = {
    layout: 'standard',
    sidebarPosition: 'start',
};

export default ShopPageProduct;
