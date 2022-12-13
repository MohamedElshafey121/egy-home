// react
import React,{useEffect,useState} from 'react';


// third-party
import classNames from 'classnames';
import {
    Link,
    matchPath,
    Redirect,
    Switch,
    Route,
} from 'react-router-dom';

import { useSelector,useDispatch } from 'react-redux';

//data stubs
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'


// application
import PageHeader from '../shared/PageHeader';
import {
    logout
} from '../../store/authentication'

// pages
import AccountPageAddresses from './AccountPageAddresses';
import AccountPageDashboard from './AccountPageDashboard';
import AccountPageEditAddress from './AccountPageEditAddress';
import AccountPageCreateAddress from './AccountPageCreateAddress'
import AccountPageOrderDetails from './AccountPageOrderDetails';
import AccountPageOrders from './AccountPageOrders';
import AccountPagePassword from './AccountPagePassword';
import AccountPageProfile from './AccountPageProfile';

export default function AccountLayout ( props ) {
    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )
    const { match, location, history } = props;
    const userLogin = useSelector( ( state ) => state.userLogin );
    const { userInfo } = userLogin;


    useEffect( () => {
        if ( !userInfo ) {
            history.push( '/account/login' );
        } 
    }, [userInfo] )
    
    const dispatch=useDispatch()
    const handleLogout = ( e ) => {
        e.preventDefault();
        dispatch( logout() )
    }

    const breadcrumb = [
        { title: `${messages.home}`, url: '' },
        { title: `${messages.myAccount}`, url: '' },
    ];

    const links = [
        { title: `${messages.dashboard}`, url: 'dashboard' },
        { title: `${messages.orderHistory}`, url: 'orders' },
        { title: `${messages.addresses}`, url: 'addresses' },
        // { title: `${messages.password}`, url: 'password' },
        // { title: `${messages.logout}`, url: 'login' },
    ].map((link) => {
        const url = `${match.url}/${link.url}`;
        const isActive = matchPath(location.pathname, { path: url, exact: true });
        const classes = classNames('account-nav__item', {
            'account-nav__item--active': isActive,
        });

        return (
            <li key={link.url} className={classes}>
                <Link to={url}>{link.title}</Link>
            </li>
        );
    } );
    

   

    if ( userInfo && userInfo.registerationType === 'email' ) {
        const url = `${match.url}/password`;
        const isActive = matchPath(location.pathname, { path: url, exact: true });
        links.push( <li key='password' className={classNames('account-nav__item', {
            'account-nav__item--active': isActive,
        })}>
            <Link to={url}>{messages.password}</Link>
        </li> );
    }

     if ( userInfo ) {
        links.push( <li key='password' className='account-nav__item'>
            <button
                className='btn btn-default'
                style={{ color: '#777' }}
                onClick={e => handleLogout( e )}
            >{messages.logout}</button>
        </li> );
    }

    return (
        <React.Fragment>
            <PageHeader header={messages.myAccount} breadcrumb={breadcrumb} />

            <div className="block">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-lg-3 d-flex">
                            <div className="account-nav flex-grow-1">
                                <h4 className="account-nav__title">{ messages.navigation}</h4>
                                <ul>{links}</ul>
                            </div>
                        </div>
                        <div className="col-12 col-lg-9 mt-4 mt-lg-0">
                            <Switch>
                                <Redirect exact from={match.path} to={`${match.path}/dashboard`} />
                                <Route exact path={`${match.path}/dashboard`} component={AccountPageDashboard} />
                                <Route exact path={`${match.path}/profile`} component={AccountPageProfile} />
                                <Route exact path={`${match.path}/orders`} component={AccountPageOrders} />
                                <Route exact path={`${match.path}/orders/:orderId`} component={AccountPageOrderDetails} />
                                <Route exact path={`${match.path}/addAddress`} component={AccountPageCreateAddress} />
                                <Route exact path={`${match.path}/addresses`} component={AccountPageAddresses} />
                                <Route exact path={`${match.path}/addresses/:addressId`} component={AccountPageEditAddress} />
                                <Route exact path={`${match.path}/password`} component={AccountPagePassword} />
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
