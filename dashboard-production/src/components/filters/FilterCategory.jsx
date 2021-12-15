// react
import React, { Fragment } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// application
import { ArrowRoundedLeft6x9Svg } from '../../svg';
import { getCategoryParents, url } from '../../services/utils';

function FilterCategory(props) {
    const { data } = props;
    // const data={items:[{name:'Moahmed1'},{name:'Moahmed3'},{name:'Moahmed1'},{name:'Moahmed1'},{name:'Moahmed1'},{name:'Moahmed1'},{name:'Moahmed1'},{name:'Moahmed1'},{name:'Moahmed1'},]}
    const categoriesList = data.items.map((category) => {
        const itemClasses = classNames('filter-categories__item ', {
            'filter-categories__item--current': data.value === category.slug,
        });

        return (
            <Fragment key={category.id}>
                {getCategoryParents(category).map((parent) => (
                    <li key={parent.id} className="filter-categories__item filter-categories__item--parent">
                        <ArrowRoundedLeft6x9Svg className="filter-categories__arrow" />
                        <Link to={url.category(parent)}>{parent.name}</Link>
                    </li>
                ))}
                <li className={itemClasses}>
                    <Link to={url.category(category)}>{category.name}</Link>
                </li>
                {category.children && category.children.map((child) => (
                    <li key={child.id} className="filter-categories__item filter-categories__item--child">
                        <Link to={url.category(child)}>{child.name}</Link>
                    </li>
                ) )}
                
            </Fragment>
        );
    });

    if (data.value) {
        categoriesList.unshift(
            <li key="[shop]" className="filter-categories__item filter-categories__item--parent">
                <ArrowRoundedLeft6x9Svg className="filter-categories__arrow" />
                <Link to={url.catalog()}>All Products</Link>
            </li>,
        );
    }

    return (
        <div className="filter-categories">
            <ul className="filter-categories__list">
                {categoriesList}
            </ul>
        </div>
    );
}

FilterCategory.propTypes = {
    /**
     * Filter object.
     */
    data: PropTypes.object,
};

export default FilterCategory;
