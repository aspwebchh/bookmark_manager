///<reference path="common.ts" />

namespace BookMark {
    export class DataSource {

        private static cates: BookMarkDataItem[];
        private static pages: BookMarkPageDataItem[];

        private static async jsonpHttp(url: string, data = ""): Promise<any> {
            return new Promise<any>((resolve, reject) => {
                let ajaxSetting = {} as JQueryAjaxSettings;
                ajaxSetting.url = url;
                ajaxSetting.type = "post";
                ajaxSetting.dataType = "html";
                ajaxSetting.data = { data: data };
                ajaxSetting.success = (response) => {
                    resolve(response);
                }
                ajaxSetting.error = () => {
                    reject("请求出错");
                }
                $.ajax(ajaxSetting);
            });
        }
 
        private static getDataURL(method: string): string {
            let url = `http://chhblog.com:9528/bookmark?method=${method}`;
            return url;
        }
    
        public static async getCategories(): Promise<BookMarkDataItem[]>{
            if (DataSource.cates != null) {
                return DataSource.cates;
            }
            let url = DataSource.getDataURL("getCategories");
            let data = await DataSource.jsonpHttp(url);
            if (!data) {
                DataSource.cates = [{ id: 0, pid: -1, title: "" }];
            } else {
                let result = JSON.parse(data) as BookMarkDataItem[];
                DataSource.cates = result;
                return result;
            }
        }

        public static async updateCategories(data: BookMarkDataItem[]): Promise<void>{
            DataSource.cates = data;
            let dataString = JSON.stringify(data);
            let url = DataSource.getDataURL("updateCategories");
            await DataSource.jsonpHttp(url, dataString);
        }

        private static async getAllPages(): Promise<BookMarkPageDataItem[]> {
            if (DataSource.pages != null) {
                return DataSource.pages;
            }
            let url = DataSource.getDataURL("getAllPages");
            let jsonString = await DataSource.jsonpHttp(url) || "[]";
            let jsonData = JSON.parse(jsonString);
            let data = jsonData as BookMarkPageDataItem[];
            DataSource.pages = data;
            return data;
        }

        private static async setAllPages(allData: BookMarkPageDataItem[]): Promise<void>{
            DataSource.pages = allData;
            let dataString = JSON.stringify(allData);
            let url = DataSource.getDataURL("setAllPages");
            await DataSource.jsonpHttp(url, dataString);
        }

        public static async addPage(page: BookMarkPageDataItem): Promise<void> {
            let data = await DataSource.getAllPages();
            data.push(page);
            await DataSource.setAllPages(data);
        }

        public static async removePage(id: string): Promise<void> {
            let data = await DataSource.getAllPages();
            data = data.filter(n => n.id != id);
            await DataSource.setAllPages(data);
        }

        public static async editPage(page: BookMarkPageDataItem): Promise<void> {
            await this.removePage(page.id);
            await this.addPage(page);
        }

        public static async getPages(cid: number): Promise<BookMarkPageDataItem[]> {
            const data = await DataSource.getAllPages();
            return data.filter(n => n.cid == cid);
        }

        public static async newPage(title: string, url: string, cid: number): Promise<BookMarkPageDataItem> {
            let data = await DataSource.getAllPages();
            let maxId = data.reduce<number>((resultId, item) => {
                let [, id] = item.id.split("-");
                let numberId = Number.parseInt(id);
                return resultId > numberId ? resultId : numberId;
            }, 0)
            let newId = maxId + 1;
            let idString = cid + "-" + newId;
            let newItemData: BookMarkPageDataItem = { id: idString, title: title, url: url, cid: cid };
            return newItemData;
        }
    }
}