import $ from "jquery";
import { Quill } from "react-quill";
window.stroyka.quill = function () {
    const stroykaQuill = {
        init: function (element) {
            const $element = $(element);
            const $container = $("<div></div>");
            const $content = $("<div></div>");

            $container.addClass("sa-quill").attr("translate", "no").append($content).insertAfter($element);

            $content.html($element.val());

            const quill = new Quill($content[0], stroykaQuill.getSettings());

            quill.on("text-change", function () {
                // $element.val(container.querySelector(".ql-editor").innerHTML);
                // $element.val(container.querySelector(".ql-editor").innerHTML);
                $element.val($(".ql-editor").innerHTML);
                console.log($element.val($(".ql-editor").innerHTML));
            });

            $element.addClass("sa-quill-control--ready");
        },
        getSettings: function () {
            return {
                theme: "snow",
                modules: {
                    toolbar: [
                        ["bold", "italic", "underline", "strike"], // toggled buttons
                        ["blockquote", "code-block", "link"],

                        [{ header: 1 }, { header: 2 }], // custom button values
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ script: "sub" }, { script: "super" }], // superscript/subscript
                        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
                        // [{ direction: "rtl" }], // text direction

                        [{ size: ["small", false, "large", "huge"] }], // custom dropdown

                        // [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                        // [{ font: [] }],
                        [{ align: [] }],

                        ["clean"], // remove formatting button
                    ],
                },
            };
        },
    };

    $(".sa-quill-control").each(function () {
        stroykaQuill.init(this);
    });

    // stroykaQuill.init($(".sa-quill-control")[0]);

    return stroykaQuill;
};
