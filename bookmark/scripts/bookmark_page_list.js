var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
///<reference path="common.ts" />
var BookMark;
(function (BookMark) {
    class BookMarkPageList {
        constructor() {
            this.dataList = [];
            this.isEdit = false;
            this.onItemAdd = (data) => { };
            this.onItemEdit = (data) => { };
            this.onItemDel = (data) => { };
            this.onRightClick = (e, dataItem) => { };
            this.onDragDown = () => { };
            this.onDragUp = () => { };
        }
        getSource() {
            return this.dataList;
        }
        getDragDataItem() {
            return this.dragDataItem;
        }
        getDataItem(id) {
            return this.dataList.filter(n => id == n.id)[0];
        }
        add(dataItem) {
            this.dataList.push(dataItem);
        }
        genStdUrl(url) {
            if (!/^http(s)?:\/\//.test(url)) {
                url = "http://" + url;
            }
            return url;
        }
        editItem(id) {
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
            let editItemHandler = (e) => {
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
            window.setTimeout(() => {
                $(document).bind("click", editItemHandler);
            }, 1);
        }
        newItem(cid) {
            let html = `<li>
                            <span class="title">
                                <input type="text" name='title'/>
                            </span>
                            <span class-="url">
                                <input type="text" name='url' />
                            </span>
                        </li>`;
            let newItemEle = $(html);
            this.ele.append(newItemEle);
            let getTitleElement = () => newItemEle.find('[name=title]');
            let getUrlElement = () => newItemEle.find('[name=url]');
            getTitleElement().focus().select();
            let newItemHandler = (e) => __awaiter(this, void 0, void 0, function* () {
                if (newItemEle.get(0).contains(e.target)) {
                    return;
                }
                let title = $.trim(getTitleElement().val());
                let url = $.trim(getUrlElement().val());
                if (title != "" && url != "") {
                    url = this.genStdUrl(url);
                    let newItemData = yield BookMark.DataSource.newPage(title, url, cid);
                    this.add(newItemData);
                    this.onItemAdd(newItemData);
                }
                this.reRender();
                $(document).unbind("click", newItemHandler);
            });
            window.setTimeout(() => {
                $(document).bind("click", newItemHandler);
            }, 1);
        }
        empty() {
            this.dataList = [];
            this.reRender();
        }
        getDataItemByElement(itemElement) {
            let liElement = itemElement.tagName == 'LI' ? $(itemElement) : $(itemElement).parents("li");
            let dataId = liElement.attr("data-id");
            let dataItem = this.getDataItem(dataId);
            return dataItem;
        }
        render(targetElementId) {
            this.targetElementId = targetElementId;
            let html = this.dataList.reduce((result, ele, index, list) => {
                return result + `<li data-id='${ele.id}'>
                                <a class="title">${ele.title}</a>
                                <a class="url">${ele.url}</a>
                            </li>`;
            }, "");
            this.ele = $("#" + targetElementId).html(html);
            this.ele.find("li").bind("contextmenu", (e) => {
                let dataItem = this.getDataItemByElement(e.target);
                this.onRightClick(e, dataItem);
                e.preventDefault();
            });
            this.initDrag();
        }
        showCursorMoveIcon() {
            this.ele.find("li").css("cursor", "move");
            $("body").css("cursor", "move");
        }
        hideCursorMoveIcon() {
            this.ele.find("li").css("cursor", "default");
            $("body").css("cursor", "default");
        }
        initDrag() {
            this.ele.find("li").bind("mousedown", (e) => {
                if (this.isEdit) {
                    return;
                }
                let dataItem = this.getDataItemByElement(e.target);
                this.dragDataItem = dataItem;
                this.showCursorMoveIcon();
                this.onDragDown();
                e.preventDefault();
            });
            $(document).bind("mouseup", (e) => {
                if (this.isEdit) {
                    return;
                }
                this.dragDataItem = null;
                this.hideCursorMoveIcon();
                this.onDragUp();
            });
            this.ele.find("li").bind("mousemove", (e) => {
            });
        }
        reRender() {
            this.render(this.targetElementId);
        }
        removeItem(id) {
            this.onItemDel(this.getDataItem(id));
            this.dataList = this.dataList.filter(n => n.id != id);
            this.reRender();
        }
    }
    BookMark.BookMarkPageList = BookMarkPageList;
})(BookMark || (BookMark = {}));
//# sourceMappingURL=bookmark_page_list.js.map