import React from 'react'

//third party
import PropTypes from 'prop-types'

function Price ( props ) {
    const { value } = props;
   const mr = /^(-?)([0-9]+)\.([0-9]+)$/.exec(value.toFixed(2));
    const sign = mr[1];
    const integer = mr[2]
        .split('').reverse().join('')
        .match(/.{1,3}/g).join(',')
        .split('').reverse().join('');
    const decimal = mr[3];

    return (
        <div className="sa-price">
            <span className="sa-price__integer">{sign + integer}</span>
            <span className="sa-price__decimal">.{decimal}</span>
            <span className="sa-price__symbol"> ج.م </span>
        </div>
    );
}

Price.propTypes = {
    value:PropTypes.number
}

export default Price
