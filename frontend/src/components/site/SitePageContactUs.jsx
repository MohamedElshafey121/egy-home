// react
import React,{useEffect,useState} from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';

// application
import PageHeader from '../shared/PageHeader';

// blocks
import BlockMap from '../blocks/BlockMap';

// data stubs
import theme from '../../data/theme';

function SitePageContactUs () {
    const locale = useSelector( state => state.locale )

    const message_en={
        OurAddress: "Our Address",
        email: "Email",
        PhoneNumber: "Phone Number",
        reply: "About reply",
        YourName: "Your Name",
        Subject: 'Subject',
        Message: "Message",
        SendMessage: "Send Message",
        messageHead: "Leave us a Message",
        Home: "Home",
        ContactUs:"Contact Us"
    }

    const message_ar={
        OurAddress: "معلومات الأتصال",
        email: "البريد الألكترونى",
        PhoneNumber: "خدمة العملاء",
        reply: "الرد",
        YourName: "الأسم بالكامل",
        Subject: 'العنوان ',
        Message: "الموضوع",
        SendMessage: "إرسال",
        messageHead: "أرسل بريد إلينا",
        Home: "الرئيسية",
        ContactUs:"تواصل معنا"
    }

    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )

     const breadcrumb = [
        { title: messages.Home, url: '/' },
        { title: messages.ContactUs, url: '' },
    ];

    return (
        <React.Fragment>
            <Helmet>
                <title>{`Contact Us — ${theme.name}`}</title>
            </Helmet>


            <PageHeader header="Contact Us" breadcrumb={breadcrumb} />

            <div className="block">
                <div className="container">
                    <div className="card mb-0">
                        <div className="card-body contact-us">
                            <div className="contact-us__container">
                                <div className="row">
                                    <div className="col-12 col-lg-6 pb-4 pb-lg-0">
                                        <h4 className="contact-us__header card-title">{ messages.OurAddress}</h4>

                                        <div className="contact-us__address">
                                            <p>
                                                {messages.email}: stroyka@example.com
                                                <br />
                                                {messages.PhoneNumber}: 01010-098-1072                                            </p>

                                            <p>

                                                <strong>{ messages.reply}</strong>
                                                <br />
                                                فى حالة ارسال بريد الكترونى عادة ما يتم الرد خلال يوم على الأكثر
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-12 col-lg-6">
                                        <h4 className="contact-us__header card-title">{ messages.messageHead}</h4>

                                        <form>
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="form-name">{ messages.YourName}</label>
                                                    <input type="text" id="form-name" className="form-control" placeholder={ messages.YourName} />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="form-email">{messages.email}</label>
                                                    <input
                                                        type={ messages.email}
                                                        id="form-email"
                                                        className="form-control"
                                                        placeholder="Email Address"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="form-subject">{ messages.Subject}</label>
                                                <input type="text" id="form-subject" className="form-control" placeholder={messages.Subject} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="form-message">{ messages.Message}</label>
                                                <textarea id="form-message" className="form-control" rows="4" />
                                            </div>
                                            <button type="submit" className="btn btn-primary">{messages.SendMessage}</button>
                                        </form>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default SitePageContactUs;
