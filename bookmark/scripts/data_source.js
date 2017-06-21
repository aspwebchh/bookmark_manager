///<reference path="common.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var BookMark;
(function (BookMark) {
    class DataSource {
        static jsonpHttp(url, data = "") {
            return __awaiter(this, void 0, Promise, function* () {
                return new Promise((resolve, reject) => {
                    let ajaxSetting = {};
                    ajaxSetting.url = url;
                    ajaxSetting.type = "post";
                    ajaxSetting.dataType = "html";
                    ajaxSetting.data = { data: data };
                    ajaxSetting.success = (response) => {
                        resolve(response);
                    };
                    ajaxSetting.error = () => {
                        reject("请求出错");
                    };
                    $.ajax(ajaxSetting);
                });
            });
        }
        static getDataURL(method) {
            let url = `http://chhblog.com:9528/bookmark?method=${method}`;
            return url;
        }
        static getCategories() {
            return __awaiter(this, void 0, Promise, function* () {
                if (DataSource.cates != null) {
                    return DataSource.cates;
                }
                let url = DataSource.getDataURL("getCategories");
                let data = yield DataSource.jsonpHttp(url);
                if (!data) {
                    DataSource.cates = [{ id: 0, pid: -1, title: "" }];
                }
                else {
                    let result = JSON.parse(data);
                    DataSource.cates = result;
                    return result;
                }
            });
        }
        static updateCategories(data) {
            return __awaiter(this, void 0, Promise, function* () {
                DataSource.cates = data;
                let dataString = JSON.stringify(data);
                let url = DataSource.getDataURL("updateCategories");
                yield DataSource.jsonpHttp(url, dataString);
            });
        }
        static getAllPages() {
            return __awaiter(this, void 0, Promise, function* () {
                if (DataSource.pages != null) {
                    return DataSource.pages;
                }
                let url = DataSource.getDataURL("getAllPages");
                let jsonString = (yield DataSource.jsonpHttp(url)) || "[]";
                let jsonData = JSON.parse(jsonString);
                let data = jsonData;
                DataSource.pages = data;
                return data;
            });
        }
        static setAllPages(allData) {
            return __awaiter(this, void 0, Promise, function* () {
                DataSource.pages = allData;
                let dataString = JSON.stringify(allData);
                let url = DataSource.getDataURL("setAllPages");
                yield DataSource.jsonpHttp(url, dataString);
            });
        }
        static addPage(page) {
            return __awaiter(this, void 0, Promise, function* () {
                let data = yield DataSource.getAllPages();
                data.push(page);
                yield DataSource.setAllPages(data);
            });
        }
        static removePage(id) {
            return __awaiter(this, void 0, Promise, function* () {
                let data = yield DataSource.getAllPages();
                data = data.filter(n => n.id != id);
                yield DataSource.setAllPages(data);
            });
        }
        static editPage(page) {
            return __awaiter(this, void 0, Promise, function* () {
                yield this.removePage(page.id);
                yield this.addPage(page);
            });
        }
        static getPages(cid) {
            return __awaiter(this, void 0, Promise, function* () {
                const data = yield DataSource.getAllPages();
                return data.filter(n => n.cid == cid);
            });
        }
        static newPage(title, url, cid) {
            return __awaiter(this, void 0, Promise, function* () {
                let data = yield DataSource.getAllPages();
                let maxId = data.reduce((resultId, item) => {
                    let [, id] = item.id.split("-");
                    let numberId = Number.parseInt(id);
                    return resultId > numberId ? resultId : numberId;
                }, 0);
                let newId = maxId + 1;
                let idString = cid + "-" + newId;
                let newItemData = { id: idString, title: title, url: url, cid: cid };
                return newItemData;
            });
        }
    }
    BookMark.DataSource = DataSource;
})(BookMark || (BookMark = {}));
//# sourceMappingURL=data_source.js.map