/**
 * 频道列表2，无jquery版本
 * 
 * @authors lizc (ccc_simon@163.com)
 * @date    2017-05-09
 * @version 0.1
 *
 * [USE] 使用方式
 *
 *  1. new： var clist = new ChannelList();
 *  2. init: clist.init();
 *  3. 绑定事件: 请使用函数调用方式
 *      window.onkeydown = function (event) { clist.eventHandler(event); };
 * 
 * [CREATE] - 2017-05-09T17:19:59+08:00
 *
 * 2017-05-10T17:35:58+08:00
 *
 * [ADD] MediaPlayController{Object}
 *  
 */

function $ID(id) {
    return document.getElementById(id);
}


/* ---------------------------END Channel List --------------------------- */

function ChannelList() {
   
    // 列表总行数 
    this.rows = 10;

    // 列表是否已经生成，避免重复创建列表
    this.isGenerated = false;

    // 列表行的 id 前缀
    this.clistPrefix = 'clist-';

    // 是否使用虚拟数据
    this.isFate = true;

    // 当前行索引
    this.currRow = 0;

    // 列表容器
    this.parent = $ID('clist');

    // 列表总页数
    this.totalPages = '';

    // 当前列表页
    this.currPage = 0;

    // 当前行所在频道在频道数据中的索引
    this.channelIndex = 0;

    // 频道信息
    this.channels = [];

    // 数据索引
    this.dataIndex = 0;

    // 隐藏计时器
    this.autoHideTimer = null;

    // 缓存对象
    this.cache = {};

    // 显示状态
    this.isShow = true;

    // 默认频道号
    this.DftUserChannelID = '';

    // 是否正在请求列表
    this.isRequestStatus = false;

    // 频道列表服务器地址
    this.listServerAddr = 'http://192.168.88.51';

    // 播放器控制对象
    this.mpc = null;
}

/**
 * 列表按键处理
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
ChannelList.prototype.eventHandler = function (event) {


    var keycode = event.which || event.keycode,
        that = this;

    var filterKeys = [38, 40];

    // 列表没显示情况下不响应上下键
    if ( filterKeys.indexOf(keycode) > -1 && !that.isShow ) { return false; }

    // 有按键发生，重置自动隐藏计时器
    that._autoHide();

    switch (keycode) {
        case 38:    // up
            that.move(1); return false;
        break;
        case 40:    // down
            that.move(-1); return false;
        break;
        case 8:     // 返回键
            if (that.isShow) { that.hide(); } return false;
        break;
        case 33:    // test
        case 34:
            window.document.location.href = GCL_TEST_ENTRY_PAGE;
            return false;
        case 13:    // 确认键/播放键

            (that.isShow  
                // 列表显示情况下去播放
                ? that.play() 

                // 列表没显示情况下显示列表
                : that.show());
            return false;
        break;
        default: return false; break;
    }
};

// 显示列表
ChannelList.prototype.show = function () {
    this.parent.style.display = 'block';
    this.isShow = true;
};

// 隐藏列表
ChannelList.prototype.hide = function () {
    this.parent.style.display = 'none';
    this.isShow = false;
}

ChannelList.prototype.setChannelDataDomain = function () {

    this.listServerAddr = GCL_CHANNEL_DATA_DOMIAN || 'http://192.168.88.36/clist/data/channel.json';

    return this;
}

// 请求频道信息
ChannelList.prototype.requestChannels = function (callback) {

    var that = this, xhr;

    if (this.isRequestStatus) {
        return;
    }
    this.isRequestStatus = true;

    if ( window.XMLHttpRequest ) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    that.error('addr: ' + that.listServerAddr);

    xhr.open('get', that.listServerAddr, true);
    xhr.onreadystatechange = function () {
        that.error('ready: ' + xhr.readyState + ', status: ' + xhr.status);
        if ( xhr.readyState === 4 && xhr.status === 200 ) {

            var _data = JSON.parse(xhr.responseText);
            var _msgBody = _data.Message.MessageBody;
            that.error('resultCode: ' + _msgBody.ResultCode);
            if (_msgBody.ResultCode == 200) {

                var channels = _msgBody.ChannelList.Channel;
                that.error('bool: ' + channels && channels.length > 0);

                if ( channels && channels.length > 0 ) {
                    // that.error('callback: ' + callback.toString());
                    that.channels = [].slice.call(channels, 0);
                    if (callback) { callback(); }
                } else {
                    that.channels = [];
                    that.error('没有频道数据！');
                }
            }

            this.isRequestStatus = false;
        }
    };

    xhr.send(null);

    /*
    // '/epgservice/index.php?MessageType=GetChannelListReq'
    $.ajax({
        type: 'GET',
        url: that.listServerAddr,
        // data: JSON.stringify(tmpObj),
        complete: function(data) {
            if (data.status === 200) {
                var _data = JSON.parse(data.response);
                var _msgBody = _data.Message.MessageBody;
                if (_msgBody.ResultCode == 200) {

                    var channels = _msgBody.ChannelList.Channel;
                    if ( channels && channels.length > 0 ) {
                        that.channels = [].slice.call(channels, 0);
                        callback && callback();
                    } else {
                        that.channels = [];
                        that.error('没有频道数据！');
                    }
                } else {
                    that.error("请求数据失败");
                }
            } else {
                that.error("网络请求失败");
            }

            that.isRequestStatus = false;
            that.showLoading = false;
        },
        error: function(err) {
            that.error(err);
        },
    }); */
}

