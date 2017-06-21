///<reference path="jquery/jquery.d.ts" />
///<reference path="bookmark_right_click_menu.ts" />
///<reference path="common.ts" />
namespace BookMark {
    export abstract class BookMarkNode {
        protected nodeList: BookMarkNode[];
        protected data: BookMarkDataItem;

        public onRename = () => { };

        constructor(data: BookMarkDataItem) {
            this.nodeList = [];
            this.data = data;
        }

        public getSource(): BookMarkDataItem {
            return this.data;
        }

        public addChild(node: BookMarkNode): void {
            this.nodeList.push(node);
        }

        public getNodeId(): string {
            let id = "node_index_" + this.data.id;
            return id;
        }

        public getNodeElement(): JQuery {
            return $(document.getElementById(this.getNodeId()));
        }

        public onRenderComplete(): void {
            let ele = this.getNodeElement();
            let input = ele.children("a").children("input");
            setTimeout(() => { input.select();}, 1);
            input.bind("blur", () => {
                this.data.state = BookMarkDataItemState.Normal;
                this.data.title = input.val();
                input.replaceWith(this.data.title);
                this.onRename();
            });
        }

        public abstract onNodeClick(e: JQueryEventObject): boolean;

        public abstract toHtml(): string;

        protected content(): string {
            let html = "";
            if (this.data.state == BookMarkDataItemState.New || this.data.state == BookMarkDataItemState.Rename) {
                html += "<a><input type='text' value='" + this.data.title + "' /></a>";
            } else {
                html += "<a><span>" + this.data.title + "</span></a>";
            }
            return html;
        }
    }


    class BookMarkListNode extends BookMarkNode {
        public toHtml(): string {
            let html = "<li id='" + this.getNodeId() + "' class='node_list'>";
            html += "<span class='icon'>&nbsp;</span>";
            html += this.content();
            html += "<ul style='display:none;'>";
            this.nodeList.forEach(item => html += item.toHtml());
            html += "</ul>";
            html += "</li>";
            return html;
        }

        public onRenderComplete() {
            super.onRenderComplete();
            let ele = this.getNodeElement();
            ele.children("a").addClass("close");
            this.toggle();
        }

        private toggle(): void {
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
            } else {
                list.hide();
                btn.addClass("close");
                icon.removeClass("open");
                this.data.isOpen = false;
            }
        }

