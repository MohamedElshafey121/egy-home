// react
import React from 'react';

//third-party
import {connect} from 'react-redux'


// application
import FooterContacts from './FooterContacts';
import FooterLinks from './FooterLinks';
import FooterNewsletter from './FooterNewsletter';
import ToTop from './ToTop';



function Footer ( props ) {
    const { userLogin: { userInfo } } = props;
    
    const informationLinks = [
        { title: 'Delivery Information', url: '' },
        { title: 'Privacy Policy', url: '' },
        { title: 'Contact Us', url: '' },
        { title: 'Returns', url: '' },
    ];

    const informationLinks_ar = [
        { title: 'تتبع طلبك', url: '/shop/track-order' },
        { title: 'سياسة الخصوصيه', url: '/site/privacy' },
        { title: 'تواصل معنا', url: '/site/contact-us' },
        { title: 'الشروط والاحكام', url: '/site/terms' },
    ];

    let accountLinks;
    if ( userInfo ) {
        accountLinks = [
        { title: 'Dashboard', url: '/account/dashboard' },
        { title: 'Edit Profile', url: '/account/profile' },
        { title: 'Order History', url: '/account/orders' },
        { title: 'Addresses', url: '/account/addresses' },
        { title: 'Password', url: '/account/password' },
    ];
    } else {
        accountLinks = [
        { title: 'Login', url: '/account/login' },
        { title: 'Sign up', url: '/account/signup' }
    ];
    }

    let accountLinks_ar;
    if ( userInfo ) {
        accountLinks_ar = [
        { title: ' الحساب ', url: '/account/dashboard' },
        { title: 'تعديل البيانات', url: '/account/profile' },
        { title: 'قائمة الطلبات', url: '/account/orders' },
        { title: 'العناوين', url: '/account/addresses' },
        // { title: 'كلمة السر', url: '/account/password' },
    ];
    } else {
        accountLinks_ar = [
        { title: 'تسجيل الدخول', url: '/account/login' },
        { title: 'التسجيل', url: '/account/signup' }
    ];
    }

    return (
        <div className="site-footer">
            <div className="container">
                <div className="site-footer__widgets">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-4">
                            <FooterContacts />
                        </div>
                        <div className="col-6 col-md-3 col-lg-2">
                            {/* <FooterLinks title="Information" items={informationLinks} /> */}
                            <FooterLinks title="حول الموقع" items={informationLinks_ar} />
                        </div>
                        <div className="col-6 col-md-3 col-lg-2">
                            <FooterLinks title="حسابى" items={accountLinks_ar} />
                        </div>
                        <div className="col-12 col-md-12 col-lg-4">
                            <FooterNewsletter />
                        </div>
                    </div>
                </div>

                
            </div>
            <ToTop />
        </div>
    );
}

const mapStateToProps = (state) => ({
    userLogin:state.userLogin
});

export default  connect(mapStateToProps)(Footer)
