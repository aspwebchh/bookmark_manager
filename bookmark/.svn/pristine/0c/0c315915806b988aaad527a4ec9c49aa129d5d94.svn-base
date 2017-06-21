///<reference path="jquery/jquery.d.ts" />
///<reference path="bookmark_container.ts" />
var BookMark;
(function (BookMark) {
    var BookMarkRightClickMenu = (function () {
        function BookMarkRightClickMenu() {
        }
        BookMarkRightClickMenu.prototype.onAddDir = function () { };
        BookMarkRightClickMenu.prototype.onAddPage = function () { };
        BookMarkRightClickMenu.prototype.onDel = function () { };
        BookMarkRightClickMenu.prototype.onRename = function () { };
        BookMarkRightClickMenu.prototype.setTargetNode = function (node) {
            this.targetNode = node;
        };
        BookMarkRightClickMenu.prototype.getTargetNode = function () {
            return this.targetNode;
        };
        BookMarkRightClickMenu.prototype.render = function () {
            var _this = this;
            var html = "<div class=\"menu\" id='right_click_menu'>\n                            <ul>\n                                <li id=\"add_dir\">\u6DFB\u52A0\u6587\u4EF6\u5939</li>\n                                <li id=\"add_page\">\u6DFB\u52A0\u7F51\u9875</li>\n                                <li id=\"del\">\u5220\u9664</li>\n                                <li id=\"rename\">\u91CD\u547D\u540D</li>\n                            </ul>\n                        </div>";
            var menuElement = $(html).hide();
            $('body').append(menuElement);
            this.ele = menuElement;
            $(document).bind("click", function (e) {
                if (_this.ele.get(0).contains(e.target)) {
                    return;
                }
                _this.hide();
            });
            this.ele.find("li").bind("mouseover", function () {
                $(this).addClass("selected");
            }).bind("mouseout", function () {
                $(this).removeClass("selected");
            });
            this.ele.find("li").click(function (e) {
                var id = e.target.id;
                switch (id) {
                    case "add_dir":
                        _this.onAddDir();
                        break;
                    case "add_page":
                        _this.onAddPage();
                        break;
                    case "del":
                        _this.onDel();
                        break;
                    case "rename":
                        _this.onRename();
                        break;
                }
                _this.hide();
            });
        };
        BookMarkRightClickMenu.prototype.show = function (left, top) {
            this.ele.show().offset({ left: left, top: top });
        };
        BookMarkRightClickMenu.prototype.hide = function () {
            this.ele.hide();
        };
        return BookMarkRightClickMenu;
    }());
    BookMark.BookMarkRightClickMenu = BookMarkRightClickMenu;
})(BookMark || (BookMark = {}));
//# sourceMappingURL=bookmark_right_menu.js.map