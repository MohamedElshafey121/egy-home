// react
import React from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// application
import AppLink from '../shared/AppLink';
import languages from '../../i18n';
import Megamenu from './Megamenu';
import Menu from './Menu';
import { ArrowRoundedDown9x6Svg } from '../../svg';

// data stubs
// import navLinks from '../../data/headerNavigation';

const navLinks= [
    {
        title: "Home",
        url: "/",
    },
    {
        title: "Shop",
        url: "/shop/catalog",
        submenu: {
            type: "menu",
            menu: [
                {
                    title: "Shop ",
                    url: "/shop/catalog",
                },
                { title: "Checkout", url: "/shop/checkout" },
                { title: "Order Success", url: "/shop/checkout/success" },
                { title: "Wishlist", url: "/shop/wishlist" },
                { title: "Compare", url: "/shop/compare" },
                { title: "Track Order", url: "/shop/track-order" },
            ],
        },
    },
    {
        title: "New Offers",
        url: "/shop/catalog",
    },
    {
        title: "Contact Us",
        url: "/site/contact-us",
    },
    {
        title: "Control Panel",
        url: "/dashboard?redirect=dash",
    },
]

const navLinks_ar= [
    {
        title: "الصفحة الرئيسية",
        url: "/",
    },
    {
        title: "المتجر",
        url: "/shop/catalog",
    },
    {
        title: "العروض",
        url: "/shop/catalog",
    },
    {
        title: "تواصل معنا",
        url: "/site/contact-us",
    },
    // {
    //     title: "لوحة التحكم",
    //     url: "/dashboard?redirect=dash",
    // },
]

function NavLinks(props) {
    const handleMouseEnter = (event) => {
        const { locale } = props;
        const { direction } = languages[locale];

        const item = event.currentTarget;
        const megamenu = item.querySelector('.nav-links__megamenu');

        if (megamenu) {
            const container = megamenu.offsetParent;
            const containerWidth = container.getBoundingClientRect().width;
            const megamenuWidth = megamenu.getBoundingClientRect().width;
            const itemOffsetLeft = item.offsetLeft;

            if (direction === 'rtl') {
                const itemPosition = containerWidth - (
                    itemOffsetLeft + item.getBoundingClientRect().width
                );

                const megamenuPosition = Math.round(
                    Math.min(itemPosition, containerWidth - megamenuWidth),
                );

                megamenu.style.left = '';
                megamenu.style.right = `${megamenuPosition}px`;
            } else {
                const megamenuPosition = Math.round(
                    Math.min(itemOffsetLeft, containerWidth - megamenuWidth),
                );

                megamenu.style.right = '';
                megamenu.style.left = `${megamenuPosition}px`;
            }
        }
    };

    const linksList = navLinks_ar.map((item, index) => {
        let arrow;
        let submenu;

        if (item.submenu) {
            arrow = <ArrowRoundedDown9x6Svg className="nav-links__arrow" />;
        }

        if (item.submenu && item.submenu.type === 'menu') {
            submenu = (
                <div className="nav-links__menu">
                    <Menu items={item.submenu.menu} />
                </div>
            );
        }

        if (item.submenu && item.submenu.type === 'megamenu') {
            submenu = (
                <div className={`nav-links__megamenu nav-links__megamenu--size--${item.submenu.menu.size}`}>
                    {/* <Megamenu menu={item.submenu.menu} /> */}
                </div>
            );
        }

        const classes = classNames('nav-links__item', {
            'nav-links__item--with-submenu': item.submenu,
        });

        return (
            <li key={index} className={classes} onMouseEnter={handleMouseEnter}>
                <AppLink to={item.url} {...item.props}>
                    <span>
                        {item.title}
                        {arrow}
                    </span>
                </AppLink>
                {submenu}
            </li>
        );
    });

    return (
        <ul className="nav-links__list">
            {linksList}
        </ul>
    );
}

NavLinks.propTypes = {
    /** current locale */
    locale: PropTypes.string,
};

const mapStateToProps = (state) => ({
    locale: state.locale,
});

export default connect(mapStateToProps)(NavLinks);
