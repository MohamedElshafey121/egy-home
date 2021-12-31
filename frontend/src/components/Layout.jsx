//style
import  './../scss/style.rtl.scss'

// react
import React,{useEffect,useState} from 'react';
    
// third-party
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { Redirect, Route, Switch,useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';

// application
import Footer from './footer';
import Header from './header';
import MobileHeader from './mobile/MobileHeader';
import MobileMenu from './mobile/MobileMenu';
import Quickview from './shared/Quickview';
import {changeStyle} from '../store/style'

// pages
import HomePageOne from './home/HomePageOne';
import AccountLayout from './account/AccountLayout';
import AccountPageLogin from './account/AccountPageLogin';
import AccountPageSignUp from './account/AccountPageSignUp';
import BlogPageCategory from './blog/BlogPageCategory';
import BlogPagePost from './blog/BlogPagePost';
import PageCart from './shop/ShopPageCart';
import PageCheckout from './shop/ShopPageCheckout';
import PageCompare from './shop/ShopPageCompare';
import PageWishlist from './shop/ShopPageWishlist';
import ShopPageCategory from './shop/ShopPageCategory';
import ShopPageOrderSuccess from './shop/ShopPageOrderSuccess';
import ShopPageOrderTrackResult from './shop/ShopPageOrderTrackResult'
import ShopPageProduct from './shop/ShopPageProduct';
import ShopPageTrackOrder from './shop/ShopPageTrackOrder';
import SitePageAboutUs from './site/SitePageAboutUs';
import SitePageComponents from './site/SitePageComponents';
import SitePageContactUs from './site/SitePageContactUs';
import SitePageContactUsAlt from './site/SitePageContactUsAlt';
import SitePageFaq from './site/SitePageFaq';
import SitePageNotFound from './site/SitePageNotFound';
import SitePageTerms from './site/SitePageTerms';
import SitePageTypography from './site/SitePageTypography';

// data stubs
import theme from '../data/theme';

function useQuery() {
  // return new URLSearchParams(location.search)
  return new URLSearchParams(useLocation().search);
}

function Layout ( props ) {
    const query = useQuery();

    const { match, style: { site },setFileSite,history } = props;

    // const dispatch=useDispatch()
    // useEffect( () => {
    //     if ( !site ) {
    //         dispatch( changeStyle( true ) )
    //         setFileSite(true)
    //     }
        
    // },[])
     useEffect( () => {
        if ( query.get( 'redirect' ) ) {
            history.push('/dashboard')
            window.location.reload(); 
        }
    }, [] );

    return (
        <React.Fragment>
            <Helmet>
                <title>{theme.name}</title>
                <meta name="description" content={theme.fullName} />
                <link rel='stylesheet' href='./scss/style.scss' />
            </Helmet>

            <ToastContainer autoClose={5000} hideProgressBar />

            <Quickview />

            <MobileMenu />

            <div className="site">
                <header className="site__header d-lg-none">
                    <MobileHeader />
                </header>

                <header className="site__header d-lg-block d-none">
                    <Header />
                </header>

                <div className="site__body">
                    <Switch>
                        {/*
                        // Home
                        */}
                        <Route exact path="/" component={HomePageOne} />

                        {/*
                        // Shop
                        */}
                        <Redirect exact from="/shop" to="/shop/catalog" />
                        <Route
                            exact
                            path="/shop/catalog"
                            render={( props ) => (
                                <ShopPageCategory {...props} columns={3} viewMode="grid" sidebarPosition="start" />
                            )}
                        />
                        <Route
                            exact
                            path="/shop/catalog/:categorySlug"
                            render={( props ) => (
                                <ShopPageCategory
                                    {...props}
                                    columns={3}
                                    viewMode="grid"
                                    sidebarPosition="start"
                                    categorySlug={props.match.params.categorySlug}
                                />
                            )}
                        />
                       

                        <Route
                            exact
                            path="/shop/products/:productId"
                            render={( props ) => (
                                <ShopPageProduct
                                    {...props}
                                    layout="standard"
                                    productId={props.match.params.productId}
                                />
                            )}
                        />

                        <Route exact path="/shop/cart" component={PageCart} />
                        <Route exact path="/shop/checkout" component={PageCheckout} />
                        <Route exact path="/shop/checkout/success/:id" component={ShopPageOrderSuccess} />
                        <Route exact path="/shop/track/:id" component={ShopPageOrderTrackResult} />
                        <Route exact path="/shop/wishlist" component={PageWishlist} />
                        <Route exact path="/shop/compare" component={PageCompare} />
                        <Route exact path="/shop/track-order" component={ShopPageTrackOrder} />

                        {/*
                        // Blog
                        */}
                        <Redirect exact from="/blog" to="/blog/category-classic" />
                        <Route
                            exact
                            path="/blog/category-classic"
                            render={( props ) => (
                                <BlogPageCategory {...props} layout="classic" sidebarPosition="end" />
                            )}
                        />
                        <Route
                            exact
                            path="/blog/category-grid"
                            render={( props ) => (
                                <BlogPageCategory {...props} layout="grid" sidebarPosition="end" />
                            )}
                        />
                        <Route
                            exact
                            path="/blog/category-list"
                            render={( props ) => (
                                <BlogPageCategory {...props} layout="list" sidebarPosition="end" />
                            )}
                        />
                        <Route
                            exact
                            path="/blog/category-left-sidebar"
                            render={( props ) => (
                                <BlogPageCategory {...props} layout="classic" sidebarPosition="start" />
                            )}
                        />
                        <Route
                            exact
                            path="/blog/post-classic"
                            render={( props ) => (
                                <BlogPagePost {...props} layout="classic" sidebarPosition="end" />
                            )}
                        />
                        <Route
                            exact
                            path="/blog/post-full"
                            render={( props ) => (
                                <BlogPagePost {...props} layout="full" />
                            )}
                        />

                        {/*
                        // Account
                        */}
                        <Route exact path="/account/login" component={AccountPageLogin} />
                        <Route exact path="/account/signup" component={AccountPageSignUp} />
                        <Route path="/account" component={AccountLayout} />

                        {/*
                        // Site
                        */}
                        <Redirect exact from="/site" to="/site/about-us" />
                        <Route exact path="/site/about-us" component={SitePageAboutUs} />
                        <Route exact path="/site/components" component={SitePageComponents} />
                        <Route exact path="/site/contact-us" component={SitePageContactUs} />
                        <Route exact path="/site/contact-us-alt" component={SitePageContactUsAlt} />
                        <Route exact path="/site/not-found" component={SitePageNotFound} />
                        <Route exact path="/site/faq" component={SitePageFaq} />
                        <Route exact path="/site/terms" component={SitePageTerms} />
                        <Route exact path="/site/typography" component={SitePageTypography} />

                        {/*
                        // Page Not Found
                        */}
                        <Route component={SitePageNotFound} />
                    </Switch>
                </div>

                <footer className="site__footer">
                    <Footer />
                </footer>
            </div>
        </React.Fragment>
    );
}

export default Layout;
