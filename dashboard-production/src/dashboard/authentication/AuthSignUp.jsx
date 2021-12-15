//react
import React,{useEffect,useState} from 'react'

//third party
import { Link } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux'

//services
import { url } from '../../services/utils'

//application
import { handleRegister } from "../../store/authentication";



function AuthSignUp (props) {
    const { history } = props;

    //store
    const userLogin = useSelector( state => state.userLogin )
    const { loading, error, userInfo } = userLogin;

    //states
    const [name, setName] = useState( '' );
    const [email, setEmail] = useState( '' );
    const [password, setPassword] = useState( '' );
    const [passwordConfirm, setPasswordConfirm] = useState( '' );
    const [emailMessage, setEmailMessage] = useState( '' );
    const [nameMessage, setNameMessage] = useState( '' );
    const [passwordMessage, setPasswordMessage] = useState( '' );
    const[passwordConfirmMessage,setPasswordConfirmMessage]=useState('')
    const[checkpassMatch,setCheckpassMatch]=useState('')
    const [tooShortPassword, setTooShortPassword] = useState( '' )

    const dispatch = useDispatch();
     useEffect( () => {
        if ( userInfo ) {
            history.push('/')
        }   
    },[userInfo,history])
    
    const checkMatch = () => {
    if (password !== passwordConfirm) {
        return setCheckpassMatch("Not Matched")
    }
    return setCheckpassMatch("Matched")
  };

  //dispatch signUp
  const handleSubmit = () => {
    // e.preventDefault();
    dispatch(
      handleRegister({
        name,
        email,
        password,
        passwordConfirm,
      })
    );
  };

  const checkPassLength = () => {
    if (password.length < 8 && password.trim() !== "") {
        return setTooShortPassword(true)
    }
      setTooShortPassword( false );
    };
    
    const checkData = (e) => {
    e.preventDefault();
    if (name.trim() === "") {
        return setNameMessage("Please provide a Name" )
    } else {
        setNameMessage("")
    }

    if (email.trim() === "") {
        return setEmailMessage("Email is required")
    } else {
        setEmailMessage("")
    }

    if (password.trim() === "") {
        return setPasswordMessage("Please specify a password")
      // return false;
    } else {
        setPasswordMessage("")
    }

    if (passwordConfirm.trim() === "") {
        return setPasswordConfirmMessage("Please confirm your password")
      // return false;
    } else {
        setPasswordConfirmMessage("")
    }

    // this.setState( { disabled: true } );
    // return true;
    handleSubmit();
  };

    return (
        <React.Fragment>
            <div className="min-h-100 p-0 p-sm-6 d-flex align-items-stretch">
                <div className="card w-25x flex-grow-1 flex-sm-grow-0 m-sm-auto">
                    <div className="card-body p-sm-5 m-sm-3 flex-grow-0">
                        <h1 className="mb-0 fs-3">Sign Up</h1>
                        <div className="fs-exact-14 text-muted mt-2 pt-1 mb-5 pb-2">Fill out the form to create a new account.</div>
                            <form onSubmit={e=>checkData(e)}>
                        <div className="mb-4">
                            <label className="form-label">Full name</label>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                value={name}
                                onChange={e => setName( e.target.value )}
                                required
                            />
                            {nameMessage !== "" && (
                                <p className='text-danger'>{nameMessage}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control form-control-lg"
                                value={email}
                                onChange={( e ) => setEmail( e.target.value )}
                                required
                            />
                            {emailMessage !== "" && (
                                <p className='text-danger'>{emailMessage}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control form-control-lg"
                                onKeyUp={checkPassLength}
                                value={password}
                                onChange={( e ) => setPassword( e.target.value )}
                            />
                            {passwordMessage !== "" && (
                                <p className='text-danger'>{passwordMessage}</p>
                            )}
                            {tooShortPassword === true && (
                                <p className='text-danger'>
                                    Too short length at least 8
                                </p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="form-label">Password Confirm</label>
                            <input
                                type="password"
                                className="form-control form-control-lg"
                                value={passwordConfirm}
                                onKeyUp={checkMatch}
                                onChange={( e ) =>
                                    setPasswordConfirm( e.target.value )
                                }
                            />
                            {passwordConfirmMessage !== "" &&
                                checkpassMatch.trim() === "" && (
                                    <p className='text-danger'>
                                        {passwordConfirmMessage}
                                    </p>
                                )}
                            {checkpassMatch.trim().toLocaleLowerCase() ===
                                "not matched" && (
                                    <p className='text-danger'>{checkpassMatch}</p>
                                )}
                            {checkpassMatch.trim().toLocaleLowerCase() ===
                                "matched" && (
                                    <p className='text-success'>{checkpassMatch}</p>
                                )}
                        </div>

                        <div className="mb-4 py-2">
                            <label className="form-check mb-0">
                                <input type="checkbox" className="form-check-input" />
                                <span className="form-check-label">I agree to the <Link to="/site/terms">terms and conditions</Link>.</span>
                            </label>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg w-100"
                                onClick={e => checkData( e )}
                            >Sign Up</button>
                        </div>
                        </form>
                    </div>
                    <div className="text-center" style={{marginBottom:'20px'}}>
                        Already have an account? <Link to="/auth/login">Sign in</Link>
                    </div>
                    
                </div>
            </div>
        
        </React.Fragment>
    );
}

export default AuthSignUp
