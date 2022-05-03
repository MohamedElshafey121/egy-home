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

import {
    handleGetAllSubCategories,
}from '../../store/subCategory'


//data stubs
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'



function getSubcategoriesSmallMenu ( categoryId, subCategories=[] ) {
    const subs = [];
    subCategories&&subCategories.forEach( ( subCat ) => {
        if ( subCat.category ) {
            if ( categoryId === subCat.category._id ) {
                subs.push({ type: "link", label: subCat.name, url: `/shop/catalog?c=${categoryId}&s=${ subCat._id }` })
            }
        }
    } );

    return subs;
}

function prepareCategories ( categories,subCategories=null ) {
    const listcategory = []
    for (const category of categories) {
        const categoryItem = { type: "link", label: category.name, url: `/shop/catalog?c=${ category._id }` }
        const subcats = getSubcategoriesSmallMenu( category._id, subCategories );
        if ( subcats.length ) {
            categoryItem.children = subcats;
        }
        listcategory.push(  categoryItem)
    }

    return listcategory;
}

function MobileMenu ( props ) {
    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )

    const searchCategories = useSelector( state => state.searchCategories )
    const { categories } = searchCategories;

    const allSubCategories = useSelector( state => state.allSubCategories )
    const {  SubCategories } = allSubCategories;

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
        if ( !SubCategories ) {
            dispatch( handleGetAllSubCategories( {}, 1000 ) )
        }
    }, [] );
    
    useEffect( () => {
        if ( !categories ) {
            dispatch( getSearchCategories() )
        }
    }, [dispatch, categories] );

    

    const shopLinks = {
    type: "link",
    label: messages.shop,
    url: "/shop/catalog"
};

const accounLogin = {
    type: "link",
    label: messages.login,
    url: "/account/login"
};
    
const accountlinks = {
    type: "link",
    label: messages.myAccount,
    url: "/account/dashboard",
    children: [
        {
            type: "link",
            label: messages.dashboard,
            url: "/account/dashboard",
        },
        { type: "link", label: messages.editProfile, url: "/account/profile" },
        { type: "link", label: messages.orderHistory, url: "/account/orders" },
        { type: "link", label: messages.addresses, url: "/account/addresses" },
    ],
    };
    
    let categoriesLinks=null;
    if ( categories   ) {
        
        categoriesLinks = {
        type: "button",
        label: "الاقسام",
        url: "/shop/catalog",
        children: prepareCategories( categories,SubCategories )
        };
    }

const homeLink = {
    type: "link",
    label: messages.home,
    url: "/"
    };
    
    
    mobileMenuLinks.push( homeLink );
    if ( categoriesLinks ) {
        mobileMenuLinks.push(categoriesLinks)
    }
    mobileMenuLinks.push( shopLinks );
    // else {
    // }

    mobileMenuLinks.push( {
        type: "link",
        label: messages.trackOrder,
        url: "/shop/track-order"
    } );

    mobileMenuLinks.push( {
        type: "link",
        label: messages.contactUs,
        url: "/site/contact-us"
    } );

    mobileMenuLinks.push( {
        type: "link",
        label: messages.sellingPolices,
        url: "/site/terms"
    } );

    mobileMenuLinks.push( {
        type: "link",
        label: messages.privacyPolicy,
        url: "/site/privacy"
    } );

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
                                ? <span onClick={closeMobileMenu} style={{ fontWeight: 'normal' }}>
                                    {userInfo.name}
                                </span>
                                : <Link to='/account/login' onClick={closeMobileMenu} style={{ color: '#333' }}>
                                    <i className="fa fa-user" style={{ margin: '0 10px' }}></i>
                                    {messages.login}
                                </Link>
                        }
                    </div>
                    <button type="button" className="mobilemenu__close" onClick={closeMobileMenu}>
                        <Cross20Svg />
                    </button>
                </div>
                <div className="mobilemenu__content">
                    <MobileLinks
                        categories={categories}
                        links={mobileMenuLinks}
                        userInfo={userInfo}
                        onItemClick={handleItemClick}
                    />
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
