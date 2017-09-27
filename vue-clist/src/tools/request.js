/*
  EPG 请求
*/

'use strict';

import {
    post,
    ss,
    log,
    type,
    copyObj,
    queryParams
} from './utils';
import operatorConfig from './operator';
import goto from '../pages/jump';

let isRequesting = false;
const relativePath = ss('relativePath');
const reqUrl = (relativePath
                ? relativePath + '/epgservice/index.php?MessageType='
                : '/epgservice/index.php?MessageType='
               );
const reqTypesObj = {
    login: 'STBLoginReq',
    auth: 'DoAuthReq',
    sysParam: 'GetSysParamReq'
};

// callback of login successed
function loginSuccess(data) {
    if (!data || data === null) {
        console.log('login failed, data null.');
        return false;
    }

    if (data.status === 200) {
        const _data = JSON.parse(data.response);

        if (!_data) {
            log('loginSuccess: response data error.');
            return false;
        }

        const _msgBody = _data.Message.MessageBody;

        if (_msgBody.ResultCode == 200) {
            const tmpObj = {
                HostID: _msgBody.HostID,
                UserID: _msgBody.UserID,
                AdPath: _msgBody.AdPath,
                MainPath: _msgBody.MainPath,
                WelcomePageGroupPath: _msgBody.WelcomePageGroupPath
            };

            ss(tmpObj);

            isRequesting = false;

            log({
                code: 'loginSuccess',
                detail: _msgBody,
                level: 2
            });

            // login successed, ready to do auth
            doAuth();

        } else {
            goto('iptv', 'loginSuccess: request data failed.', data);
        }
    } else {
        goto('iptv', 'loginSuccess: network broken.', data);
    }

    isRequesting = false;

    return true;
}

// callback of login failed
function loginFail(error) {
    goto('iptv', 'loginFail: login failed.');
}

// callback of auth successed
function authSuccess(data) {
    if (!data || data === null) {
        console.log('authSuccess: response data error.');
        return false;
    }

    if (data.status == 200) {
        const _data = JSON.parse(data.response);
        const _msgBody = _data.Message.MessageBody;

        if (_msgBody.ResultCode == 200) {
            const tmpObj = {
                EPGDirectory: _msgBody.EPGDirectory,
                EPGTemplateType: _msgBody.EPGTemplateType,
                EpgGroupID: _msgBody.EpgGroupID,
                LoginID: _msgBody.LoginID,
                RootCategoryID: _msgBody.RootCategoryID,
                Token: _msgBody.Token
            };

            ss(tmpObj);

            isRequesting = false;

            log({
                code: 'authSuccess',
                detail: _msgBody,
                level: 2
            });

            // auth passed, ready to get system params.
            getSysParams();

        } else {
            goto('iptv', 'authSuccess: request data failed.', data);
        }
    } else {
        goto('iptv', 'authSuccess: network broken.', data);
    }

    isRequesting = false;

    return true;
}

// callback of auth failed
function authFail(error) {
    goto('iptv', 'authFail: auth failed.');
}

// callback of success to get system params
function getSysParamsSuccess(data) {
    if (!data || data === null) {
        return false;
    }

    if (data.status == 200) {
        const _data = JSON.parse(data.response);
        const _msgBody = _data.Message.MessageBody;
        if (_msgBody.ResultCode == 200) {
            _msgBody.ParamList.Param.map(item => {
                ss(item.Name, item.Value);
            });
            // system params got, ready to locate welcome page
            const pageName = (queryParams('cKey') === 'back') ? 'main' : 'welcome';

            log({
                code: 'getSysParamsSuccess',
                detail: {
                    ..._msgBody,
                    pageName
                },
                level: 2
            });

            // jump to welcome or main page
            // TODO cut comment, now for test
            goto(pageName);

        } else {
            goto('iptv', 'getSysparamsSuccess: response data error.', data);
        }
    } else {
        goto('iptv', 'getSysParamsSuccess: network broken.', data);
    }

    return true;
}

// callback of failed to get system params
function getSysParamsFail(error) {
    console.log('get system params failed.');
}

// append more params for login request
function paramConfig(reqObj) {
    if (type(reqObj) !== 'object' || !reqObj) {
        log('request.js paramConfig reqObj: ' + JSON.stringify(reqObj));
        return false;
    }
    const userID = operatorConfig('UserID');
    const platform = ss('from');
    const province = ss('province');

    log('paramConfig userID:' + userID + ', province: ' + province);

    switch (province) {
        case '云南':
            reqObj.USERID = userID;
            break;
        case '湖北':
            reqObj.USERID = ss('oss_user_id');
            reqObj.HotelGroupName = ss('group_name');
            reqObj.HotelGroupID = ss('cdc_group_id');
            break;
        case '河南':
            if (platform === 'huawei') {
                reqObj.USERID = ss('userid') || userID;
                reqObj.Platform = 'HUAWEI';
            } else {
                reqObj.USERID = userID;
                reqObj.Platform = 'ZTE';
            }
            break;
        case '深圳':
            reqObj.USERID = userID;
            break;
        case '广西':
            reqObj.USERID = userID;
            break;
        case '山西':
            reqObj.USERID = userID;
            break;
        default: break;
    }
}

// do login
export function doLogin() {
    log('logining..................');

    if (isRequesting) {
        log('is requesting before doLogin, please wait.');
        /* return false;*/
    }

    isRequesting = true;

    const reqObj = {
        STBID: operatorConfig('STBID')
    };

    // append arguments
    paramConfig(reqObj);

    // append request type
    // host optional
    const host = window.location.protocol + '//' + window.location.host;
    const loginReqUrl = reqUrl + reqTypesObj.login;

    log({
        code: 'do logining',
        detail: {
            ...reqObj,
            loginReqUrl,
            host
        },
        level: 2
    });

    // Trigger login request
    post(reqObj, reqTypesObj.login, loginReqUrl, loginSuccess, loginFail);

    return true;
}

// do auth
export function doAuth() {
    if (isRequesting) {
        /* return false;*/
    }

    isRequesting = true;

    const reqObj = {
        HostID: ss('HostID'),
        UserID: ss('UserID')
    };

    const authReqUrl = reqUrl + reqTypesObj.auth;

    log({
        code: 'do authing',
        detail: {
            ...reqObj,
            authReqUrl
        }
    });

    post(reqObj, reqTypesObj.auth, authReqUrl, authSuccess, authFail);

    return true;
}

// request system params after auth successed
export function getSysParams() {
    if (isRequesting) {
        console.log('getSysParam: something is requesting.');
        /* return false;*/
    }

    isRequesting = true;

    // body of system params request
    const reqObj = {
        ParamList: {
            Param: [{
                Name: "bg_media_url"
            }]
        },
        Token: ss('Token')
    };

    // const reqObj = copyObj(reqSysParamsObj);

    const sysParamReqUrl = reqUrl + reqTypesObj.sysParam;

    log({
        code: 'getSystemParams',
        detail: {
            ...reqObj,
            sysParamReqUrl
        }
    });

    post(reqObj, reqTypesObj.sysParam, sysParamReqUrl,
         getSysParamsSuccess, getSysParamsFail);

    return true;
}

