import React from 'react'
import classnames from "classnames";


function WidgetHeader ( props ) {
    const { title, className } = props;
    const id='12'
    return (
        <div className={classnames( 'sa-widget-header', className )}>
            <h2 className="sa-widget-header__title">{title}</h2>
            <div className="sa-widget-header__actions">
                <div className="dropdown">
                    <button
                        type="button"
                        className="btn btn-sm btn-sa-muted d-block"
                        id={`widget-context-menu-${ id }`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        aria-label="More"
                    >
                        {/* {svg('stroyka/dots-3x13')} */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="3" height="13" fill="currentColor">
                            <path
                                d="M1.5,8C0.7,8,0,7.3,0,6.5S0.7,5,1.5,5S3,5.7,3,6.5S2.3,8,1.5,8z M1.5,3C0.7,3,0,2.3,0,1.5S0.7,0,1.5,0 S3,0.7,3,1.5S2.3,3,1.5,3z M1.5,10C2.3,10,3,10.7,3,11.5S2.3,13,1.5,13S0,12.3,0,11.5S0.7,10,1.5,10z"
                            ></path>
                        </svg>
                    </button>

                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`widget-context-menu-${ id }`}>
                        <li><a className="dropdown-item" href="#">Settings</a></li>
                        <li><a className="dropdown-item" href="#">Move</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item text-danger" href="#">Remove</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default WidgetHeader
