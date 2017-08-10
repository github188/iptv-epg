/*
  欢迎页
*/

import { ss } from '../tool/utils';

const test = './epggroup_welcomes/welcome_test/welcome.html';
const dft = './epggroup_welcomes/welcome_default/welcome.html';

function toWelcome() {
    location.replace(ss('WelcomePageGroupPath') === 'test' ? test : dft);
}

function runTestWelcome() {
    const toLinkPath = ss('toLinkPath') === '1';

    // 之前跳转过链接
    if (toLinkPath) {
        ss('WelcomePageGroupPath', 'test');
    }

    const welPath = ss('WelcomePageGroupPath');
    const isWelLink = /^https?:\/\//.test(welPath);
    if (!toLinkPath && isWelLink) {
        ss(
            'isFromTestLink',
            ss('WelcomePageGroupPath')
        );
        ss('toLinkPath', '1');
        // 链接跳转
        location.replace(welPath);
    } else {
        toWelcome();
    }
}

function runNormalWelcome() {
    const welPath = ss('WelcomePageGroupPath');
    if (/^https?:\/\//.test(welPath)) {
        // 链接跳转
        location.replace(welPath);
    } else {
        toWelcome();
    }
}

export function gotoWelcome() {
    /*
      警告：测试时使用 runTestWelcome，正式环境使用 runNormalWelcome，
      提交时请注释 this.runTestWelcome();, 放开 this.runNormalWelcome();
    */
    /* this.runTestWelcome();*/
    runNormalWelcome();
}
