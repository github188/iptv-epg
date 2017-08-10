/*
  EPG Tools Module


*/

import Http from '../../assets/lib/Http';

export function toArray(obj) {
    if (!obj || !obj.length) {
        return null;
    }

    return Array.prototype.slice.call(obj);
}

export function queryParams(name) {

    /*
      TODO: Any string with params can be resolved, but only location
    */

    return unescape(
        location.search.substr(1).match(
            new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
        )[2]
    );
}

export function getIp(url, prefix) {
    // 默认返回带协议头的
    if (!!!prefix) {
        return url.match(/^https?:\/\/\d+\.\d+\.\d+\.\d+(\:\d+)?/)[0];
    } else {
        return url.match(/\d+\.\d+\.\d+\.\d+(\:\d+)?/)[0];
    }
}

export function log(params = {
    code: '',
    detail: ''
}) {
    let detail = params.Detail;
    let code = params.OperationCode;

    if (type(detial) === 'object' || type(detail) === 'array') {
        detail = JSON.stringify(detail);
    }
    const msgBody = {
        "USERID": ss("USERID"),
        "HostID": ss('HostID'),
        "OperationCode": params.OperationCode,
        "Detail": params.Detail
    };
    const url = ss('relativePath') + '/epgservice/index.php?MessageType=EPGLogReq';
    _post(msgBody, type, url, emptyFn, emptyFn);
}

export function type(obj) {
    return (Object.prototype.toString
            .call(obj)
            .split(' ')[1]
            .replace(/]/, '')
            .toLowerCase()
           );
}

export function post(msgBody, type, url, success, fail) {
    const tmpObj = {
        'Message': {
            "MessageType": type,
            "MessageBody": msgBody
        }
    };

    Http({
        type: 'POST',
        url, url,
        data: JSON.stringify(tmpObj),
        complete: success,
        error: fail
    });
}

export function emptyFn() {}

export function copyObj(obj) {
    if (!obj || obj === null) {
        return {};
    }

    let bakObj = {};

    for (let prop in obj) {
        // only copy self prop
        if (obj.hasOwnProperty(prop)) {
            bakObj[prop] = obj[prop];
        }
    }

    return bakObj;
}


export function debug(name, str) {
    if (!str || str === '') {
        return false;
    }

    console.log('--------------------------- ' + name);
    if (typeof(str) === 'object') {
        str = JSON.stringify(str);
    }
    console.log('      ' + str);

    return true;
}


/************S H5 Storage Relative ************/
export function ss(k, v) {
    if (!k || k === '') {
        return false;
    }

    // to get
    if (k && !!!v) {
        if (type(k) === 'array') {
            // 1. 数组，返回结果数组
            let result = [];
            for (let i = 0, len = k.length; i < len; i++) {
                result.push(sessionStorage.getItem(k[i]));
            }

            return result;
        } else if (type(k) === 'object') {
            // 2. 对象，设置
            for (let prop in k) {
                sessionStorage.setItem(prop, k[prop]);
            }
        }
        return sessionStorage.getItem('' + k);
    }

    sessionStorage.setItem('' + k, '' + v);
    return true;
}
/************E H5 Storage Relative ************/
