var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
///<reference path="scripts/jquery/jquery.d.ts" />
///<reference path="scripts/bookmark_right_click_menu.ts" />
///<reference path="scripts/bookmark_container.ts" />
///<reference path="scripts/bookmark_page_list.ts" />
///<reference path="scripts/data_source.ts" />
var BookMark;
(function (BookMark) {
    class Main {
        constructor() {
            this.bookMarkNavManager = new BookMark.BookMarkManager();
            this.bookMarkNavRightMenu = new BookMark.BookMarkRightClickMenu();
            this.bookMarkPageList = new BookMark.BookMarkPageList();
            this.pageListRightClickMenu = new BookMark.PageListRightClickMenu();
            this.initNavMenu();
            this.initPageList();
            this.initPageSet();
            this.initTopBookMarkNav();
            //this.bookMarkNavManager.setOuterDrag(true);
        }
        initPageSet() {
            let navEl = $(".nav");
            let pageListEl = $(".page_list");
            let wndHeight = $(window).height();
            let top = navEl.offset().top;
            let height = wndHeight - top;
            navEl.height(height);
            pageListEl.height(height);
        }
        initTopBookMarkNav() {
            let btn = $("#top");
            this.bookMarkNavRightMenu.setExceptElement(btn.get(0));
            btn.bind("click", (e) => {
                let { left, top } = $(e.target).offset();
                this.bookMarkNavRightMenu.show(left - 5, top + 20);
                this.bookMarkNavRightMenu.setTargetNode(this.bookMarkNavManager.getRoot());
                this.bookMarkNavRightMenu.disable(BookMark.MenuId.AddPage, BookMark.MenuId.DelDir, BookMark.MenuId.RenameDir);
            });
        }
        initNavMenu() {
            return __awaiter(this, void 0, void 0, function* () {
                let saveData = () => {
                    BookMark.DataSource.updateCategories(this.bookMarkNavManager.getDataSource());
                };
                this.bookMarkNavRightMenu.onAddDir = () => {
                    let node = this.bookMarkNavRightMenu.getTargetNode();
                    this.bookMarkNavManager.newItem(node.getSource().id);
                    saveData();
                };
                this.bookMarkNavRightMenu.onAddPage = () => {
                    this.bookMarkPageList.newItem(this.bookMarkNavRightMenu.getTargetNode().getSource().id);
                };
                this.bookMarkNavRightMenu.onDel = () => __awaiter(this, void 0, void 0, function* () {
                    let node = this.bookMarkNavRightMenu.getTargetNode();
                    let nodeId = node.getSource().id;
                    let pages = yield BookMark.DataSource.getPages(nodeId);
                    if (pages.length > 0) {
                        alert("请选择删除书签内容");
                        return;
                    }
                    let success = this.bookMarkNavManager.removeItem(node.getSource().id);
                    if (!success) {
                        alert("请先删除子目录");
                    }
                    saveData();
                });
                this.bookMarkNavRightMenu.onRename = () => {
                    let node = this.bookMarkNavRightMenu.getTargetNode();
                    node.getSource().state = BookMark.BookMarkDataItemState.Rename;
                    this.bookMarkNavManager.reRender();
                    saveData();
                };
                this.bookMarkNavRightMenu.render();
                this.bookMarkNavManager = new BookMark.BookMarkManager();
                this.bookMarkNavManager.onRightClick = (node, e) => {
                    let offset = node.getNodeElement().offset();
                    this.bookMarkNavRightMenu.show(e.pageX + 2, e.pageY + 2);
                    this.bookMarkNavRightMenu.setTargetNode(node);
                    this.pageListRightClickMenu.hide();
                };
                this.bookMarkNavManager.onRename = (node) => {
                    saveData();
                };
                this.bookMarkNavManager.onMove = () => {
                    saveData();
                };
                let renderPageList = (cid) => __awaiter(this, void 0, void 0, function* () {
                    this.bookMarkPageList.empty();
                    let data = yield BookMark.DataSource.getPages(cid);
                    data.forEach(item => this.bookMarkPageList.add(item));
                    this.bookMarkPageList.reRender();
                });
                this.bookMarkNavManager.onOuterDragUp = (node) => __awaiter(this, void 0, void 0, function* () {
                    let page = this.bookMarkPageList.getDragDataItem();
                    page.cid = node.getSource().id;
                    yield BookMark.DataSource.editPage(page);
                    yield renderPageList(page.cid);
                });
                this.bookMarkNavManager.onNodeClick = (arg, fold) => __awaiter(this, void 0, void 0, function* () {
                    this.bookMarkNavManager.select(arg);
                    renderPageList(arg.getSource().id);
                    if (fold) {
                        yield BookMark.DataSource.updateCategories(this.bookMarkNavManager.getDataSource());
                    }
                });
                let data = yield BookMark.DataSource.getCategories();
                data.forEach(item => this.bookMarkNavManager.addBookMarkData(item));
                this.bookMarkNavManager.render("bookmark_nav");
            });
        }
        initPageList() {
            let selectedBookMarkPageDataItem;
            this.bookMarkPageList.render("page_list");
            this.bookMarkPageList.onItemAdd = (data) => {
                BookMark.DataSource.addPage(data);
            };
            this.bookMarkPageList.onItemEdit = (data) => {
                BookMark.DataSource.editPage(data);
            };
            this.bookMarkPageList.onItemDel = (data) => {
                BookMark.DataSource.removePage(data.id);
            };
            this.bookMarkPageList.onRightClick = (e, dataItem) => {
                selectedBookMarkPageDataItem = dataItem;
                this.pageListRightClickMenu.show(e.pageX, e.pageY);
                this.bookMarkNavRightMenu.hide();
            };
            this.bookMarkPageList.onDragDown = () => {
                this.bookMarkNavManager.setOuterDrag(true);
            };
            this.bookMarkPageList.onDragUp = () => {
                this.bookMarkNavManager.setOuterDrag(false);
            };
            this.pageListRightClickMenu.render();
            this.pageListRightClickMenu.onDel = () => {
                this.bookMarkPageList.removeItem(selectedBookMarkPageDataItem.id);
            };
            this.pageListRightClickMenu.onEdit = () => {
                this.bookMarkPageList.editItem(selectedBookMarkPageDataItem.id);
            };
            this.pageListRightClickMenu.onOpen = () => {
                window.open(selectedBookMarkPageDataItem.url);
            };
        }
    }
    new Main();
})(BookMark || (BookMark = {}));
//# sourceMappingURL=manager.js.map