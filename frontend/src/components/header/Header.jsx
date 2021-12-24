// react
import React from 'react';

// third-party
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

// application
import NavPanel from './NavPanel';
import Search from './Search';
import Topbar from './Topbar';
import { LogoSvg } from '../../svg';

function Header ( props ) {

    const bannerSection = (
        <div className="site-header__middle container">
            <div className="site-header__logo" >
                {/* <Link to="/"><LogoSvg /></Link> */}
                <Link to="/">
                    <img src='/uploads/imgs/site/logo2_ar.png' style={{maxWidth:'150px'}} />
                </Link>
            </div>
            <div className="site-header__search">
                <Search context="header" />
            </div>
            <div className="site-header__phone">
                <div className="site-header__phone-title">
                    <FormattedMessage id="header.phoneLabel_ar" defaultMessage="خدمة العملاء" />
                </div>
                <div className="site-header__phone-number">
                    <FormattedMessage id="header.phone_ar" defaultMessage=" 0111-144-4013" />
                </div>
            </div>
        </div>
    );


    return (
        <div className="site-header">
            <Topbar />
            {bannerSection}
            <div className="site-header__nav-panel">
                <NavPanel />
            </div>
        </div>
    );
}

export default Header;
