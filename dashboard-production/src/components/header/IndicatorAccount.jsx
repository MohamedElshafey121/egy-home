// react
import React, { Fragment, useState, useEffect } from 'react';

// third-party
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// application
import Indicator from './Indicator';
import { Person20Svg } from '../../svg';

// Actions
import {
    handleLogin,
    logout
} from '../../store/authentication'

export default function IndicatorAccount ( props ) {
    const { history, location } = props;

    const userLogin = useSelector( state => state.userLogin )
    const { loading, error, userInfo } = userLogin;

    const [email, setEmail] = useState( '' );
    const [password, setPassword] = useState( '' );


    const dispatch = useDispatch()
    const handleSubmit = ( e ) => {
        e.preventDefault();
        dispatch( handleLogin( { email, password } ) )
    }

    const handleLogout = ( e ) => {
        e.preventDefault();
        dispatch( logout() )
    }

    // const redirect = history.location.search ? history.location.search.split( '=' )[1] : '/'

    const dropdown = (
        <div className="account-menu">

            {!userInfo && (
                <Fragment>
                    <form className="account-menu__form" onSubmit={e => handleSubmit( e )}>
                        <div className="account-menu__form-title">Log In to Your Account</div>
                        <div className="form-group">
                            <label htmlFor="header-signin-email" className="sr-only">Email address</label>
                            <input
                                id="header-signin-email"
                                type="email"
                                value={email}
                                onChange={( e ) => setEmail( e.target.value )}
                                className="form-control form-control-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="header-signin-password" className="sr-only">Password</label>
                            <div className="account-menu__form-forgot">
                                <input
                                    value={password}
                                    onChange={( e ) => setPassword( e.target.value )}
                                    id="header-signin-password"
                                    type="password"
                                    className="form-control form-control-sm"
                                    placeholder="Password"
                                />
                                <Link to="/auth/password/forget" className="account-menu__form-forgot-link">Forgot?</Link>
                            </div>
                        </div>
                        <div className="form-group account-menu__form-button">
                            <button type="submit" onClick={e => handleSubmit( e )} className="btn btn-primary btn-sm">Login</button>
                        </div>
                        <div className="account-menu__form-link">
                            <Link to="/auth/signup">Create An Account</Link>
                        </div>
                    </form>
                    <div className="account-menu__divider" />
                </Fragment>
            )
            }

            {userInfo && (
                <Fragment>
                    <Link to="/account/dashboard" className="account-menu__user">
                        <div className="account-menu__user-avatar">
                            <img src="/uploads/imgs/users/user_avatar.png" alt="" />
                        </div>

                        <div className="account-menu__user-info">
                            <div className="account-menu__user-name">{userInfo.name}</div>
                            <div className="account-menu__user-email">{userInfo.email}</div>
                        </div>
                    </Link>
                    <div className="account-menu__divider" />
                    <ul className="account-menu__links">
                        <li><Link to="/account/profile">Edit Profile</Link></li>
                        <li><Link to="/account/orders">Order History</Link></li>
                        <li><Link to="/account/addresses">Addresses</Link></li>
                        <li><Link to="/account/password">Password</Link></li>
                    </ul>
                    <div className="account-menu__divider" />
                    <ul className="account-menu__links">
                        <li><Link onClick={e => handleLogout( e )}>Logout</Link></li>
                    </ul>
                </Fragment>
            )
            }

        </div>
    );

    return (
        <Indicator url="/account" dropdown={dropdown} icon={<Person20Svg />} />
    );
}
