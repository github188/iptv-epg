/*
  EPG Tools Module
*/

import Http from 'assets/lib/Http';
import Cookie from 'assets/lib/Cookie';
// import { _post } from './request';

const sessionCookie = {
    setItem(name, value) {
        Cookie(name, value);
    },
    getItem(name) {
        return Cookie(name);
    }
};

if (!window.sessionStorage) {
    window.sessionStorage = sessionCookie;
}

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
    let srch = location.search;

    if (!srch) {
        return '';
    }

    let argList = srch.substr(1).match(
        new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    );

    if (!argList || (type(argList) === 'array' && argList.length < 2)) {
        return '';
    }

    return unescape(argList[2]);
}

export function getIp(url, prefix) {
    // 默认返回带协议头的
    if (!prefix) {
        return url.match(/^https?:\/\/\d+\.\d+\.\d+\.\d+(:\d+)?/)[0];
    }

    return url.match(/\d+\.\d+\.\d+\.\d+(:\d+)?/)[0];
}

export function log(params = {
    code: '',
    detail: '',
    console: true,
    level: 1
}) {
    let wpath = ss('WelcomePageGroupPath');
    let mpath = ss('MainPath');
    if (wpath !== 'test' && mpath !== 'test') {
        return false;
    }

    // level required and must be a number
    if (type(params) === 'object'
        && (!params.level || type(params.level) !== 'number')
       ) {
        console.log(params.code + ': ' + params.detail
                    + ', level must be required');
        return false;
    }

    // params maybe other type(as String, Number, etc.)
    if (typeof(params) !== 'object') {
        let tmpObj = params;
        params = {
            code: 'Logging',
            detail: tmpObj,
            // if params is string, 4 for optional log
            level: 4
        };
    }

    // if no level arg, default value to 0(console output)
    let level = params.level;
    let detail = params.detail;
    let code = params.code;

    if (typeof(detail) === 'object') {
        detail = (detail
                  ? JSON.stringify(detail)
                  : 'detail is required but got null.'
                 );
    } else if (type(detail) === 'function') {
        detail = detail.toString();
    }

    // not false, or other type, or undefied
    if (type(params.console) !== 'boolean' || params.console) {
        console.log(code + '[' + level + ']: ' + detail);
    }

    // no debug info, decided by EPG_DEBUG_LEVEL's value
    // more info with `src/init.js`
    if (level > window.EPG_LOG_LEVEL) {
        return false;
    }

    const msgBody = {
        "USERID": ss("USERID"),
        "HostID": ss('HostID'),
        "OperationCode": code,
        "Detail": detail
    };
    // const host = window.location.protocol + '//' + window.location.host;
    // host optional
    let repath = ss('relativePath');
    const url = (repath
                 ? repath + '/epgservice/index.php?MessageType=EPGLogReq'
                 : '/epgservice/index.php?MessageType=EPGLogReq');
    post(msgBody, 'EPGLogReq', url, emptyFn, emptyFn);
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
        "Message": {
            "MessageType": type,
            "MessageBody": msgBody
        }
    };

    Http({
        type: 'POST',
        url: url,
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
    if (k && !v) {
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
            return true;
        }
        return sessionStorage.getItem(k);
    }

    sessionStorage.setItem('' + k, '' + v);
    return true;
}
/************E H5 Storage Relative ************/
