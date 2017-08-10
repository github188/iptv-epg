/*
  Shengyang EPG Entry

*/

console.log('portal in');

import Http from '../assets/lib/Http';
import xml2json from '../assets/lib/xml2json.min';
import baseConfig from './baseConfig';
import { ss } from './tool/utils';
import operatorConfig from './tool/operator';
import { iPanelCompat } from './compat';
import { configParams } from './config/configParams';
import { jump as goto } from './jump';

((window) => {
    /* ---------------- Variables[Static] ---------------- */
    // 需要每次都回到欢迎页的省份
    let toWelcomeProvinces = ['湖北', '云南', '深圳'];

    // 开机配置
    baseConfig();

    // 开机配置完成后取数据
    let [province, isFirstStart] = ss(['province', 'ISFIRSTSTART']);

    console.log('province:' + province + ', isFirst:' + isFirstStart);
    // 首次开机走欢迎页，后面直接进主页
    if (toWelcomeProvinces.indexOf(province) === -1) {
        if (!isFirstStart && isFirstStart !== '1') {
            ss('ISFIRSTSTART', '1');
        } else {
            goto('main');
            return true;
        }
    }

    // 保存EPG ip
    ss('EPGIP', window.location.host);

    console.log({
        province,
        isFirstStart,
        EPGIP: ss('EPGIP')
    });

    // 茁壮浏览器兼容
    iPanelCompat();

    // 参数配置
    configParams();

    return true;

    console.log('portal out');
})(window);
