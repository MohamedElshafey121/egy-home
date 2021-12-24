// react
import React,{useEffect,useState} from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {useSelector,useDispatch } from 'react-redux';

// data stubs
import dataAddresses from '../../data/accountAddresses';
import theme from '../../data/theme';
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'

import {
  getUserDetails,
} from "../../store/user";

import {
    UPDATE_USER_ADDRESS_RESET,
    ADD_USER_ADDRESS_RESET,
    USER_ADDRESS_DETAILS_RESET
} from '../../store/user/userActionsTypes';



export default function AccountPageAddresses () {
    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )

    const userDetails = useSelector( ( state ) => state.userDetails );
    const { loading, user, error } = userDetails;

    const updateAddress = useSelector( ( state ) => state.updateAddress );
    const { success: updateAddressSuccess } = updateAddress;

  const addAddress = useSelector((state) => state.addAddress);
    const { success: addAddressSuccess } = addAddress;
    
        const addressDetails = useSelector( ( state ) => state.addressDetails );
    const { error: gettingAddressError, address } = addressDetails;



  const [deltedItemId, setDeletedItemId] = useState("");
  const [meesage, setMessage] = useState("");

  const dispatch = useDispatch();

    useEffect( () => {
        if ( gettingAddressError ) {
            //reset getting address
            dispatch({type:USER_ADDRESS_DETAILS_RESET})
        }
   
      if (!user || !user.name) {
        dispatch(getUserDetails("profile"));
      } else if (updateAddressSuccess || addAddressSuccess) {
        dispatch({ type: UPDATE_USER_ADDRESS_RESET });
        dispatch({ type: ADD_USER_ADDRESS_RESET });
        dispatch(getUserDetails("profile"));
      }
    
  }, [
    dispatch,
    user,
    updateAddressSuccess,
    addAddressSuccess,
  ]);


    const addresses = ( user && user.address && user.address.length > 0 ) && user.address.map( ( address ) => (
        <React.Fragment key={address._id}>
            <div className="addresses-list__item card address-card">
                {address.default && <div className="address-card__badge">{ messages.defaultAddress}</div>}

                <div className="address-card__body">
                    <div className="address-card__name">{`${ address.firstName } ${ address.lastName }`}</div>
                    <div className="address-card__row">
                        {address.governate}
                        <br />
                        {address.city}
                        <br />
                        {address.area}
                        ,
                        {address.address}
                    </div>
                    <div className="address-card__row">
                        <div className="address-card__row-title">{messages.addressType}</div>
                        <div className="address-card__row-content">{address.type}</div>
                    </div>
                    <div className="address-card__row">
                        <div className="address-card__row-title">{ messages.phoneNumber}</div>
                        <div className="address-card__row-content">{address.phoneNumber}</div>
                    </div>
                    <div className="address-card__row">
                        <div className="address-card__row-title">{ messages.emailAddress}</div>
                        <div className="address-card__row-content">{user.email}</div>
                    </div>
                    <div className="address-card__footer">
                        <Link to={`/account/addresses/${ address._id }`}>{ messages.edit}</Link>
                        &nbsp;&nbsp;
                        <Link to="/">{messages.remove}</Link>
                    </div>
                </div>
            </div>
            <div className="addresses-list__divider" />
        </React.Fragment>
    ) );

    return (
        <div className="addresses-list">
            <Helmet>
                <title>{`Address List — ${theme.name}`}</title>
            </Helmet>

            <Link to="/account/addAddress" className="addresses-list__item addresses-list__item--new">
                <div className="addresses-list__plus" />
                <div className="btn btn-secondary btn-sm">{ messages.addNewAddress}</div>
            </Link>
            <div className="addresses-list__divider" />
            {addresses}
        </div>
    );
}
