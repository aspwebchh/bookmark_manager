var BookMark;
(function (BookMark) {
    //文件夹数据项
    (function (BookMarkDataItemState) {
        BookMarkDataItemState[BookMarkDataItemState["Normal"] = 0] = "Normal";
        BookMarkDataItemState[BookMarkDataItemState["New"] = 1] = "New";
        BookMarkDataItemState[BookMarkDataItemState["Rename"] = 2] = "Rename";
    })(BookMark.BookMarkDataItemState || (BookMark.BookMarkDataItemState = {}));
    var BookMarkDataItemState = BookMark.BookMarkDataItemState;
})(BookMark || (BookMark = {}));
//# sourceMappingURL=common.js.map