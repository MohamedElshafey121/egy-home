// react
import React,{useEffect,useState} from 'react';

// third-party
import { Link } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';

// application
import Megamenu from './Megamenu';
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

function getSubcategoriesSmallMenu ( categoryId, subCategories ) {
    const subs = subCategories.filter( ( subCat ) => {
        if ( subCat.category ) {
            if ( categoryId === subCat.category._id ) return subCat;
        }
    } ).slice(0,10);

    return subs;
}

// data stubs

function DepartmentsLinksNew () {
    const allCategories = useSelector( state => state.allCategories )
    const { categories } = allCategories;

    const allSubCategories = useSelector( state => state.allSubCategories )
    const {  SubCategories } = allSubCategories;

    const dispatch=useDispatch()
    useEffect( () => {
        dispatch( handleGetAllCategories({},10) )
    }, [dispatch] )

    //load subcategories
    useEffect( () => {
        if ( !SubCategories ) {
            dispatch(handleGetAllSubCategories({},10))
        }
    },[])
    

    const linksList = categories && categories.map( ( category, index ) => {
        if ( index < 13 ) {
            
        let arrow = null;
        let submenu = null;
        let itemClass = '';
        // links for large menu with photo
        // let columns = SubCategories ? getSubcategories( category._id, SubCategories ) : null

        //links for small menu
        let smallMenuLinks = SubCategories ? getSubcategoriesSmallMenu( category._id, SubCategories ) : null;

        if (category.subCategories.length>0) {
            arrow = <ArrowRoundedRight6x9Svg className="departments__link-arrow" />;
        }


        // This part is for small menu
          if ( smallMenuLinks && smallMenuLinks.length > 0 ) {
               itemClass = 'departments__item--menu';
            submenu = (
                <div className="departments__menu">
                    <MenuNew items={smallMenuLinks} />
                </div>
            );
        };

        // this part is for large menu with photo
        // if ( columns && columns.length > 0 ) {
        //      submenu = (
        //         <div className={`departments__megamenu departments__megamenu--xl`}>
        //             <Megamenu menu={columns} location="department" image={category.photo} />
        //         </div>
        //     );
        // }
        
        
        return (
            <li key={index} className={`departments__item ${itemClass}`}>
                <Link to={`/shop/catalog?c=${category._id}`}>
                    {category.name}
                    {arrow}
                </Link>
                {category.subCategories.length>0 && submenu}
            </li>
        );
    
        }
    });

    return (
        <ul className="departments__links">
            {linksList}
        </ul>
    );
}

export default DepartmentsLinksNew;
