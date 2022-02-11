// react
import React from 'react';

// third-party
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// application
import BlockHeader from '../shared/BlockHeader';

export default function BlockCategories(props) {
    const { title, layout, categories } = props;

    const categoriesList = categories.map((category, index) => {
        const classes = `block-categories__item category-card category-card--layout--${layout}`;

        const subcategories = category.subCategories && category.subCategories.map((sub, subIndex) => (
            <li key={subIndex}>
                <Link to={`/shop/catalog?s=${sub._id}`} >{sub.name}</Link>
            </li>
        ));

        return (
            <div key={index} className={classes}>
                <div className=" category-card__body">
                    <div className=" category-card__image">
                        <Link to={`/shop/catalog?c=${category._id}`}><img src={`/uploads/imgs/categories/${ category.photo }`} alt="" style={{width:'90px',height:'90px'}}/></Link>
                    </div>
                    <div className=" category-card__content">
                        <div className=" category-card__name">
                            <Link to={`/shop/catalog?c=${category._id}`}>{category.name}</Link>
                        </div>
                        <ul className="category-card__links">
                            {subcategories}
                        </ul>
                        <div className="category-card__all">
                            <Link to={`/shop/catalog?c=${category._id}`}>Show All</Link>
                        </div>
                        <div className="category-card__products">
                            {`${category.products} Products`}
                        </div>
                    </div>
                </div>
            </div>
        );
    } );
    
    if ( categories.length>0 ) {
        return (
        <div className={`block block--highlighted block-categories block-categories--layout--${layout}`}>
            <div className="container">
                <BlockHeader title={title} />

                <div className="block-categories__list">
                    {categoriesList}
                </div>
            </div>
        </div>
    );
    }

    return <></>
}

BlockCategories.propTypes = {
    title: PropTypes.string.isRequired,
    categories: PropTypes.array,
    layout: PropTypes.oneOf(['classic', 'compact']),
};

BlockCategories.defaultProps = {
    categories: [],
    layout: 'classic',
};
