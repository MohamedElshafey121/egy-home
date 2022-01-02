// react
import React,{useEffect,useState} from 'react';

// third-party
import { Link } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';

// application
import Megamenu from './Megamenu';
import Menu from './Menu';
import MenuNew from './MenuNew';
import { ArrowRoundedRight6x9Svg } from '../../svg';

////////////////////////
//application
import {
    handleGetAllCategories,
} from "../../store/category"

import {
    handleGetAllSubCategories,
}from '../../store/subCategory'


function getSubcategories ( categoryId, subCategories ) {
    const columns = [];
    const subs = subCategories.filter( ( subCat ) => {
        if ( subCat.category ) {
            if ( categoryId === subCat.category._id ) return subCat;
        }
    } );

  
     if ( subs.length / 5 > 1 ) {
        for (let index = 0; index < subs.length; index+=5) {
            columns.push([...subs.slice(index,index+5)])
        }
     }
     else {
         columns.push( subs );
    }

    return columns;
}

// data stubs

function DepartmentsLinksNew () {
    const allCategories = useSelector( state => state.allCategories )
    const { loading, error, categories, page: currentPage, count } = allCategories;

     const allSubCategories = useSelector( state => state.allSubCategories )
    const {  SubCategories,success:loaingSubcategoriesSuccess } = allSubCategories;

    const dispatch=useDispatch()
    useEffect( () => {
        dispatch( handleGetAllCategories({},10) )
    }, [dispatch] )

    // function getSubCategoriesHandler ( categoryId ) {
    //     dispatch(handleGetAllSubCategories({},1000, '', 1,categoryId))
    // }

    //load subcategories
    useEffect( () => {
        dispatch(handleGetAllSubCategories({},1000))
    },[])
    

    const linksList = categories &&categories.map((category, index) => {
        let arrow = null;
        let submenu = null;
        let itemClass = '';
        // let subs=SubCategories?getSubcategories(category._id,SubCategories):null
        let columns=SubCategories?getSubcategories(category._id,SubCategories):null

        if (category.subCategories.length>0) {
            arrow = <ArrowRoundedRight6x9Svg className="departments__link-arrow" />;
        }

        // if (subs &&subs.length>0 ) {
        //     itemClass = 'departments__item--menu';
        //     submenu = (
        //         <div className="departments__menu">
        //             <MenuNew items={subs} />
        //         </div>
        //     );
        // }

        if ( columns && columns.length > 0 ) {
             submenu = (
                <div className={`departments__megamenu departments__megamenu--xl`}>
                    <Megamenu menu={columns} location="department" image={category.photo} />
                </div>
            );
        }
        
        
        return (
            <li key={index} className={`departments__item ${itemClass}`}>
                {/* <Link onClick={e=>e.preventDefaut()} onMouseOver={e=>getSubCategoriesHandler(category._id)}> */}
                <Link to={`/shop/catalog?c=${category._id}`}>
                    {category.name}
                    {arrow}
                </Link>
                {category.subCategories.length>0 && submenu}
            </li>
        );
    });

    return (
        <ul className="departments__links">
            {linksList}
        </ul>
    );
}

export default DepartmentsLinksNew;