// 播放当前直播
ChannelList.prototype.play = function () {
    
    var that = this,
        currChannelIndex = -1,
        currChannelUserID = '',
        playUrl = '';

    // 获取当前频道索引
    currChannelIndex = that._getCurrChannelIndex();

    // 获取当前频道信息
    currChannelInfo = that._getCurrChannelByIndex(currChannelIndex);
   
    if ( !currChannelInfo ) { return false; }

    // 拿到用户频道 ID
    currChannelUserID = currChannelInfo.ChannelNumber;

    that.currPlayUrl = currChannelInfo.LiveUrl;

    // 播放切隐藏列表
    that.hide();

    /*
        开始播放
        1. joinChannel，使用频道 ID 播放
        2. setSingleMedia + playFromStart，使用直播地址播放，少用
     */
     // TODO[play]

     that.mpc.play(that.currPlayUrl);

    debug('----------------- playing id: ' +  currChannelUserID );
};

// 根据数据索引(this.dataIndex) 和 当前行索引(this.currRow) 拿到频道索引
ChannelList.prototype._getCurrChannelIndex = function () {
    return (this.dataIndex + this.currRow); 
};

// 通过索引获取当前频道
ChannelList.prototype._getCurrChannelByIndex = function (index) {

    if ( index < 0 ) { this.error('频道号不存在！'); return null; }

    return this.channels && this.channels[index]; 
};

// 频道列表错误处理
ChannelList.prototype.error = function (msg, code, handler) {

    var errorContent = '',
        width = 350,
        left = (document.body.clientWidth - width) / 2,
        tmpV = null;

    if ( tmpV = $ID('cl-error-tips') ) {

        tmpV.innerHTML = msg;

        return false;
    }

    errorContent = '<div id="cl-error-tips" style="position:absolute;'
        + 'left:' + left
        + 'px;top:40%;'
        + 'width:' + width 
        + 'px;height:80px;background-color:gray;border-radius:2px;'
        + 'text-align:center;line-height:80px;color:white;font-size:22px;'
        + '">'
        + '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>'
        + '&nbsp;&nbsp;' + msg
        + '</div>';

    var div = document.createElement('div');
    document.body.appendChild(div);
    div.innerHTML = errorContent;

    // $('body').append($(errorContent));

    setTimeout(function () {
        div.parentNode.removeChild(div);
    }, 2000);
};

/**
 * 上下移动焦点
 * @param  {[type]} direction [description]
 * @return {[type]}           [description]
 */
ChannelList.prototype.move = function (direction) {

    var that = this,
        count = that.channels.length,
        // 上下到头是否需要翻页标识
        needRound = false; 

    if ( direction !== 1 && direction !== -1 ) { return false; }

    // 焦点在第一页第一行，不响应上键
    if ( direction > 0 && that.currRow <= 0 && that.dataIndex <= 0 ) {
        return false; // 上到头了
    } 

    // 焦点在最后一页最后一行，不响应下键
    if ( direction < 0 && that.dataIndex + that.currRow + 1 === count ) {
         return false;
    }

    // 焦点行索引向上递减，向下递增
    direction > 0 ? that.currRow-- : that.currRow++;

    if ( direction < 0 && that.currRow >= that.rows ) { // 下到头，向下翻页
        that.currRow = 0; 
        that.dataIndex += that.rows;    // 数据索引加一页行数，及防止越界
        if ( that.dataIndex >= count ) { that.dataIndex = count - 1; }
        needRound = true;
    } else if ( direction > 0 && that.currRow < 0 ) { // 上到头，向上翻页
        that.currRow = that.rows - 1;
        that.dataIndex -= that.rows;    // 数据说因减一页行数，及防止越界
        if ( that.dataIndex <= 0 ) { that.dataIndex = 0; }
        needRound = true;
    }

    // 输出方向，数据索引，和当前行
    debug('msg: ' + 'd/' + direction + ', currRow/' + that.currRow + ', dataIndex/' + that.dataIndex);

    // 翻页刷新数据
    if ( needRound ) { that.refreshData(); }

    // 刷新行焦点
    that.refreshFoucsBgColor();
};

