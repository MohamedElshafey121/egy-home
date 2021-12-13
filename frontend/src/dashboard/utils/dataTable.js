//Datatable Modules
// import "datatables.net-dt/js/dataTables.dataTables";
// import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";

export default function dataTables() {
    $.fn.DataTable.ext.pager.numbers_length = 5;
    $.fn.DataTable.defaults.oLanguage.sInfo = "Showing _START_ to _END_ of _TOTAL_";
    $.fn.DataTable.defaults.oLanguage.sLengthMenu = "Rows per page _MENU_";

    const template =
        "" +
        '<"sa-datatables"' +
        '<"sa-datatables__table"t>' +
        '<"sa-datatables__footer"' +
        '<"sa-datatables__pagination"p>' +
        '<"sa-datatables__controls"' +
        '<"sa-datatables__legend"i>' +
        '<"sa-datatables__divider">' +
        '<"sa-datatables__page-size"l>' +
        ">" +
        ">" +
        ">";

    $(".sa-datatables-init").each(function () {
        const tableSearchSelector = $(this).data("sa-search-input");
        const table = $(this).DataTable({
            dom: template,
            paging: true,
            ordering: true,
            drawCallback: function () {
                $(this.api().table().container()).find(".pagination").addClass("pagination-sm");
            },
        });

        if (tableSearchSelector) {
            $(tableSearchSelector).on("input", function () {
                table.search(this.value).draw();
            });
        }
    });
}
