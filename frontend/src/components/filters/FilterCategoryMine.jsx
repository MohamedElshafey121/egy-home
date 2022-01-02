// react
import React, { Fragment,useEffect, useState } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link,withRouter } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';

// application
import { ArrowRoundedLeft6x9Svg } from '../../svg';


function FilterCategoryMine ( props ) {
    const {
        categories,
        category,
        subCategories,
        subCategory,
        categoryPushHandler,
        subCategoryPushHandler
    } = props;
    const selectedCategory = categories.find( ( cat ) => category === cat._id );

    return (
        <div className="filter-categories">
            <ul className="filter-categories__list">
                {/* {categoriesList} */}
                {selectedCategory && (
                    <li className="filter-categories__item filter-categories__item--parent">
                        <ArrowRoundedLeft6x9Svg className="filter-categories__arrow" />
                        <Link to={`/shop/catalog`}>All Products</Link>
                    </li>
                )}

                {!category && categories.map( ( category ) => (
                    <li className="filter-categories__item filter-categories__item--child">
                        {/* <Link to={`/shop/catalog?c=${ category._id }`} >{category.name}</Link> */}
                        <Link onClick={e=>categoryPushHandler(e,category._id)} >{category.name}</Link>
                    </li>
                ) )}

                {selectedCategory && (
                    <li className="filter-categories__item filter-categories__item--parent">
                        <ArrowRoundedLeft6x9Svg className="filter-categories__arrow" />
                        <Link  onClick={e=>categoryPushHandler(e,selectedCategory._id)}>{selectedCategory.name}</Link>
                    </li>
                )}
                
                {(category &&subCategories) && subCategories.map( ( sub ) => {
                    return ( <li className={classNames( 'filter-categories__item filter-categories__item--child', {
                        'filter-categories__item--current':(subCategory &&subCategory.trim()!=='' && subCategory===sub._id)
                    })}>
                        {/* <Link  to={`/shop/catalog?c=${ selectedCategory._id }&s=${sub._id}`} >{sub.name}</Link> */}
                        <Link  onClick={e=>subCategoryPushHandler(e,sub._id)} >{sub.name}</Link>
                    </li> )
                } )}
                
            </ul>
        </div>
    );
}

FilterCategoryMine.propTypes = {
    /**
     * Filter object.
     */
    data: PropTypes.object,
};

export default withRouter(FilterCategoryMine);