/**
 * 刷新焦点行背景及样式
 * @return {[type]} [description]
 */
ChannelList.prototype.refreshFoucsBgColor = function () {
    
    var cInfoDivs = this.cache.cis, // $('.channel-info')
        that = this,
        tmpV = '';

    var i = 0, len = cInfoDivs.length || 0;

    for ( ; i < len; i++ ) {
        if ( cInfoDivs[i].className.indexOf('focus-bg-color') ) {

            tmpV = cInfoDivs[i].className;

            cInfoDivs[i].className = tmpV
                    .split('focus-bg-color')
                    .map(function (value, index) {
                        return value.replace(/(^\s*)|(\s*$)/g, '');
                    })
                    .join(' ');
        }
    }

    tmpV = cInfoDivs[that.currRow].className;

    cInfoDivs[that.currRow].className = tmpV + ' ' + 'focus-bg-color';
};

// 列表初始化
ChannelList.prototype.init = function (datas) {
   
    var that = this;

    that.setChannelDataDomain();

    if ( that.isFate ) {
        // 假数据
        that.channels = FateChannelDatas;
        that._init();
    } else {

        // 请求真实数据，成功执行回调初始化工作
        that.requestChannels(function () {
            that._init();
        });
    }
};

// 内部初始化函数
ChannelList.prototype._init = function () {
    
    var that = this;

    if ( !that.channels || that.channels.length <= 0 ) { return false; }

    that.totalPages = Math.ceil(that.channels.length / that.rows);

    // 初始化数据(数据索引，当前页)
    that.dataIndex = 0;
    that.currPage = 0;
    that.DftUserChannelID = that.channels[0].ChannelNumber; // UserChannelID

    // 生成列表
    that._generateList(that.parent);
    that.cache.lis = document.getElementById('clist').getElementsByTagName('li');

    // 渲染列表行
    that._renderRows(that.channels);
    that.cache.cis = document.getElementsByClassName('channel-info');

    // 显示列表
    that.show();

    // 初始化焦点行
    that.refreshFoucsBgColor(); 

    // 初始化进入页面播放时的地址
    that.currPlayUrl = that.channels[0].LiveUrl;

    // 启动自动隐藏计时器
    that._autoHide();

}

// 6秒后自动隐藏
ChannelList.prototype._autoHide = function () {

    var that = this;

    clearTimeout(that.autoHideTimer);
    that.autoHideTimer = setTimeout(function () {
        // $(that.parent).fadeOut(1000);
        that.parent.style.display = 'none';
        that.isShow = false;
    }, 6000);
}

// 刷新列表数据
ChannelList.prototype.refreshData = function () {
    
    var that = this,
        spans = null,
        channelInfo = null,
        dataIndex = -1,
        count = that.channels.length,
        lastRows = count % that.rows;

    if ( !that.channels ) { return false; }

    that._clearList();

    var cis = that.cache.cis;

    for ( var index = 0, len = cis.length; index < len; index++ ) {

        dataIndex = that.dataIndex + index;

        // 没有数据可刷新了，结束刷新
        if ( that.dataIndex === count - lastRows
            && index >= lastRows ) { debug('over');return false; };

        debug('refreshData: ' 
            + 'dataIndex/' + that.dataIndex
            + ', lastRows/' + lastRows
            + ', index/' + index
            + ', count/' + count);

        channelInfo = that.channels[dataIndex];

        spans = cis[index].getElementsByTagName('span');
        spans[0].innerHTML = dataIndex + 1;
        spans[1].innerHTML = channelInfo.ChannelName;
    }
};

