///<reference path="jquery/jquery.d.ts" />
///<reference path="bookmark_container.ts" />
var BookMark;
(function (BookMark) {
    (function (MenuType) {
        MenuType[MenuType["BookMarkNavMenu"] = 0] = "BookMarkNavMenu";
        MenuType[MenuType["PageList"] = 1] = "PageList";
    })(BookMark.MenuType || (BookMark.MenuType = {}));
    var MenuType = BookMark.MenuType;
    class MenuId {
    }
    MenuId.AddDir = "add_dir";
    MenuId.AddPage = "add_page";
    MenuId.DelDir = 'del_dir';
    MenuId.RenameDir = "rename_dir";
    BookMark.MenuId = MenuId;
    class RightClickMenu {
        setExceptElement(ele) {
            this.exceptElement = ele;
        }
        removeMenuItem(menuId) {
            this.ele.find("li[id='" + menuId + "']").remove();
        }
        show(left, top) {
            this.endableAll();
            this.ele.show().offset({ left: left, top: top });
        }
        hide() {
            this.ele.hide();
        }
        disable(...menuIds) {
            menuIds.forEach(id => this.ele.find("#" + id).attr("enable", "false"));
        }
        endableAll() {
            this.ele.find("li").removeAttr("enable");
        }
        render() {
            let html = this.getMenuHtml();
            let menuElement = $(html).hide();
            $('body').append(menuElement);
            this.ele = menuElement;
            $(document).bind("click", (e) => {
                if (this.ele.get(0).contains(e.target)) {
                    return;
                }
                if (this.exceptElement && this.exceptElement.contains(e.target)) {
                    return;
                }
                this.hide();
            });
            this.ele.find("li").bind("mouseover", function () {
                if ($(this).attr("enable") == "false") {
                    return;
                }
                $(this).addClass("selected");
            }).bind("mouseout", function () {
                $(this).removeClass("selected");
            });
            this.ele.find("li").click((e) => {
                if ($(e.target).attr("enable") == "false") {
                    return;
                }
                let id = e.target.id;
                this.hide();
                this.eventProxy(id);
            });
        }
    }
    BookMark.RightClickMenu = RightClickMenu;
    class BookMarkRightClickMenu extends RightClickMenu {
        constructor(...args) {
            super(...args);
            this.onAddDir = () => { };
            this.onAddPage = () => { };
            this.onDel = () => { };
            this.onRename = () => { };
        }
        setTargetNode(node) {
            this.targetNode = node;
        }
        getTargetNode() {
            return this.targetNode;
        }
        eventProxy(evenName) {
            switch (evenName) {
                case MenuId.AddDir:
                    this.onAddDir();
                    break;
                case MenuId.AddPage:
                    this.onAddPage();
                    break;
                case MenuId.DelDir:
                    this.onDel();
                    break;
                case MenuId.RenameDir:
                    this.onRename();
                    break;
            }
        }
        getMenuHtml() {
            return `<div class="menu" id='right_click_menu'>
                            <ul>
                                <li id="${MenuId.AddDir}">添加文件夹</li>
                                <li id="${MenuId.AddPage}">添加网页</li>
                                <li id="${MenuId.DelDir}">删除</li>
                                <li id="${MenuId.RenameDir}">重命名</li>
                            </ul>
                        </div>`;
        }
    }
    BookMark.BookMarkRightClickMenu = BookMarkRightClickMenu;
    class PageListRightClickMenu extends RightClickMenu {
        constructor(...args) {
            super(...args);
            this.onOpen = () => { };
            this.onEdit = () => { };
            this.onDel = () => { };
        }
        eventProxy(evenName) {
            switch (evenName) {
                case "open_url":
                    this.onOpen();
                    break;
                case "del":
                    this.onDel();
                    break;
                case "edit":
                    this.onEdit();
                    break;
            }
        }
        getMenuHtml() {
            return `<div class="menu" id='right_click_menu'>
                            <ul>
                                <li id="open_url">打开网页</li>
                                <li id="del">删除</li>
                                <li id="edit">编辑</li>
                            </ul>
                        </div>`;
        }
    }
    BookMark.PageListRightClickMenu = PageListRightClickMenu;
})(BookMark || (BookMark = {}));
//# sourceMappingURL=bookmark_right_click_menu.js.map