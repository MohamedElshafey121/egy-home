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
import {
    Fi24Hours48Svg,
    LogoSvg
} from '../../svg';

function Header ( props ) {

    const bannerSection = (
        <div className="site-header__middle container">
            <div className="site-header__logo" >
                {/* <Link to="/"><LogoSvg /></Link> */}
                <Link to="/">
                    <img src='/uploads/imgs/site/icon.jpeg' style={{maxWidth:'150px'}} />
                </Link>
            </div>
            <div className="site-header__search">
                <Search context="header" />
            </div>
            <div className="site-header__phone">
                {/* <div className="site-header__phone-title">
                    <FormattedMessage id="header.phoneLabel_ar" defaultMessage="خدمة العملاء" />
                </div>
                <div className="site-header__phone-number"> */}
                    {/* <FormattedMessage id="header.phone_ar" defaultMessage=" 0101-098-1072" /> */}
                    {/* <Fi24Hours48Svg/>
                </div> */}
                    <Link to='/site/contact-us'>
                <div className="block-features__item">
                        <div className="block-features__icon" style={{marginLeft:'8px'}}>
                            <Fi24Hours48Svg />
                        </div>
                        <div className="block-features__content">
                            {/* <div className="block-features__title">Support 24/7</div>
                            <div className="block-features__subtitle">Call us anytime</div> */}
                            <div className="block-features__title">خدمة العملاء</div>
                            <div className="block-features__subtitle">تواصل الآن</div>
                        </div>
                    </div>
                    </Link>
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
