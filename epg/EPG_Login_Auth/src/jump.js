/*
  EPG 跳转
*/

import { ss } from './tool/utils';
import { gotoMainLayout } from './pages/mainPage';
import { gotoWelcome } from './pages/welcome';

function gotoIptv(msg) {

    if (msg) {
        console.log(msg);
    }

    location.href = ss('indexUrl');
}

// 执行跳转
export default function jump(name, msg) {
    if (name === 'main') {
        gotoMainLayout(msg);
    } else if (name === 'welcome') {
        gotoWelcome(msg);
    } else if (name === 'iptv') {
        gotoIptv(msg);
    }
}
