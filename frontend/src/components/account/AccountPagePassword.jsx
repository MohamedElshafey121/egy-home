// react
import React,{useState,useEffect} from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';

// data stubs
import theme from '../../data/theme';
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'


export default function AccountPagePassword () {
    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )

    return (
        <div className="card">
            <Helmet>
                <title>{`${messages.myAccount}`}</title>
            </Helmet>

            <div className="card-header">
                <h5>{messages.changePassword}</h5>
            </div>
            <div className="card-divider" />
            <div className="card-body">
                <div className="row no-gutters">
                    <div className="col-12 col-lg-7 col-xl-6">
                        <div className="form-group">
                            <label htmlFor="password-current">{ messages.currentPassword}</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password-current"
                                placeholder={messages.currentPassword}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password-new">{ messages.newPassword}</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password-new"
                                placeholder={messages.newPassword}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password-confirm">{ messages.reenterNewPassword}</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password-confirm"
                                placeholder={messages.reenterNewPassword}
                            />
                        </div>

                        <div className="form-group mt-5 mb-0">
                            <button type="button" className="btn btn-primary">{messages.save}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
