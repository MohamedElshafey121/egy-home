// react
import React, { useEffect, useState } from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { connect,useSelector, useDispatch } from 'react-redux'


// application
import {
    resetConfirmationEmail
} from '../../store/authentication';


// data stubs
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'


function AccountpageEmailConfirm ( props ) {
      const {
        confirmationMessage,
        history,
        userLogin
    } = props;
    const{userInfo}=userLogin
    const { success, message, shortMessage, email } = confirmationMessage;
    
    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )

     const dispatch=useDispatch()
    useEffect( () => {
        //check verification email exist
        if ( !success ) {
            history.push('/')
        }

        //check if already logged in
        if ( userInfo ) {
            history.push('/')
        }
    },[history, success,userInfo])

    function resetConfirmHandler () {
        dispatch(resetConfirmationEmail())
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
                             <div className="min-h-100 p-0 p-sm-6 d-flex align-items-stretch">
            <div className="card w-25x flex-grow-1 flex-sm-grow-0 m-sm-auto">
                <div className="card-body p-sm-5 m-sm-3 flex-grow-0">
                    <h4 className="mb-0 fs-3">{messages.confEmail}</h4>

                    <div className="alert alert-success alert-sa-has-icon mt-4 mb-4" role="alert">
                        <div className="alert-sa-icon">
                            {/* {svg( 'feather/check-circle' )} */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="feather feather-check-circle"
                            >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <div className="alert-sa-content">
                            {/* A confirmation email was sent to the <strong>stroyka@example.com</strong>. */}
                            {message && (
                                <>
                                    {message} <strong>{ email }</strong>
                                </>
                            )}
                        </div>
                    </div>

                    {/* <p className="pt-2">Before proceeding, we must verify the authenticity of your inbox.</p> */}

                    <p>
                        {/* Check the mailbox! After receiving the email, click on the link provided to confirm the
                        email address. */}
                        {shortMessage && shortMessage}
                    </p>

                    <p className="mb-0 sa-text--sm text-center">
                        {/* Back to <a href={url( 'auth/sign-in' )}>Sign In</a> page. */}
                        {messages.backTo} <Link to="/" onClick={()=>resetConfirmHandler()} >{messages.home}</Link> 
                    </p>
                </div>
            </div>
        </div>
    </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

function mapStateToProps ( state ) {
    return {
        confirmationMessage: state.confirmationMessage,
        userLogin:state.userLogin
    }
}

export default connect(mapStateToProps)(AccountpageEmailConfirm)

