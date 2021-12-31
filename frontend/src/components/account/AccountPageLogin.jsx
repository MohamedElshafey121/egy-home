// react
import React,{useEffect,useState} from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'


// application
import { Check9x7Svg } from '../../svg';
import {
    handleLogin
} from '../../store/authentication'


// data stubs
import theme from '../../data/theme';
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'


export default function AccountPageLogin(props) {
    const { history } = props;
    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )

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
            history.push( '/' )
        }   
    },[userInfo])


    return (
        <React.Fragment>
            <Helmet>
                <title>{`${messages.login}`}</title>
            </Helmet>


            <div className="block mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-5 d-flex m-auto">
                            <div className="card flex-grow-1 mb-md-0">
                                <div className="card-body">
                                    <h3 className="card-title text-center">{messages.login}</h3>
                                    <form onSubmit={e=>handleSubmit(e)}>
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
                                        <div className="form-group">
                                            <label htmlFor="login-password">{messages.password}</label>
                                            <input
                                                id="login-password"
                                                type="password"
                                                className="form-control"
                                                placeholder={messages.password}
                                                onChange={e => setPassword( e.target.value )}
                                                value={password}
                                            />
                                            <small className="form-text text-muted">
                                                <Link to="/">{ messages.forgetPassword}</Link>
                                            </small>
                                        </div>
                                        <div className="form-group">
                                            <div className="form-check">
                                                <span className="form-check-input input-check">
                                                    <span className="input-check__body">
                                                        <input
                                                            id="login-remember"
                                                            type="checkbox"
                                                            className="input-check__input"
                                                        />
                                                        <span className="input-check__box" />
                                                        <Check9x7Svg className="input-check__icon" />
                                                    </span>
                                                </span>
                                                <label className="form-check-label" htmlFor="login-remember">
                                                    {messages.rememberMe}
                                                </label>
                                            </div>
                                            <p>إن كنت لا تمتلك حساب يمكنك إنشاء حساب جديد  <Link to='/account/signup'>  من هنا </Link> </p>
                                        </div>
                                        
                                        <button type="submit" className="btn btn-primary mt-2 mt-md-3 mt-lg-4"
                                             onClick={e=>handleSubmit(e)}
                                        >
                                            {messages.login}
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
