// react
import React, { useEffect, useState } from "react";

// third-party
import { Helmet } from "react-helmet-async";
import { useSelector, useDispatch } from "react-redux";

// data stubs
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'
import governates from '../../data/governates.json'
import cities from '../../data/cities.json'


import { addNewUserAddress } from "../../store/user";


export default function AccountPageCreateAddress ( { history } ) {
    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )

   

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [governate, setGovernate] = useState("");
    const [city, setCity] = useState("");
    const [area, setArea] = useState("");
    const [street, setAddress] = useState(""); //العنوان بالتفصيل او الشارع
    const [type, setAddressType] = useState("");
    const [phoneNumber, setPhone] = useState("");
    const [orderNotes, setOrderNotes] = useState("");
    const [email, setEmail] = useState("");

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const addAddress = useSelector( state => state.addAddress );
    const { success: addAddressSuccess, error: addAddressError } = addAddress;    

    const dispatch = useDispatch();
    useEffect( () => {
        
        if ( addAddressSuccess ) {
            history.push( "/account/addresses" );
        }
        if ( userInfo && !firstName.trim() ) {
            setFirstName( userInfo.name )
        }
        if ( userInfo && !email.trim() ) {
            setEmail( userInfo.email );
        }
    }, [addAddressSuccess] );

    const submitHandler = ( e ) => {
        e.preventDefault();
        let governateName = governates.find( gov => {
            if ( gov.id === governate ) return gov;
        } ).governorate_name_ar
        
        let cityName = cities.find( cit => {
            if ( cit.id === city ) return cit;
        } ).city_name_ar;
        dispatch(addNewUserAddress({
            firstName,
            lastName,
            governate:governateName,
            city:cityName,
            area,
            address:street,
            type,
            phoneNumber,
            orderNotes,
            email
        }))
    };

    return (
        <div className="card">
            <Helmet>
                <title>{` ${ messages.myAccount }`}</title>
            </Helmet>

            <div className="card-header">
                <h5>{messages.addNewAddress}</h5>
            </div>
            <div className="card-divider" />
            <div className="card-body">
                <div className="row no-gutters">
                    <div className="col-12 col-lg-10 col-xl-8">
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="checkout-first-name">{messages.firstName}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="checkout-first-name"
                                    placeholder={messages.firstName}
                                    value={firstName}
                                    onChange={( e ) => setFirstName( e.target.value )}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="checkout-last-name">{messages.lastName}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="checkout-last-name"
                                    placeholder={messages.lastName}
                                    value={lastName}
                                    onChange={( e ) => setLastName( e.target.value )}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="checkout-governate_name"> {messages.governate}</label>
                            <select id="checkout-governate_name" className="form-control"
                                value={governate}
                                onChange={( e ) => setGovernate( e.target.value )}
                            >
                                {!governate && <option  >--</option>}
                                {governates && governates.map( gov => (
                                    <option value={gov.id}>{locale === 'ar' ? gov.governorate_name_ar : gov.governorate_name_en}</option>
                                ) )}
                            </select>
                        </div>


                        {governate && <div className="form-group">
                            <label htmlFor="checkout-city"> {messages.city}</label>
                            <select id="checkout-city" className="form-control"
                                value={city}
                                onChange={( e ) => setCity( e.target.value )}
                            >
                                {!city && <option  >--</option>}
                                {cities && cities.map( city => {
                                    return ( city.governorate_id === governate ) ? <option value={city.id}> {locale === 'ar' ? city.city_name_ar : city.city_name_en}</option> : ''
                                } )}
                            </select>
                        </div>}

                        <div className="form-group">
                            <label htmlFor="checkout-state">{messages.area}</label>
                            <input
                                type="text"
                                className="form-control"
                                id="checkout-state"
                                value={area}
                                onChange={( e ) => setArea( e.target.value )}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="checkout-state">{messages.streetAddress}</label>
                            <input
                                type="text"
                                className="form-control"
                                id="checkout-state"
                                value={street}
                                onChange={( e ) => setAddress( e.target.value )}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="checkout-address-type">{messages.addressType}</label>
                            <select
                                id="checkout-address-type"
                                className="form-control form-control-select2"
                                value={type}
                                onChange={( e ) => setAddressType( e.target.value )}
                            >
                                <option>Select address type...</option>
                                <option value="home">{messages.homeAddress}</option>
                                <option value="work">{messages.workAddress}</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="checkout-email">{messages.emailAddress}</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="checkout-email"
                                    placeholder={messages.emailAddress}
                                    value={email}
                                    onChange={( e ) => setEmail( e.target.value )}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="checkout-phone">{messages.phoneNumber}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="checkout-phone"
                                    placeholder={messages.phoneNumber}
                                    value={phoneNumber}
                                    onChange={( e ) => setPhone( e.target.value )}
                                />
                            </div>
                        </div>

                        <div className="form-group mt-3 mb-0">
                            <button className="btn btn-primary" type="button" onClick={( e ) => submitHandler( e )}>
                                {messages.save}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
