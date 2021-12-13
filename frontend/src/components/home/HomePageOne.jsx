// react
import React, { useMemo,useEffect,useState } from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import { useSelector,useDispatch } from 'react-redux';

// application
import shopApi from '../../api/shop';
import { useDeferredData, useProductColumns, useProductTabs } from '../../services/hooks';

// blocks
import BlockBanner from '../blocks/BlockBanner';
import BlockBrands from '../blocks/BlockBrands';
import BlockCategories from '../blocks/BlockCategories';
import BlockFeatures from '../blocks/BlockFeatures';
import BlockPosts from '../blocks/BlockPosts';
import BlockProductColumns from '../blocks/BlockProductColumns';
import BlockProducts from '../blocks/BlockProducts';
import BlockProductsCarousel from '../blocks/BlockProductsCarousel';
import BlockSlideShow from '../blocks/BlockSlideShow';
import BlockLoader from '../blocks/BlockLoader';


// data stubs
import categories from '../../data/shopBlockCategories';
import posts from '../../data/blogPosts';
import theme from '../../data/theme';

//application store
import {
    getHomePageCategories, getHomePageNewArrivaProducts, getHomePageTopRatedProducts
} from '../../store/homePage';

function HomePageOne () {
    // const[categoryId,setCategoryId]=useState(null)
    const homePageCategories = useSelector( state => state.homePageCategories )
    const { loading, categories: homecategories, error } = homePageCategories
    
    const homeNewArrival = useSelector( state => state.homeNewArrival )
    const { loading: loadingNewArrivals, products: newArrivals, error: newArrivalsError } = homeNewArrival
    
     const homeToprated = useSelector( state => state.homeToprated )
    const{loading:loadingTopRated,products:topRated,error:topRatedError}=homeToprated
    

    const dispatch = useDispatch()
    //load categories
    useEffect( () => {
        if ( !homecategories ) {
            dispatch(getHomePageCategories())
        }
    }, [ dispatch, homecategories] )
    
    //load New Arrival
    useEffect( () => {
        if ( !newArrivals ) {
            dispatch(getHomePageNewArrivaProducts())
        }
    }, [dispatch, newArrivals] )
    
    //load top Rated
    useEffect( () => {
        if ( !topRated ) {
            dispatch(getHomePageTopRatedProducts())
        }
    }, [dispatch, topRated] )
    
    
    function getNewArrivalHandler (categoryId) {
        dispatch(getHomePageNewArrivaProducts(categoryId))
    }

    function getTopRatedHandler (categoryId) {
        dispatch(getHomePageTopRatedProducts(categoryId))
    }


    /**
     * Bestsellers.
     */
    // const bestsellers = useDeferredData(() => (
    //     shopApi.getPopularProducts({ limit: 7 })
    // ), []);


    /**
     * Product columns.
     */
    // const columns = useProductColumns(
    //     useMemo(() => [
    //         {
    //             title: 'Top Rated Products',
    //             source: () => shopApi.getTopRatedProducts({ limit: 3 }),
    //         },
    //         {
    //             title: 'Special Offers',
    //             source: () => shopApi.getDiscountedProducts({ limit: 3 }),
    //         },
    //         {
    //             title: 'Bestsellers',
    //             source: () => shopApi.getPopularProducts({ limit: 3 }),
    //         },
    //     ], []),
    // );

    // if ( loading ) {
    //     return <BlockLoader/>
    // }

    return (
        <React.Fragment>
            <Helmet>
                <title>{`Home Page One — ${ theme.name }`}</title>
            </Helmet>

            {useMemo( () => <BlockSlideShow withDepartments />, [] )}

            {useMemo( () => <BlockFeatures />, [] )}

            {useMemo( () => (
                <BlockProductsCarousel
                    title="Top Rated"
                    layout="grid-4"
                    products={topRated?topRated:[]}
                    loading={ loadingTopRated}
                    groups={homecategories?homecategories.slice(0,2):[]}
                    onGroupClick={getTopRatedHandler}
                />
            ), [topRated,getTopRatedHandler,homecategories,loadingTopRated] )}

            {useMemo( () => <BlockBanner />, [] )}

            {/* new Arrivals */}
            {useMemo( () => (
                <BlockProducts
                    title="Featured products"
                    layout="large-first"
                    featuredProduct={newArrivals?newArrivals[0]:[]}
                    products={newArrivals?newArrivals.slice( 1, 7 ):[]}
                />
            ), [newArrivals] )}

            {useMemo( () => (
                <BlockCategories
                    title="Popular Categories"
                    layout="classic"
                    categories={homecategories?homecategories:[]}
                />
            ), [newArrivals,homecategories] )}
            
            {useMemo( () => (
                <BlockProductsCarousel
                    title="New Arrivals"
                    layout="horizontal"
                    rows={2}
                    products={newArrivals?newArrivals:[]}
                    loading={loadingNewArrivals}
                    groups={homecategories?homecategories.slice(2,4):[]}
                    onGroupClick={getNewArrivalHandler}
                />
            ), [newArrivals,loadingNewArrivals,homecategories,getNewArrivalHandler] )}

            {/* {useMemo(() => <BlockPosts title="Latest News" layout="list-sm" posts={posts} />, [])} */}

            {useMemo( () => <BlockBrands />, [] )}

            {/* {useMemo( () => <BlockProductColumns columns={columns} />, [columns] )} */}
        </React.Fragment>
    );
}

export default HomePageOne;
