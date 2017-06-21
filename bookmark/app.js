///<reference path="scripts/jquery/jquery.d.ts" />
///<reference path="scripts/bookmark_right_click_menu.ts" />
///<reference path="scripts/bookmark_container.ts" />
///<reference path="scripts/bookmark_page_list.ts" />
var BookMark;
(function (BookMark) {
    var Main = (function () {
        function Main() {
            var bookMarkPageList = new BookMark.BookMarkPageList();
            bookMarkPageList.add({ id: 1, title: "ÐÂÀËÍø", url: "http://www.sina.com/" });
            bookMarkPageList.add({ id: 5, title: "ÐÂÀËÍø1", url: "http://www.sina.com/" });
            bookMarkPageList.add({ id: 3, title: "ÐÂÀËÍø2", url: "http://www.sina.com/" });
            bookMarkPageList.add({ id: 4, title: "ÐÂÀËÍø3", url: "http://www.sina.com/" });
            bookMarkPageList.render("page_list");
            bookMarkPageList.onItemAdd = function (data) {
                console.log(data);
            };
            var selectedBookMarkPageDataItem;
            var pageListRightClickMenu = new BookMark.PageListRightClickMenu();
            pageListRightClickMenu.render();
            pageListRightClickMenu.onDel = function () {
                bookMarkPageList.removeItem(selectedBookMarkPageDataItem.id);
            };
            pageListRightClickMenu.onEdit = function () {
                bookMarkPageList.editItem(selectedBookMarkPageDataItem.id);
            };
            pageListRightClickMenu.onOpen = function () {
                window.open(selectedBookMarkPageDataItem.url);
            };
            bookMarkPageList.onRightClick = function (e, dataItem) {
                selectedBookMarkPageDataItem = dataItem;
                pageListRightClickMenu.show(e.pageX, e.pageY);
            };
            // bookMarkPageList.newItem();
        }
        return Main;
    }());
    new Main();
})(BookMark || (BookMark = {}));
//# sourceMappingURL=app.js.map