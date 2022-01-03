import { combineReducers } from "redux";

// reducers
// import cartReducer from './oldCart';
import compareReducer from "./compare";
import currencyReducer from "./currency";
import localeReducer from "./locale";
import styleReducer from "./style";
import mobileMenuReducer from "./mobile-menu";
import quickviewReducer from "./quickview";
import sidebarReducer from "./sidebar";
import version from "./version";
import wishlistReducer from "./wishlist";

// MY WORK START
import {
    userRegisterReducer,
    userLoginReducer,
    forgetPasswordReducer,
    resetPasswordReducer,
    confirmationMessageReducer,
} from "./authentication";

import {
    userDetailsReducer,
    userUpdateProfileReducer,
    userAddressReducer,
    userAddressDetailsReducer,
    updateAddressReducer,
    deleteAddressReducer,
    getAllUsersReducer,
    cahngeUserRoleReducer,
    cahngeUserCategoriesReducer,
} from "./user";

import { cartReducer, userCartReducer, addCartItemReducer, removeCartItemReducer } from "./cart";

//product
import {
    addProductReducer,
    allProductsReducer,
    getOneProductReducer,
    addProductSpecificationReducer,
    updateProductReducer,
    updateProductSpecificationReducer,
    deleteProductSpecificationReducer,
    getOneProductSpecificationReducer,
    topProductsReducer,
    relatedProductsReducer,
    recentProductsReducer,
} from "./product";

import { createProductReviewReducer } from "./reviews";
//order
import {
    orderCreateReducer,
    OrdersMyListReducer,
    OrdersListReducer,
    orderGetReducer,
    orderCancelReducer,
    userOrdersListReducer,
    recentOrdersReducer,
    adminUpdateOrderReducer,
} from "./order";

//category
import {
    getCategoriesReducer,
    createCategoryReducer,
    getMainCategoriesReducer,
    getOneCategoryReducer,
    updateCategoryReducer,
} from "./category";

//sub category
import {
    getSubCategories,
    createSubCategoryReducer,
    getOneSubCategoryReducer,
    updateSubcategoryReducer,
} from "./subCategory";
//home page
import {
    homePgaeCategoriesReducer,
    homePageNewArrivalProductsReducer,
    homePageTopRatedProductsReducer,
    homePgaeBrandsReducer,
    getSearchCategoriesReducer,
    suggestedSearchProductsReducer,
} from "./homePage";

//ACL
import { getAllPermissionsReducer } from "./permissions";
import {
    allRolesReducer,
    getOneRoleReducer,
    removePermissionFromRoleReducer,
    addPermissionToRoleReducer,
    createRoleReducer,
    updateRoleDescriptionReducer,
} from "./roles";

import { dashboardSidebarMobileReducer } from "./dashboard-sidebar";

import { getBrandsReducer, createBrandReducer, updateBrandReducer, getOneBrandReducer } from "./brand";

export default combineReducers({
    version: (state = version) => state,
    // cart: cartReducer,
    compare: compareReducer,
    currency: currencyReducer,
    locale: localeReducer,
    style: styleReducer,
    mobileMenu: mobileMenuReducer,
    quickview: quickviewReducer, //important and necessary
    sidebar: sidebarReducer,
    wishlist: wishlistReducer,
    // MY WORK START
    dashboardSidebar: dashboardSidebarMobileReducer,
    userRegister: userRegisterReducer,
    userLogin: userLoginReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    addAddress: userAddressReducer,
    addressDetails: userAddressDetailsReducer,
    allusers: getAllUsersReducer,
    changeUserRole: cahngeUserRoleReducer,
    changeUserCategory: cahngeUserCategoriesReducer,
    updateAddress: updateAddressReducer,
    deleteAddress: deleteAddressReducer,
    userCart: userCartReducer, //logged in user cart
    cart: cartReducer, //guest user cart
    addcartItem: addCartItemReducer,
    removeCartItem: removeCartItemReducer,
    addProduct: addProductReducer,
    allProducts: allProductsReducer,
    productDeatils: getOneProductReducer,
    topProducts: topProductsReducer,
    recentProducts: recentProductsReducer,
    createProductReview: createProductReviewReducer,
    relatedProducts: relatedProductsReducer,
    oneProductSpecification: getOneProductSpecificationReducer,
    addProductSpecification: addProductSpecificationReducer,
    updateProduct: updateProductReducer,
    updateProductSpecification: updateProductSpecificationReducer,
    deleteProductSpecification: deleteProductSpecificationReducer,
    orderCreate: orderCreateReducer,
    myOrderList: OrdersMyListReducer,
    orderList: OrdersListReducer,
    order: orderGetReducer,
    cancelOrder: orderCancelReducer,
    userOrdersList: userOrdersListReducer,
    recentOrders: recentOrdersReducer,
    adminUpdateOrder: adminUpdateOrderReducer,
    forgetPassword: forgetPasswordReducer,
    resetPassword: resetPasswordReducer,
    confirmationMessage: confirmationMessageReducer,
    allCategories: getCategoriesReducer,
    createCategory: createCategoryReducer,
    mainCategories: getMainCategoriesReducer,
    getCategory: getOneCategoryReducer,
    updateCategory: updateCategoryReducer,
    allSubCategories: getSubCategories,
    createSubCategory: createSubCategoryReducer,
    getSubcategory: getOneSubCategoryReducer,
    updateSubcategory: updateSubcategoryReducer,
    allBrands: getBrandsReducer,
    createBrand: createBrandReducer,
    getBrand: getOneBrandReducer,
    updateBrand: updateBrandReducer,
    homePageCategories: homePgaeCategoriesReducer,
    homeNewArrival: homePageNewArrivalProductsReducer,
    homeToprated: homePageTopRatedProductsReducer,
    homePageBrands: homePgaeBrandsReducer,
    searchCategories: getSearchCategoriesReducer,
    suggestedSearchProducts: suggestedSearchProductsReducer,
    allPermissions: getAllPermissionsReducer,
    allRoles: allRolesReducer,
    roleDetails: getOneRoleReducer,
    addPermissionToRole: addPermissionToRoleReducer,
    removePermissionFromRole: removePermissionFromRoleReducer,
    createRole: createRoleReducer,
    roleDescriptionUpdate: updateRoleDescriptionReducer,
});
