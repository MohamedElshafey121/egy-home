//react
import React,{useEffect,useState} from 'react'

//third party
import { Link } from 'react-router-dom'
import {useSelector,useDispatch} from 'react-redux'

//services
import { url } from '../../services/utils'

//application
import {
    handleLogin
} from '../../store/authentication'


function AuthLogin ( props ) {
    const { history } = props;
    const userLogin = useSelector( state => state.userLogin )
    const { loading, error, userInfo } = userLogin;

    const [email, setEmail] = useState( '' );
    const [password, setPassword] = useState( '' );


    const dispatch = useDispatch()

    const handleSubmit = ( e ) => {
        e.preventDefault();
        dispatch( handleLogin( { email, password } ) )
    }

    useEffect( () => {
        if ( userInfo ) {
            history.push('/')
        }   
    },[userInfo])

    return (
        <React.Fragment>
                        <div className="min-h-100 p-0 p-sm-6 d-flex align-items-stretch">
                <div className="card w-25x flex-grow-1 flex-sm-grow-0 m-sm-auto">

                    <div className="card-body p-sm-5 m-sm-3 flex-grow-0">
                        {/*  */}
                        <form onSubmit={e=>handleSubmit(e)}>
                        <h1 className="mb-0 fs-3">Sign In</h1>
                        <div className="fs-exact-14 text-muted mt-2 pt-1 mb-5 pb-2">
                            Log in to your account to continue.
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                onChange={e => setEmail( e.target.value )}
                                value={email}
                                className="form-control form-control-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control form-control-lg"
                                onChange={e => setPassword( e.target.value )}
                                value={password}
                            />
                        </div>
                        <div className="mb-4 row py-2 flex-wrap">
                            <div className="col-auto me-auto">
                                <label className="form-check mb-0">
                                    <input type="checkbox" className="form-check-input" />
                                    <span className="form-check-label">Remember me</span>
                                </label>
                            </div>
                            <div className="col-auto d-flex align-items-center">
                                {/* <a href={url.customer({_id:45})}>Forgot password?</a> */}
                                <Link to="/auth/password/forget">Forgot password?</Link>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg w-100"
                                onClick={e=>handleSubmit(e)}
                            >Sign In</button>
                        </div>
                        {/*  */}
                        </form>
                    </div>

                    <div className='text-center'>
                            Don't have an account? <Link to='/auth/signup'>Sign up</Link>

                    </div>
                    
                    <div className="card-body p-sm-5 m-sm-3 flex-grow-0">
                        
                    </div>
                </div>
            </div>
        
       </React.Fragment>
    )
}

export default AuthLogin