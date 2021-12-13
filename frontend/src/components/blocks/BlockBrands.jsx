// react
import React,{useEffect} from 'react';

// third-party
import { Link } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';

// application
import StroykaSlick from '../shared/StroykaSlick';
import {getHomePageBrands} from '../../store/homePage';


// data stubs
// import brands from '../../data/shopBrands';

const slickSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 400,
    slidesToShow: 6,
    slidesToScroll: 6,
    responsive: [
        {
            breakpoint: 1199,
            settings: {
                slidesToShow: 5,
                slidesToScroll: 5,
            },
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 4,
            },
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
            },
        },
        {
            breakpoint: 575,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
            },
        },
    ],
};

export default function BlockBrands () {
    const homePageBrands = useSelector( state => state.homePageBrands )
    const { brands } = homePageBrands;

    const dispatch = useDispatch()
    //load Brands
    useEffect( () => {
        if ( !brands ) {
            dispatch(getHomePageBrands())
        }
    }, [dispatch,brands] )
    
    const brandsList = brands &&brands.map((brand, index) => (
        <div key={index} className="block-brands__item">
            <Link to="/"><img src={`/uploads/imgs/brands/${ brand.photo }`} style={{maxHeight:'40px'}} alt="" /></Link>
        </div>
    ));

    if ( brands ) {
        return (
            <div className="block block-brands">
                <div className="container">
                    <div className="block-brands__slider">
                        <StroykaSlick {...slickSettings}>
                            {brandsList}
                        </StroykaSlick>
                    </div>
                </div>
            </div>
        );
    }

    return <></>
}
