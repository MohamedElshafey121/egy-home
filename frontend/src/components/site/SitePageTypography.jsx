// react
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// third-party
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

// application
import PageHeader from '../shared/PageHeader';

// data stubs
import theme from '../../data/theme';
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'
import privacyInfo from '../../data/privacyInfo';

function SitePageTypography () {
     const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )


    const breadcrumb = [
        { title: messages.home, url: '' },
        { title: messages.privacyPolicy, url: '/site/privacy' },
    ];

    return (
        <React.Fragment>
            <Helmet>
                <title>{`Typography — ${theme.name}`}</title>
            </Helmet>

            <PageHeader breadcrumb={breadcrumb} />

            <div className="block">
                <div className="container">
                    <div className="document">
                        {/* INTRODUCTION */}
                        <div className="document__header">
                            <h1 className="document__title">{ privacyInfo.intro_title}</h1>
                        </div>
                        <div className="document__content typography">
                            <p>
                              {privacyInfo.intro}.
                            </p>

                            {/* PERSONAL INFO */}

                            <h2>{privacyInfo.personalinfoTitle}</h2>

                            <ol>
                                {privacyInfo.personalInfoList.map( ( inf ) => (
                                    <li>{ inf}</li>
                                ))}
                            </ol>

                            {/* BUY POLITICS */}
                            <h2>{privacyInfo.buy_politics_title}</h2>
                            <ul>
                                {privacyInfo.buy_politics_list.map( ( poli ) => (
                                    <li>{ poli}</li>
                                ))}
                            </ul>

                            {/* PAYMENT WAYS */}
                            <h2>{privacyInfo.paymentWay }</h2>
                            <p>
                                <strong>{privacyInfo.paymentInfo.slice( 0, 18 )} :</strong>
                                {privacyInfo.paymentInfo.slice(19)}
                            </p>

                            {/* COUPON  */}

                            <h2>{privacyInfo.coupon}</h2>
                            <p>
                              {privacyInfo.coupon_intro}
                            </p>
                            <ul>
                                {privacyInfo.coupon_list.map( ( el ) => (
                                    <li>{ el}</li>
                                ))}
                            </ul>

                            {/* USAGE INFO */}
                            <h2>{privacyInfo.usageInfo}</h2>
                            <ul>
                                {privacyInfo.usageInfo_list.map( ( info ) => (
                                    <li>{ info}</li>
                                ))}
                            </ul>

                            {/* PRODUCT RETURN */}
                            <h2>{privacyInfo.productReturnPrivacy_title}</h2>
                            <ul>
                                {privacyInfo.productReturnPrivacy_list.map( ( ret ) => (
                                    <li>{ ret}</li>
                                ))}
                            </ul>

                            {/* REPLACEMENT */}
                            <h4>{privacyInfo.replacement_start}</h4>
                            <p>{privacyInfo.replacement_intro}</p>
                            <ul>
                                {privacyInfo.replacement_list.map( ( el ) => (
                                    <li>{ el}</li>
                                ))}
                            </ul>

                            <h4>{privacyInfo.termsConditionsAggree}</h4>
                            <p>{ privacyInfo.termsConditionsAggree_intro}</p>

                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default SitePageTypography;
