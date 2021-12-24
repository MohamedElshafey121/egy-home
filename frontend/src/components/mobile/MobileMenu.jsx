// react
import React from 'react';

// third-party
import classNames from 'classnames';
import { connect} from 'react-redux';
import { Link } from 'react-router-dom';

// application
import MobileLinks from './MobileLinks';
import { Cross20Svg } from '../../svg';
import { currencyChange } from '../../store/currency';
import { localeChange } from '../../store/locale';
import { mobileMenuClose } from '../../store/mobile-menu';

// data stubs
import currencies from '../../data/shopCurrencies';
// import mobileMenuLinks from '../../data/mobileMenu';

const shopLinks = {
    type: "link",
    label: "Shop",
    url: "/shop/catalog"
};

const accounLogin = {
    type: "link",
    label: "Login",
    url: "/auth/login"
};
    
const accountlinks = {
    type: "link",
    label: "Account",
    url: "/account/dashboard",
    children: [
        {
            type: "link",
            label: "Dashboard ",
            url: "/account/dashboard",
        },
        { type: "link", label: "Edit Profile", url: "/account/profile" },
        { type: "link", label: "Order History", url: "/account/orders" },
        { type: "link", label: "Addresses", url: "/account/addresses" },
    ],
};

const homeLink = {
    type: "link",
    label: "Home",
    url: "/"
};

function MobileMenu ( props ) {
    const mobileMenuLinks = [];
    const {
        mobileMenuState,
        closeMobileMenu,
        changeLocale,
        changeCurrency,
        userLogin:{userInfo}
    } = props;

    if ( userInfo ) {
        mobileMenuLinks.push(homeLink)
        mobileMenuLinks.push(accountlinks)
        mobileMenuLinks.push(shopLinks)
    } else {
        mobileMenuLinks.push(homeLink)
        mobileMenuLinks.push(shopLinks)
        mobileMenuLinks.push(accounLogin)
    };

    const classes = classNames('mobilemenu', {
        'mobilemenu--open': mobileMenuState.open,
    });

    const handleItemClick = (item) => {
        if (item.data) {
            if (item.data.type === 'language') {
                changeLocale(item.data.locale);
                closeMobileMenu();
            }
            if (item.data.type === 'currency') {
                const currency = currencies.find((x) => x.currency.code === item.data.code);

                if (currency) {
                    changeCurrency(currency.currency);
                    closeMobileMenu();
                }
            }
        }
        if (item.type === 'link') {
            closeMobileMenu();
        }
    };

    return (
        <div className={classes}>
            {/* eslint-disable-next-line max-len */}
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
            <div className="mobilemenu__backdrop" onClick={closeMobileMenu} />
            <div className="mobilemenu__body">
                <div className="mobilemenu__header">
                    <div className="mobilemenu__title">
                        <Link to='/' onClick={closeMobileMenu}>
                            <img src='/uploads/imgs/site/logo2_ar.png' style={{maxWidth:'60px'}}/>
                        </Link>
                    </div>
                    <button type="button" className="mobilemenu__close" onClick={closeMobileMenu}>
                        <Cross20Svg />
                    </button>
                </div>
                <div className="mobilemenu__content">
                    <MobileLinks links={mobileMenuLinks} userInfo={userInfo} onItemClick={handleItemClick} />
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    mobileMenuState: state.mobileMenu,
    userLogin:state.userLogin
});

const mapDispatchToProps = {
    closeMobileMenu: mobileMenuClose,
    changeLocale: localeChange,
    changeCurrency: currencyChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileMenu);
