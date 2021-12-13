export default [
    {
        type: "link",
        label: "Home",
        url: "/",
    },

    {
        type: "link",
        label: "Categories",
        url: "",
        children: [
            {
                type: "link",
                label: "Power Tools",
                url: "",
                children: [
                    { type: "link", label: "Engravers", url: "" },
                    { type: "link", label: "Wrenches", url: "" },
                    { type: "link", label: "Wall Chaser", url: "" },
                    { type: "link", label: "Pneumatic Tools", url: "" },
                ],
            },
            {
                type: "link",
                label: "Machine Tools",
                url: "",
                children: [
                    { type: "link", label: "Thread Cutting", url: "" },
                    { type: "link", label: "Chip Blowers", url: "" },
                    { type: "link", label: "Sharpening Machines", url: "" },
                    { type: "link", label: "Pipe Cutters", url: "" },
                    { type: "link", label: "Slotting machines", url: "" },
                    { type: "link", label: "Lathes", url: "" },
                ],
            },
        ],
    },

    {
        type: "link",
        label: "Shop",
        url: "/shop/catalog",
        children: [
            {
                type: "link",
                label: "Shop ",
                url: "/shop/catalog",
            },
            { type: "link", label: "Checkout", url: "/shop/checkout" },
            { type: "link", label: "Order Success", url: "/shop/checkout/success" },
            { type: "link", label: "Wishlist", url: "/shop/wishlist" },
            { type: "link", label: "Compare", url: "/shop/compare" },
            { type: "link", label: "Track Order", url: "/shop/track-order" },
        ],
    },

    {
        type: "link",
        label: "Account",
        url: "/account",
        children: [
            { type: "link", label: "Login", url: "/account/login" },
            { type: "link", label: "Dashboard", url: "/account/dashboard" },
            { type: "link", label: "Edit Profile", url: "/account/profile" },
            { type: "link", label: "Order History", url: "/account/orders" },
            { type: "link", label: "Order Details", url: "/account/orders/5" },
            { type: "link", label: "Address Book", url: "/account/addresses" },
            { type: "link", label: "Edit Address", url: "/account/addresses/5" },
            { type: "link", label: "Change Password", url: "/account/password" },
        ],
    },

    {
        type: "link",
        label: "Blog",
        url: "/blog/category-classic",
        children: [
            { type: "link", label: "Blog Classic", url: "/blog/category-classic" },
            { type: "link", label: "Blog Grid", url: "/blog/category-grid" },
            { type: "link", label: "Blog List", url: "/blog/category-list" },
            { type: "link", label: "Blog Left Sidebar", url: "/blog/category-left-sidebar" },
            { type: "link", label: "Post Page", url: "/blog/post-classic" },
            { type: "link", label: "Post Without Sidebar", url: "/blog/post-full" },
        ],
    },

    {
        type: "link",
        label: "Pages",
        url: "/site/about-us",
        children: [
            { type: "link", label: "About Us", url: "/site/about-us" },
            { type: "link", label: "Contact Us", url: "/site/contact-us" },
            { type: "link", label: "Contact Us Alt", url: "/site/contact-us-alt" },
            { type: "link", label: "404", url: "/site/not-found" },
            { type: "link", label: "Terms And Conditions", url: "/site/terms" },
            { type: "link", label: "FAQ", url: "/site/faq" },
            { type: "link", label: "Components", url: "/site/components" },
            { type: "link", label: "Typography", url: "/site/typography" },
        ],
    },

    {
        type: "button",
        label: "Currency",
        children: [
            { type: "button", label: "€ Euro", data: { type: "currency", code: "EUR" } },
            { type: "button", label: "£ Pound Sterling", data: { type: "currency", code: "GBP" } },
            { type: "button", label: "$ US Dollar", data: { type: "currency", code: "USD" } },
            { type: "button", label: "₽ Russian Ruble", data: { type: "currency", code: "RUB" } },
        ],
    },

    {
        type: "button",
        label: "Language",
        children: [
            { type: "button", label: "English", data: { type: "language", locale: "en" } },
            { type: "button", label: "Russian", data: { type: "language", locale: "ru" } },
        ],
    },
];
