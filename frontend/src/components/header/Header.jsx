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
            <div className="site-header__logo">
                <Link to="/"><LogoSvg /></Link>
            </div>
            <div className="site-header__search">
                <Search context="header" />
            </div>
            <div className="site-header__phone">
                <div className="site-header__phone-title">
                    <FormattedMessage id="header.phoneLabel" defaultMessage="Customer Service" />
                </div>
                <div className="site-header__phone-number">
                    <FormattedMessage id="header.phone" defaultMessage="(800) 060-0730" />
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
