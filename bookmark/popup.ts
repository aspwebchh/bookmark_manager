///<reference path="scripts/jquery/jquery.d.ts" />
///<reference path="scripts/bookmark_right_click_menu.ts" />
///<reference path="scripts/bookmark_container.ts" />
///<reference path="scripts/data_source.ts" />
namespace BookMark {
    class Popup {
        private bookMarkNavManager: BookMarkManager;
        private bookMarkNavRightMenu: BookMarkRightClickMenu;
        private selectedNode: BookMarkNode;

        constructor() {
            this.initNavMenu();
            this.fillCurrBookMarkInfo();
            this.initSaveAction();
            this.initManagerAction(); 
        }

        private initSaveAction() {

            let showErrorMessage = (msg:string)=>{
                $("#error_msg").html(msg).show();
            };
            let hideErrorMessage = ()=>{
                $("#error_msg").html('').hide();
            };
            $("#ok").bind("click",async ()=>{
                let title = $.trim( $("#title").val() );
                let url = $.trim( $("#url").val() );
                if( title == '' ) {
                    showErrorMessage("请输入标题");
                    return;
                }
                if( url == '' ) {
                    showErrorMessage("请输入网址");
                    return;
                }
                if( this.selectedNode == null ) {
                    showErrorMessage("请选择目录");
                    return;
                }
                let bookMarkId = this.selectedNode.getSource().id;
                let newPage = await DataSource.newPage(title, url, bookMarkId);
                DataSource.addPage(newPage);
                hideErrorMessage();
                window.close();
            });
        }

        private initManagerAction() {
            $("#manager").bind("click", function () {
                window.open("manager.html");
            });
        }

        private fillCurrBookMarkInfo() {
            chrome.tabs.getSelected((tab: chrome.tabs.Tab) => {
                $("#title").val(tab.title);
                $("#url").val(tab.url);
            });
        }

        private async initNavMenu() {
            this.bookMarkNavManager = new BookMarkManager();
            this.bookMarkNavManager.enableDrag = false;
            this.bookMarkNavManager.enableOuterDrag = false;

            let data = await DataSource.getCategories();
            data.forEach(item => this.bookMarkNavManager.addBookMarkData(item));
            this.bookMarkNavManager.onNodeClick = (arg: BookMarkNode) => {
                this.selectedNode = arg;
                this.bookMarkNavManager.select(arg);
            };
            this.bookMarkNavManager.render("cate");
        }
    }

    new Popup();
}