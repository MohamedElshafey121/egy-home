// react
import React from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Pagination from '../shared/Pagination';

// application
import { Check9x7Svg } from '../../svg';
import Rating from '../shared/Rating';

function FilterRatings(props) {
    const { ratingPushHandler,selectedRating } = props;

    const itemsList = Object.keys( [...new Array( 5 )] ).reverse().map( ( el, idx ) => {
        return ( <label className='filter-list__item'>
            <span className="filter-list__input input-check">
                <span className="input-check__body">
                    <input
                        className="input-check__input"
                        type="checkbox"
                        value={Number( el ) + 1}
                        checked={( Number( el ) + 1 ) === Number( selectedRating )}
                        onChange={e => ratingPushHandler( e, Number( el ) + 1 )}
                    />
                    <span className="input-check__box" />
                    <Check9x7Svg className="input-check__icon" />
                </span>
            </span>
            <span className="filter-list__title">
                <Rating value={Number( el ) + 1} />
            </span>
        </label> )
    } );
    
   
    return (
        <div className="filter-list">
            <div className="filter-list__list">
                {itemsList}
                
            </div>
        </div>
    );
}

FilterRatings.propTypes = {
    /**
     * Filter object.
     */
    data: PropTypes.object,
    /**
     * Value.
     */
    value: PropTypes.arrayOf(PropTypes.string),
    /**
     * Change value callback.
     */
    onChangeValue: PropTypes.func,
};

export default FilterRatings;
