/*
  EPG 请求
*/

import { post, ss, type, copyObj, queryParams } from './tool/utils';
import operatorConfig from './tool/operator';
import goto from './jump';

let isRequesting = false;
const province = ss('province');
const reqUrl = ss('relativePath') + '/epgservice/index.php?MessageType=';
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
            console.log('loginSuccess: response data error.');
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

            // TODO delete
            debug('loginSuccess', tmpObj);

            isRequesting = false;

            // login successed, ready to do auth
            doAuth();

        } else {
            goto('iptv', 'loginSuccess: request data failed.');
        }
    } else {
        goto('iptv', 'loginSuccess: network broken.');
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

            // TODO delete
            debug('authSuccess', tmpObj);

            // auth passed, ready to get system params.
            getSysParams();

        } else {
            goto('iptv', 'authSuccess: request data failed.');
        }
    } else {
        goto('iptv', 'authSuccess: network broken.');
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

            // TODO delete
            debug('getSysParamsSuccess', _msgBody.ParamList.Param);

            // system params got, ready to locate welcome page
            const pageName = (queryParams('cKey') === 'back') ? 'main' : 'welcome';

            // jump to welcome or main page
            // TODO cut comment, now for test
            // goto(pageName);

        } else {
            goto('iptv', 'getSysparamsSuccess: response data error.');
        }
    } else {
        goto('iptv', 'getSysParamsSuccess: network broken.');
    }

    return true;
}

// callback of failed to get system params
function getSysParamsFail(error) {
    console.log('get system params failed.');
}

// append more params for login request
function paramConfig(reqObj) {
    if (type(reqObj) !== 'object' && !reqObj) {
        return false;
    }
    const userID = operatorConfig('UserID');

    console.log('paramConfig userID:' + userID);

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
        if (ss('from') === 'huawei') {
            reqObj.USERID = ss('userid') || userID;
            reqObj.Platform = 'HUAWEI';
        } else {
            reqObj.USERID = userID;
            reqObj.Playform = 'ZTE';
        }
        break;
    case '深圳':
        reqObj.USERID = userID;
        break;
    default: break;
    }

}

// do login
export function doLogin() {
    console.log('logining..................');

    if (isRequesting) {
        return false;
    }

    isRequesting = true;

    const reqObj = {
        STBID: operatorConfig('STBID') 
    };

    // append arguments
    paramConfig(reqObj);

    // append request type
    const loginReqUrl = reqUrl + reqTypesObj.login;

    // TODO delete
    debug('doLogin', reqObj);

    // Trigger login request
    post(reqObj, reqTypesObj.login, loginReqUrl, loginSuccess, loginFail);

    return true;
}

// do auth
export function doAuth() {
    if (isRequesting) {
        return false;
    }

    isRequesting = true;

    const reqObj = {
        HostID: ss('HostID'),
        UserID: ss('UserID')
    };

    const authReqUrl = reqUrl + reqTypesObj.auth;

    post(reqObj, reqTypesObj.auth, authReqUrl, authSuccess, authFail);

    return true;
}

// request system params after auth successed
export function getSysParams() {
    if (isRequesting) {
        console.log('getSysParam: something is requesting.');
        return false;
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

    post(reqObj, reqTypesObj.sysParam, sysParamReqUrl,
         getSysParamsSuccess, getSysParamsFail);

    return true;
}

