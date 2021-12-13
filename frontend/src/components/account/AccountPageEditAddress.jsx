// react
import React,{useEffect,useState} from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux'
import { toast } from "react-toastify";

// data stubs
import theme from '../../data/theme';
import {
    getAddressDetails,
    updateUserAddress,
} from '../../store/user';

export default function AccountPageEditAddress ( { match,history } ) {
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
                <title>{`Edit Address — ${theme.name}`}</title>
            </Helmet>

            <div className="card-header">
                <h5>Edit Address</h5>
            </div>
            <div className="card-divider" />
            <div className="card-body">
                <div className="row no-gutters">
                    <div className="col-12 col-lg-10 col-xl-8">
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="checkout-first-name">First Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="checkout-first-name"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={e=>setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="checkout-last-name">Last Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="checkout-last-name"
                                    placeholder="Last Name"
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
                            <label htmlFor="checkout-street-address">Governate</label>
                            <input
                                type="text"
                                className="form-control"
                                id="checkout-street-address"
                                placeholder="Street Address"
                                value={governate}
                                onChange={e=>setGovernate(e.target.value)}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="checkout-city">Town / City</label>
                            <input
                                type="text"
                                className="form-control"
                                id="checkout-city"
                                value={city}
                                onChange={e=>setCity(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="checkout-state">Area</label>
                            <input
                                type="text"
                                className="form-control"
                                id="checkout-state"
                                value={area}
                                onChange={e=>setArea(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="checkout-state">Address / Street</label>
                            <input
                                type="text"
                                className="form-control"
                                id="checkout-state"
                                value={street}
                                onChange={e=>setAddress(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="checkout-address-type">Address type</label>
                            <select
                                id="checkout-address-type"
                                className="form-control form-control-select2"
                                value={type}
                                onChange={e=>setAddressType(e.target.value)}
                            >
                                <option>Select address type...</option>
                                <option value="home">Home</option>
                                <option value="work">work</option>
                               
                            </select>
                        </div>
                       <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="checkout-email">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="checkout-email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={e=>setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="checkout-phone">Phone</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="checkout-phone"
                                    placeholder="Phone"
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
                            >Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
