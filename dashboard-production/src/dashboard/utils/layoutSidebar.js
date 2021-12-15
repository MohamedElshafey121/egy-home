import $ from "jquery";
window.stroyka.layoutSidebar = function () {
    const $layout = $(".sa-layout");
    const openClass = "sa-layout--sidebar-open";
    const media = matchMedia("(min-width: 1600px)");

    return {
        toggle: function (value) {
            const curState = $layout.hasClass(openClass) && !$layout.hasClass(openClass);
            const newState = typeof value === "boolean" ? value : !curState;

            $layout.toggleClass(openClass, newState);
        },
        open: function () {
            this.toggle(true);
        },
        close: function () {
            this.toggle(false);
        },
        media,
        layout: $layout,
    };
};

export default function effectLayutSidebar() {
    const layoutSidebar = window.stroyka.layoutSidebar();

    $("[data-sa-layout-sidebar-open]").on("click", function () {
        layoutSidebar.open();
    });
    $("[data-sa-layout-sidebar-close]").on("click", function () {
        layoutSidebar.close();
    });

    function onMediaChange() {
        if (!layoutSidebar.media.matches) {
            window.stroyka.layoutSidebar.close();
        }

        layoutSidebar.layout.addClass("sa-layout--switch-device");
        layoutSidebar.layout.width(); // force reflow
        layoutSidebar.layout.removeClass("sa-layout--switch-device");
    }

    if (layoutSidebar.media.addEventListener) {
        layoutSidebar.media.addEventListener("change", onMediaChange);
    } else {
        layoutSidebar.media.addListener(onMediaChange);
    }
}
