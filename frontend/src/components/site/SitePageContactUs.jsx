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
import { Link } from 'react-router-dom';

function SitePageContactUs () {
    const locale = useSelector( state => state.locale )

    const [emailSubject, setEmailSubject] = useState( '' )
    const[emailBody,setEmailBody]=useState('')

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
                <title>تواصل معنا </title>
                <meta name="description" content={theme.aboutUs}/>
            </Helmet>


            <PageHeader header="تواصل معنا" breadcrumb={breadcrumb} />

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
                                                {messages.email}: mgmohamed11@gmail.com
                                                <br />
                                            </p>
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
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="form-email">{messages.email}</label>
                                                    <input
                                                        type={messages.email}
                                                        disabled='true'
                                                        id="form-email"
                                                        className="form-control"
                                                        placeholder="Email Address"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="form-subject">{ messages.Subject}</label>
                                                <input
                                                    type="text"
                                                    id="form-subject"
                                                    className="form-control"
                                                    placeholder='موضوع الرسالة'
                                                    onChange={(e)=>setEmailSubject(e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="form-message">{ messages.Message}</label>
                                                <textarea
                                                    id="form-message"
                                                    className="form-control"
                                                    rows="4"
                                                    placeholder='محتوى الرسالة'
                                                    onChange={e=>setEmailBody(e.target.value)}
                                                />
                                            </div>
                                            {/* <button type="submit" className="btn btn-primary">{messages.SendMessage}</button> */}
                                            <Link to='#' className="btn btn-primary"
                                                onClick={e => {
                                                    e.preventDefault();
                                                    window.location.href=`mailto: mgmohamed11@gmail.com?subject=${emailSubject}&body=${emailBody}`;
                                                }}
                                            >
                                                {messages.SendMessage}
                                            </Link>
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
