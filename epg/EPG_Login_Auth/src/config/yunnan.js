/*
  云南配置
*/

import { ss, query } from '../tool/utils';
import { doLogin } from '../request';

export function config() {
    let [relativePath, EPGIP] = ss(['relativePath', 'EPGIP']);
    let indexUrl = '';

    relativePath = relative.replace(/\/service/, '');

    indexUrl = ((!ss('indexUrl') && !!query('indexUrl'))
                ? query('indexUrl')
                : 'http://182.245.29.132:78/iptv/ppthdplay/hotelapps/index/index_epg.html'
               );

    ss('indexUrl', indexUrl);

    console.log('yunnan indexUrl: ' + indexUrl);

    // TODO: log
    doLogin();
}
