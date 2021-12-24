// react
import React,{useEffect,useState} from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux'
import { toast } from "react-toastify";

// data stubs
import theme from '../../data/theme';
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'


import {
    getAddressDetails,
    updateUserAddress,
} from '../../store/user';

export default function AccountPageEditAddress ( { match, history } ) {
    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )


    let addressId = match.params.addressId;

     const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [governate, setGovernate] = useState('')
    const [city, setCity] = useState('')
    const [area, setArea] = useState('')
    const [street, setAddress] = useState('')//العنوان بالتفصيل او الشارع
    const [type, setAddressType] = useState('')
    const [phoneNumber, setPhone] = useState('')
    const [orderNotes, setOrderNotes] = useState( '' )
    const [email, setEmail] = useState( '' )

    const userLogin = useSelector( ( state ) => state.userLogin );
    const { userInfo } = userLogin;

    const addressDetails = useSelector( ( state ) => state.addressDetails );
    const { loading: loadingAddress, error: gettingAddressError, address } = addressDetails;

    const updateAddress = useSelector( ( state ) => state.updateAddress );
    const { success: updateAddressSuccess,error:updateAddressError } = updateAddress;


    const dispatch = useDispatch()
    
    useEffect( () => {
        if ( gettingAddressError ) {
            toast.error('Invalid address Id',{ theme: "colored" })
        }
        
        if ( updateAddressSuccess || gettingAddressError ) {
            history.push('/account/addresses')
        }
        
        if ( !address || ( addressId !== address._id ) ) {
            dispatch( getAddressDetails( addressId ) )
        }
        else {
            setFirstName( address.firstName )
            setLastName( address.lastName )
            setGovernate( address.governate )
            setCity( address.city )
            setArea( address.area )
            setAddress( address.address )
            setAddressType( address.type )
            setPhone( address.phoneNumber )
            setOrderNotes( address.orderNotes )
            address.email? setEmail(address.email):setEmail(userInfo.email)
        }
        
        // if ( updateAddressSuccess ) {
        //     history.push('/profile/address')
        // }
        // eslint-disable-next-line
    }, [dispatch, addressId, address, updateAddressSuccess,gettingAddressError] );

    const submitHandler = ( e ) => {
        e.preventDefault();
        //dispatch update address here
        dispatch( updateUserAddress( addressId,{
            firstName,
            lastName,
            governate,
            city,
            area,
            address:street,
            type,
            phoneNumber,
            orderNotes,
            email
        } ) )
           
    }

    return (
        <div className="card">
            <Helmet>
                <title>{`${messages.myAccount}`}</title>
            </Helmet>

            <div className="card-header">
                <h5>{ messages.editAddress}</h5>
            </div>
            <div className="card-divider" />
            <div className="card-body">
                <div className="row no-gutters">
                    <div className="col-12 col-lg-10 col-xl-8">
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="checkout-first-name">{ messages.firstName}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="checkout-first-name"
                                    placeholder={ messages.firstName}
                                    value={firstName}
                                    onChange={e=>setFirstName(e.target.value)}
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
                                    onChange={e=>setLastName(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* <div className="form-group">
                            <label htmlFor="checkout-company-name">
                                Company Name
                                {' '}
                                <span className="text-muted">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="checkout-company-name"
                                placeholder="Company Name"
                            />
                        </div> */}
                        {/* <div className="form-group">
                            <label htmlFor="checkout-country">Country</label>
                            <select id="checkout-country" className="form-control form-control-select2">
                                <option>Select a country...</option>
                                <option>United States</option>
                                <option>Russia</option>
                                <option>Italy</option>
                                <option>France</option>
                                <option>Ukraine</option>
                                <option>Germany</option>
                                <option>Australia</option>
                            </select>
                        </div> */}
                        <div className="form-group">
                            <label htmlFor="checkout-street-address">{messages.governate}</label>
                            <input
                                type="text"
                                className="form-control"
                                id="checkout-street-address"
                                placeholder={messages.governate}
                                value={governate}
                                onChange={e=>setGovernate(e.target.value)}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="checkout-city">{messages.city}</label>
                            <input
                                type="text"
                                className="form-control"
                                id="checkout-city"
                                value={city}
                                onChange={e=>setCity(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="checkout-state">{messages.area}</label>
                            <input
                                type="text"
                                className="form-control"
                                id="checkout-state"
                                value={area}
                                onChange={e=>setArea(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="checkout-state">{messages.streetAddress}</label>
                            <input
                                type="text"
                                className="form-control"
                                id="checkout-state"
                                value={street}
                                onChange={e=>setAddress(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="checkout-address-type">{messages.addressType}</label>
                            <select
                                id="checkout-address-type"
                                className="form-control form-control-select2"
                                value={type}
                                onChange={e=>setAddressType(e.target.value)}
                            >
                                <option>{messages.selectAddressType} ...</option>
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
                                    value={email}
                                    onChange={e=>setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="checkout-phone">{messages.phoneNumber}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="checkout-phone"
                                    value={phoneNumber}
                                    onChange={e=>setPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group mt-3 mb-0">
                            <button
                                className="btn btn-primary"
                                type="button"
                                onClick={e=>submitHandler(e)}
                            >{messages.save}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
