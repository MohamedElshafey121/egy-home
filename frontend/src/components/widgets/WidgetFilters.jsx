// react
import React, { useCallback,useState,useEffect } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router';

// application
import Collapse from '../shared/Collapse';
import FilterCategory from '../filters/FilterCategory';
import FilterCategoryMine from '../filters/FilterCategoryMine';
import FilterBrands from '../filters/FilterBrands'
import FilterCheck from '../filters/FilterCheck';
import FilterColor from '../filters/FilterColor';
import FilterRadio from '../filters/FilterRadio';
import FilterRange from '../filters/FilterRange';
import FilterRatings from '../filters/FilterRatings';
import FilterPrice from '../filters/FilterPrice';
import getFilterHandler from '../../services/filters';
import { ArrowRoundedDown12x7Svg } from '../../svg';

import {
    getSearchCategories,
    getSuggestedSearchProducts
} from "../../store/homePage"

import { handleGetAllCategorySubCategories } from '../../store/subCategory'
import {getAllBrands} from '../../store/brand'

const filterComponents = {
    category: FilterCategory,
    range: FilterRange,
    check: FilterCheck,
    radio: FilterRadio,
    color: FilterColor,
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function WidgetFilters(props) {
    const {
        title,
        offcanvas,
        subCategories,
        categories,
        brands,
        category,
        subCategory,
        brand,
        rating,
        brandPushHandler,
        categoryPushHandler,
        handleResetFilters,
        subCategoryPushHandler,
        ratingPushHandler
    } = props;

    
    const classes = classNames('widget-filters widget', {
        'widget-filters--offcanvas--always': offcanvas === 'always',
        'widget-filters--offcanvas--mobile': offcanvas === 'mobile',
    });

    return (
        <div className={classes}>
            <h4 className="widget-filters__title widget__title">{title}</h4>

            <div className="widget-filters__list">
                {/* {filtersList} */}
                <div  className="widget-filters__item">
                <Collapse
                    toggleClass="filter--opened"
                    render={({ toggle, setItemRef, setContentRef }) => (
                        <div className="filter filter--opened" ref={setItemRef}>
                            <button type="button" className="filter__title" onClick={toggle}>
                                Category
                                <ArrowRoundedDown12x7Svg className="filter__arrow" />
                            </button>
                            <div className="filter__body" ref={setContentRef}>
                                <div className="filter__container">
                                    {/* <FilterCategory /> */}
                                    <FilterCategoryMine
                                        subCategories={subCategories ? subCategories : null}
                                        category={category}
                                        categories={categories ? categories : []}
                                        subCategory={subCategory}
                                        categoryPushHandler={categoryPushHandler}
                                        subCategoryPushHandler={subCategoryPushHandler}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                />
                </div>
                
                {brands&&(<div  className="widget-filters__item">
                <Collapse
                    toggleClass="filter--opened"
                    render={({ toggle, setItemRef, setContentRef }) => (
                        <div className="filter filter--opened" ref={setItemRef}>
                            <button type="button" className="filter__title" onClick={toggle}>
                                Brands
                                <ArrowRoundedDown12x7Svg className="filter__arrow" />
                            </button>
                            <div className="filter__body" ref={setContentRef}>
                                <div className="filter__container">
                                    <FilterBrands
                                        selectedBrand={brand}
                                        brands={brands}
                                        brandPushHandler={brandPushHandler}
                                        />
                                </div>
                            </div>
                        </div>
                    )}
                />
                </div> )}
                

                <div  className="widget-filters__item">
                <Collapse
                    toggleClass="filter--opened"
                    render={({ toggle, setItemRef, setContentRef }) => (
                        <div className="filter filter--opened" ref={setItemRef}>
                            <button type="button" className="filter__title" onClick={toggle}>
                                Ratings
                                <ArrowRoundedDown12x7Svg className="filter__arrow" />
                            </button>
                            <div className="filter__body" ref={setContentRef}>
                                <div className="filter__container">
                                    <FilterRatings
                    ratingPushHandler={ratingPushHandler}
                                        selectedRating={rating}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                />
                </div> 
                

                
                

            </div>

            <div className="widget-filters__actions d-flex mb-n2">
                <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleResetFilters}
                >
                    Reset
                </button>
            </div>
        </div>
    );
}

WidgetFilters.propTypes = {
    /**
     * widget title
     */
    title: PropTypes.node,
    /**
     * Category page dispatcher.
     */
    dispatch: PropTypes.func,
    /**
     * Products list filters.
     */
    filters: PropTypes.array,
    /**
     * Products list filter values.
     */
    values: PropTypes.object,
    /**
     * indicates when sidebar bar should be off canvas
     */
    offcanvas: PropTypes.oneOf(['always', 'mobile']),
};

WidgetFilters.defaultProps = {
    offcanvas: 'mobile',
};

export default WidgetFilters;
