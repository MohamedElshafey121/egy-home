const catchAsync = require( '../utils/catchAsync' )
const AppError = require( './../utils/appError' );
const APIFeatures = require( './../utils/apiFeatures' );
const Factory = require( './handlerFactory' );

const Cart = require( '../models/cartModel' )
const User = require( '../models/userModel' )
const Product = require( '../models/productModel' )


/*
 * @desc     Create New Cart
 * @route    POST /api/cart
 * @access   private
 */
exports.createCart = catchAsync( async ( req, res, next ) => {
    const cartFounded = await Cart.findOne( { user: req.user._id } );
    if ( cartFounded ) {
        return next(new AppError('Cart Already Founded',400))
    }

    const { cartItems } = req.body;

    const cart = new Cart( {
        cartItems,
        user:req.user._id
    } )
    
    const newCart = await cart.save();
    if ( !newCart ) {
        return next(new AppError('error in creating cart',400))
    }

    res.status( 201 ).json( {
        status: 'success',
        data: {
            cart:newCart
        }
    })


} )


/*
 * @desc     Get user cart
 * @route    GET /api/cart
 * @access   private
 */
exports.getCart = catchAsync( async ( req, res, next ) => {
    const cart = await Cart.findOne( { user: req.user._id } );
    if ( !cart ) {
        return next( new AppError( 'cart not found', 404 ) );
    }
    
    res.status( 200 ).json( {
        status: 'success',
        data: {
            cart
        }
    })
})

/*
 * @desc     Add Item to cart
 * @route    POST /api/cart/items
 * @access   private
 */
exports.addCartItem = catchAsync( async ( req, res, next ) => {
    const cart = await Cart.findOne( { user: req.user._id } );
    if ( !cart ) {
        return next( new AppError( 'Cart is not found', 400 ) );
    }
    // console.log( req.body );

    const { product, name, price, photo, qty, shape } = req.body;
    
    const existItem = await Cart.findOne( { user: req.user._id, "cartItems.product": product, "cartItems.shape": shape } );
    if ( existItem ) {
        return next( new AppError( 'product is already found in cart', 400 ) );
    }

    const cartItem = {
        product,
        name,
        photo,
        price,
        qty,
        shape
    }

    const added_product = await Product.findById( product )
    if ( !added_product ) {
        return next(new AppError('product is not found',404))
    }

    cart.cartItems.push( cartItem );
    await cart.save()
    res.status( 200 ).json( {
        status: 'success',
        data: {
            cart
        }
    })
} )

/*
 * @desc     Delete Item from cart
 * @route    DELETE /api/cart/items/:id
 * @access   private
 */
exports.deleteCartItem = catchAsync( async ( req, res, next ) => {
    console.log( req.params.id );
    const cart = await Cart.findOne( { user: req.user._id } );
    if ( !cart ) {
        return next(new AppError('Cart is not found',404))
    };

    if ( !cart.cartItems.id( req.params.id ) ) {
        return next( new AppError( 'This cart item is not found', 404 ) );
    }

    await cart.cartItems.id( req.params.id ).remove()
    await cart.save();

    res.status( 200 ).json( {
        status: 'success',
        data: {
            cart
        }
    })
} )

/*
 * @desc     Update cart Item 
 * @route    PATCH /api/cart/items/:id
 * @access   private
 */
exports.updateCartItem = catchAsync( async ( req, res, next ) => {
    const cart = await Cart.findOne( { user: req.user._id } );
    // console.log(cart)

   if ( !cart ) {
        return next(new AppError('Cart is not found',404))
    };

    const item = await cart.cartItems.id( req.params.id );
    if ( !item) {
        return next( new AppError( 'This cart item is not found', 404 ) );
    }

    const cartItem = {
        product: req.body.product || item.product,
        name: req.body.name || item.name,
        photo: req.body.photo || item.photo,
        price: req.body.price || item.price,
        qty: req.body.qty || item.qty,
        shape: req.body.shape || item.shape
    }

    const newCart = await Cart.findOneAndUpdate( { user: req.user._id, "cartItems._id": req.params.id }, {
        "$set": {
            "cartItems.$":cartItem
        }
    }, {
        new: true,
        runValidators:true
    } )
    
    res.status( 200 ).json( {
        status: 'success',
        data: {
            cart:newCart
        }
    })

} )

/*
 * @desc     Add Item to cart
 * @route    get /api/cart/items
 * @access   private
 */
exports.getcartItem = catchAsync( async ( req, res, next ) => {
    const { product, shape } = req.body
    // console.log(req.body)
    const item =await Cart.findOne( { user: req.user._id, "cartItems.product": product, "cartItems.shape": shape },{"cartItems.$":1,"_id":0} );

    if ( !item ) {
        return next (new AppError('This item is not found',400))
    }

    res.status( 200 ).json( {
        status: 'success',
        data: {
            item
        }
    })
} )

/*
 * @desc     Empty Cart Items
 * @route    delete /api/cart/items
 * @access   private
 */
exports.emptyCart = catchAsync( async ( req, res, next ) => {
    const cart = await Cart.findOne( { user: req.user._id } );
    if ( !cart ) {
        return next(new AppError('cart is not found',404))
    }

    cart.cartItems = [];
    await cart.save();
    res.status( 200 ).json( {
        status: 'success',
        data: {
            cart
        }
    })
})