// 清空列表内容
ChannelList.prototype._clearList = function () {
    
    var spans = null;
    var cis = this.cache.cis;

    for ( var i = 0, len = cis.length; i < len; i++ ) {

        spans = cis[i].getElementsByTagName('span');

        spans[0].innerHTML = '';
        spans[1].innerHTML = '';
    }
}

// 只会被调用一次，初始化时使用
ChannelList.prototype._renderRows = function () {
    
    var that = this,
        rowContent = '',
        channelInfos = that.channels,
        lis = that.cache.lis,
        count = 0;

    if ( !channelInfos ) { return null; }

    count = channelInfos.length < lis.length
        ? channelInfos.length
        : lis.length;

    for ( var i = 0, len = count; i < len; i++ ) {

        lis[i].innerHTML = ''
            + '<div class="channel-info">'
            // 序号
            + '<span class="channel-index">' + (i + 1) + '</span>'
            // 频道名
            + '<span class="channel-name">' + channelInfos[i].ChannelName + '</span>'
            + '</div>';
    }
}

// 只会被调用一次，生成列表
ChannelList.prototype._generateList = function (styles) {
    
    var that = this, 
        contents = '',
        i = 0,
        len = that.rows || 10,
        parent = that.parent;

    if ( that.isGenerated ) { debug('dont repeat;');return; }

    contents += '<div id="clist-top">'
             + '<i class="fa fa-angle-up fa-2x" aria-hidden="true"></i>'
             + '</div>';

    for ( ; i < len; i++ ) {
        contents    += '<li id="'
                    + that.clistPrefix + i + '">'
                    // 防止数据不够一页时，依旧有索引填充
                    + (that.channels.length < that.rows ? '' : i)
                    + '</li>';
    }

    contents += '<div id="clist-bottom">'
             + '<i class="fa fa-angle-down fa-2x" aria-hidden="true"></i>'
             + '</div>';

    parent = parent || document.body;

    parent.innerHTML = contents;

    if ( contents ) { that.isGenerated = true; }

    return contents;
}

// 缓存数据
ChannelList.prototype._cache = function () {
    // unuse 
}

function debug(str) {
    return;
    console.log(str);
}


/* ---------------------------END Channel List --------------------------- */


/* ---------------------------START MediaPlayer --------------------------- */

// // 播放器对象
// function MediaPlayController() {
    
//     this.mediaStr = '';
//     this.playUrl = 'http://192.168.88.36/clist/vod/yanguiren.mp4';
//     this.mp = null;
//     this.replayTimer = null;
// }

/*
MediaPlayController.prototype.VirtualMsgHandler = function ( msg ) {
   
    var that = this;

    var eventMediaEndHandler = function () {
        
        that.error('media play end ...');

        clearTimeout(that.replayTimer);
        that.replayTimer = setTimeout(function () { 
            that.play(); 
        }, 2000);
    };

    switch () {
        case 'EVENT_MEDIA_END': // 播放结束，重新播放
            eventMediaEndHandler();
        break;
        default: return false;
        break;
    } 
}; */

// MediaPlayController.prototype.setChannelID = function (channelUserId) {
//     this.channelID = channelUserId;

//     return this;
// }

// MediaPlayController.prototype.init = function () {
    
//     this.initMediaPlay();

//     return this;
// };

// // 频道列表错误处理
// MediaPlayController.prototype.error = function (msg, code, handler) {

//     var errorContent = '',
//         width = 350,
//         left = (document.body.clientWidth - width) / 2;

//     errorContent = '<div id="mp-error-tips" style="position:absolute;'
//         + 'left:' + left
//         + 'px;top:40%;'
//         + 'width:' + width 
//         + 'px;height:80px;background-color:gray;border-radius:2px;'
//         + 'text-align:center;line-height:80px;color:white;font-size:22px;'
//         + '">'
//         + '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>'
//         + '&nbsp;&nbsp;' + msg
//         + '</div>';

//     var div = document.createElement('div');
//     document.body.appendChild(div);
//     div.innerHTML = errorContent;

//     // $('body').append($(errorContent));

//     setTimeout(function () {
//         div.parentNode.removeChild(div);
//     }, 2000);
// };

// MediaPlayController.prototype.setMediaStr = function (playUrl) {
    
//     if ( !playUrl ) { that.error('频道地址不存在！'); return; }

//     this.playUrl = playUrl;

