/*
  主页
*/

import { ss } from '../tool/utils';

export function gotoMainLayout() {
    let dot = '.';
    let path = '/epggroup_mains/main_default/';
    let file = 'main.html';
    let hasFrom = /&from=/.test(window.location.href);
    const {
        vendor,
        appName,
        userAgent
    } = navigator;

    path = (ss("MainPath") === 'test'
            ? '/epggroup_mains/main_test/'
            : path
           );


    // 兼容UT盒子：MC8638
    if (vendor === 'Apple Inc.'
        && appName === 'EIS iPanel'
        && userAgent === 'Sunniwell'
       ) {
        const lang = ss('currLangCode') || 'chi';
        file = `main_outer.html?currLangCode=${lang}`;
    }

    const provinces = ['陕西', '河南'];

    if (provinces.indexOf(ss('province')) !== -1 && hasFrom) {
        window.location.href = domain + path + file;
    } else {
        location.replace(dot + path + file);
    }
}

