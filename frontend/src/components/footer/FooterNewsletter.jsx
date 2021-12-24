// react
import React from 'react';

// application
import SocialLinks from '../shared/SocialLinks';

export default function FooterNewsletter() {
    return (
        <div className="site-footer__widget footer-newsletter">
            <h5 className="footer-newsletter__title">نشرة الاخبار</h5>
            <div className="footer-newsletter__text">
               يمكنك الاطلاع على احدث منتجاتنا من خلال اشتراكك فى نشرة الاخبار عن طريق إدخال بريدك الالكترونى فى الاسفل
            </div>

            <form action="" className="footer-newsletter__form">
                <label className="sr-only" htmlFor="footer-newsletter-address">البريد الالكترونى</label>
                <input
                    type="text"
                    className="footer-newsletter__form-input form-control"
                    id="footer-newsletter-address"
                    placeholder="البريد الالكترونى..."
                />
                <button type="submit" className="footer-newsletter__form-button btn btn-primary">إشتراك</button>
            </form>

            {/* <div className="footer-newsletter__text footer-newsletter__text--social">
                Follow us on social networks
            </div> */}

            {/* <SocialLinks className="footer-newsletter__social-links" shape="circle" /> */}
        </div>
    );
}
