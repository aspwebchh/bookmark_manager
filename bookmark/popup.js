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
///<reference path="scripts/data_source.ts" />
var BookMark;
(function (BookMark) {
    class Popup {
        constructor() {
            this.initNavMenu();
            this.fillCurrBookMarkInfo();
            this.initSaveAction();
            this.initManagerAction();
        }
        initSaveAction() {
            let showErrorMessage = (msg) => {
                $("#error_msg").html(msg).show();
            };
            let hideErrorMessage = () => {
                $("#error_msg").html('').hide();
            };
            $("#ok").bind("click", () => __awaiter(this, void 0, void 0, function* () {
                let title = $.trim($("#title").val());
                let url = $.trim($("#url").val());
                if (title == '') {
                    showErrorMessage("请输入标题");
                    return;
                }
                if (url == '') {
                    showErrorMessage("请输入网址");
                    return;
                }
                if (this.selectedNode == null) {
                    showErrorMessage("请选择目录");
                    return;
                }
                let bookMarkId = this.selectedNode.getSource().id;
                let newPage = yield BookMark.DataSource.newPage(title, url, bookMarkId);
                BookMark.DataSource.addPage(newPage);
                hideErrorMessage();
                window.close();
            }));
        }
        initManagerAction() {
            $("#manager").bind("click", function () {
                window.open("manager.html");
            });
        }
        fillCurrBookMarkInfo() {
            chrome.tabs.getSelected((tab) => {
                $("#title").val(tab.title);
                $("#url").val(tab.url);
            });
        }
        initNavMenu() {
            return __awaiter(this, void 0, void 0, function* () {
                this.bookMarkNavManager = new BookMark.BookMarkManager();
                this.bookMarkNavManager.enableDrag = false;
                this.bookMarkNavManager.enableOuterDrag = false;
                let data = yield BookMark.DataSource.getCategories();
                data.forEach(item => this.bookMarkNavManager.addBookMarkData(item));
                this.bookMarkNavManager.onNodeClick = (arg) => {
                    this.selectedNode = arg;
                    this.bookMarkNavManager.select(arg);
                };
                this.bookMarkNavManager.render("cate");
            });
        }
    }
    new Popup();
})(BookMark || (BookMark = {}));
//# sourceMappingURL=popup.js.map