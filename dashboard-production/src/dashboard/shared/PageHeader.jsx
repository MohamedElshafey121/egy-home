import React from 'react'

//third party
import { Link } from 'react-router-dom'
import { ArrowRoundedRight6x9Svg } from '../../svg';


function PageHeader (props) {
    let { title, breadcrumb,actions } = props;
    let header;
    let links;
    let breadcrumbs;

    if (title) {
        header = (
            <h1 className="h3 m-0">{title}</h1>
        );
    }

    if (breadcrumb.length > 0) {
        const lastIndex = breadcrumb.length - 1;

        links = breadcrumb.map((item, index) => {
            let link;

            if (lastIndex === index) {
                link = <li key={index} className="breadcrumb-item active" aria-current="page">{item.title}</li>;
            } else {
                link = (
                    <li key={index} className="breadcrumb-item">
                        <Link to={item.url}>{item.title}</Link>
                        <ArrowRoundedRight6x9Svg className="breadcrumb-arrow" />
                    </li>
                );
            }

            return link;
        });

        breadcrumbs = (
            <nav className="mb-2" aria-label="breadcrumb">
                <ol className="breadcrumb breadcrumb-sa-simple">
                    {links}
                </ol>
            </nav>
        );
    }

    return (
        <React.Fragment>
            <div className="py-5">
                <div className="row g-4 align-items-center">
                    <div className="col">
                        {breadcrumbs}
                        {header}
                    </div>
                    {actions && (
                        <div className="col-auto d-flex">
                            {actions}
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
}

export default PageHeader
