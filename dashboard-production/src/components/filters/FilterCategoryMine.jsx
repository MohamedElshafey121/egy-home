// react
import React, { Fragment,useEffect, useState } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link,withRouter } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';

// application
import { ArrowRoundedLeft6x9Svg } from '../../svg';
import { getCategoryParents, url } from '../../services/utils';

import {
    handleGetAllCategories,
} from "../../store/category"

import {
    handleGetAllSubCategories,
}from '../../store/subCategory'



function FilterCategoryMine ( props ) {
    const { data, match } = props;
    // console.log( match.params.categorySlug );
    let categoryId=match.params.categorySlug;
    
    const allCategories = useSelector( state => state.allCategories )
    let { loading, error, categories } = allCategories;

    const allSubCategories = useSelector( state => state.allSubCategories )
    const {  SubCategories } = allSubCategories;
    

    // const [value, setValue] = useState(categoryId);
    
    if ( categoryId && categories ) {
        const found= categories.find( ( category ) => {
            if ( category._id === categoryId ) {
                return category;
            }
        } )
        
        categories=[found]
    }

    
    const dispatch=useDispatch()
    useEffect( () => {
        if ( !categories ) {
            dispatch( handleGetAllCategories() )
        }
    }, [dispatch] )
    
    //load subcategories
    useEffect( () => {
        if ( categoryId ) {
            dispatch(handleGetAllSubCategories({}, 10, '', 1,categoryId))
        }
    }, [dispatch] )
    
    
    
    // const data={items:[{name:'Moahmed1'},{name:'Moahmed3'},{name:'Moahmed1'},{name:'Moahmed1'},{name:'Moahmed1'},{name:'Moahmed1'},{name:'Moahmed1'},{name:'Moahmed1'},{name:'Moahmed1'},]}
    const categoriesList = categories &&categories.map((category) => {
        const itemClasses = classNames('filter-categories__item ', {
            'filter-categories__item--current': categoryId === category._id,
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
                {categoryId && SubCategories && SubCategories.map((child) => (
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

FilterCategoryMine.propTypes = {
    /**
     * Filter object.
     */
    data: PropTypes.object,
};

export default withRouter(FilterCategoryMine);
