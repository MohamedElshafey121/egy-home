// react
import React,{useState,useEffect} from 'react';

//third party
import { useDispatch,useSelector } from 'react-redux';

// application
import Pagination from '../shared/Pagination';
import Rating from '../shared/Rating';

// data stubs
// import reviews from '../../data/shopProductReviews';
import { createProductReviewHandler,resetProductReviews } from '../../store/reviews'
import {
    handleGetOneProduct,
} from '../../store/product';


function ProductTabReviews ( { productId, reviews } ) {
     const userLogin = useSelector(state=>state.userLogin);
    const { userInfo } = userLogin;

    const createProductReview = useSelector( state => state.createProductReview )
    const { success } = createProductReview;
   
    const limit = 5;
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState();
    const [page, setpage] = useState( 1 )
    
    const [alreadyReviewed, setAlreadyReviewed] = useState( false );

    
    
    useEffect( () => {
        reviews.forEach( review => {
            if (review.user===userInfo._id) {
                setAlreadyReviewed( true );
            }
        })
    },[])

    const dispatch = useDispatch();
    //create review
    function createReviewHandler ( event ) {
        event.preventDefault();
        const ratingForm = new FormData();
        // if ( rating ) ratingForm.append( 'rating',rating )
        // if ( comment ) ratingForm.append( 'comment', comment )
        
        dispatch(createProductReviewHandler(productId,{rating,comment}))
    };

    useEffect( () => {
        if ( success ) {
            setAlreadyReviewed( true );
            dispatch(resetProductReviews())
            dispatch( handleGetOneProduct( productId ) );
        }
    },[success])



    const reviewForm=(<form className="reviews-view__form" onSubmit={e=>createReviewHandler(e)}>
                <h3 className="reviews-view__header">Write A Review</h3>
                <div className="row">
                    <div className="col-12 col-lg-9 col-xl-8">
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="review-stars">Review Stars</label>
                                <select id="review-stars" className="form-control" value={rating} onChange={e=>setRating(e.target.value)}>
                                    <option value="5">5 Stars Rating</option>
                                    <option value="4">4 Stars Rating</option>
                                    <option value="3">3 Stars Rating</option>
                                    <option value="2">2 Stars Rating</option>
                                    <option value="1">1 Stars Rating</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="review-text">Your Review</label>
                            <textarea
                                className="form-control"
                                id="review-text" rows="6"
                                placeholder='Add your experience about this product'
                                value={comment}
                                onChange={e => setComment( e.target.value )} />
                        </div>
                        <div className="form-group mb-0">
                            <button type="submit" className="btn btn-primary btn-lg" onClick={e=>createReviewHandler(e)}>Post Your Review</button>
                        </div>
                    </div>
                </div>
            </form>
        )

    const reviewsList = reviews &&reviews.map((review, index) => (
        <li key={index} className="reviews-list__item">
            <div className="review">
                <div className="review__avatar"><img src="/uploads/imgs/users/user_avatar.png" alt="" /></div>
                <div className=" review__content">
                    <div className=" review__author">{review.name}</div>
                    <div className=" review__rating">
                        <Rating value={review.rating} />
                    </div>
                    <div className=" review__text">{review.comment}</div>
                    <div className=" review__date">{new Date(review.createdAt).toDateString()}</div>
                </div>
            </div>
        </li>
    ));

    return (
        <div className="reviews-view">
            <div className="reviews-view__list">
                <h3 className="reviews-view__header">Customer Reviews</h3>

                {reviews.length > 0 && (
                    <div className="reviews-list">
                    <ol className="reviews-list__content">
                        {reviewsList.slice((page-1)*limit,page*limit)}
                    </ol>
                    {reviews.length>limit&& <div className="reviews-list__pagination">
                        <Pagination current={page} siblings={3} total={Math.ceil(reviews.length/limit)} />
                    </div>}
                    </div>
                )}
                {reviews.length===0 && (<div className="reviews-list"> Ther is No Reviews Yet </div>)}
            </div>

            {!alreadyReviewed && reviewForm}

            </div>
    );
}

export default ProductTabReviews;
