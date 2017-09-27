/*
 * @Author: hedgehog
 * @Date:   2016-11-22 19:33:07
 * @Last Modified by:   hedgehog
 * @Last Modified time: 2016-11-22 22:04:16
 */

const Http = function() {
    this.opt = {
        type: 'GET',
        url: '',
        data: '',
        complete(res) {},
        error(err) {}
    };
};
export default function(opt) {
    const http = new Http();
    for (const key in opt) {
        if (opt.hasOwnProperty(key)) {
            http.opt[key] = opt[key];
        }
    }
    const xhr = new XMLHttpRequest();
    function xhrFinish () {
        http.opt.complete(this);
    }
    function xhrError(argument) {
        alert("网络连接失败，请检查网络");
        http.opt.error(this);
    }
    xhr.addEventListener("load", xhrFinish);
    xhr.addEventListener("error", xhrError);
    xhr.open(http.opt.type.toUpperCase(), http.opt.url);
    switch(http.opt.type.toUpperCase()) {
    case 'POST':
        xhr.send(http.opt.data);
        break;
    case 'GET':
        xhr.send(null);
        break;
    }
    return http;
};
