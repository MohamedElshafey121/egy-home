// react
import React,{useEffect,useState} from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect,useDispatch,useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

//data stubs
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'


// application
import AsyncAction from './AsyncAction';
import Currency from './Currency';
import Rating from './Rating';
import { Compare16Svg, Quickview16Svg, Wishlist16Svg } from '../../svg';
import { compareAddItem } from '../../store/compare';
import { quickviewOpen } from '../../store/quickview';
import { url } from '../../services/utils';
import { wishlistAddItem } from '../../store/wishlist';

import {
    addToCart,
    addToUserCart
} from '../../store/cart';


function ProductCard ( props ) {
    const {
        product,
        layout,
        quickviewOpen,
        wishlistAddItem,
        compareAddItem,
        userInfo
    } = props;

    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    // const [mainImages, setMainImages] = useState( [product && product.photo] );
    const [selectedImage,setSelectedImage]=useState('')
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )

    const dispatch = useDispatch();
    //add to cart handler
    const addTocartHandler = ( product, qty = 1 , shape = '',color='') => {
        // shape = shape.trim() ? shape : product.color;
        shape = product.shape && product.shape
        color = product.color && product.color
        
        if ( userInfo ) {
            return dispatch( addToUserCart( product._id, { qty, shape,color } ) )
        }
        
        return dispatch( addToCart( product._id, { qty, shape,color } ) );
    };


    const containerClasses = classNames( 'product-card', {
        'product-card--layout--grid product-card--size--sm': layout === 'grid-sm',
        'product-card--layout--grid product-card--size--nl': layout === 'grid-nl',
        'product-card--layout--grid product-card--size--lg': layout === 'grid-lg',
        'product-card--layout--list': layout === 'list',
        'product-card--layout--horizontal': layout === 'horizontal',
    } );

    let badges = [];
    let image;
    let price;
    let features;
    
    const mouseOverHandler = () => {
        if ( product.Specifications &&product.Specifications.length ) {
            setSelectedImage(product.Specifications[0].photo)
        }
    }

    useEffect(()=>{},[selectedImage])

    // if ( product.badges&& product.badges.includes( 'sale' ) ) {
    //     badges.push( <div key="sale" className="product-card__badge product-card__badge--sale">{messages.sale}</div> );
    // }
    // if ( product.badges&& product.badges.includes( 'hot' ) ) {
    //     badges.push( <div key="hot" className="product-card__badge product-card__badge--hot">{messages.hot}</div> );
    // }
    // if ( product.badges&& product.badges.includes( 'new' ) ) {
    //     badges.push( <div key="new" className="product-card__badge product-card__badge--new">{messages.hot}</div> );
    // }

    if ( product.oldPrice ) {
        badges.push( <div key="sale" className="product-card__badge product-card__badge--sale">{messages.sale}{' '}{ (((product.oldPrice-product.price)/product.price)*100).toFixed(0)} % </div> );
    }
    if ( product.rating >4 ) {
        badges.push( <div key="hot" className="product-card__badge product-card__badge--hot">{locale==='en'? messages.hot:'تقييم مرتفع'}</div> );
        
    }


    badges = badges.length ? <div className="product-card__badges-list">{badges}</div> : null;

    // if ( product.images  ) {
    //     image = (
    //         <div className="product-card__image product-image">
    //             <Link to={url.product( product )} className="product-image__body">
    //                 <img className="product-image__img" src={`/uploads/imgs/products/${ image }`} alt="" />
    //             </Link>
    //         </div>
    //     );
    // }

    if ( product.oldPrice ) {
        price = (
            <div className="product-card__prices">
                <span className="product-card__new-price"><Currency value={product.price} /></span>
                {' '}
                <span className="product-card__old-price"><Currency value={product.oldPrice} /></span>
            </div>
        );
    } else {
        price = (
            <div className="product-card__prices">
                <Currency value={Number(product.price)} />
            </div>
        );
    }

    // if ( product.attributes && product.attributes.length ) {
    //     features = (
    //         <ul className="product-card__features-list">
    //             {product.attributes.filter( ( x ) => x.featured ).map( ( attribute, index ) => (
    //                 <li key={index}>{`${ attribute.name }: ${ attribute.values.map( ( x ) => x.name ).join( ', ' ) }`}</li>
    //             ) )}
    //         </ul>
    //     );
    // }

    return (
        <div className={containerClasses} onMouseOver={mouseOverHandler} onMouseLeave={e => {
            setSelectedImage('')
        }}>
            <AsyncAction
                action={() => quickviewOpen( product._id )}
                render={( { run, loading } ) => (
                    <button
                        type="button"
                        onClick={run}
                        className={classNames( 'product-card__quickview', {
                            'product-card__quickview--preload': loading,
                        } )}
                    >
                        <Quickview16Svg />
                    </button>
                )}
            />
            {badges}
            {/* Start Render Product Data */}
            {/* {image} */}
            <div className="product-card__image product-image">
                <Link to={url.product( product )} className="product-image__body" >
                    <img className="product-image__img" src={`/uploads/imgs/products/${ selectedImage?selectedImage:product.photo }`} alt="" />
                </Link>
            </div>
            <div className="product-card__info">
                <div className="product-card__name">
                    <Link to={url.product( product )}>{product.name}</Link>
                </div>
                <div className="product-card__rating">
                    <Rating value={product.rating} />
                    <div className=" product-card__rating-legend">{`( ${ product.numReviews } )`}</div>
                </div>
                {/* {features} */}
                {/* Faetures Start */}
                
                {layout==='grid-with-features'&& <ul className="product-card__features-list">
                    {product.size&&<li > {`size , ${product.size} `}</li>}
                    {product.color && <li > {`color , ${product.color} `}</li>}
                </ul>}
                {/* Faetures End */}

                {layout === 'list' && (
                    <p> { product.shortDescription}</p>
                )}
            </div>

            <div className="product-card__actions">
                {/* START Availability Feature (hidden) */}
                <div className="product-card__availability">
                    {messages.availability} :
                    <span className="text-success">{messages.inStock}</span>
                </div>
                {/* END Availability Feature (hidden) */}
                
                {price}
                {/* Start Prdouct Actions  */}
                <div className="product-card__buttons">
                    <AsyncAction
                        action={() => addTocartHandler( product )}
                        render={( { run, loading } ) => (
                            <React.Fragment>
                                <button
                                    type="button"
                                    onClick={run}
                                    className={classNames( 'btn btn-primary product-card__addtocart', {
                                        'btn-loading': loading,
                                    } )}
                                >
                                    {messages.addToCart}
                                </button>
                                <button
                                    type="button"
                                    onClick={run}
                                    className={classNames( 'btn btn-secondary product-card__addtocart product-card__addtocart--list', {
                                        'btn-loading': loading,
                                    } )}
                                >
                                    {messages.addToCart}
                                </button>
                            </React.Fragment>
                        )}
                    />
                    {/* whishlist button */}
                    {/* <AsyncAction
                        action={() => wishlistAddItem( product )}
                        render={( { run, loading } ) => (
                            <button
                                type="button"
                                onClick={run}
                                className={classNames( 'btn btn-light btn-svg-icon btn-svg-icon--fake-svg product-card__wishlist', {
                                    'btn-loading': loading,
                                } )}
                            >
                                <Wishlist16Svg />
                            </button>
                        )}
                    /> */}
                    {/* compare button */}
                    {/* <AsyncAction
                        action={() => compareAddItem( product )}
                        render={( { run, loading } ) => (
                            <button
                                type="button"
                                onClick={run}
                                className={classNames( 'btn btn-light btn-svg-icon btn-svg-icon--fake-svg product-card__compare', {
                                    'btn-loading': loading,
                                } )}
                            >
                                <Compare16Svg />
                            </button>
                        )}
                    /> */}
                {/* Start Prdouct Actions  */}
                </div>
            </div>
        </div>
    );
}

ProductCard.propTypes = {
    /**
     * product object
     */
    product: PropTypes.object.isRequired,
    /**
     * product card layout
     * one of ['grid-sm', 'grid-nl', 'grid-lg', 'list', 'horizontal']
     */
    layout: PropTypes.oneOf( ['grid-sm', 'grid-nl', 'grid-lg', 'list', 'horizontal','grid-with-features'] ),
};

const mapStateToProps = ( state ) => {
    const userLogin = state.userLogin;
    const { userInfo } = userLogin;
    return {
        userInfo
    }
};

const mapDispatchToProps = {
    wishlistAddItem,
    compareAddItem,
    quickviewOpen,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)( ProductCard );
