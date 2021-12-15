import React,{useEffect,useState} from 'react'

//data-stub
import theme from '../data/theme';



function AuthLayout ( props ) {
    const {  history } = props;
    const [loadingDashboard, setLoadingDashboard] = useState( true );

    useEffect( () => {
        setTimeout(() => {
            if ( loadingDashboard ) {
                setLoadingDashboard( false )
            }
        }, 300);
    }, [] )

    useEffect( () => {
        window.location.reload();
    }, [] );

    return(<></>)
    
};



export default AuthLayout
