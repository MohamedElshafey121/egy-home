import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux'
import {
    forgetPassword,
    forgetPasswordReset,
    setConfirmationEmail
} from '../../store/authentication'

function AuthForgetPassword (props) {
    const { history } = props;

    const userLogin = useSelector( state => state.userLogin )
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
            const msg = `A confirmation email was sent to the `
            const shortMSg="Check the mailbox! After receiving the email, click on the link provided to reset your password."
            dispatch(setConfirmationEmail(email,msg,shortMSg))
            history.push('/authdashboard/confirm')
            dispatch(forgetPasswordReset())
        }
    }, [dispatch,userInfo, history,success] )
    
    function submitHandler ( e ) {
        e.preventDefault();
        dispatch(forgetPassword(email))
    }

    return (
        <React.Fragment>
            <div className="min-h-100 p-0 p-sm-6 d-flex align-items-stretch">
                <div className="card w-25x flex-grow-1 flex-sm-grow-0 m-sm-auto">
                    <div className="card-body p-sm-5 m-sm-3 flex-grow-0">
                        <h1 className="mb-0 fs-3">Forgot password?</h1>
                        <div className="fs-exact-14 text-muted mt-2 pt-1 mb-5 pb-2">
                            Enter the email address associated with your account and we will send a link to reset your
                            password.
                        </div>

                        <form onSubmit={e=>submitHandler(e)}>
                        <div className="mb-4">
                            <label className="form-label">Email Address</label>
                            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="form-control form-control-lg" required />
                        </div>
                        <div>
                            <button onClick={e=>submitHandler(e)} type="submit" className="btn btn-primary btn-lg w-100">Reset Password</button>
                        </div>
                        </form>
                        <div className="form-group mb-0 mt-4 pt-2 text-center text-muted">
                            {/* Remember your password? <a href={url( 'auth/sign-in' )}>Sign in</a> */}
                            Remember your password? <Link to="/authdashboard/login">Sign in</Link>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default AuthForgetPassword
