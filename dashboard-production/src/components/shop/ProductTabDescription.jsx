// react
import React from 'react';
import PropTypes from 'prop-types'

function ProductTabDescription (props) {
    const { description } = props;
    return (
        <div className="typography" dangerouslySetInnerHTML={{__html:description}}>
        </div>
    );
}

ProductTabDescription.prototype = {
    description:PropTypes.string
}

export default ProductTabDescription;
