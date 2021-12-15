// react
import React,{useEffect,useState} from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import {withRouter} from 'react-router-dom'
import{useSelector,useDispatch} from 'react-redux'

// data stubs
import theme from '../../data/theme';
import {
    getUserDetails,
    updateUserProfile
} from '../../store/user';


function AccountPageProfile ({history}) {
    const userLogin = useSelector( ( state ) => state.userLogin );
    const { userInfo } = userLogin;

    const userDetails = useSelector( ( state ) => state.userDetails );
    const { loading, user, error } = userDetails;

    const [name,setName] = useState( '' )
    const [email,setEmail] = useState( '' )
    

    const dispatch = useDispatch();
    //Load UserDetails with Addresses
    useEffect( () => {
        if ( !user || !user.name ) {
            dispatch( getUserDetails( 'profile' ) );
        } else {
            setName( user.name );
            setEmail( user.email )
        }
        if ( user._id !== userInfo._id ) {
            dispatch( getUserDetails( 'profile' ) );
        }
        
    }, [dispatch, history, userInfo, user] );

    //update Handler
    const submitHandler = (e) => {
    e.preventDefault();
      dispatch(
        updateUserProfile({
          name,
          email
        })
      );
    
  };


    return (
        <div className="card">
            <Helmet>
                <title>{`Profile — ${theme.name}`}</title>
            </Helmet>

            <div className="card-header">
                <h5>Edit Profile</h5>
            </div>
            <div className="card-divider" />
            {
                user&&(<div className="card-body">
                <div className="row no-gutters">
                    <div className="col-12 col-lg-7 col-xl-6">
                        <div className="form-group">
                            <label htmlFor="profile-first-name">Name</label>
                            <input
                                id="profile-first-name"
                                type="text"
                                className="form-control"
                                    placeholder="User Name"
                                    value={name}
                                    onChange={e=>setName(e.target.value)}
                            />
                        </div>
                        {/* <div className="form-group">
                            <label htmlFor="profile-last-name">Last Name</label>
                            <input
                                id="profile-last-name"
                                type="text"
                                className="form-control"
                                placeholder="Last Name"
                            />
                        </div> */}
                        <div className="form-group">
                            <label htmlFor="profile-email">Email Address</label>
                            <input
                                id="profile-email"
                                type="email"
                                className="form-control"
                                    placeholder="Email Address"
                                    value={email}
                                    readOnly
                                    disabled
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="profile-phone">Phone Number</label>
                            <input
                                id="profile-phone"
                                type="text"
                                className="form-control"
                                placeholder="Phone Number"
                            />
                        </div>

                        <div className="form-group mt-5 mb-0">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={(e) => submitHandler(e)}
                                >Save</button>
                        </div>
                    </div>
                </div>
            </div>
        )
            }
        </div>
    );
}

export default withRouter(AccountPageProfile)