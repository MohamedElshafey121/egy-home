//react
import React,{useEffect,useState} from 'react'

//third party
import {useLocation} from 'react-router-dom'

function useQuery() {
  // return new URLSearchParams(location.search)
  return new URLSearchParams(useLocation().search);
}
function DashboardLayout ( props ) {
    const query = useQuery();
    const {
        history
    } = props;

    const [loadingDashboard, setLoadingDashboard] = useState( true );

    useEffect( () => {
        setTimeout(() => {
            if ( loadingDashboard ) {
                setLoadingDashboard(false)
            }
        }, 300);
    }, [] )

    useEffect( () => {
        if ( query.get( 'redirect' ) ) {
            history.push('/dashboard')
            window.location.reload(); 
        }
        window.location.reload(); 
    }, [] );
    
    return (
        <></>
    );
}


export default DashboardLayout
