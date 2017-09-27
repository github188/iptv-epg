/*
  直播页面入口文件
*/

// 工具
import T from '../lib/util.js';
// 假数据
import {FateChannels} from './channel-datas';
// 直播页面基本配置
import Config from '../cfg/config';
// 列表对象
import CList from './clist';
// 播控对象
import MPlayer from './mplayer';

window.onload = () => {
    let player = false;

    // 实例化列表
    const clist = new CList();
    // 实例化播放器，并赋给列表对象
    clist.mpc = new MPlayer();

    // 初始化列表
    clist.init(() => {
        // 列表初始化成功
        const channels = clist.channels;
        const firstChannel = channels[0];
        let toPlayStr = '';

        if (!firstChannel) {
            T.debug('no first channel', 0);
            return false;
        }
        let url = firstChannel.ChannelURL;
        let ucid = firstChannel.UserChannelID;

        url = url.indexOf('igmp://') >= 0 ? 

        if (GCL_PLAY_BY_TYPE === 1) { // url
            // no change
        } else if (GCL_PLAY_BY_TYPE === 2) { // channel id
            url = firstChannel.UserChannelID;
        } else {
            // do nothing
        }

        return true;
    });


};
