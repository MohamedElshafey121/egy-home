// react
import React,{useEffect,useState} from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

// data stubs
import theme from '../../data/theme';


function SitePageNotFound () {
    
    return (
        <div className="block">
            <Helmet>
                <title>{`404 الصفحة غير موجودة `}</title>
            </Helmet>

            <div className="container">
                <div className="not-found">
                    <div className="not-found__404">
                        خطأ! غير موجود
                    </div>

                    <div className="not-found__content">
                        <h1 className="not-found__title">الصفحة غير موجودة</h1>

                        <p className="not-found__text">
                            لا نستطيع إيجاد الصفحة المطلوبة
                            <br />
                            يمكنك أستخدام البحث
                        </p>

                        <form className="not-found__search">
                            <input type="text" className="not-found__search-input form-control" placeholder="أدخل كلمات البحث..." />
                            <button type="submit" className="not-found__search-button btn btn-primary">بحث</button>
                        </form>

                        <p className="not-found__text">
                            أو يمكنك العودة إلى الصفحة الرئيسية
                        </p>

                        <Link to="/" className="btn btn-secondary btn-sm">العودة إلى الصفحة الرئيسية</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SitePageNotFound;
