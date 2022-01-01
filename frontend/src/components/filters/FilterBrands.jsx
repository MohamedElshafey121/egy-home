// react
import React from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

// application
import { Check9x7Svg } from '../../svg';

function FilterBrands(props) {
    const { brands,selectedBrand,brandPushHandler } = props;
    

  return (
    <div className="filter-list">
      <div className="filter-list__list">
        {brands.map( ( brand ) => (
          <label className='filter-list__item'>
            <span className="filter-list__input input-check">
              <span className="input-check__body">
                <input
                  className="input-check__input"
                  type="checkbox"
                  value={brand._id}
                  checked={brand._id === selectedBrand}
                  // disabled={item.count === 0}
                  onChange={e => brandPushHandler( e, brand._id )}
                />
                <span className="input-check__box" />
                <Check9x7Svg className="input-check__icon" />
              </span>
            </span>
            <span className="filter-list__title">{brand.name}</span>
            {/* {count} */}
          </label>
        ) )}
               
      </div>
    </div>
  );
};

FilterBrands.propTypes = {
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

export default withRouter(FilterBrands)
