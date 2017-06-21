var Control;
(function (Control) {
    var SendResultState;
    (function (SendResultState) {
        SendResultState[SendResultState["df"] = 1] = "df";
        SendResultState[SendResultState["success"] = 2] = "success";
        SendResultState[SendResultState["fail"] = 3] = "fail";
    })(SendResultState || (SendResultState = {}));
    function getUIDs(callback) {
        let result = new Object;
        let uidEl = $("#user_id").get(0);
        let uidFile = uidEl.files[0];
        if (!uidFile) {
            result.error = true;
            result.message = `没有读取到文件`;
            callback(result);
            return;
        }
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(uidFile);
        fileReader.onload = (env) => {
            let value = $.trim(fileReader.result);
            if (value == null || value == "") {
                result.error = true;
                result.message = `文件无数据`;
                callback(result);
            }
            else {
                result.error = false;
                result.message = "";
                result.data = string2Array(value);
                callback(result);
            }
        };
    }
    function string2Array(str) {
        let items = str.split(/\s/);
        items = items.map((n) => {
            return $.trim(n);
        }).filter(n => {
            return n.length > 0;
        });
        return items;
    }
    function init() {
        $("#submit").bind("click", function () {
            getUIDs((result) => {
                if (result.error) {
                    alert(result.message);
                }
                else {
                    let temp = {};
                    let sendPool = new SendPool(result.data);
                    sendPool.start();
                }
            });
        });
    }
    class SendPool {
        constructor(uids) {
            this.pool = [];
            uids.forEach(uid => {
                let sendResult = {};
                sendResult.uid = uid;
                sendResult.state = SendResultState.df;
                this.pool.push(sendResult);
            });
        }
        sendMessage(data) {
            let result = "";
            chrome.tabs.getSelected((tab) => {
                chrome.tabs.sendRequest(tab.id, data, (response) => {
                    if (response.success) {
                        this.markUidToPool(response.uid, SendResultState.success);
                    }
                    else {
                        this.markUidToPool(response.uid, SendResultState.fail);
                    }
                });
            });
        }
        showResult() {
            console.log(`发送完成`);
            this.showProcess();
        }
        showProcess() {
            let getCount = (state) => {
                return this.pool.filter(item => {
                    return item.state == state;
                }).length;
            };
            let dfCount = getCount(SendResultState.df);
            let successCount = getCount(SendResultState.success);
            let failCount = getCount(SendResultState.fail);
            let processHtml = "";
            processHtml += `成功：${successCount},
                            失败：${failCount},
                            未发送：${dfCount}`;
            $("#proccess").html(processHtml);
        }
        getGiftData(uid) {
            let data = {};
            data.coins = $("#coins").val();
            data.gems = $("#gems").val();
            data.message = $("#message").val();
            data.subject = $("#subject").val();
            data.recipient = uid;
            return data;
        }
        start() {
            let timer = window.setInterval(() => {
                var uid = this.getUID();
                if (uid == null) {
                    window.clearInterval(timer);
                    this.showResult();
                    return;
                }
                this.sendMessage(this.getGiftData(uid));
                this.showProcess();
            }, 100);
        }
        markUidToPool(uid, state) {
            for (let sendResult of this.pool) {
                if (sendResult.uid == uid && sendResult.state == SendResultState.df) {
                    sendResult.state = state;
                    break;
                }
            }
        }
        getUID() {
            for (let sendResult of this.pool) {
                if (sendResult.state == SendResultState.df) {
                    return sendResult.uid;
                }
            }
            return null;
        }
    }
    init();
})(Control || (Control = {}));
