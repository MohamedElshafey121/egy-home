export default [
    {
        title: "Home",
        url: "/",
    },
    // {
    //     title: "Megamenu",
    //     url: "",
    //     submenu: {
    //         type: "megamenu",
    //         menu: {
    //             size: "nl",
    //             columns: [
    //                 {
    //                     size: 6,
    //                     links: [
    //                         {
    //                             title: "Power Tools",
    //                             url: "",
    //                             links: [
    //                                 { title: "Engravers", url: "" },
    //                                 { title: "Wrenches", url: "" },
    //                                 { title: "Wall Chaser", url: "" },
    //                                 { title: "Pneumatic Tools", url: "" },
    //                             ],
    //                         },
    //                         {
    //                             title: "Machine Tools",
    //                             url: "",
    //                             links: [
    //                                 { title: "Thread Cutting", url: "" },
    //                                 { title: "Chip Blowers", url: "" },
    //                                 { title: "Sharpening Machines", url: "" },
    //                                 { title: "Pipe Cutters", url: "" },
    //                                 { title: "Slotting machines", url: "" },
    //                                 { title: "Lathes", url: "" },
    //                             ],
    //                         },
    //                     ],
    //                 },
    //                 {
    //                     size: 6,
    //                     links: [
    //                         {
    //                             title: "Hand Tools",
    //                             url: "",
    //                             links: [
    //                                 { title: "Screwdrivers", url: "" },
    //                                 { title: "Handsaws", url: "" },
    //                                 { title: "Knives", url: "" },
    //                                 { title: "Axes", url: "" },
    //                                 { title: "Multitools", url: "" },
    //                                 { title: "Paint Tools", url: "" },
    //                             ],
    //                         },
    //                         {
    //                             title: "Garden Equipment",
    //                             url: "",
    //                             links: [
    //                                 { title: "Motor Pumps", url: "" },
    //                                 { title: "Chainsaws", url: "" },
    //                                 { title: "Electric Saws", url: "" },
    //                                 { title: "Brush Cutters", url: "" },
    //                             ],
    //                         },
    //                     ],
    //                 },
    //             ],
    //         },
    //     },
    // },
    {
        title: "Shop",
        url: "/shop/catalog",
        submenu: {
            type: "menu",
            menu: [
                {
                    title: "Shop ",
                    url: "/shop/catalog",
                },
                { title: "Checkout", url: "/shop/checkout" },
                { title: "Order Success", url: "/shop/checkout/success" },
                { title: "Wishlist", url: "/shop/wishlist" },
                { title: "Compare", url: "/shop/compare" },
                { title: "Track Order", url: "/shop/track-order" },
            ],
        },
    },
    {
        title: "New Offers",
        url: "/shop/catalog",
    },
    {
        title: "About Us",
        url: "/site/about-us",
    },
    {
        title: "Contact Us",
        url: "/site/contact-us",
    },
    // {
    //     title: "Blog",
    //     url: "/blog/category-classic",
    //     submenu: {
    //         type: "menu",
    //         menu: [
    //             { title: "Blog Classic", url: "/blog/category-classic" },
    //             { title: "Blog Grid", url: "/blog/category-grid" },
    //             { title: "Blog List", url: "/blog/category-list" },
    //             { title: "Blog Left Sidebar", url: "/blog/category-left-sidebar" },
    //             { title: "Post Page", url: "/blog/post-classic" },
    //             { title: "Post Without Sidebar", url: "/blog/post-full" },
    //         ],
    //     },
    // },
    // {
    //     title: "Pages",
    //     url: "/site/about-us",
    //     submenu: {
    //         type: "menu",
    //         menu: [
    //             { title: "About Us", url: "/site/about-us" },
    //             { title: "Contact Us", url: "/site/contact-us" },
    //             { title: "Contact Us Alt", url: "/site/contact-us-alt" },
    //             { title: "404", url: "/site/not-found" },
    //             { title: "Terms And Conditions", url: "/site/terms" },
    //             { title: "FAQ", url: "/site/faq" },
    //             { title: "Components", url: "/site/components" },
    //             { title: "Typography", url: "/site/typography" },
    //         ],
    //     },
    // },
    {
        title: "Control Panel",
        url: "/dashboard?redirect=dash",
    },
    // {
    //     title: 'Buy Theme',
    //     url: 'https://themeforest.net/item/stroyka-tools-store-react-ecommerce-template/23909258',
    //     props: {
    //         external: true,
    //         target: '_blank',
    //     },
    // },
];
