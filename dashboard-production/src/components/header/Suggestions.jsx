// react
import React from 'react';

// third-party
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// application
import AsyncAction from '../shared/AsyncAction';
import Currency from '../shared/Currency';
import { Cart16Svg } from '../../svg';
import { cartAddItem } from '../../store/oldCart';
import { url } from '../../services/utils';
import {
    addToCart,
    addToUserCart
} from '../../store/cart';


function Suggestions ( props ) {
    const {
        context,
        className,
        products,
        cartAddItem,
        userInfo
    } = props;

    const dispatch = useDispatch();
     const addTocartHandler = ( product, shape = '', qty = 1 ) => {
        shape = shape.trim() ? shape : product.color;
        if ( userInfo ) {
            return dispatch( addToUserCart( product._id, { qty, shape } ) )
        }
        
        return dispatch( addToCart( product._id, { qty, shape } ) );
    };
    const rootClasses = classNames( `suggestions suggestions--location--${ context }`, className );

    const list = ( products && products.map( ( product ) => (
        <li key={product._id} className="suggestions__item">
            {product.photo  && (
                <div className="suggestions__item-image product-image">
                    <div className="product-image__body">
                        <img className="product-image__img" src={`/uploads/imgs/products/${ product.photo }`} alt="" />
                    </div>
                </div>
            )}
            <div className="suggestions__item-info">
                <Link className="suggestions__item-name" to={url.product( product )}>
                    {product.name}
                </Link>
                {/* <div className="suggestions__item-meta">SKU: 83690/32</div> */}
            </div>
            <div className="suggestions__item-price">
                {product.compareAtPrice && (
                    <React.Fragment>
                        <span className="suggestions__item-price-new"><Currency value={product.price} /></span>
                        {' '}
                        {/* <span className="suggestions__item-price-old"><Currency value={product.compareAtPrice} /></span> */}
                    </React.Fragment>
                )}

                {!product.compareAtPrice && ( <Currency value={product.price} /> )}
            </div>
            {context === 'header' && (
                <div className="suggestions__item-actions">
                    <AsyncAction
                        action={() => addTocartHandler( product )}
                        render={( { run, loading } ) => (
                            <button
                                type="button"
                                onClick={run}
                                title="Add to cart"
                                className={classNames( 'btn btn-primary btn-sm btn-svg-icon', {
                                    'btn-loading': loading,
                                } )}
                            >
                                <Cart16Svg />
                            </button>
                        )}
                    />
                </div>
            )}
        </li>
    ) ) );

    return (
        <div className={rootClasses}>
            <ul className="suggestions__list">
                {list}
            </ul>
        </div>
    );
}

// const mapStateToProps = () => ( {} );

const mapDispatchToProps = {
    cartAddItem,
};

const mapStateToProps = ( state ) => {
    const userLogin = state.userLogin;
    const { userInfo } = userLogin;
    return {
        userInfo
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)( Suggestions );
