﻿///<reference path="common.ts" />
namespace BookMark {
    export class BookMarkPageList {
        private dataList: BookMarkPageDataItem[] = [];
        private targetElementId: string;
        private ele: JQuery;
        private dragDataItem: BookMarkPageDataItem;
        private isEdit = false;

        public onItemAdd = (data: BookMarkPageDataItem) => { };
        public onItemEdit = (data: BookMarkPageDataItem) => { };
        public onItemDel = (data: BookMarkPageDataItem) => { };
        public onRightClick = (e: JQueryEventObject, dataItem: BookMarkPageDataItem) => { }
        public onDragDown = () => { }
        public onDragUp = () => { }

        public getSource() {
            return this.dataList;
        }

        public getDragDataItem() {
            return this.dragDataItem;
        }

        private getDataItem( id: string ): BookMarkPageDataItem {
            return this.dataList.filter( n => id == n.id )[ 0 ];
        }

        public add( dataItem: BookMarkPageDataItem ) {
            this.dataList.push( dataItem );
        }

        private genStdUrl (url:string): string{
            if (!/^http(s)?:\/\//.test(url)) {
                url = "http://" + url;
            }
            return url;
        }

        public editItem(id: string) {
            this.isEdit = true;
            let itemElement = $(`[data-id=${id}]`);
            let dataItem = this.getDataItem(id);
            let itemContentHtml = `<span class="title">
                                <input type="text" name='title' value='${dataItem.title}'/>
                            </span>
                            <span class="url">
                                <input type="text" name='url' value='${dataItem.url}' />
                            </span>`;
            itemElement.html(itemContentHtml);

            let getTitleElement = () => itemElement.find('[name=title]');
            let getUrlElement = () => itemElement.find('[name=url]');
            getTitleElement().select().focus();

            let editItemHandler = (e: JQueryEventObject) => {
                if (itemElement.get(0).contains(e.target)) {
                    return;
                }
                let title = $.trim(getTitleElement().val());
                let url = $.trim(getUrlElement().val());
                 if (title != "" && url != "") {
                     url = this.genStdUrl(url);
                     dataItem.title = title;
                     dataItem.url = url;
                     this.onItemEdit(dataItem);
                     this.reRender();
                     this.isEdit = false;
                 }
                 $(document).unbind("click", editItemHandler);
            };

            //document的click事件自动触发问题
            window.setTimeout(()=>{
                 $(document).bind("click", editItemHandler);
            },1);
        }

        public newItem(cid: number) {
            let html = `<li>
                            <span class="title">
                                <input type="text" name='title'/>
                            </span>
                            <span class-="url">
                                <input type="text" name='url' />
                            </span>
                        </li>`;
            let newItemEle = $(html)
            this.ele.append(newItemEle);

            let getTitleElement = () => newItemEle.find('[name=title]');
            let getUrlElement = () => newItemEle.find('[name=url]');
            getTitleElement().focus().select();

            let newItemHandler = async (e: JQueryEventObject) => {
                if (newItemEle.get(0).contains(e.target)) {
                    return;
                }
                let title = $.trim(getTitleElement().val());
                let url = $.trim(getUrlElement().val());
                if (title != "" && url != "") {
                    url = this.genStdUrl(url);
                    let newItemData: BookMarkPageDataItem = await DataSource.newPage(title, url, cid);
                    this.add(newItemData);
                    this.onItemAdd(newItemData);
                }
                this.reRender();
                $(document).unbind("click", newItemHandler);
            }
            window.setTimeout(() => {
                $(document).bind("click", newItemHandler);
            }, 1);
        }

        public empty() {
            this.dataList = [];
            this.reRender();
        }

        private getDataItemByElement(itemElement: Element) {
            let liElement = itemElement.tagName == 'LI' ? $(itemElement) : $(itemElement).parents("li");
            let dataId = liElement.attr("data-id");
            let dataItem = this.getDataItem(dataId);
            return dataItem;
        }

        public render(targetElementId: string) {
            this.targetElementId = targetElementId;
            let html = this.dataList.reduce<string>((result, ele, index, list) => {
                return result + `<li data-id='${ele.id}'>
                                <a class="title">${ele.title}</a>
                                <a class="url">${ele.url}</a>
                            </li>`;
            }, "");
            this.ele = $("#" + targetElementId).html(html);

            this.ele.find("li").bind("contextmenu", (e: JQueryEventObject) => {
                let dataItem = this.getDataItemByElement(e.target);
                this.onRightClick(e, dataItem);
                e.preventDefault();
            });

            this.initDrag();
        }

        private showCursorMoveIcon() {
            this.ele.find("li").css("cursor", "move");
            $("body").css("cursor", "move");
        }

        private hideCursorMoveIcon() {
            this.ele.find("li").css("cursor", "default");
            $("body").css("cursor", "default");
        }

        private initDrag() {
            this.ele.find("li").bind("mousedown", (e: JQueryEventObject) => {
                if (this.isEdit) {
                    return;
                }
                let dataItem = this.getDataItemByElement(e.target);
                this.dragDataItem = dataItem;
                this.showCursorMoveIcon();
                this.onDragDown();
                e.preventDefault();
            });
            $(document).bind("mouseup", (e: JQueryEventObject) => {
                if (this.isEdit) {
                    return;
                }
                this.dragDataItem = null;
                this.hideCursorMoveIcon();
                this.onDragUp();
            });
            this.ele.find("li").bind("mousemove", (e: JQueryEventObject) => {
                
            });
        }

        public reRender(): void {
            this.render(this.targetElementId);
        }

        public removeItem(id: string): void {
            this.onItemDel(this.getDataItem(id));
            this.dataList = this.dataList.filter(n => n.id != id);
            this.reRender();
        }
    }
}