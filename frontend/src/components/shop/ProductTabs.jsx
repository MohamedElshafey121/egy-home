// react
import React, { Component } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';

// application
import ProductTabDescription from './ProductTabDescription';
import ProductTabSpecification from './ProductTabSpecification';
import ProductTabReviews from './ProductTabReviews';



class ProductTabs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentTab: 'description',
        };
    }

    setTab = (newTab) => {
        this.setState(() => ({ currentTab: newTab }));
    };

    render() {
        const { currentTab } = this.state;
        const { withSidebar,description,productId ,reviews} = this.props;
        const classes = classNames('product-tabs', {
            'product-tabs--layout--sidebar': withSidebar,
        });

        const tabs = [
            { key: 'description', title: 'الوصف', content: <ProductTabDescription description={description} /> },
            { key: 'reviews', title: 'التقييمات', content: <ProductTabReviews reviews={reviews}  productId={productId} /> },
            // { key: 'specification', title: 'Specification', content: <ProductTabSpecification /> },
        ];

        const tabsButtons = tabs.map((tab) => {
            const classes = classNames('product-tabs__item', {
                'product-tabs__item--active': currentTab === tab.key,
            });

            return <button key={tab.key} type="button" onClick={() => this.setTab(tab.key)} className={classes}>{tab.title}</button>;
        });

        const tabsContent = tabs.map((tab) => {
            const classes = classNames('product-tabs__pane', {
                'product-tabs__pane--active': currentTab === tab.key,
            });

            return <div key={tab.key} className={classes}>{tab.content}</div>;
        });

        return (
            <div className={classes}>
                <div className="product-tabs__list">
                    {tabsButtons}
                </div>
                <div className="product-tabs__content">
                    {tabsContent}
                </div>
            </div>
        );
    }
}

ProductTabs.propTypes = {
    withSidebar: PropTypes.bool,
    description: PropTypes.string,
    productId:PropTypes.string
};

ProductTabs.defaultProps = {
    withSidebar: false,
};

export default ProductTabs;
