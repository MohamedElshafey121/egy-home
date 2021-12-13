// react
import React from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function MegamenuLinks(props) {
    const { links, depth } = props;

    const linksList = links.map((link, index) => {
        let title = null;
        let subLinks = null;

        if (link.name) {
            title = <Link to={link.name}>{link.name}</Link>;
        }

        // if (link.links && link.links.length) {
        //     subLinks = <MegamenuLinks links={links} depth={depth + 1} />;
        // }

        // const classes = classNames('megamenu__item', {
        //     'megamenu__item--with-submenu': subLinks,
        // });

        return (
            // <li key={index} className={classes}>
            <li key={index}>
                {title}
                {/* {subLinks} */}
            </li>
        );
    });

    return (
        <ul className={`megamenu__links megamenu__links--level--1`}>
            {linksList}
        </ul>
    );
}

MegamenuLinks.propTypes = {
    links: PropTypes.array,
    depth: PropTypes.number,
};

MegamenuLinks.defaultProps = {
    depth: 0,
};

export default MegamenuLinks;
