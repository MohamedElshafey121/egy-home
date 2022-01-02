// react
import React from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';

function FilterPrice(props) {
    const { data, value, onChangeValue } = props;

    const itemsList = (
        <React.Fragment>
            <label
                // key={item.slug}
                className="filter-list__item"
            >
                <span className="filter-list__input input-radio">
                    <span className="input-radio__body">
                        <input
                            className="input-radio__input"
                            type="radio"
                            name="price"
                            value='all'
                            checked
                            // onChange={handleChange}
                        />
                        <span className="input-radio__circle" />
                    </span>
                </span>
                <span className="filter-list__title">All</span>
            </label>
            
            <label
                // key={item.slug}
                className="filter-list__item"
            >
                <span className="filter-list__input input-radio">
                    <span className="input-radio__body">
                        <input
                            className="input-radio__input"
                            type="radio"
                            name="price"
                            value='0-500'
                            // checked={value === item.slug}
                            // onChange={handleChange}
                        />
                        <span className="input-radio__circle" />
                    </span>
                </span>
                <span className="filter-list__title">0-500</span>
            </label>
            <label
                // key={item.slug}
                className="filter-list__item"
            >
                <span className="filter-list__input input-radio">
                    <span className="input-radio__body">
                        <input
                            className="input-radio__input"
                            type="radio"
                            name="price"
                            value='500-1000'
                            // checked={value === item.slug}
                            // onChange={handleChange}
                        />
                        <span className="input-radio__circle" />
                    </span>
                </span>
                <span className="filter-list__title">500-1000</span>
            </label>
            <label
                // key={item.slug}
                className="filter-list__item"
            >
                <span className="filter-list__input input-radio">
                    <span className="input-radio__body">
                        <input
                            className="input-radio__input"
                            type="radio"
                            name="price"
                            value='1000'
                            // checked={value === item.slug}
                            // onChange={handleChange}
                        />
                        <span className="input-radio__circle" />
                    </span>
                </span>
                <span className="filter-list__title">1000 more than</span>
            </label>
            
        </React.Fragment>
    )
    
    return (
        <div className="filter-list">
            <div className="filter-list__list">
                {itemsList}
            </div>
        </div>
    );
}

FilterPrice.propTypes = {
    /**
     * Filter object.
     */
    data: PropTypes.object,
    /**
     * Value.
     */
    value: PropTypes.string,
    /**
     * Change value callback.
     */
    onChangeValue: PropTypes.func,
};

export default FilterPrice;
