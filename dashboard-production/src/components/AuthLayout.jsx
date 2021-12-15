//style
// import '../css/style.rtl.css'
// import './../css/style.ltr.css'
import './../css/bootstrap/css/bootstrap.ltr.css'
import '../css/style.ltr.css'

// /bootstrap/js/bootstrap.bundle.min.js
// import style from './../css/bootstrap/css/bootstrap.ltr.css'

//react
import React,{useEffect} from 'react'

//third party
import { Helmet } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import classNames from 'classnames';
import { connect,useDispatch } from 'react-redux';
import {Switch,Route,Redirect} from 'react-router-dom'


//data-stub
import theme from '../data/theme';

//application
import { changeStyle } from '../store/style'


//pages
import AuthLogin from '../dashboard/authentication/AuthLogin'
import AuthSignUp from '../dashboard/authentication/AuthSignUp'
import AuthResetPassword from '../dashboard/authentication/AuthResetPassword'
import AuthForgetPassword from '../dashboard/authentication/AuthForgetPassword'
import AuthEmailConfirmation from '../dashboard/authentication/AuthEmailConfirmation'


function AuthLayout ( props ) {

    const { match, style: { site },setFileSite } = props;
    useEffect( () => {
        console.log( 'HERE AUTH dashboard' )
    }, [] );

    return (
        <React.Fragment>
            <Helmet>
                <title>{theme.name} - dashboard</title>
                <meta name="description" content={theme.fullName} />
                {/* <link rel="stylesheet" href="style.ltr.css" /> */}
                {/* <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.rtl.min.css" /> */}

            </Helmet>
            <ToastContainer autoClose={5000} hideProgressBar />

            {/* <!-- sa-app --> */}
            
            <Switch>
                <Route exact path={`${ match.path }/login`} component={AuthLogin} />
                <Route exact path={`${ match.path }/signup`} component={AuthSignUp} />
                <Route exact path={`${ match.path }/password/reset/:token`} component={AuthResetPassword} />
                <Route exact path={`${ match.path }/password/forget`} component={AuthForgetPassword} />
                <Route exact path={`${ match.path }/confirm`} component={AuthEmailConfirmation} />
               
                        
            </Switch>
                    
            {/* <!-- sa-app / end --> */}

        </React.Fragment>
    );
}

function mapStateToProps () {
    return {}
}


export default connect(mapStateToProps)(AuthLayout)
