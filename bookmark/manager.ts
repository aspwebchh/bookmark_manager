///<reference path="scripts/jquery/jquery.d.ts" />
///<reference path="scripts/bookmark_right_click_menu.ts" />
///<reference path="scripts/bookmark_container.ts" />
///<reference path="scripts/bookmark_page_list.ts" />
///<reference path="scripts/data_source.ts" />
namespace BookMark {
    class Main {
        private bookMarkNavManager: BookMarkManager;
        private bookMarkNavRightMenu: BookMarkRightClickMenu;

        private bookMarkPageList: BookMarkPageList;
        private pageListRightClickMenu: PageListRightClickMenu;


        constructor() {
            this.bookMarkNavManager = new BookMarkManager();
            this.bookMarkNavRightMenu = new BookMarkRightClickMenu();
            this.bookMarkPageList = new BookMarkPageList();
            this.pageListRightClickMenu = new PageListRightClickMenu();

            this.initNavMenu();
            this.initPageList();

            this.initPageSet();

            this.initTopBookMarkNav();

            //this.bookMarkNavManager.setOuterDrag(true);
        }

        private initPageSet() {
            let navEl = $(".nav");
            let pageListEl = $(".page_list")
            let wndHeight = $(window).height();
            let top = navEl.offset().top;
            let height = wndHeight - top;
            navEl.height(height);
            pageListEl.height(height);
        }

        private initTopBookMarkNav() {
            let btn = $("#top");
            this.bookMarkNavRightMenu.setExceptElement(btn.get(0));
            btn.bind("click", (e: JQueryEventObject) => {
                let {left, top} = $(e.target).offset();
                this.bookMarkNavRightMenu.show(left - 5, top + 20);
                this.bookMarkNavRightMenu.setTargetNode(this.bookMarkNavManager.getRoot());
                this.bookMarkNavRightMenu.disable(MenuId.AddPage, MenuId.DelDir, MenuId.RenameDir);
            });
        }

        private async initNavMenu() {
            let saveData = () => {
                DataSource.updateCategories(this.bookMarkNavManager.getDataSource());
            };

            this.bookMarkNavRightMenu.onAddDir = () => {
                let node = this.bookMarkNavRightMenu.getTargetNode();
                this.bookMarkNavManager.newItem(node.getSource().id);
                saveData();
            }
            this.bookMarkNavRightMenu.onAddPage = () => {
                this.bookMarkPageList.newItem(this.bookMarkNavRightMenu.getTargetNode().getSource().id);
            }
            this.bookMarkNavRightMenu.onDel = async () => {
                let node = this.bookMarkNavRightMenu.getTargetNode();
                let nodeId = node.getSource().id;
                let pages = await DataSource.getPages(nodeId);
                if (pages.length > 0) {
                    alert("请选择删除书签内容");
                    return;
                }
                let success = this.bookMarkNavManager.removeItem(node.getSource().id);
                if (!success) {
                    alert("请先删除子目录");
                }
                saveData();
            }
            this.bookMarkNavRightMenu.onRename = () => {
                let node = this.bookMarkNavRightMenu.getTargetNode();
                node.getSource().state = BookMarkDataItemState.Rename;
                this.bookMarkNavManager.reRender();
                saveData();
            }
            this.bookMarkNavRightMenu.render();


            this.bookMarkNavManager = new BookMarkManager();
            this.bookMarkNavManager.onRightClick = (node: BookMarkNode, e: JQueryEventObject) => {
                let offset = node.getNodeElement().offset();
                this.bookMarkNavRightMenu.show(e.pageX + 2, e.pageY + 2);
                this.bookMarkNavRightMenu.setTargetNode(node);

                this.pageListRightClickMenu.hide();
            }
            this.bookMarkNavManager.onRename = (node: BookMarkNode) => {
                saveData();
            }
            this.bookMarkNavManager.onMove = () => {
                saveData();
            }

            let renderPageList = async (cid: number ) => {
                this.bookMarkPageList.empty();
                let data = await DataSource.getPages(cid);
                data.forEach(item => this.bookMarkPageList.add(item));
                this.bookMarkPageList.reRender();
            }

            this.bookMarkNavManager.onOuterDragUp = async (node: BookMarkNode) => {
                let page = this.bookMarkPageList.getDragDataItem();
                page.cid = node.getSource().id;
                await DataSource.editPage(page);
                await renderPageList(page.cid);
            }

            this.bookMarkNavManager.onNodeClick = async (arg: BookMarkNode, fold: boolean) => {
                this.bookMarkNavManager.select(arg);
                renderPageList(arg.getSource().id);
                if (fold) {
                    await DataSource.updateCategories(this.bookMarkNavManager.getDataSource());
                }
            };

            let data = await DataSource.getCategories();
            data.forEach(item => this.bookMarkNavManager.addBookMarkData(item));

            this.bookMarkNavManager.render("bookmark_nav"); 
        }

        private initPageList() {
            let selectedBookMarkPageDataItem: BookMarkPageDataItem;

            this.bookMarkPageList.render("page_list");
            this.bookMarkPageList.onItemAdd = (data: BookMarkPageDataItem) => {
                DataSource.addPage(data);
            }
            this.bookMarkPageList.onItemEdit = (data: BookMarkPageDataItem) => {
                DataSource.editPage(data);
            }
            this.bookMarkPageList.onItemDel = (data: BookMarkPageDataItem) => {
                DataSource.removePage(data.id);
            }
            this.bookMarkPageList.onRightClick = (e: JQueryEventObject, dataItem: BookMarkPageDataItem) => {
                selectedBookMarkPageDataItem = dataItem;
                this.pageListRightClickMenu.show(e.pageX, e.pageY);
                 
                this.bookMarkNavRightMenu.hide();
            }
            this.bookMarkPageList.onDragDown = () => {
                this.bookMarkNavManager.setOuterDrag(true);
            };
            this.bookMarkPageList.onDragUp = () => {
                this.bookMarkNavManager.setOuterDrag(false);
            };


            this.pageListRightClickMenu.render();
            this.pageListRightClickMenu.onDel = () => {
                this.bookMarkPageList.removeItem(selectedBookMarkPageDataItem.id);
            }
            this.pageListRightClickMenu.onEdit = () => {
                this.bookMarkPageList.editItem(selectedBookMarkPageDataItem.id);
            }
            this.pageListRightClickMenu.onOpen = () => {
                window.open(selectedBookMarkPageDataItem.url);
            }
        }
    }
    new Main();
}
