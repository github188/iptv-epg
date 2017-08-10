/*
  湖北配置相关
*/

import xml2json from '../../assets/lib/xml2json.min';
import { ss, log } from '../tool/utils';

export function config() {

    ss('indexUrl', 'http://116.210.255.120:8080/HBEpg/epg/broadBandTV.jsp');

    const x2js = new xml2json();

    let currUrl = decodeURIComponent(window.location.href);
    let param = currUrl;

    if (param) {
        let jsonObj = null;
        try {
            jsonObj = x2js.xml_str2json(
                '<xml>' + param.split('=')[1] + '</xml>'
            );
        } catch(e) {
            console.log('hubei.js 解析参数失败');
            return false;
        }

        if (!jsonObj) {
            log({
                code: 'portal params',
                detail: jsonObj
            });

            return false;
        }

        ss(jsonObj.xml);
    }

    return true;
}
