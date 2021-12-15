import React from 'react'
import classnames from 'classnames';
import PropType from 'prop-types';


function Card ( { title, help, children, body, className } ) {
    return (
    <div className={classnames('card', className)}>
        <div className="card-body p-5">
            {title && (
                <div className="mb-5">
                    <h2 className="mb-0 fs-exact-18">{title}</h2>
                    {help && <div className="mt-3 text-muted">{help}</div>}
                </div>
            )}
            {children}
        </div>
        {body}
    </div>
);

}


Card.PropType = {
    title: PropType.string,
    help: PropType.string,
    className: PropType.string,
    body: React.ReactNodestring,
    children: React.ReactNodestring,
}

export default Card
