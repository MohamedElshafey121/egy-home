// react
import React, { Component } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

//data-stubs
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'


// application
import AsyncAction from './AsyncAction';
import Currency from './Currency';
import InputNumber from './InputNumber';
import ProductGallery from './ProductGallery';
import Rating from './Rating';
import { cartAddItem } from '../../store/oldCart';
import { compareAddItem } from '../../store/compare';
import { Wishlist16Svg, Compare16Svg } from '../../svg';
import { wishlistAddItem } from '../../store/wishlist';
import {
    addToCart,
    addToUserCart
} from '../../store/cart';


class Product extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            quantity: 1,
            messages:message_ar
        };
    }

    componentDidMount () {
        this.setState({messages: this.props.locale === 'ar' ? message_ar : message_en || message_ar })
    }

    images = [];
    getAllImages () {
        this.images = [];
        const { product } = this.props;
        this.images.push( product.photo );
        product.Specifications.forEach( feature => {
            this.images.push( feature.photo )
        } );
    };

    colors = [];
    getAllcolors () {
        this.colors = [];
        const { product } = this.props;
        this.colors.push( product.color );
        product.Specifications.forEach( feature => {
            this.colors.push( feature.color )
        } );
    };

    //add to cart handler
    addTocartHandler = ( product, shape = '', qty = 1 ) => {
        const { userInfo } = this.props;
        shape = shape.trim() ? shape : product.color;
        if ( userInfo ) {
            return this.props.addToUserCart( product._id, { qty, shape } ) 
        }
        
        return this.props.addToCart( product._id, { qty, shape } ) 
    };


    handleChangeQuantity = ( quantity ) => {
        this.setState( { quantity } );
    };

    render () {
        this.getAllImages();
        this.getAllcolors()
        const {
            product,
            layout,
            wishlistAddItem,
            compareAddItem,
            cartAddItem,
        } = this.props;
        const { quantity,messages } = this.state;
        let prices;

        if ( product.compareAtPrice ) {
            prices = (
                <React.Fragment>
                    <span className="product__new-price"><Currency value={product.price} /></span>
                    {' '}
                    <span className="product__old-price"><Currency value={product.compareAtPrice} /></span>
                </React.Fragment>
            );
        } else {
            prices = <Currency value={product.price} />;
            // prices = <div>{product.price}</div>;
        }

        return (
            <div className={`product product--layout--${ layout }`}>
                <div className="product__content">
                    <ProductGallery layout={layout} images={this.images} />

                    <div className="product__info">
                        <div className="product__wishlist-compare">
                            <AsyncAction
                                action={() => wishlistAddItem( product )}
                                render={( { run, loading } ) => (
                                    <button
                                        type="button"
                                        data-toggle="tooltip"
                                        data-placement="right"
                                        title="Wishlist"
                                        onClick={run}
                                        className={classNames( 'btn btn-sm btn-light btn-svg-icon', {
                                            'btn-loading': loading,
                                        } )}
                                    >
                                        <Wishlist16Svg />
                                    </button>
                                )}
                            />
                            <AsyncAction
                                action={() => compareAddItem( product )}
                                render={( { run, loading } ) => (
                                    <button
                                        type="button"
                                        data-toggle="tooltip"
                                        data-placement="right"
                                        title="Compare"
                                        onClick={run}
                                        className={classNames( 'btn btn-sm btn-light btn-svg-icon', {
                                            'btn-loading': loading,
                                        } )}
                                    >
                                        <Compare16Svg />
                                    </button>
                                )}
                            />
                        </div>
                        <h1 className="product__name">{product.name}</h1>
                        <div className="product__rating">
                            <div className="product__rating-stars">
                                <Rating value={product.rating} />
                            </div>
                            <div className="product__rating-legend">
                                {/* <Link to="/">{`${ product.numReviews } Reviews`}</Link> */}
                                <span>{`${ product.numReviews } ${messages.reviews}`}</span>
                                {/* <Link to="/">Write A Review</Link> */}
                            </div>
                        </div>
                        <div className="product__description">
                            {product.shortDescription}
                        </div>
                        <ul className="product__features d-none">
                            <li>Speed: 750 RPM</li>
                            <li>Power Source: Cordless-Electric</li>
                            <li>Battery Cell Type: Lithium</li>
                            <li>Voltage: 20 Volts</li>
                            <li>Battery Capacity: 2 Ah</li>
                        </ul>
                        <ul className="product__meta">
                            <li className="product__meta-availability">
                                {messages.availability} :
                                {' '}
                                <span className="text-success">{messages.inStock}</span>
                            </li>
                            {(product.brand&&product.brand.name)&&(<li>
                                {messages.brand}:
                                <Link to="/">{product.brand.name}</Link>
                            </li>)}
                            {/* <li>SKU: 83690/32</li> */}
                        </ul>
                    </div>

                    <div className="product__sidebar">
                        <div className="product__availability">
                            {messages.availability} :
                            {' '}
                            <span className="text-success">{messages.inStock}</span>
                        </div>

                        <div className="product__prices">
                            {prices}
                        </div>

                        <form className="product__options">
                            {this.colors.length > 0 && (
                                <div className="form-group product__option">
                                <div className="product__option-label">{messages.colors}</div>
                                <div className="input-radio-color">
                                    <div className="input-radio-color__list">
                                            {this.colors.map( ( color ) => (
                                            <label
                                            className={`input-radio-color__item ` }
                                            style={{ color: color }}
                                            data-toggle="tooltip"
                                            title={color}
                                        >
                                            <input type="radio" name="color" />
                                            <span />
                                        </label>
                                        ))}
                                        {/*                                         <label
                                            className="input-radio-color__item input-radio-color__item--disabled"
                                            style={{ color: '#4080ff' }}
                                            data-toggle="tooltip"
                                            title="Blue"
                                        >
                                            <input type="radio" name="color" disabled />
                                            <span />
                                        </label> */}
                                    </div>
                                </div>
                            </div>
                            
                            )}
                            <div className="form-group product__option d-none">
                                <div className="product__option-label">Material</div>
                                <div className="input-radio-label">
                                    <div className="input-radio-label__list">
                                        <label>
                                            <input type="radio" name="material" />
                                            <span>Metal</span>
                                        </label>
                                        <label>
                                            <input type="radio" name="material" />
                                            <span>Wood</span>
                                        </label>
                                        <label>
                                            <input type="radio" name="material" disabled />
                                            <span>Plastic</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group product__option">
                                <label htmlFor="product-quantity" className="product__option-label">{messages.quantity}</label>
                                <div className="product__actions">
                                    <div className="product__actions-item">
                                        <InputNumber
                                            id="product-quantity"
                                            aria-label="Quantity"
                                            className="product__quantity"
                                            size="lg"
                                            min={1}
                                            value={quantity}
                                            onChange={this.handleChangeQuantity}
                                        />
                                    </div>
                                    <div className="product__actions-item product__actions-item--addtocart">
                                        <AsyncAction
                                            action={() => this.addTocartHandler( product, '', quantity )}
                                            render={( { run, loading } ) => (
                                                <button
                                                    type="button"
                                                    onClick={run}
                                                    disabled={!quantity}
                                                    className={classNames( 'btn btn-primary btn-lg', {
                                                        'btn-loading': loading,
                                                    } )}
                                                >
                                                    {messages.addToCart}
                                                </button>
                                            )}
                                        />
                                    </div>
                                    <div className="product__actions-item product__actions-item--wishlist d-none">
                                        <AsyncAction
                                            action={() => wishlistAddItem( product )}
                                            render={( { run, loading } ) => (
                                                <button
                                                    type="button"
                                                    data-toggle="tooltip"
                                                    title="Wishlist"
                                                    onClick={run}
                                                    className={classNames( 'btn btn-secondary btn-svg-icon btn-lg', {
                                                        'btn-loading': loading,
                                                    } )}
                                                >
                                                    <Wishlist16Svg />
                                                </button>
                                            )}
                                        />
                                    </div>
                                    <div className="product__actions-item product__actions-item--compare d-none">
                                        <AsyncAction
                                            action={() => compareAddItem( product )}
                                            render={( { run, loading } ) => (
                                                <button
                                                    type="button"
                                                    data-toggle="tooltip"
                                                    title="Compare"
                                                    onClick={run}
                                                    className={classNames( 'btn btn-secondary btn-svg-icon btn-lg', {
                                                        'btn-loading': loading,
                                                    } )}
                                                >
                                                    <Compare16Svg />
                                                </button>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="product__footer d-none">
                        <div className="product__tags tags">
                            <div className="tags__list">
                                <Link to="/">Mounts</Link>
                                <Link to="/">Electrodes</Link>
                                <Link to="/">Chainsaws</Link>
                            </div>
                        </div>

                        
                    </div>
                </div>
            </div>
        );
    }
}

Product.propTypes = {
    /** product object */
    product: PropTypes.object.isRequired,
    /** one of ['standard', 'sidebar', 'columnar', 'quickview'] (default: 'standard') */
    layout: PropTypes.oneOf( ['standard', 'sidebar', 'columnar', 'quickview'] ),
};

Product.defaultProps = {
    layout: 'standard',
};

const mapStateToProps = ( state ) => {
    const userLogin = state.userLogin;
    const { userInfo } = userLogin;
    return {
        userInfo,
        locale:state.locale
    }
};

const mapDispatchToProps = {
    cartAddItem,
    wishlistAddItem,
    compareAddItem,
    addToCart,
    addToUserCart
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)( Product );
