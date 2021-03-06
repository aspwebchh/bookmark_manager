///<reference path="jquery/jquery.d.ts" />
///<reference path="bookmark_right_click_menu.ts" />
///<reference path="common.ts" />
var BookMark;
(function (BookMark) {
    class BookMarkNode {
        constructor(data) {
            this.onRename = () => { };
            this.nodeList = [];
            this.data = data;
        }
        getSource() {
            return this.data;
        }
        addChild(node) {
            this.nodeList.push(node);
        }
        getNodeId() {
            let id = "node_index_" + this.data.id;
            return id;
        }
        getNodeElement() {
            return $(document.getElementById(this.getNodeId()));
        }
        onRenderComplete() {
            let ele = this.getNodeElement();
            let input = ele.children("a").children("input");
            setTimeout(() => { input.select(); }, 1);
            input.bind("blur", () => {
                this.data.state = BookMark.BookMarkDataItemState.Normal;
                this.data.title = input.val();
                input.replaceWith(this.data.title);
                this.onRename();
            });
        }
        content() {
            let html = "";
            if (this.data.state == BookMark.BookMarkDataItemState.New || this.data.state == BookMark.BookMarkDataItemState.Rename) {
                html += "<a><input type='text' value='" + this.data.title + "' /></a>";
            }
            else {
                html += "<a><span>" + this.data.title + "</span></a>";
            }
            return html;
        }
    }
    BookMark.BookMarkNode = BookMarkNode;
    class BookMarkListNode extends BookMarkNode {
        toHtml() {
            let html = "<li id='" + this.getNodeId() + "' class='node_list'>";
            html += "<span class='icon'>&nbsp;</span>";
            html += this.content();
            html += "<ul style='display:none;'>";
            this.nodeList.forEach(item => html += item.toHtml());
            html += "</ul>";
            html += "</li>";
            return html;
        }
        onRenderComplete() {
            super.onRenderComplete();
            let ele = this.getNodeElement();
            ele.children("a").addClass("close");
            this.toggle();
        }
        toggle() {
            let ele = this.getNodeElement();
            let btn = ele.children("a");
            let list = ele.children("ul");
            let icon = ele.children("span");
            btn.removeClass("close");
            btn.removeClass("open");
            if (this.data.isOpen) {
                btn.addClass("open");
                icon.addClass("open");
                this.data.isOpen = true;
                list.show();
            }
            else {
                list.hide();
                btn.addClass("close");
                icon.removeClass("open");
                this.data.isOpen = false;
            }
        }
        onNodeClick(e) {
            if (e.target.tagName == "SPAN") {
                return false;
            }
            this.data.isOpen = this.data.isOpen ? false : true;
            this.toggle();
            return true;
        }
    }
    class BookMarkRoot extends BookMarkListNode {
        toHtml() {
            let html = "<div class='tree'>";
            this.nodeList.forEach(item => html += item.toHtml());
            html += "</div>";
            return html;
        }
        onRenderComplete() {
            super.onRenderComplete();
        }
        onNodeClick(e) {
            return false;
        }
    }
    class BookMarkLeaf extends BookMarkNode {
        toHtml() {
            let html = "<li id='" + this.getNodeId() + "' class='node_leaf'>";
            html += this.content();
            html += "</li>";
            return html;
        }
        onRenderComplete() {
            super.onRenderComplete();
            let ele = this.getNodeElement();
            ele.children("a").addClass("close");
        }
        onNodeClick(e) {
            return false;
        }
    }
    class BookMarkManager {
        constructor() {
            this.bookMarkData = [];
            this.isOuterDrag = false;
            this.enableDrag = true;
            this.enableOuterDrag = true;
            this.getDataSource = () => { return this.bookMarkData; };
            this.onNodeClick = (arg, fold) => { };
            this.onRightClick = (node, e) => { };
            this.onRename = (node) => { };
            this.onMove = () => { };
            this.onOuterDragUp = (node) => { };
        }
        findMaxId() {
            return this.bookMarkData.sort((a, b) => b.id - a.id)[0].id;
        }
        findChild(id) {
            return this.bookMarkData.filter((item) => item.pid == id);
        }
        getParent(pid) {
            let result = this.bookMarkData.filter((item) => item.id == pid);
            return result.length > 0 ? result[0] : null;
        }
        findDataItem(id) {
            return this.bookMarkData.filter(item => item.id == id)[0];
        }
        genNode(id) {
            let childNodeList = this.findChild(id);
            let dataItem = this.findDataItem(id);
            let node;
            if (childNodeList.length > 0) {
                if (id == 0) {
                    node = new BookMarkRoot(dataItem);
                }
                else {
                    node = new BookMarkListNode(dataItem);
                }
                childNodeList.forEach(item => node.addChild(this.genNode(item.id)));
            }
            else {
                node = new BookMarkLeaf(dataItem);
            }
            BookMarkManager.nodeTable[node.getNodeId()] = node;
            node.onRename = () => {
                this.onRename(node);
                this.reRender();
            };
            return node;
        }
        addBookMarkData(dataItem) {
            this.bookMarkData.push(dataItem);
        }
        removeItem(id) {
            let childs = this.findChild(id);
            if (childs.length > 0) {
                return false;
            }
            else {
                this.bookMarkData = this.bookMarkData.filter(item => item.id != id);
                this.reRender();
                return true;
            }
            //let removeById = (id: number) => {
            //    this.bookMarkData = this.bookMarkData.filter(item => item.id != id);
            //    let childs = this.findChild(id);
            //    childs.forEach(item => removeById(item.id));
            //};
            //removeById(id);
            //this.reRender();
        }
        reRender() {
            this.render(this.targetElementId);
        }
        newItem(parentId) {
            this.findDataItem(parentId).isOpen = true;
            let nodeDataItem = { id: this.findMaxId() + 1, pid: parentId, title: "新建文件夹", state: BookMark.BookMarkDataItemState.New };
            this.addBookMarkData(nodeDataItem);
            this.reRender();
        }
        select(node) {
            for (let key in BookMarkManager.nodeTable) {
                BookMarkManager.nodeTable[key].getNodeElement().removeClass("select");
            }
            node.getNodeElement().addClass("select");
        }
        render(targetEleId) {
            this.targetElementId = targetEleId;
            this.bookMarkData.sort((a, b) => a.id - b.id);
            let bookMarkNode = this.genNode(0);
            this.ele = $(document.getElementById(targetEleId)).html(bookMarkNode.toHtml());
            bookMarkNode.getNodeElement().children("ul").show();
            for (let key in BookMarkManager.nodeTable) {
                let node = BookMarkManager.nodeTable[key];
                node.onRenderComplete();
            }
            let btns = this.ele.find("a");
            btns.bind("click", (e) => {
                let node = this.getNodeOnElement(e.target);
                let fold = node.onNodeClick(e);
                this.onNodeClick(node, fold);
            });
            btns.bind("mouseup", (e) => {
                if (e.button == 2) {
                    let node = this.getNodeOnElement(e.target);
                    this.onRightClick(node, e);
                }
            });
            btns.bind("contextmenu", (e) => {
                e.preventDefault();
            });
            if (this.enableDrag) {
                this.initDragNode();
            }
            if (this.enableOuterDrag) {
                this.initOuterDrag();
            }
        }
        getRoot() {
            for (let key in BookMarkManager.nodeTable) {
                let item = BookMarkManager.nodeTable[key];
                if (item.getSource().id == 0) {
                    return item;
                }
            }
        }
        getNodeOnElement(element) {
            let nodeId = $(element).parents("li").attr("id");
            let node = BookMarkManager.nodeTable[nodeId];
            return node;
        }
        isAncestorNode(ancestorNode, node) {
            let ancestorData = ancestorNode.getSource();
            let nodeData = node.getSource();
            let check = (ancestor, curr) => {
                if (curr == null) {
                    return false;
                }
                return ancestor.id == curr.pid || check(ancestor, this.getParent(curr.pid));
            };
            return check(ancestorData, nodeData);
        }
        showCursorMoveIcon() {
            this.ele.children().css("cursor", "move").find("a").css("cursor", "move");
        }
        hideCursorMoveIcon() {
            this.ele.children().css("cursor", "default").find("a").css("cursor", "default");
        }
        setOuterDrag(state) {
            this.isOuterDrag = state;
            if (this.isOuterDrag) {
                this.showCursorMoveIcon();
            }
            else {
                this.hideCursorMoveIcon();
            }
        }
        initOuterDrag() {
            let btns = this.ele.find("a");
            btns.bind("mousemove", (e) => {
                if (!this.isOuterDrag) {
                    return;
                }
                let target = this.getNodeOnElement(e.target);
                this.select(target);
            });
            btns.bind("mouseup", (e) => {
                if (!this.isOuterDrag) {
                    return;
                }
                this.onOuterDragUp(this.getNodeOnElement(e.target));
            });
            //btns.bind("mouseenter", (e: JQueryEventObject) => {
            //    if (!this.isOuterDrag) {
            //        return;
            //    }
            //});
            //btns.bind("mouseleave", (e: JQueryEventObject) => {
            //    if (!this.isOuterDrag) {
            //        return;
            //    }
            //});
        }
        initDragNode() {
            let btns = this.ele.find("a");
            let startX;
            let startY;
            let currX;
            let currY;
            let isDrag;
            let dragNode;
            let targetNode;
            btns.bind("mousedown", (e) => {
                if (e.target.tagName == "INPUT") {
                    return;
                }
                let getTarget = () => {
                    if (e.target.tagName == "SPAN") {
                        return $(e.target).parents("a");
                    }
                    else {
                        return $(e.target);
                    }
                };
                this.showCursorMoveIcon();
                let target = getTarget();
                startX = e.pageX;
                startY = e.pageY;
                isDrag = true;
                dragNode = this.getNodeOnElement(e.target);
                e.preventDefault();
            });
            $("body").bind("mouseup", (e) => {
                if (isDrag && targetNode != null) {
                    if (dragNode != targetNode && !this.isAncestorNode(dragNode, targetNode)) {
                        dragNode.getSource().pid = targetNode.getSource().id;
                        targetNode.getSource().isOpen = true;
                        this.reRender();
                        this.onMove();
                        targetNode = null;
                    }
                }
                if (isDrag) {
                    startX = 0;
                    startY = 0;
                    currX = 0;
                    currY = 0;
                    isDrag = false;
                    dragNode = null;
                    this.hideCursorMoveIcon();
                }
            });
            $("body").bind("mousemove", (e) => {
                if (!isDrag) {
                    return;
                }
                currX = e.pageX;
                currY = e.pageY;
                if (!(Math.abs(currX - startX) > 10 || Math.abs(currY - startY) > 5)) {
                    return;
                }
            });
            btns.bind("mouseenter", (e) => {
                if (isDrag) {
                    targetNode = this.getNodeOnElement(e.target);
                    this.select(targetNode);
                }
                //for (let key in BookMarkManager.nodeTable) {
                //    BookMarkManager.nodeTable[key].getNodeElement().removeClass("select");
                //}
                //if (isDrag) {
                //    targetNode = this.getNodeOnElement(e.target);
                //    targetNode.getNodeElement().addClass("select");
                //}
            });
        }
    }
    BookMarkManager.nodeTable = {};
    BookMark.BookMarkManager = BookMarkManager;
})(BookMark || (BookMark = {}));
//# sourceMappingURL=bookmark_container.js.map