        public onNodeClick(e: JQueryEventObject) {
            if (e.target.tagName == "SPAN") {
                return false;
            }
            this.data.isOpen = this.data.isOpen ? false : true;
            this.toggle();
            return true;
        }
    }

    class BookMarkRoot extends BookMarkListNode {
        public toHtml(): string {
            let html = "<div class='tree'>";
            this.nodeList.forEach(item => html += item.toHtml());
            html += "</div>";
            return html;
        }

        public onRenderComplete() {
            super.onRenderComplete();
        }

        public onNodeClick(e: JQueryEventObject) {
            return false;
        }
    }

    class BookMarkLeaf extends BookMarkNode {
        public toHtml(): string {
            let html = "<li id='" + this.getNodeId() + "' class='node_leaf'>";
            html += this.content();
            html += "</li>";
            return html;
        }

        public onRenderComplete() {
            super.onRenderComplete();
            let ele = this.getNodeElement();
            ele.children("a").addClass("close");
        }

        public onNodeClick(e: JQueryEventObject) {
            return false;
        }
    }

    export class BookMarkManager {
        private static nodeTable: { [index: string]: BookMarkNode } = {};

        private bookMarkData: BookMarkDataItem[] = [];

        private ele: JQuery;
        private targetElementId: string;
        private isOuterDrag = false;

        public enableDrag = true;
        public enableOuterDrag = true;

        constructor() { }

        public getDataSource = () => { return this.bookMarkData; }

        private findMaxId(): number {
            return this.bookMarkData.sort((a, b) => b.id - a.id)[0].id;
        }

        private findChild(id: number): BookMarkDataItem[] {
            return this.bookMarkData.filter((item) => item.pid == id);
        }

        private getParent(pid: number): BookMarkDataItem {
            let result = this.bookMarkData.filter((item) => item.id == pid);
            return result.length > 0 ? result[0] : null;
        }

        private findDataItem(id: number): BookMarkDataItem {
            return this.bookMarkData.filter(item =>item.id == id)[0];
        }


        private genNode(id: number): BookMarkNode {
            let childNodeList = this.findChild(id);
            let dataItem = this.findDataItem(id);
            let node: BookMarkNode;
            if (childNodeList.length > 0) {
                if (id == 0) {
                    node = new BookMarkRoot(dataItem);
                } else {
                    node = new BookMarkListNode(dataItem);
                }
                childNodeList.forEach(item => node.addChild(this.genNode(item.id)));
            } else {
                node = new BookMarkLeaf(dataItem);
            }
            BookMarkManager.nodeTable[node.getNodeId()] = node;
            node.onRename = () => {
                this.onRename(node);
                this.reRender();
            }
            return node;
        }

        public addBookMarkData(dataItem: BookMarkDataItem) {
            this.bookMarkData.push(dataItem);
        }

        public removeItem(id: number): Boolean {
            let childs = this.findChild(id);
            if (childs.length > 0) {
                return false;
            } else {
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

        public reRender(): void {
            this.render(this.targetElementId);
        }


        public newItem(parentId: number): void {
            this.findDataItem(parentId).isOpen = true;
            let nodeDataItem: BookMarkDataItem = { id: this.findMaxId() + 1, pid: parentId, title: "新建文件夹", state: BookMarkDataItemState.New };
            this.addBookMarkData(nodeDataItem);
            this.reRender();
        }

        public select(node:BookMarkNode) {
            for(let key in BookMarkManager.nodeTable) {
                BookMarkManager.nodeTable[key].getNodeElement().removeClass("select");
            }
            node.getNodeElement().addClass("select");
        }

        public render(targetEleId: string): void {
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
            btns.bind("click", (e: JQueryEventObject) => {
                let node = this.getNodeOnElement(e.target);
                let fold = node.onNodeClick(e);
                this.onNodeClick(node, fold);
            });

            btns.bind("mouseup", (e: JQueryEventObject) => {
                if (e.button == 2) {
                    let node = this.getNodeOnElement(e.target);
                    this.onRightClick(node,e);
                }
            });

            btns.bind("contextmenu",  (e: JQueryEventObject) => {
                e.preventDefault();
            });

            if (this.enableDrag) {
                this.initDragNode();
            }
            if (this.enableOuterDrag) {
                this.initOuterDrag();
            }
        }

        public getRoot(): BookMarkNode {
            for (let key in BookMarkManager.nodeTable) {
                let item = BookMarkManager.nodeTable[key];
                if (item.getSource().id == 0) {
                    return item;
                }
            }
        }

        private getNodeOnElement(element: Element): BookMarkNode {
            let nodeId = $(element).parents("li").attr("id");
            let node = BookMarkManager.nodeTable[nodeId];
            return node;
        }

        private isAncestorNode(ancestorNode: BookMarkNode, node: BookMarkNode): boolean {
            let ancestorData = ancestorNode.getSource();
            let nodeData = node.getSource();
            let check = (ancestor: BookMarkDataItem, curr: BookMarkDataItem) => {
                if (curr == null ) {
                    return false;
                }
                return ancestor.id == curr.pid || check(ancestor, this.getParent(curr.pid));
            }
            return check(ancestorData, nodeData);
        }

        private showCursorMoveIcon() {
            this.ele.children().css("cursor", "move").find("a").css("cursor", "move");
        }

        private hideCursorMoveIcon() {
            this.ele.children().css("cursor", "default").find("a").css("cursor", "default");
        }

        public setOuterDrag(state: boolean) {
            this.isOuterDrag = state;
            if (this.isOuterDrag) {
                this.showCursorMoveIcon();
            } else {
                this.hideCursorMoveIcon();
            }
        }

        private initOuterDrag(): void {
            let btns = this.ele.find("a");
            btns.bind("mousemove", (e: JQueryEventObject) => {
                if (!this.isOuterDrag) {
                    return;
                }
                let target = this.getNodeOnElement(e.target);
                this.select(target);
            });
            btns.bind("mouseup", (e: JQueryEventObject) => {
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

        private initDragNode(): void {
            let btns = this.ele.find("a");

            let startX: number;
            let startY: number;
            let currX: number;
            let currY: number;
            let isDrag: boolean;
            let dragNode: BookMarkNode;
            let targetNode: BookMarkNode;

            btns.bind("mousedown", (e: JQueryEventObject) => {
                if (e.target.tagName == "INPUT") {
                    return;
                }
                let getTarget = () => {
                    if (e.target.tagName == "SPAN") {
                        return $(e.target).parents("a");
                    } else {
                        return $(e.target);
                    }
                }
                this.showCursorMoveIcon();
                let target = getTarget();
                startX = e.pageX;
                startY = e.pageY;
                isDrag = true;
                dragNode = this.getNodeOnElement(e.target);
                e.preventDefault();
            });


            $("body").bind("mouseup", (e: JQueryEventObject) => {
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

            $("body").bind("mousemove", (e: JQueryEventObject) => {
                if (!isDrag) {
                    return;
                }
                currX = e.pageX;
                currY = e.pageY;
                if (!(Math.abs(currX - startX) > 10 || Math.abs(currY - startY) > 5 )) {
                    return;
                }
            });

            btns.bind("mouseenter", (e: JQueryEventObject) => {
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

        public onNodeClick = (arg: BookMarkNode, fold: boolean) => { };
        public onRightClick = (node: BookMarkNode, e: JQueryEventObject) => { };
        public onRename = (node: BookMarkNode) => { };
        public onMove = () => { };
        public onOuterDragUp = (node: BookMarkNode) => { }
    }
}