//     this.mediaStr = '[{mediaUrl:"' + playUrl + '",';
//     this.mediaStr += 'mediaCode: "jsoncode1",';
//     this.mediaStr += 'mediaType:2,';
//     this.mediaStr += 'audioType:1,';
//     this.mediaStr += 'videoType:1,';
//     this.mediaStr += 'streamType:1,';
//     this.mediaStr += 'drmType:1,';
//     this.mediaStr += 'fingerPrint:0,';
//     this.mediaStr += 'copyProtection:1,';
//     this.mediaStr += 'allowTrickmode:1,';
//     this.mediaStr += 'startTime:0,';
//     this.mediaStr += 'endTime:20000,';
//     this.mediaStr += 'entryID:"jsonentry1"}]';

//     return this;
// }

// // 获取或设值播放地址
// MediaPlayController.prototype.initMediaPlay = function () {

//     // this.setMediaStr(this.playUrl);
//     this.mp = new MediaPlayer(); //新建一个mediaplayer对象
//     var instanceId = this.mp.getNativePlayerInstanceID(); //读取本地的媒体播放实例的标识

//     var playListFlag = 0; //Media Player 的播放模式。 0：单媒体的播放模式 (默认值)，1: 播放列表的播放模式
//     var videoDisplayMode = 1; //MediaPlayer 对象对应的视频窗口的显示模式. 1: 全屏显示2: 按宽度显示，3: 按高度显示
//     var height = window.innerHeight;
//     var width = window.innerWidth;
//     var left = 0;
//     var top = 0;
//     var muteFlag = 0; //0: 设置为有声 (默认值) 1: 设置为静音
//     var subtitleFlag = 0; //字幕显示
//     var videoAlpha = 0; //视频的透明度
//     var cycleFlag = 0;
//     var randomFlag = 0;
//     var autoDelFlag = 0;
//     var useNativeUIFlag = 1;
//     //初始话mediaplayer对象
//     // alert("开始播放$$$");
//     this.mp.initMediaPlayer(instanceId, playListFlag, videoDisplayMode,
//         height, width, left, top, muteFlag, useNativeUIFlag, subtitleFlag, videoAlpha, cycleFlag, randomFlag, autoDelFlag);
//     // this.mp.setSingleMedia(this.mediaStr); //设置媒体播放器播放媒体内容
//     this.mp.setAllowTrickmodeFlag(0); //设置是否允许trick操作。 0:允许 1：不允许
//     this.mp.setVideoDisplayMode(0);
//     this.mp.setVideoDisplayArea(left, top, width, height);
//     this.mp.setNativeUIFlag(0); //设置播放器本地UI显示功能 0:允许 1：不允许
//     this.mp.setAudioTrackUIFlag(1);
//     this.mp.setMuteUIFlag(1);
//     this.mp.setAudioVolumeUIFlag(1);
//     this.mp.refreshVideoDisplay();
//     console.log('mediaUrl: ' + playUrl);
// }

// MediaPlayController.prototype.stop = function () {
//     this.mp.stop(1);

//     return this;
// }

// MediaPlayController.prototype.play = function (playUrl) {

//     if ( !playUrl ) { this.error('频道地址不存在！'); return; }

//     this.setMediaStr(playUrl);

//     // 或者直接用 joinChannel 用频道号去播放
//     this.mp.setSingleMedia(this.mediaStr); //设置媒体播放器播放媒体内容
//     this.mp.playFromStart();

//     // or jc
//     // this.mp.joinChannel();

//     return this;
// };





/* ---------------------------END MediaPlayer --------------------------- */



window.onload = function () {

    // 频道列表
    window.clist = new ChannelList();

    // 频道列表初始化
    clist.init();

    // 播放器
    // window.mpc = new MediaPlayController();

    // clist.mpc = mpc;

    // 1. 频道号播放
    // mpc.init().setChannelID(clist.DftUserChannelID).joinChannel();

    // 2. 频道地址播放
    // mpc.init().play(clist.currPlayUrl || mpc.playUrl);

    window.onkeydown = function (event) {
        clist.eventHandler(event);
    };

    var gclDebug = new GCLDebug();
    gclDebug.open();
}

window.onunload = function () {
    
    // 这里执行销毁播放器实例操作，避免每打开一次直播页面
    // 就会创建一个播放器实例

    // window.mpc.mp.stop(); // 停止播放失败，避免关闭页面后视频在后台播放
    // window.mpc.mp.close();
    // window.mpc.mp.releaseMediaPlayer();
    // window.mpc = null;
    // window.clist = null;
}


