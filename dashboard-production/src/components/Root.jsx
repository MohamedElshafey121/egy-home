// react
import React, { Component } from 'react';

// third-party
import PropTypes from 'prop-types';
import {
    BrowserRouter,
    Route,
    Redirect,
    Switch,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { IntlProvider } from 'react-intl';
import { ScrollContext } from 'react-router-scroll-4';

// application
import languages from '../i18n';
import { localeChange } from '../store/locale';

// pages
// import Layout from './Layout';
import DashboardLayout from './DashboardLayout'
import AuthLayout from './AuthLayout'

class Root extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            site: true,
        }
    }
    // state = {
    //     siteFiles:this.props.style.site
    // }

    setFileSite = ( valu ) => {
        this.setState( { siteFiles: valu } )
        // this.forceUpdate()
    }

    componentDidMount () {
        // alert('Render Again')
        // const { siteFiles } = this.state;
        // if(true) require('./../css/bootstrap/css/bootstrap.ltr.css');

        
        // preloader
        setTimeout( () => {
            const preloader = document.querySelector( '.site-preloader' );

            if ( preloader ) {
                preloader.addEventListener( 'transitionend', ( event ) => {
                    if ( event.propertyName === 'opacity' ) {
                        preloader.parentNode.removeChild( preloader );
                    }
                } );
                preloader.classList.add( 'site-preloader__fade' );
            }
        }, 500 );

        // this is for demo only, you can delete it
        const { localeChange: changeLocale } = this.props;
        const direction = new URLSearchParams( window.location.search ).get( 'dir' );

        if ( direction !== null ) {
            changeLocale( direction === 'rtl' ? 'ar' : 'en' );
        }

        // if ( this.state.site ) {
        //     require('./../scss/style.scss')
        // } else {
        //     alert('re render')
        //     require('./../css/bootstrap/css/bootstrap.ltr.css')
        //     require('../css/style.ltr.css')
        // }

        // setTimeout( () => {
        //     this.setState({site:false})
        // }, 5000 )
        
        // setTimeout( () => {
        //     this.setState({site:true})
        // },15000)
    }

    // componentDidUpdate () {
    //     if ( this.state.site ) {
    //         alert("Site")
    //         // delete require.cache[require.resolve('./../css/bootstrap/css/bootstrap.ltr.css')]
    //         // delete require.cache[require.resolve('./../css/style.ltr.css')]
           
    //         require( './../scss/style.scss' )
    //         // this.forceUpdate()
    //     } else {
    //         alert( 'Dashboard' )
    //         // delete require.cache[require.resolve('./../scss/style.scss')]
    //         require('./../css/bootstrap/css/bootstrap.ltr.css')
    //         require('../css/style.ltr.css')
            
    //     }
    // }

    shouldUpdateScroll = ( prevRouterProps, { location } ) => (
        prevRouterProps && location.pathname !== prevRouterProps.location.pathname
    );

    render () {
        const { locale,style } = this.props;
        const { messages, direction } = languages[locale];

        return (
            <IntlProvider locale={locale} messages={messages}>
                <BrowserRouter basename={process.env.PUBLIC_URL}>
                    <HelmetProvider>
                        <Helmet htmlAttributes={{ lang: locale, dir: direction }} />
                        <ScrollContext shouldUpdateScroll={this.shouldUpdateScroll}>
                            <Switch>

                                <Route
                                    path="/dashboard"
                                    render={( props ) => (
                                        <DashboardLayout {...props} style={style} setFileSite={this.setFileSite}/>
                                    )}
                                />

                                <Route
                                    path="/auth"
                                    render={( props ) => (
                                        <AuthLayout {...props} style={style} setFileSite={this.setFileSite}/>
                                    )}
                                />

                                
                                <Route
                                    path="/"
                                    render={( props ) => (
                                        <DashboardLayout {...props} style={style} setFileSite={this.setFileSite}/>
                                    )}
                                />

                                

                                <Redirect to="/" />
                            </Switch>
                        </ScrollContext>
                    </HelmetProvider>
                </BrowserRouter>
            </IntlProvider>
        );
    }
}

Root.propTypes = {
    /** current locale */
    locale: PropTypes.string,
    style:PropTypes.bool
};

const mapStateToProps = ( state ) => ( {
    locale: state.locale,
    style:state.style
} );

const mapDispatchToProps = {
    localeChange,
};

export default connect( mapStateToProps, mapDispatchToProps )( Root );
