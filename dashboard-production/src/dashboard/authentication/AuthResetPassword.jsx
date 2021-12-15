import React,{useState,useEffect} from 'react'

import { useSelector,useDispatch } from 'react-redux';

import {
    resetPassword,
    resetPasswordReset
} from '../../store/authentication'


function AuthResetPassword (props) {
    const { history, match } = props;
    const resetToken = match.params.token;

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
            <div className="min-h-100 p-0 p-sm-6 d-flex align-items-stretch">
                <div className="card w-25x flex-grow-1 flex-sm-grow-0 m-sm-auto">
                    <div className="card-body p-sm-5 m-sm-3 flex-grow-0">
                        <h1 className="mb-0 fs-3">Reset Password</h1>
                        <div className="fs-exact-14 text-muted mt-2 pt-1 mb-5 pb-2">Please enter your new password.</div>

                        <form onSubmit={e=>resetPasswordHandler(e)}>
                        <div className="mb-4">
                            <label className="form-label">Password</label>
                            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="form-control form-control-lg" />
                        </div>
                        <div className="mb-4 pb-2">
                            <label className="form-label">Confirm password</label>
                            <input value={passwordConfirm} onChange={e=>setPasswordConfirm(e.target.value)} type="password" className="form-control form-control-lg" />
                        </div>
                        <div className="pt-3">
                            <button type="submit" onClick={e=>resetPasswordHandler(e)} className="btn btn-primary btn-lg w-100">Reset</button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        
        </React.Fragment>
    );
}

export default AuthResetPassword
