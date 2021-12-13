export const url = {
    home: () => "/",

    catalog: () => "/shop/catalog",

    category: (category) => `/shop/catalog/${category._id}`,
    categoryDashboard: (category) => `/dashboard/categories/${category._id}`,
    subcategoryDashboard: (category) => `/dashboard/subcategories/${category._id}`,
    brandDashboard: (brand) => `/dashboard/brands/${brand._id}`,

    product: (product) => `/shop/products/${product._id}`,

    order: (order) => `/dashboard/${order._id}`,
    orderDashboard: (order) => `/dashboard/orders/${order._id}`,

    customer: (customer) => `/dashboard/customers/${customer._id}`,
};

export function getCategoryParents(category) {
    return category.parent ? [...getCategoryParents(category.parent), category.parent] : [];
}
