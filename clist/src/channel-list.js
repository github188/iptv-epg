/**
 * 频道列表
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
 *  -- 属性
 *  [A]: rows               列表总行数，默认 10 行
 *  [A]: isGenerated        列表DOM树是否已生成，避免重复创建
 *  [A]: clistPrefix        列表项的 id 前缀
 *  [A]: isFate             虚拟数据标识
 *  [A]: currRow            当前行索引
 *  [A]: parent             列表父容器
 *  [A]: totalPages         总页数（未用）
 *  [A]: currPage           当前页（未用）
 *  [A]: channelIndex       频道索引（未用）
 *  [A]: channels           所有频道信息
 *  [A]: dataIndex          数据索引，用来让列表和频道数据发生联系
 *  [A]: autoHideTimer      自动隐藏计时器
 *
 *  -- 函数
 *  [F]: eventHandler   列表事件处理
 *  [F]: play   播放直播
 *  [F]: error  错误处理（或提示）
 *  [F]: move   焦点移动（上下）
 *  [F]: init   列表初始化（数据，样式等）
 *  [F]: refreshFoucsBgColor    根据上下键操作更新当前行的背景及其他样式
 *  [F]: refreshData            刷新列表数据
 *  [F]: _init          内部初始化（在虚拟数据准备好或ajax真实数据成功后调用）
 *  [F]: _autoHide      自动隐藏计时器函数
 *  [F]: _clearList     清空列表内容，在每次刷新列表数据之前执行
 *  [F]: _renderRows    渲染行，在生成列表之后，渲染用来填充数据的标签
 *  [F]: _generateList  生成列表
 *  [F]: _getCurrChannelIndex       根据 that.dataIndex 和 that.currRow 来拿到频道索引
 *  [F]: _getCurrChannelByIndex     根据索引拿到当前频道信息
 *  [F]: toggle     显示或隐藏列表
 *  
 */


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
    this.parent = $('#clist');

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
}

/**
 * 列表按键处理
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
ChannelList.prototype.eventHandler = function (event) {


    var keycode = event.which || event.keycode,
        that = this;

    console.log('keycode: ' + keycode);

    // 列表没显示情况下不响应按键
    if ( keycode !== 96 && !$(that.parent).is(':visible') ) { return false; }

    // 有按键发生，重置自动隐藏计时器
    that._autoHide();

    switch (keycode) {
        case 38:    // up
            that.move(1); return false;
        break;
        case 40:    // down
            that.move(-1); return false;
        break;
        case 96:    // 小键盘 0，显示/隐藏 [TEST]
            that.toggle(); return false;
        break;
        case 13:    // play
            that.play();
        break;
        default: return false; break;
    }
};

// 显示或隐藏
ChannelList.prototype.toggle = function () {

    var $el = $(this.parent);

    if ( $el.is(':visible') ) { $el.hide(); } 
    else { $el.show(); }

    return true;
}

// 播放当前直播
ChannelList.prototype.play = function () {
    
    var that = this,
        currChannelIndex = -1,
        currChannelUserID = '';

    // 获取当前频道索引
    currChannelIndex = that._getCurrChannelIndex();

    // 获取当前频道信息
    currChannelInfo = that._getCurrChannelByIndex(currChannelIndex);
   
    if ( !currChannelInfo ) { return false; }

    // 拿到用户频道 ID
    currChannelUserID = currChannelInfo.UserChannelID;

    /*
        开始播放
        1. joinChannel，使用频道 ID 播放
        2. setSingleMedia + playFromStart，使用直播地址播放，少用
     */
     // TODO[play]

    debug('----------------- playing id: ' + currChannelUserID);
};

// 根据数据索引(this.dataIndex) 和 当前行索引(this.currRow) 拿到频道索引
ChannelList.prototype._getCurrChannelIndex = function () {
    return (this.dataIndex + this.currRow); 
};

ChannelList.prototype._getCurrChannelByIndex = function (index) {

    if ( index < 0 ) { this.error('频道号不存在！'); return null; }

    return this.channels && this.channels[index]; 
};

