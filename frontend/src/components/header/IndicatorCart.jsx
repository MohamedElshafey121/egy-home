// react
import React, { useEffect } from 'react';

// third-party
import classNames from 'classnames';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// application
import AsyncAction from '../shared/AsyncAction';
import Currency from '../shared/Currency';
import Indicator from './Indicator';
import { Cart20Svg, Cross10Svg } from '../../svg';
// import { cartRemoveItem } from '../../store/oldCart';
import { url } from '../../services/utils';

// MY WORK
import {
    getUserCart,
    removeFromUserCart,
    removeFromCart
} from '../../store/cart'

function IndicatorCart ( props ) {
    // const { cart, cartRemoveItem } = props;
    const { cart, userInfo } = props;
    const { cartItems } = cart;
    let dropdown;
    let totals;

    const removeCartItem = useSelector( ( state ) => state.removeCartItem );
    const { loading: removeItemLoading } = removeCartItem;

    if ( cart && cartItems ) {
        //calculate prices
        cart.itemPrices = cartItems.reduce( ( acc, item ) => acc + item.price * item.qty, 0 );
        cart.shippingPrice = cart.itemPrices > 100 ? ( 21 * cartItems.length ) : 0;
        cart.totalPrice = Number( cart.itemPrices ) + Number( cart.shippingPrice );
    }


    const dispatch = useDispatch();
    useEffect( () => {
        // dispatch()
        if ( userInfo ) {
            dispatch( getUserCart() )
        }
    }, [] )

    const removeFromCartHandler = ( id ) => {
        if ( userInfo ) {
            return dispatch( removeFromUserCart( id ) )
        }

        return dispatch( removeFromCart( id ) )
    };

    if ( cart.itemPrices ) {
        totals = (
            <React.Fragment>
                <tr>
                    <th>Subtotal</th>
                    <td><Currency value={cart.itemPrices} /></td>
                </tr>
                <tr>
                    <th>Shipping</th>
                    <td><Currency value={cart.shippingPrice} /></td>
                </tr>
            </React.Fragment>
        );
    }

    const items = cartItems && cartItems.map( ( item ) => {

        const image = (
            <div className="product-image dropcart__product-image">
                <Link to={url.product( item.product )} className="product-image__body">
                    <img className="product-image__img" src={`/uploads/imgs/products/${ item.photo }`} alt="" />
                </Link>
            </div>
        );

        const removeButton = (
            <AsyncAction
                action={() => removeFromCartHandler( userInfo ? item._id : item.product )}
                render={( { run, loading } ) => {
                    const classes = classNames( 'dropcart__product-remove btn btn-light btn-sm btn-svg-icon', {
                        'btn-loading': loading,
                    } );

                    return (
                        <button type="button" onClick={run} className={classes}>
                            <Cross10Svg />
                        </button>
                    );
                }}
            />
        );

        return (
            < div key={item.id} className="dropcart__product" >
                {image}
                <div div className="dropcart__product-info" >
                    <div className="dropcart__product-name">
                        <Link to={url.product( item.product )}>{item.name}</Link>
                    </div>
                    {/* {options} */}
                    <div className="dropcart__product-meta">
                        <span className="dropcart__product-quantity">{item.qty}</span>
                        {' × '}
                        <span className="dropcart__product-price"><Currency value={item.price} /></span>
                    </div>
                </div >
                {/* {<RemoveButton />} */}
                {removeButton}
            </div >
        );
    } );

    if ( cartItems && cartItems.length > 0 ) {
        dropdown = (
            <div className="dropcart">
                <div className="dropcart__products-list">
                    {items}
                </div>

                <div className="dropcart__totals">
                    <table>
                        <tbody>
                            {totals}
                            <tr>
                                <th>Total</th>
                                <td><Currency value={cart.totalPrice} /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="dropcart__buttons">
                    <Link className="btn btn-secondary" to="/shop/cart">View Cart</Link>
                    <Link className="btn btn-primary" to="/shop/checkout">Checkout</Link>
                </div>
            </div>
        );
    } else {
        dropdown = (
            <div className="dropcart">
                <div className="dropcart__empty">
                    عربة التسوق فارغة
                </div>
            </div>
        );
    }

    return (
        <Indicator url="/shop/cart" dropdown={dropdown} value={cartItems && cartItems.length} icon={<Cart20Svg />} />
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

// const mapDispatchToProps = {
//     cartRemoveItem,
// };

export default connect( mapStateToProps )( IndicatorCart );
