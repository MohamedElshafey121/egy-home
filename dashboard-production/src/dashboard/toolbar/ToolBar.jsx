//react
import React, { useEffect } from 'react'

//components
import NotificationBox from './NotificationBox'

//third party
import { connect, useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router';

//site
import { dashboardSidebarMobileOpen, dashboardSidebarMobileClose } from './../../store/dashboard-sidebar';
import {
    logout
} from '../../store/authentication'
import {localeChange} from '../../store/locale'
import { Link } from 'react-router-dom';


function ToolBar ( props ) {
    const { history } = props;
    const userLogin = useSelector( state => state.userLogin )
    const { userInfo } = userLogin;

    const {
        dashboardSidebarState,
        dashboardSidebarMobileOpen,
        dashboardSidebarMobileClose
    } = props;

    const locale = useSelector( state => state.locale )
        

    //check for user
    useEffect( () => {
        if ( !userInfo ) {
            history.push( '/auth/login' )
        }
    }, [userInfo] );

    const dispatch = useDispatch();
    const handleLogout = ( e ) => {
        e.preventDefault();
        dispatch( logout() )
    }

    const changeLocaleHandler = ( e, newLocale ) => {
        e.preventDefault();
        dispatch(localeChange(newLocale))
    }

    const user =userInfo && (
        <div className="dropdown sa-toolbar__item">
            <button
                className="sa-toolbar-user"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                data-bs-offset="0,1"
                aria-expanded="false"
            >
                <span className="sa-toolbar-user__avatar sa-symbol sa-symbol--shape--rounded">
                    <img src="/uploads/imgs/users/user_avatar.png" size={40}width="64" height="64" alt="" />
                </span>
                <span className="sa-toolbar-user__info">
                    <span className="sa-toolbar-user__title"> {userInfo.name} </span>
                    <span className="sa-toolbar-user__subtitle">{ userInfo.email} </span>
                </span>
            </button>
            <ul className="dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
               <li><Link onClick={e => handleLogout( e )} className="dropdown-item" >Sign Out</Link></li>
            </ul>
        </div>
    );

    return (
        <div className="sa-toolbar sa-toolbar--search-hidden sa-app__toolbar">
            <div className="sa-toolbar__body">
                <div className="sa-toolbar__item">
                    {/* <button className="sa-toolbar__button" type="button" aria-label="Menu" data-sa-toggle-sidebar="" onClick={dashboardSidebarMobileOpen}> */}
                    <button className="sa-toolbar__button" type="button" aria-label="Menu" data-sa-toggle-sidebar="">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M1,11V9h18v2H1z M1,3h18v2H1V3z M15,17H1v-2h14V17z"></path>
                        </svg>
                    </button>
                </div>
                <div className="mx-auto"></div>
                <div className="sa-toolbar__item d-sm-none">
                    <button className="sa-toolbar__button" type="button" aria-label="Show search" data-sa-action="show-search">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">
                            <path
                                d="M16.243 14.828C16.243 14.828 16.047 15.308 15.701 15.654C15.34 16.015 14.828 16.242 14.828 16.242L10.321 11.736C9.247 12.522 7.933 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.933 12.522 9.247 11.736 10.321L16.243 14.828ZM6.5 2C4.015 2 2 4.015 2 6.5C2 8.985 4.015 11 6.5 11C8.985 11 11 8.985 11 6.5C11 4.015 8.985 2 6.5 2Z"
                            ></path>
                        </svg>
                    </button>
                </div>
                {/* Language Start */}
                <div className="sa-toolbar__item dropdown">
                    <button
                        className="sa-toolbar__button"
                        type="button"
                        id="dropdownMenuButton3"
                        data-bs-toggle="dropdown"
                        data-bs-reference="parent"
                        data-bs-offset="0,1"
                        aria-expanded="false"
                    >
                        {locale==='ar'?'AR':'EN'}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton3">
                        {locale==='en' &&(<li>
                            <Link
                                className="dropdown-item d-flex align-items-center"
                                onClick={e => changeLocaleHandler( e, 'ar' )}
                            >
                                <span className="ps-2">Arabic</span>
                            </Link>
                        </li>)}
                        {(locale==='ar') &&(<li>
                            <Link
                                className="dropdown-item d-flex align-items-center"
                                onClick={e => changeLocaleHandler( e, 'en' )}
                            >
                                <span className="ps-2">English</span>
                            </Link>
                        </li>)}
                    </ul>
                </div>

                {/* Language End */}
                
                {/* Notification Start */}
                {/* <div className="sa-toolbar__item dropdown">
                    <button
                        className="sa-toolbar__button"
                        type="button"
                        id="dropdownMenuButton2"
                        data-bs-toggle="dropdown"
                        data-bs-reference="parent"
                        data-bs-offset="0,1"
                        aria-expanded="false"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">
                            <path
                                d="M8,13c0,0-5.2,0-7,0c0-1-0.1-1.9,1-1.9C2,5,4,2,6,2c0-1.1,0-2,2-2c1.9,0,2,0.9,2,2c2,0,4,3,4,9c1,0,1,1,1,2C12.7,13,8,13,8,13z M6,14h4c0,1.1,0,2-2,2C6,16,6,15.1,6,14L6,14L6,14z"
                            ></path>
                        </svg>
                        <span className="sa-toolbar__button-indicator">3</span>
                    </button>

                    <NotificationBox/>
                    
                </div> */}
                {/* Notification end */}
                {user}

                </div>
            <div className="sa-toolbar__shadow"></div>
        </div>
    );
}

function mapStateToProps (state) {
    return {
        dashboardSidebarState:state.dashboardSidebar
    }
}

const mapDispatchToProps = {
    dashboardSidebarMobileOpen,
    dashboardSidebarMobileClose
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(ToolBar))
