// react
import React,{useEffect} from 'react';

// third-party
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux'

// application
import Currency from '../shared/Currency';
import { url } from '../../services/utils';

import {
    getRecentProducts
}from '../../store/product'


function WidgetProducts(props) {
    const {
        title,
        products
    } = props;

    // const dispatch = useDispatch();
    // const recentProducts = useSelector( state => state.recentProducts );
    // const { products, success: recentProductsSuccess, error: recentProductsError } = recentProducts;
   
    // useEffect( () => {
    //     dispatch( getRecentProducts({limit:7}) );
    // },[dispatch])

    const productsList =products&& products.map((product) => {
        let image;
        let price;

        if (product.photo ) {
            image = (
                <div className="widget-products__image">
                    <div className="product-image">
                        <Link to={url.product(product)} className="product-image__body">
                            <img className="product-image__img" src={`/uploads/imgs/products/${ product.photo }`} alt="image" />
                        </Link>
                    </div>
                </div>
            );
        }

        if (product.compareAtPrice) {
            price = (
                <React.Fragment>
                    <span className="widget-products__new-price"><Currency value={product.price} /></span>
                    {' '}
                    <span className="widget-products__old-price"><Currency value={product.compareAtPrice} /></span>
                </React.Fragment>
            );
        } else {
            price = <Currency value={product.price} />;
        }

        return (
            <div key={product._id} className="widget-products__item">
                {image}
                <div className="widget-products__info">
                    <div className="widget-products__name">
                        <Link to={url.product(product)}>{product.name}</Link>
                    </div>
                    <div className="widget-products__prices">
                        {price}
                    </div>
                </div>
            </div>
        );
    });

    return (
        <div className="widget-products widget">
            <h4 className="widget__title">{title}</h4>
            <div className="widget-products__list">
                {productsList}
            </div>
        </div>
    );
}

WidgetProducts.propTypes = {
    /**
     * widget title
     */
    title: PropTypes.node,
    /**
     * array of product objects
     */
    products: PropTypes.array,
};

WidgetProducts.defaultProps = {
    products: [],
};

export default WidgetProducts;
