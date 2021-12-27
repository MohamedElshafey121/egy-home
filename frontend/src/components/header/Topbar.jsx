// react
import React from 'react';

// third-party
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux'

// application
import Dropdown from './Dropdown';
import DropdownCurrency from './DropdownCurrency';
import DropdownLanguage from './DropdownLanguage';

function Topbar ( props ) {
    const { userLogin:{userInfo} } = props;
    const links = [
        { title: <FormattedMessage id="topbar.privacy" defaultMessage="سياسة الخصوصية" />, url: '/site/about-us' },
        { title: <FormattedMessage id="topbar.contactss" defaultMessage="تواصل معنا" />, url: '/site/contact-us' },
        { title: <FormattedMessage id="topbar.trackOrderr" defaultMessage="تتبع طلبك" />, url: '/shop/track-order' },
    ];

    let accountLinks = [
        { title: 'Dashboard', url: '/account/dashboard' },
        { title: 'Edit Profile', url: '/account/profile' },
        { title: 'Order History', url: '/account/orders' },
        { title: 'Addresses', url: '/account/addresses' },
        { title: 'Password', url: '/account/password' },
        // { title: 'Logout', url: '/account/login' },
    ];

     let accountLinks_ar = [
        { title: ' الحساب ', url: '/account/dashboard' },
        { title: 'تعديل البيانات', url: '/account/profile' },
        { title: 'قائمة الطلبات', url: '/account/orders' },
        { title: 'العناوين', url: '/account/addresses' },
        // { title: 'كلمة السر', url: '/account/password' },
    ];

    const linksList = links.map((item, index) => (
        <div key={index} className="topbar__item topbar__item--link">
            <Link className="topbar-link" to={item.url}>{item.title}</Link>
        </div>
    ));

    return (
        <div className="site-header__topbar topbar">
            <div className="topbar__container container">
                <div className="topbar__row">
                    {linksList}
                    <div className="topbar__spring" />
                    <div className="topbar__item">
                        
                        {userInfo ? (
                        //      <Dropdown
                        //     title={<FormattedMessage id="topbar.myAccount" defaultMessage="My Account" />}
                        //     items={accountLinks}
                        // />
                            <Dropdown
                            title={<FormattedMessage id="topbar.myAccount_ar" defaultMessage="الحساب" />}
                            items={accountLinks_ar}
                        />
                        ) : (
                                <React.Fragment>
                                    <div className="topbar__item topbar__item--link">
                                        <Link className="topbar-link" to='/account/login'>تسجيل الدخول</Link>
                                    </div>
                                    <div className="topbar__item topbar__item--link">
                                        <Link className="topbar-link" to='/account/signup'>إنشاء حساب</Link>
                                    </div>
                                </React.Fragment>
                        )
                    }
                       
                    </div>
                    {/* <div className="topbar__item">
                        <DropdownCurrency />
                    </div>
                    <div className="topbar__item">
                        <DropdownLanguage />
                    </div> */}
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    userLogin:state.userLogin
});


export default connect(mapStateToProps)(Topbar);
