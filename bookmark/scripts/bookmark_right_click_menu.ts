﻿///<reference path="jquery/jquery.d.ts" />
///<reference path="bookmark_container.ts" />
namespace BookMark {
    export enum MenuType {
        BookMarkNavMenu,
        PageList
    }

   export class MenuId {
        public static AddDir = "add_dir";
        public static AddPage = "add_page";
        public static DelDir = 'del_dir';
        public static RenameDir = "rename_dir";
    }


    export abstract class RightClickMenu {
        protected ele: JQuery;

        private exceptElement: HTMLElement;

        public setExceptElement(ele: HTMLElement) {
            this.exceptElement = ele;
        }

        public removeMenuItem( menuId: string ) {
            this.ele.find("li[id='"+ menuId +"']").remove();
        }

        public show(left: number, top: number): void {
            this.endableAll();
            this.ele.show().offset({ left: left, top: top });
        }

        public hide(): void {
            this.ele.hide();
        }

        public disable(...menuIds: string[]) {
            menuIds.forEach(id => this.ele.find("#" + id).attr("enable", "false"));
        }

        private endableAll() {
            this.ele.find("li").removeAttr("enable");
        }

        public render(): void {
            let html = this.getMenuHtml();
            let menuElement = $(html).hide();
            $('body').append(menuElement);
            this.ele = menuElement;

            $(document).bind("click", (e: JQueryEventObject) => {
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

            this.ele.find("li").click((e: JQueryEventObject) => {
                if ($(e.target).attr("enable") == "false") {
                    return;
                }
                let id = e.target.id;
                this.hide();
                this.eventProxy(id);
            });
        }

        protected abstract eventProxy(evenName: string);

        protected abstract getMenuHtml(): string;
    }

    export class BookMarkRightClickMenu extends RightClickMenu {
        private targetNode: BookMarkNode;
        
        public onAddDir = () => { }
        public onAddPage = () => { }
        public onDel = () => { }
        public onRename = () => { }

        public setTargetNode(node: BookMarkNode) {
            this.targetNode = node;
        }

        public getTargetNode(): BookMarkNode {
            return this.targetNode;
        }

        protected eventProxy(evenName: string) {
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

        protected getMenuHtml(): string {
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


    export class PageListRightClickMenu extends RightClickMenu {
        public onOpen = () => { }
        public onEdit = () => { }
        public onDel = () => { }

        protected eventProxy(evenName: string) {
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

        protected getMenuHtml(): string {
            return `<div class="menu" id='right_click_menu'>
                            <ul>
                                <li id="open_url">打开网页</li>
                                <li id="del">删除</li>
                                <li id="edit">编辑</li>
                            </ul>
                        </div>`;
        }

    }
}
