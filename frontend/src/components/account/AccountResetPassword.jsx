import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async';


import { useSelector,useDispatch } from 'react-redux';

import {
    resetPassword
} from '../../store/authentication'

// data stubs
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'


export default function AccountResetPassword(props) {
    const { history, match } = props;
    const resetToken = match.params.token;

    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )

    const userLogin = useSelector( state => state.userLogin )
    const { userInfo } = userLogin;

    const resetPasswordSate = useSelector( state => state.resetPassword );
    const { loading, success, error } = resetPasswordSate;

    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState( '' );
    
    const dispatch = useDispatch();
    useEffect( () => {
        // alert(resetToken)
        if ( userInfo ) {
            history.push( '/' )
        }

        if ( success ) {
            history.push( '/' )
            // dispatch(resetPasswordReset())
        }

    }, [userInfo,success] );

    function resetPasswordHandler (e) {
        e.preventDefault();
        dispatch(resetPassword(resetToken,{password,passwordConfirm}))
    }
    
    return (
        <React.Fragment>
            <Helmet>
                <title>{`${messages.resetPass}`}</title>
            </Helmet>


            <div className="block mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-5 d-flex m-auto">
                            <div className="card flex-grow-1 mb-md-0">
                                <div className="card-body">
                                    <h3 className="card-title text-center">{messages.resetPass}</h3>
                                    <form onSubmit={e=>resetPasswordHandler(e)}>
                                        <div className="form-group">
                                            <label htmlFor="login-password">{messages.password}</label>
                                            <input
                                                id="login-password"
                                                type="password"
                                                className="form-control"
                                                onChange={e => setPassword( e.target.value )}
                                                value={password}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="login-confirmpassword">{messages.confirmPass}</label>
                                            <input
                                                id="login-confirmpassword"
                                                type="password"
                                                className="form-control"
                                                onChange={e => setPasswordConfirm( e.target.value )}
                                                value={passwordConfirm}
                                            />
                                        </div>
                                        
                                        <button type="submit" className="btn btn-primary mt-2 mt-md-3 mt-lg-4 d-block m-auto btn-block"
                                             onClick={e=>resetPasswordHandler(e)}
                                        >
                                            {messages.resetPass}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
