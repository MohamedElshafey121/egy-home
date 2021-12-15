// react
import React, { Component, useState } from 'react';

// third-party
import classNames from 'classnames';
import { connect, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

// application
import AsyncAction from '../shared/AsyncAction';
import Currency from '../shared/Currency';
import InputNumber from '../shared/InputNumber';
import PageHeader from '../shared/PageHeader';
import { cartRemoveItem, cartUpdateQuantities } from '../../store/oldCart';
import { Cross12Svg } from '../../svg';
import { url } from '../../services/utils';

// data stubs
import theme from '../../data/theme';

//MY WORK
import {
    addToCart,
    removeFromCart,
    emptyCart,
    addToUserCart,
    getUserCart,
    removeFromUserCart,
    updateUserCartItem,
    emptyUserCart
} from '../../store/cart';


//Component
function ShopPageCart ( props ) {
    let content;//content that will render

    const { cart, userInfo } = props;
    const { cartItems } = cart;

    const breadcrumb = [
        { title: 'Home', url: '' },
        { title: 'Shopping Cart', url: '' },
    ];

    const [quantities, setQuantities] = useState( [] );
    const dispatch = useDispatch();

    //calculate prices
    cart.itemPrices = cartItems ? ( cartItems.reduce( ( acc, item ) => acc + item.price * item.qty, 0 ) ) : 0;
    cart.shippingPrice = cart.itemPrices > 100 ? ( 21 * cartItems.length ) : 0;
    cart.totalPrice = Number( cart.itemPrices ) + Number( cart.shippingPrice );

    //HANDLERS
    function removeFromCartHandler ( id ) {
        if ( userInfo ) {
            return dispatch( removeFromUserCart( id ) )
        }

        return dispatch( removeFromCart( id ) )
    };

    const emptyCartHandler = () => {
        if ( userInfo ) {
            return dispatch( emptyUserCart() )
        }
        return dispatch( emptyCart() );

    }


    function renderItems () {
        return cartItems && cartItems.map( ( item ) => {
            const image = (
                <div className="product-image">
                    <Link to={url.product( item.product )} className="product-image__body">
                        <img className="product-image__img" src={`/uploads/imgs/products/${ item.photo }`} alt="" />
                    </Link>
                </div>
            );

            const removeButton = (
                <AsyncAction
                    action={() => removeFromCartHandler( userInfo ? item._id : item.product )}
                    render={( { run, loading } ) => {
                        const classes = classNames( 'btn btn-light btn-sm btn-svg-icon', {
                            'btn-loading': loading,
                        } );

                        return (
                            <button type="button" onClick={run} className={classes}>
                                <Cross12Svg />
                            </button>
                        );
                    }}
                />
            );

            return (
                <tr key={item.id} className="cart-table__row">
                    <td className="cart-table__column cart-table__column--image">
                        {image}
                    </td>
                    <td className="cart-table__column cart-table__column--product">
                        <Link to={url.product( item.product )} className="cart-table__product-name">
                            {item.name}
                        </Link>
                        {/* {options} */}
                    </td>
                    <td className="cart-table__column cart-table__column--price" data-title="Price">
                        <Currency value={item.price} />
                    </td>
                    <td className="cart-table__column cart-table__column--quantity" data-title="Quantity">
                        {/* <InputNumber
                            // onChange={( quantity ) => handleChangeQuantity( item, quantity )}
                            value={item.qty}
                            min={1}
                        /> */}

                        <div className="input-number">
                            <input
                                className="form-control input-number__input form-control-sm"
                                type="number"
                                value={item.qty}
                            />

                            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                            <div className="input-number__add" onClick={() => {
                                if ( Number( item.qty ) < 14 ) {
                                    if ( userInfo ) {
                                        return dispatch(
                                            updateUserCartItem( item._id, { qty: Number( item.qty ) + 1, shape: item.shape } )
                                        )
                                    } else {
                                        return dispatch(
                                            addToCart( item.product, { qty: Number( item.qty ) + 1, shape: item.shape } )
                                        )
                                    }
                                }
                            }} />
                            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                            <div className="input-number__sub" onClick={() => {
                                if ( Number( item.qty ) > 1 ) {
                                    if ( userInfo ) {
                                        return dispatch(
                                            updateUserCartItem( item._id, { qty: Number( item.qty ) - 1, shape: item.shape } )
                                        )
                                    } else {
                                        return dispatch(
                                            addToCart( item.product, { qty: Number( item.qty ) - 1, shape: item.shape } )
                                        )
                                    }
                                }
                            }} />
                        </div>

                    </td>
                    <td className="cart-table__column cart-table__column--total" data-title="Total">
                        <Currency value={( item.qty * item.price )} />
                    </td>
                    <td className="cart-table__column cart-table__column--remove">
                        {removeButton}
                    </td>
                </tr>
            );
        } );
    }

    function renderTotals () {
        return (
            <React.Fragment>
                <thead className="cart__totals-header">
                    <tr>
                        <th>Subtotal</th>
                        <td><Currency value={cart.itemPrices} /></td>
                    </tr>
                </thead>
                <tbody className="cart__totals-body">
                    <tr>
                        <th>shipping</th>
                        <td>
                            <Currency value={cart.shippingPrice} />
                        </td>
                    </tr>
                </tbody>
            </React.Fragment>
        );
    }

    function renderCart () {
        const emptyCartButton = (
            <AsyncAction
                action={() => emptyCartHandler()}
                render={( { run, loading } ) => {
                    const classes = classNames( 'btn btn-primary cart__update-button', {
                        'btn-loading': loading,
                    } );

                    return (
                        <button type="button" onClick={run} className={classes} >
                            Empty Cart
                        </button>
                    );
                }
                }
            />
        );

        return (
            <div className="cart block">
                <div className="container">
                    <table className="cart__table cart-table">
                        <thead className="cart-table__head">
                            <tr className="cart-table__row">
                                <th className="cart-table__column cart-table__column--image">Image</th>
                                <th className="cart-table__column cart-table__column--product">Product</th>
                                <th className="cart-table__column cart-table__column--price">Price</th>
                                <th className="cart-table__column cart-table__column--quantity">Quantity</th>
                                <th className="cart-table__column cart-table__column--total">Total</th>
                                <th className="cart-table__column cart-table__column--remove" aria-label="Remove" />
                            </tr>
                        </thead>
                        <tbody className="cart-table__body">
                            {renderItems()}
                        </tbody>
                    </table>
                    <div className="cart__actions">
                        <form className="cart__coupon-form">
                            <label htmlFor="input-coupon-code" className="sr-only">Password</label>
                            <input type="text" className="form-control" id="input-coupon-code" placeholder="Coupon Code" />
                            <button type="submit" className="btn btn-primary">Apply Coupon</button>
                        </form>
                        <div className="cart__buttons">
                            <Link to="/shop/catalog" className="btn btn-light">Continue Shopping</Link>
                            {emptyCartButton}
                        </div>
                    </div>

                    <div className="row justify-content-end pt-md-5 pt-4">
                        <div className="col-12 col-md-7 col-lg-6 col-xl-5">
                            <div className="card">
                                <div className="card-body">
                                    <h3 className="card-title">Cart Totals</h3>
                                    <table className="cart__totals">
                                        {renderTotals()}
                                        <tfoot className="cart__totals-footer">
                                            <tr>
                                                <th>Total</th>
                                                <td><Currency value={cart.totalPrice} /></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                    <Link to="/shop/checkout" className="btn btn-primary btn-xl btn-block cart__checkout-button">
                                        Proceed to checkout
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    if ( cartItems && cartItems.length > 0 ) {
        content = renderCart();
    } else {
        content = (
            <div className="block block-empty">
                <div className="container">
                    <div className="block-empty__body">
                        <div className="block-empty__message">Your shopping cart is empty!</div>
                        <div className="block-empty__actions">
                            <Link to="/shop/catalog" className="btn btn-primary btn-sm">Continue</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>{`Shopping Cart — ${ theme.name }`}</title>
            </Helmet>

            <PageHeader header="Shopping Cart" breadcrumb={breadcrumb} />

            {content}
        </React.Fragment>
    );

}

const mapStateToProps = ( state ) => {
    const userLogin = state.userLogin;
    const { userInfo } = userLogin;
    return {
        cart: userInfo ? state.userCart : state.cart,
        userInfo
    }
};


export default connect( mapStateToProps )( ShopPageCart );
