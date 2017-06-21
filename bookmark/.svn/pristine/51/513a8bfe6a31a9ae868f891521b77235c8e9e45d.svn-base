/// <reference path="jquery/jquery.d.ts" />
var ContentScripts;
(function (ContentScripts) {
    function init() {
        chrome.extension.onRequest.addListener((request, sender, sendResponse) => {
            let giftData = request;
            sendGifts(giftData, (data) => {
                let reData = {};
                reData.success = true;
                reData.uid = giftData.recipient;
                sendResponse(reData);
            });
        });
    }
    function sendGifts(giftData, callback) {
        let ajaxOption = new Object;
        ajaxOption.url = "/support/gift_user/";
        ajaxOption.method = "post";
        ajaxOption.dataType = "html";
        ajaxOption.data = giftData;
        ajaxOption.success = (response) => {
            callback(response);
        };
        $.ajax(ajaxOption);
    }
    $(() => {
        init();
    });
})(ContentScripts || (ContentScripts = {}));
