import React,{useEffect} from 'react'
import { Link } from 'react-router-dom';
import { connect,useDispatch } from 'react-redux';
import { url } from '../../services/utils'

import {
   resetConfirmationEmail
} from '../../store/authentication'


function AuthEmailConfirmation (props) {
    const {
        confirmationMessage,
        history,
        userLogin
    } = props;
    const{userInfo}=userLogin
    const { success, message, shortMessage,email } = confirmationMessage;
    
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
        <div className="min-h-100 p-0 p-sm-6 d-flex align-items-stretch">
            <div className="card w-25x flex-grow-1 flex-sm-grow-0 m-sm-auto">
                <div className="card-body p-sm-5 m-sm-3 flex-grow-0">
                    <h1 className="mb-0 fs-3">Confirm email address</h1>

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

                    <p className="mb-0 sa-text--sm">
                        {/* Back to <a href={url( 'auth/sign-in' )}>Sign In</a> page. */}
                        Back to <Link to="/dashboardauth/login" onClick={()=>resetConfirmHandler()} >Sign In</Link> page.
                    </p>
                </div>
            </div>
        </div>
    );
}

function mapStateToProps ( state ) {
    return {
        confirmationMessage: state.confirmationMessage,
        userLogin:state.userLogin
    }
}

// const mapDispatchToprops = {
//     resetConfirmationEmail
// }

export default connect(mapStateToProps)(AuthEmailConfirmation)
