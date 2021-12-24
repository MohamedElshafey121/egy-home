// react
import React, { Component } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


// application
import { ArrowRoundedLeft8x13Svg, ArrowRoundedRight8x13Svg } from '../../svg';

class Pagination extends Component {
    
    //i will replace 'onPageChange' With 'stepsHandler' that set the page
    setPage = (value) => {
        const { total, current, onPageChange } = this.props;

        if (value < 1 || value > total || value === current) {
            return;
        }

        if (onPageChange) {
            onPageChange(value);
        }
    };

    getPages() {
        const { siblings, current, total } = this.props;
        const pages = [];
        const min = Math.max(1, current - siblings - Math.max(0, siblings - total + current));
        const max = Math.min(total, min + siblings * 2);

        for (let i = min; i <= max; i += 1) {
            pages.push(i);
        }

        return pages;
    }

    render() {
        const { current, total,locale } = this.props;
        const firstLinkClasses = classNames('page-item', {
            disabled: current <= 1,
        });
        const lastLinkClasses = classNames('page-item', {
            disabled: current >= total,
        });

        const pages = this.getPages().map((page, index) => {
            const classes = classNames('page-item', {
                active: Number(page ) === Number(current),
            });

            return (
                <li key={index} className={classes}>
                    <button type="button" className="page-link" onClick={() => this.setPage(page)}>
                        {page}
                        {Number(page ) === Number(current) && <span className="sr-only">(current)</span>}
                    </button>
                </li>
            );
        });

        return (
            <ul className="pagination justify-content-center">
                <li className={firstLinkClasses}>
                    <button
                        type="button"
                        // className="page-link page-link--with-arrow"
                        className="page-link"
                        aria-label="Previous"
                        onClick={() => this.setPage(Number(current) - 1)}
                    >
                    {  locale==='ar'? 'السابق':'previous' }
                        {/* <ArrowRoundedLeft8x13Svg className="page-link__arrow page-link__arrow--left" aria-hidden="true" /> */}
                    </button>
                </li>
                {pages}
                <li className={lastLinkClasses}>
                    <button
                        type="button"
                        // className="page-link page-link--with-arrow"
                        className="page-link"
                        aria-label="Next"
                        onClick={() => this.setPage(Number(current) + 1)}
                    >
                        {  locale==='ar'? 'التالى':'next' }
                        {/* <ArrowRoundedRight8x13Svg className="page-link__arrow page-link__arrow--right" aria-hidden="true" /> */}
                    </button>
                </li>
            </ul>
        );
    }
}

Pagination.propTypes = {
    /**
     * the number of sibling links
     */
    siblings: PropTypes.number,
    /**
     * current page number
     */
    current: PropTypes.number,
    /**
     * total pages
     */
    total: PropTypes.number,
    /**
     * total pages
     */
    onPageChange: PropTypes.func,
};

Pagination.defaultProps = {
    siblings: 1,
    current: 1,
    total: 1,
};

const mapStaeToProps = (state) => {
    return {locale:state.locale}
}

export default connect(mapStaeToProps)(Pagination);
