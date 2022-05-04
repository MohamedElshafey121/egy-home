// react
import React,{useEffect,useState}  from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux'


// application
import PageHeader from '../shared/PageHeader';
import { Check9x7Svg } from '../../svg';
import { handleRegister } from "../../store/authentication";


// data stubs
import theme from '../../data/theme';
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'


export default function AccountPageLogin ( props ) {
    const { history } = props;

    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )

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
        return setCheckpassMatch(messages.notMatch)
    }
    return setCheckpassMatch(messages.match)
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
        return setNameMessage(messages.userNameRequired)
    } else {
        setNameMessage("")
    }

    if (email.trim() === "") {
        return setEmailMessage(messages.emailRequired)
    } else {
        setEmailMessage("")
    }

    if (password.trim() === "") {
        return setPasswordMessage(messages.passwordEnterWarning)
      // return false;
    } else {
        setPasswordMessage("")
    }

    if (passwordConfirm.trim() === "") {
        return setPasswordConfirmMessage(messages.passwordConfirmWarning)
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
            <Helmet>
                <title>{`${ messages.register }`}</title>
            </Helmet>

            <div className="block mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-5 d-flex mt-4 mt-md-0 m-auto">
                            <div className="card flex-grow-1 mb-0">
                                <div className="card-body">
                                    <h3 className="card-title text-center">{messages.register}</h3>
                                    <form onSubmit={e => checkData( e )}>
                                        <div className="form-group">
                                            <label htmlFor="register-name">{messages.userName} <span>*</span> </label>
                                            <input
                                                id="register-name"
                                                type="text"
                                                className="form-control"
                                                placeholder={messages.userName}
                                                value={name}
                                                onChange={e => setName( e.target.value )}
                                                required
                                            />
                                            {nameMessage !== "" && (
                                                <p className='text-danger'>{nameMessage}</p>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="register-email">{messages.emailAddress} <span>*</span></label>
                                            <input
                                                id="register-email"
                                                type="email"
                                                className="form-control"
                                                placeholder={messages.emailAddress}
                                                value={email}
                                                onChange={( e ) => setEmail( e.target.value )}
                                                required
                                            />
                                            {emailMessage !== "" && (
                                                <p className='text-danger'>{emailMessage}</p>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="register-password">{messages.password} <span>*</span></label>
                                            <input
                                                id="register-password"
                                                type="password"
                                                className="form-control"
                                                placeholder={messages.password}
                                                onKeyUp={checkPassLength}
                                                value={password}
                                                onChange={( e ) => setPassword( e.target.value )}
                                            />
                                            {passwordMessage !== "" && (
                                                <p className='text-danger'>{passwordMessage}</p>
                                            )}
                                            {tooShortPassword === true && (
                                                <p className='text-danger'>
                                                    {messages.shortPass}
                                                </p>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="register-confirm">{messages.reenterNewPassword} <span>*</span></label>
                                            <input
                                                id="register-confirm"
                                                type="password"
                                                className="form-control"
                                                placeholder={messages.reenterNewPassword}
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
                                        <div>
                                            <p>  إن كنت تمتلك حساب بالفعل يمكنك تسجيل الدخول <Link to='/account/login'>من هنا  </Link>   </p>
                                        </div>
                                        <button type="submit" className="btn btn-primary mt-2 mt-md-3 mt-lg-4 d-block m-auto btn-block" onClick={e => checkData( e )}>
                                            {messages.register}
                                        </button>

                                        <span
                                            style={{
                                                display: 'block',
                                                margin: 'auto',
                                                width:'40px',
                                                height: '40px',
                                                textAlign: 'center',
                                                marginTop: '10px',
                                                marginBottom: '10px',
                                                lineHeight: '40px',
                                                borderRadius: '50%',
                                                textTransform: 'uppercase',
                                                border:'1px solid #333'
                                            }}
                                        >or</span>

                                        <button
                                            type='button'
                                            className="btn btn-primary  d-block m-auto btn-block"
                                            style={{
                                                backgroundColor: '#df4930', border: '0px', padding: '15px 25px',
                                                textAlign: 'center',
                                                minWidth:'150px'
                                            }}
                                            onClick={async e => {
                                                e.preventDefault();
                                                await window.open('http://egy-home.com/auth/google','_self')//localhost:5000
                                            }}
                                        >
                                            Google
                                            <img src='/uploads/imgs/google.png' alt="" className="icon"
                                                style={{ width: '20px',
                                                        height: '20px',
                                                    marginRight: '10px',
                                                    marginBottom:'10px'
                                                }}
                                            />
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
