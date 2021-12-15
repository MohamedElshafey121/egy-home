import $ from "jquery";

window.stroyka.sidebar = function () {
    const appEl = $(".sa-app");

    const media = matchMedia("(min-width: 1200px)");

    return {
        toggle: function (value) {
            const shownClass = "sa-app--" + (media.matches ? "desktop" : "mobile") + "-sidebar-shown";
            const hiddenClass = "sa-app--" + (media.matches ? "desktop" : "mobile") + "-sidebar-hidden";
            const curState = appEl.hasClass(shownClass) && !appEl.hasClass(hiddenClass);
            const newState = typeof value === "boolean" ? value : !curState;

            if (newState) {
                appEl.addClass(shownClass);
                appEl.removeClass(hiddenClass);
            } else {
                appEl.removeClass(shownClass);
                appEl.addClass(hiddenClass);
            }
        },
        open: function () {
            // window.stroyka.sidebar.toggle(true);
            this.toggle(true);
        },
        close: function () {
            // window.stroyka.sidebar.toggle(false);
            this.toggle(false);
        },
        media,
        appEl,
    };
};

export default function effectSidebar() {
    const sidebar = window.stroyka.sidebar();
    $("[data-sa-toggle-sidebar]").on("click", function () {
        sidebar.toggle();
    });
    $("[data-sa-open-sidebar]").on("click", function () {
        sidebar.open();
    });
    $("[data-sa-close-sidebar]").on("click", function () {
        sidebar.close();
    });

    function onMediaChange() {
        sidebar.toggle(sidebar.media.matches);

        sidebar.appEl.addClass("sa-app--switch-device");
        sidebar.appEl.width(); // force reflow
        sidebar.appEl.removeClass("sa-app--switch-device");
    }

    if (sidebar.media.addEventListener) {
        sidebar.media.addEventListener("change", onMediaChange);
    } else {
        sidebar.media.addListener(onMediaChange);
    }
}
