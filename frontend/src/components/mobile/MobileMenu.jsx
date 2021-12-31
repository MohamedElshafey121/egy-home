// react
import React,{useEffect,useState} from 'react';

// third-party
import classNames from 'classnames';
import { connect,useSelector,useDispatch} from 'react-redux';
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

import {
    getSearchCategories,
} from "../../store/homePage"


function prepareCategories ( categories ) {
    const listcategory=[]
    for (const category of categories) {
        listcategory.push( { type: "link",label:category.name,url:"/shop/category"})
    }

    return listcategory;
}

const shopLinks = {
    type: "link",
    label: "Shop",
    url: "/shop/catalog"
};

const accounLogin = {
    type: "link",
    label: "Login",
    url: "/account/login"
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
    const searchCategories = useSelector( state => state.searchCategories )
    const { categories } = searchCategories;

    const mobileMenuLinks = [];

    const {
        mobileMenuState,
        closeMobileMenu,
        changeLocale,
        changeCurrency,
        userLogin:{userInfo}
    } = props;

    const dispatch = useDispatch()
    useEffect( () => {
        if ( !categories ) {
            dispatch( getSearchCategories() )
        }
    }, [dispatch, categories] );

    mobileMenuLinks.push( homeLink );
    mobileMenuLinks.push( shopLinks );
    if ( userInfo ) {
        mobileMenuLinks.push(accountlinks)
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
                        {
                            userInfo
                                ? <span onClick={closeMobileMenu} style={{fontWeight:'normal'}}>
                                    {userInfo.name}
                                </span>
                                : <Link to='/account/login' onClick={closeMobileMenu} style={{color:'#333'}}>
                                    <i className="fa fa-user" style={{margin:'0 10px'}}></i>
                                    Login
                                </Link>
                        }
                    </div>
                    <button type="button" className="mobilemenu__close" onClick={closeMobileMenu}>
                        <Cross20Svg />
                    </button>
                </div>
                <div className="mobilemenu__content">
                    <MobileLinks categories={categories} links={mobileMenuLinks} userInfo={userInfo} onItemClick={handleItemClick} />
                </div>
            </div>
        </div>
    );
};

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
