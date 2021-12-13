// react
import React from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';

// application
import AppLink from '../shared/AppLink';
import { ArrowRoundedRight6x9Svg } from '../../svg';

function MenuNew ( props ) {
    const {
        layout,
        withIcons,
        items,
        onClick,
    } = props;
    // alert(items.length/5)
    // if ( items.length / 5 > 1 ) {
    //     const columns = [];
    //     for (let index = 0; index < items.length; index+=5) {
    //         columns.push([...items.slice(index,index+5)])
    //     }
        
    //     console.log(columns)
    // }

    // alert( items.length );

    const renderLink = (item, content) => {
        let link;

        if (item.url) {
            link = (
                <AppLink
                    {...item.props}
                    to={item.url}
                    onClick={() => onClick(item)}
                >
                    {content}
                </AppLink>
            );
        } else {
            link = <button type="button" onClick={() => onClick(item)}>{content}</button>;
        }

        return link;
    };

    const itemsList = items.map((item, index) => {
        let arrow;
        let submenu;
        let icon;

        if (item.submenu && item.submenu.length) {
            arrow = <ArrowRoundedRight6x9Svg className="menu__arrow" />;
        }

        if (item.submenu && item.submenu.length) {
            submenu = (
                <div className="menu__submenu">
                    <MenuNew items={item.submenu} />
                </div>
            );
        }

        if (withIcons && item.icon) {
            icon = (
                <div className="menu__icon">
                    <img src={item.icon} srcSet={item.icon_srcset} alt="" />
                </div>
            );
        }

        return (
            <li key={index}>
                {renderLink(item, (
                    <React.Fragment>
                        {icon}
                        {item.name}
                        {arrow}
                    </React.Fragment>
                ))}
                {submenu}
            </li>
        );
    });

    const classes = classNames(`menu menu--layout--${layout}`, {
        'menu--with-icons': withIcons,
    });

    return (
        <ul className={classes}>
            {itemsList}
        </ul>
    );
}

MenuNew.propTypes = {
    /** one of ['classic', 'topbar'] (default: 'classic') */
    layout: PropTypes.oneOf(['classic', 'topbar']),
    /** default: false */
    withIcons: PropTypes.bool,
    /** array of menu items */
    items: PropTypes.array,
    /** callback function that is called when the item is clicked */
    onClick: PropTypes.func,
};

MenuNew.defaultProps = {
    layout: 'classic',
    withIcons: false,
    items: [],
    onClick: () => {},
};

export default MenuNew;
