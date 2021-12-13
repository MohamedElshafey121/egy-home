// react
import React, { useState } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';

// application
import { ArrowRoundedLeft7x11Svg, ArrowRoundedRight7x11Svg } from '../../svg';

function BlockHeader(props) {
    const {
        title,
        groups,
        onPrev,
        onNext,
        onGroupClick,
    } = props;
    let { arrows } = props;

    const[current,setCurrent]=useState('all')

    if (arrows) {
        arrows = (
            <div className="block-header__arrows-list">
                <button className="block-header__arrow block-header__arrow--left" type="button" onClick={onPrev}>
                    <ArrowRoundedLeft7x11Svg />
                </button>
                <button className="block-header__arrow block-header__arrow--right" type="button" onClick={onNext}>
                    <ArrowRoundedRight7x11Svg />
                </button>
            </div>
        );
    }

    let groupsList;

    if (groups.length > 0) {
        groupsList = groups.map( ( group, index ) => {
            // alert(group.name)
            const classes = classNames('block-header__group', {
                'block-header__group--active': group._id===current,
            });

            return (
                <li key={index}>
                    <button type="button" className={classes} onClick={() => { setCurrent(group._id); onGroupClick(group._id)}}>
                        {group.name}
                    </button>
                </li>
            );
        } );

        const classes = classNames('block-header__group', {
                'block-header__group--active': current==='all',
            });

        groupsList.unshift( <li key={'all'}>
            <button type="button" className={classes} onClick={() => { setCurrent( 'all' ); onGroupClick() }}>
                All
            </button>
        </li>
        );

        groupsList = (
            <ul className="block-header__groups-list">
                {groupsList}
            </ul>
        );
    }

    return (
        <div className="block-header">
            <h3 className="block-header__title">{title}</h3>
            <div className="block-header__divider" />
            {groupsList}
            {arrows}
        </div>
    );
}

BlockHeader.propTypes = {
    title: PropTypes.string,
    arrows: PropTypes.bool,
    groups: PropTypes.array,
    onNext: PropTypes.func,
    onPrev: PropTypes.func,
    onGroupClick: PropTypes.func,
};
BlockHeader.defaultProps = {
    groups: [],
    onGroupClick: () => {},
};

export default BlockHeader;
