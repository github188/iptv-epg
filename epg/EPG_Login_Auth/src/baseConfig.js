/*
  EPG基本配置
*/

import {ss, type, getIp} from './tool/utils';
import operatorConfig from './tool/operator';

function setConfig(config) {

    var setOne = function(cfg) {
        for (let key in cfg) {
            if (typeof(cfg[key]) === 'object') {
                ss(key, JSON.stringify(cfg[key]));
            } else {
                ss(key, cfg[key]);
            }
        }
    };

    if (type(config) === 'array') {
        for (let i = 0; i < config.length; i++) {
            setOne(config[i]);
        }
    } else {
        setOne(config);
    }
}

export default function baseConfig() {

    setConfig(Config);
    ss('EpgVersion', JSON.stringify(EpgVersion));
    if (!!window.Authentication) {
        const EPGDomain = operatorConfig('EPGDomain');
        //中兴平台
        const last = EPGDomain.lastIndexOf("/");
        const zhongxingMediaUrlOrigin = EPGDomain.substr(0, last);
        //华为平台
        const str = EPGDomain.indexOf('/', 10);
        const huaweiMediaUrlOrigin = EPGDomain.substr(0, str);

        const cfgObj = {
            huaweiMediaUrlOrigin,
            zhongxingMediaUrlOrigin,
            EPGDomain,
            UrlOrigin: getIp(EPGDomain),
            UserToken: operatorConfig('UserToken'),
            USERID: operatorConfig('UserID'),
            STBID: operatorConfig('STBID')
        };
        
        ss(cfgObj);
        console.log(cfgObj);
    }
}
