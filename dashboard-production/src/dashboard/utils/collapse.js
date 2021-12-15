import $ from "jquery";

export default function collapse() {
    $("[data-sa-collapse]").each(function (i, element) {
        const collapse = element;
        const $triggers = $(collapse).find("[data-sa-collapse-trigger]");
        const $contents = $(collapse).find("[data-sa-collapse-content]");

        $triggers.on("click", function (event) {
            event.preventDefault();

            const $item = $(this).closest("[data-sa-collapse-item]");
            const $content = $item.find("[data-sa-collapse-content]").filter(function (index, element) {
                return $(element).closest("[data-sa-collapse-item]").is($item);
            });
            const $parents = $item.parents();
            const openClass = $item.data("sa-collapse-item");
            $parents
                .slice(0, $parents.index(collapse) + 1)
                .filter("[data-sa-collapse-item]")
                .css("height", "");

            if ($item.is("." + openClass)) {
                const startHeight = $content.height();

                $content.css("height", startHeight + "px");
                $item.removeClass(openClass);

                $content.height(); // force reflow
                $content.css("height", "");

                $item.trigger("sa-collapse-state", ["collapsed"]);
            } else {
                const startHeight = $content.height();

                $item.addClass(openClass);

                const endHeight = $content.height();

                $content.css("height", startHeight + "px");
                $content.height(); // force reflow
                $content.css("height", endHeight + "px");

                if ($content.height() === endHeight) {
                    $content.css("height", "");
                }

                $item.trigger("sa-collapse-state", ["expanded"]);
            }
        });

        $contents.on("transitionend", function (event) {
            if (event.originalEvent.propertyName === "height") {
                $(this).css("height", "");
            }
        });
    });
}
