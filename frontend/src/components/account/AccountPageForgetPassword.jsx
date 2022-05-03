// react
import React, { useEffect, useState } from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'


// application
import { Check9x7Svg } from '../../svg';
import {
    forgetPassword,
    forgetPasswordReset,
    setConfirmationEmail
} from '../../store/authentication';


// data stubs
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'


export default function AccountPageForgetPassword(props) {
    const { history } = props;
    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )

    const userLogin = useSelector( state => state.userLogin );
    const { userInfo } = userLogin;

    const forgetPasswordState = useSelector( state => state.forgetPassword );
    const { loading, success, error } = forgetPasswordState;

    //state
    const[email,setEmail]=useState('')


    const dispatch = useDispatch()

    useEffect( () => {
        // alert('success')
        if ( userInfo ) {
            history.push('/')
        }
        
        if ( success ) {
            const msg = messages.confirmEmailsent;
            const shortMSg = messages.checkMailMsg;
            dispatch(setConfirmationEmail(email,msg,shortMSg))
            history.push('/account/confirm')
            dispatch(forgetPasswordReset())
        }
    }, [dispatch, userInfo, history, success] )
    
     function submitHandler ( e ) {
        e.preventDefault();
        dispatch(forgetPassword(email))
    }


    return (
        <React.Fragment>
            <Helmet>
                <title>{`${messages.forgetPassword}`}</title>
            </Helmet>


            <div className="block mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-5 d-flex m-auto">
                            <div className="card flex-grow-1 mb-md-0">
                                <div className="card-body">
                                    <h3 className="card-title ">{messages.forgetPassword}</h3>
                                    <p>{ messages.forgetPasswordMsg}</p>
                                    <form onSubmit={e=>submitHandler(e)}>
                                        <div className="form-group">
                                            <label htmlFor="login-email">{ messages.emailAddress}</label>
                                            <input
                                                id="login-email"
                                                type="email"
                                                onChange={e => setEmail( e.target.value )}
                                                value={email}
                                                className="form-control"
                                                placeholder={messages.emailAddress}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary mt-2 mt-md-3 mt-lg-4 d-block m-auto btn-block"
                                             onClick={e=>submitHandler(e)}
                                        >
                                            {messages.send}
                                        </button>
                                    </form>
                                    <p className="mt-4 text-center">
                                        {messages.rememberpassquestion} <Link to='/account/login'>{messages.login}</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
