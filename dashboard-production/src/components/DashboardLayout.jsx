//style
import 'simplebar'; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import 'simplebar/dist/simplebar.css';
import './../css/bootstrap/css/bootstrap.ltr.css'
import '../css/style.ltr.css'
// import 'react-quill/dist/quill.snow.css';
// import * as rtlBootstrap from './../css/bootstrap/css/bootstrap.ltr.css'


//react
import React,{useEffect} from 'react'

//third party
import { Helmet } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import classNames from 'classnames';
import { connect,useDispatch } from 'react-redux';
import {Switch,Route,Redirect,useLocation} from 'react-router-dom'


//data-stub
import theme from '../data/theme';

//utils
import './../dashboard/utils/containerQry'
import effectSidebar from './../dashboard/utils/sidebar'

//components
import SideBar from './../dashboard/shared/SideBar'
import ToolBar from '../dashboard/toolbar/ToolBar';
import Footer from '../dashboard/shared/Footer';

//pages
import Home from '../dashboard/home/Home'
import ProductListCatalog from '../dashboard/catalog/ProductListCatalog'
import ProductAdd from '../dashboard/catalog/ProductAdd'
import ProductEdit from '../dashboard/catalog/ProductEdit'
import CategoryAdd from '../dashboard/catalog/CategoryAdd'
import CategoryEdit from '../dashboard/catalog/CategoryEdit'
import CategoriesList from '../dashboard/catalog/CategoriesList'
import SubCategoryAdd from '../dashboard/catalog/SubCategoryAdd'
import SubCategoryEdit from '../dashboard/catalog/SubCategoryEdit'
import SubCategoriesList from '../dashboard/catalog/SubCategoriesList'
import BrandsList from '../dashboard/catalog/BrandsList'
import BrandAdd from '../dashboard/catalog/BrandAdd'
import BrandEdit from '../dashboard/catalog/BrandEdit'
import CustomerData from '../dashboard/customer/CustomerData'
import CustomerList from '../dashboard/customer/CustomerList'
import OrderDetails from '../dashboard/Order/OrderDtetails'
import OrderInvoice from '../dashboard/Order/OrderInvoice'
import OrderList from '../dashboard/Order/OrderList'
import RoleList from '../dashboard/ACL/RoleList'
import PermissionList from '../dashboard/ACL/PermissionList'

//application
import {changeStyle} from '../store/style'


function useQuery() {
  // return new URLSearchParams(location.search)
  return new URLSearchParams(useLocation().search);
}
function DashboardLayout ( props ) {
    const query = useQuery();
    // query.get('redirect')
    const {
        match,
        dashboardSidebarMobileState,
        style: { site },
        setFileSite,
        history
    } = props;

    useEffect( () => {
        if ( query.get( 'redirect' ) ) {
            history.push('/dashboard')
            window.location.reload(); 
        }
    }, [] );
    // const dispatch=useDispatch()
    //  useEffect( () => {
    //     // if ( site ) {
    //         dispatch( changeStyle( false ) )
    //         setFileSite(false)
    //     // }
    //     // else {
    //         // setFileSite(false)
    //     // }
    // },[])

  const breadcrumb = [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'User Account', url: '' },
    ];

    const classes = classNames( "sa-app sa-app--mobile-sidebar-hidden sa-app--toolbar-fixed sa-app--desktop-sidebar-show")
    // , {
    //     'sa-app--desktop-sidebar-shown':dashboardSidebarState.open,
    //     'sa-app--desktop-sidebar-hidden':!dashboardSidebarState.open,
    // })
    // const classes = classNames( "sa-app  sa-app--toolbar-fixed sa-app--desktop-sidebar-shown", {
    //     "sa-app--mobile-sidebar-hidden": !dashboardSidebarMobileState.open,
    //     "sa-app--mobile-sidebar-shown": dashboardSidebarMobileState.open,
    // } );

  
    useEffect( () => {
    //   alert(match.path)
        window.stroyka.containerQuery();
      effectSidebar();
  },[])
  
    return (
        <React.Fragment>
            <Helmet>
                <title>{theme.name} - dashboard</title>
                <meta name="description" content={theme.fullName} />
            </Helmet>
            <ToastContainer autoClose={5000} hideProgressBar />

            {/* <!-- sa-app --> */}
            <div className={classes}>
                <SideBar />
                <div className="sa-app__content">
                    <ToolBar />

                    {/* <Home /> */}
                    <Switch>
                        <Route exact path={`${ match.path }`} component={Home} />
                        

                        {/* Products (catalog) */}
                        <Route
                            exact
                            path={`${ match.path }/products-list`}
                            render={( props ) => ( <ProductListCatalog {...props} /> )}
                        />
                        <Route exact path={`${ match.path }/products-add`} component={ProductAdd} />
                        <Route exact path={`${ match.path }/products/:id`} component={ProductEdit} />
                        
                        {/* Categories (catalog)*/}
                        <Route exact path={`${ match.path }/categories-add`} component={CategoryAdd} />
                        <Route exact path={`${ match.path }/categories/:id`} component={CategoryEdit} />
                        <Route exact path={`${ match.path }/categories`} component={CategoriesList} />

                        {/* Sub Categories (catalog) */}
                        <Route exact path={`${ match.path }/subcategories-add`} component={SubCategoryAdd} />
                        <Route exact path={`${ match.path }/subcategories/:id`} component={SubCategoryEdit} />
                        <Route exact path={`${ match.path }/subcategories`} component={SubCategoriesList} />

                        {/* Brands (catalog)*/}
                        <Route exact path={`${ match.path }/brand-add`} component={BrandAdd} />
                        <Route exact path={`${ match.path }/brands/:id`} component={BrandEdit} />
                        <Route exact path={`${ match.path }/brands`} component={BrandsList} />

                        {/* Customer */}
                        <Route exact path={`${ match.path }/customers/:id`} component={CustomerData} />
                        <Route exact path={`${ match.path }/customers-list`} component={CustomerList} />

                        {/* Order */}
                        <Route exact path={`${ match.path }/orders/:id`} component={OrderDetails} />
                        <Route exact path={`${ match.path }/orders-invoice/:id`} component={OrderInvoice} />
                        <Route exact path={`${ match.path }/orders-list`} component={OrderList} />

                        {/* Roles */}
                        <Route exact path={`${ match.path }/roles-list`} component={RoleList} />
                        <Route exact path={`${ match.path }/permissions-list`} component={PermissionList} />
                        
                        
                    </Switch>
                    
                    <Footer />
                </div>
           
            </div>
            {/* <!-- sa-app / end --> */}

        </React.Fragment>
    );
}

function mapStateToProps (state) {
    return {
        dashboardSidebarMobileState:state.dashboardSidebar
    }
}


export default connect(mapStateToProps)(DashboardLayout)
