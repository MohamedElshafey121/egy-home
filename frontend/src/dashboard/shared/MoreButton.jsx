import React from 'react'
import {Link} from 'react-router-dom'

import propTypes from 'prop-types'
import { url } from '../../services/utils';

function MoreButton ( { id, orderId, categoryId,subcategoryId ,brandId,customerId} ) {
    let links;
    ( orderId ) && ( links = (
        <>
            <li><Link className="dropdown-item" to={url.orderDashboard( { _id: orderId } )}> Edit </Link></li>
            <li><Link className="dropdown-item" to={url.orderDashboard( { _id: orderId } )}> View </Link></li>
            <li><Link className="dropdown-item" to={`/dashboard/orders-invoice/${ orderId }`}>invoice</Link></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item text-danger" href="#">Delete</a></li>
        </>
    ) );

    ( categoryId ) && ( links = (
        <>
            <li><Link className="dropdown-item" to={url.categoryDashboard({_id:categoryId})}>Edit</Link></li>
            <li><Link className="dropdown-item" to={url.categoryDashboard({_id:categoryId})}>View</Link></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item text-danger" href="#">Delete</a></li>
        </>
    ) );

    ( subcategoryId ) && ( links = (
        <>
            <li><Link className="dropdown-item" to={url.subcategoryDashboard( { _id: subcategoryId } )}>Edit</Link></li>
            <li><Link className="dropdown-item" to={url.subcategoryDashboard( { _id: subcategoryId } )}>View</Link></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item text-danger" href="#">Delete</a></li>
        </>
    ) );

    ( brandId ) && ( links = (
        <>
            <li><Link className="dropdown-item" to={url.brandDashboard( { _id: brandId } )}>Edit</Link></li>
            <li><Link className="dropdown-item" to={url.brandDashboard( { _id: brandId } )}>View</Link></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item text-danger" href="#">Delete</a></li>
        </>
    ) );

    ( customerId ) && ( links = (
        <>
            <li><Link className="dropdown-item" to={url.customer( { _id: customerId } )}>Edit</Link></li>
            <li><Link className="dropdown-item" to={url.customer( { _id: customerId } )}>View</Link></li>
            {/* <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item text-danger" href="#">Delete</a></li> */}
        </>
    ) );
     
    return (
        <div className="dropdown">
            <button
                className="btn btn-sa-muted btn-sm"
                type="button"
                id={id}
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label="More"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="3" height="13" fill="currentColor">
                    <path
                        d="M1.5,8C0.7,8,0,7.3,0,6.5S0.7,5,1.5,5S3,5.7,3,6.5S2.3,8,1.5,8z M1.5,3C0.7,3,0,2.3,0,1.5S0.7,0,1.5,0 S3,0.7,3,1.5S2.3,3,1.5,3z M1.5,10C2.3,10,3,10.7,3,11.5S2.3,13,1.5,13S0,12.3,0,11.5S0.7,10,1.5,10z"
                    ></path>
                </svg>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={id}>
                {links}
                {/* <li><a className="dropdown-item" href="#">Edit</a></li>
                <li><a className="dropdown-item" href="#">Duplicate</a></li>
                <li><a className="dropdown-item" href="#">Add tag</a></li>
                <li><a className="dropdown-item" href="#">Remove tag</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item text-danger" href="#">Delete</a></li> */}
            </ul>
        </div>
    );
}

MoreButton.propTypes = {
    id: propTypes.string,
    orderId:propTypes.string,
    categoryId: propTypes.string,
    subcategoryId:propTypes.string,
    brandId:propTypes.string,
    customerId:propTypes.string,
}

export default MoreButton