// 频道列表错误处理
ChannelList.prototype.error = function (msg, code, handler) {

    var errorContent = '';

    errorContent = '<div id="error-tips" style="position:absolute;left:50%;top:40%;'
        + 'width:250px;height:80px;background-color:gray;border-radius:2px;'
        + 'text-indent:6px;line-height:80px;color:red;font-size:22px;'
        + '">'
        + '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>'
        + '&nbsp;' + msg
        + '</div>';

    $('body').append($(errorContent));

    $('#error-tips').fadeOut(3000, function () {
        $('#error-tips').remove();
    });
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

    // 焦点行索引向上递减，想下递增
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

    // needRound && that.refreshData();

    // 刷新行焦点
    that.refreshFoucsBgColor();
};

/**
 * 刷新焦点行背景及样式
 * @return {[type]} [description]
 */
ChannelList.prototype.refreshFoucsBgColor = function () {
    
    var cInfoDivs = $('.channel-info'),
        that = this;

    var i = 0, len = cInfoDivs.length || 0;

    for ( ; i < len; i++ ) {
        if ( $(cInfoDivs).hasClass('focus-bg-color') ) {

            $(cInfoDivs).removeClass('focus-bg-color');
        }
    }

    $(cInfoDivs[that.currRow]).addClass('focus-bg-color');
};

// 列表初始化
ChannelList.prototype.init = function (datas) {
   
    var that = this;

    // 获取频道数据(虚拟数据或者 ajax 请求，这里请求数据需要考虑延时)
    that.channels = that.isFate ? FateChannelDatas : (datas || FateChannelDatas);

    if ( that.isFate ) {
        that.channels = FateChannelDatas;
        // 数据获取成功之后才继续执行
        that._init();
    } else {
        // $.get();
        // TODO[ajax]
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

    // 生成列表
    that._generateList(that.parent);

    // 渲染列表行
    that._renderRows(that.channels);

    // 初始化焦点行
    that.refreshFoucsBgColor(); 

    // 启动自动隐藏计时器
    that._autoHide();
}

// 6秒后自动隐藏
ChannelList.prototype._autoHide = function () {

    var that = this;

    clearTimeout(that.autoHideTimer);
    that.autoHideTimer = setTimeout(function () {
        $(that.parent).fadeOut(1000);
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

    $('.channel-info').map(function (index, el) {

        // console.log(that.channels[that.dataIndex + index]);

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

        spans = el.getElementsByTagName('span');

        $(spans[0]).html(dataIndex + 1);
        $(spans[1]).html(channelInfo.channelName);

    });
};

// 清空列表内容
ChannelList.prototype._clearList = function () {
    
    $('.channel-info').map(function (index, el) {

        spans = el.getElementsByTagName('span');

        $(spans[0]).html('');
        $(spans[1]).html('');
    });
}

// 只会被调用一次，初始化时使用
ChannelList.prototype._renderRows = function () {
    
    var that = this,
        rowContent = '',
        channelInfos = that.channels;

    if ( !channelInfos ) { return null; }

    $('#clist>li').map(function (index, el) {

        el.innerHTML = ''
            + '<div class="channel-info">'
            // 序号
            + '<span class="channel-index">' + (index + 1) + '</span>'
            // 频道名
            + '<span class="channel-name">' + channelInfos[index].channelName + '</span>'
            + '</div>';
    });
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
                    + i
                    + '</li>';
    }

    contents += '<div id="clist-bottom">'
             + '<i class="fa fa-angle-down fa-2x" aria-hidden="true"></i>'
             + '</div>';

    parent = parent || $('body');

    $(parent).html(contents);

    if ( contents ) { that.isGenerated = true; }

    return contents;
}

function debug(str) {
    return;
    console.log(str);
}

$(function () {
    var clist = new ChannelList();

    clist.init();

    window.onkeydown = function (event) {
        clist.eventHandler(event);
    };
});

