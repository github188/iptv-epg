var isTesting = false;
var isOnPlat = true;
var channelList = FateChannelDatas;
var firstChannel = FateChannelDatas[0];
// 下发频道信息
function setChannels(channels) {

  var channels = channelList
  var len = channels.length;
  if (window.Authentication) {
    window.Authentication.CUSetConfig('ChannelCount', len);
  }

  var obj = null,
      channel = null,
      value = '';
  for (var i = 0; i < len; i++) {
    channel = channels[i];

    value = '' + 'ChannelID="' + (i + 1) + '",ChannelName="' + channel.ChannelName + '",UserChannelID="' + channel.ChannelNumber + '",ChannelURL="' + channel.LiveUrl + ',TimeShift="0",TimeShiftLength="10800"' + ',ChannelSDP="' + channel.LiveUrl + '",TimeShiftURL="",ChannelType="1",IsHDChannel="2",PreviewEnable="0"' + ',ChannelPurchased="1",ChannelLocked="0"' + ',ChannelLogURL="' + channel.LogoUrl + '",PositionX="null",PositionY="null",BeginTime="null",Interval="null"' + ',Lasting="null",ActionType="1",FCCEnable="0",ChannelFECPort="0"';

    if (window.Authentication) {
      window.Authentication.CUSetConfig('Channel', value);
    }
    value = '';
  }
}

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
  this.isFate = false;

  // 当前行索引
  this.currRow = 0;

  // 列表容器
  this.parent = $ID('clist');

  // 频道号显示区元素
  this.channelNumDiv = null;

  // 列表总页数
  this.totalPages = '';

  // 当前列表页
  this.currPage = 1;

  // 当前行所在频道在频道数据中的索引
  this.channelIndex = 0;

  // 当前选中的频道号
  this.channelNo = '1';

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
  this.listServerAddr = GCL_LOCALE_DOMAIN;

  // 第一个频道
  this.first = null;

  // 播放器控制对象
  this.mpc = null;

  this.language = 0; // 0 - chi, 1 - eng

  this.tips = ['请按‘上/下页键’翻页', 'PageUp or PageDown'];

  // 数字按键计时器
  this.inputTimer = null;

  // 已经输入的频道数字
  this.inputNums = [];

  // 频道号计时器
  this.channelNumTimer = null;

  // 当前音量
  this.currVolume = 0;
  this.volStep = 5;

  // 音量条显示隐藏计时器
  this.volumeTimer = null;

  this.volumeObj = {
    wrapper: null,
    bar: null,
    line: null,
    value: null
  };
}

/**
 * 列表按键处理
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
ChannelList.prototype.eventHandler = function (event) {


  var keycode = event.which || event.keycode,
      that = this;

  // var filterKeys = [38, 40];

  // 列表没显示情况下不响应上下键
  // if ( filterKeys.indexOf(keycode) > -1 && !that.isShow ) { return false; }

  // 有按键发生，重置自动隐藏计时器
  that._autoHide();

  // 数字键
  if (keycode >= 48 && keycode <= 57) {
    that.inputNum(keycode - 48);
    return false;
  }

  debug('keycode:' + keycode);

  switch (keycode) {
  case 259: that.volume(5); return false; break;  // 声音 +
  case 260: that.volume(-5); return false; break; // 声音 -
  case 261: that.mute(); return false; break;     // 静音
  case 258: that.move(1); that.play(); return false; break;   // 频道 +
  case 257: that.move(-1); that.play(); return false; break;  // 频道 -
  case 38:    // up
    that.move(1);
    if (!that.isShow) { that.play(); }
    return false;
    break;
  case 40:    // down
    that.move(-1);
    if (!that.isShow) { that.play(); }
    return false;
    break;
    // 上下页键处理：
    // 1. 列表显示是翻页
    // 2. 不显示时切换频道
  case 33:
    if (that.isShow) { // 翻页
      that.move(-1, true);
    } else { // 切到上一台
      that.move(1);
      that.play();
    }
    return false;
    break;
  case 34:
    if (that.isShow) {
      that.move(1, true);
    } else { // 切到下一个台
      that.move(-1);
      that.play();
    }
    return false;
    break;
  case 8:     // 返回键
    if (that.isShow) { that.hide(); }
    else if (isTesting) {
      location.reload();
      return false;
    } else if (isOnPlat) {
      return false
    } else {
      return false;

      // 测试时，返回键回到 entry.html
      if (this.isFate && keycode === 8) {
        window.location.href = './entry.html';
        return false;
      }

      if (this.mpc) {
        this.mpc.stop();
      }

      var mainUrl = sessionStorage.getItem('Main2ChannelURL');
      window.location.href = mainUrl || '../../epggroup_mains/main_test/main.html';
    }
    return false;
    break;
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

ChannelList.prototype.inputNum = function (num) {

  var _this = this;

  if (typeof(num) !== 'number' || (num < 0 || num > 9)) {
    return;
  }

  // 缓存输入的数字
  this.inputNums.push(num);

  var nums = this.inputNums;

  // 频道号数字
  var channelNum = parseInt(nums.join(''), 10);

  this.showChannelNums(nums.join(''));
  debug('inputNum: ' + channelNum);

  // if (!this.inputTimer) {
  clearTimeout(_this.inputTimer);
  this.inputTimer = setTimeout(function () {
    _this.jump(channelNum);
  }, 2000);
  // }

  if (this.inputNums.length >= 3) {
    clearTimeout(this.inputTimer);
    this.jump(channelNum);
    return;
  }
};

// 显示频道号
ChannelList.prototype.showChannelNums = function (nums) {

  for (;;) {
    if (nums.length < 3) {
      nums = '0' + nums;
    } else {
      break;
    }
  }

  debug('CNUM:' + nums);

  clearTimeout(this.channelNumTimer);
  this.channelNumDiv.opacity = 1.0;
  this.channelNumDiv.innerHTML = nums;
  this.hideChannelNums();
};

// 隐藏频道号
ChannelList.prototype.hideChannelNums = function () {
  var _this = this;
  clearTimeout(this.channelNumTimer);
  this.channelNumTimer = setTimeout(function () {
    _this.channelNumDiv.innerHTML = '';
    _this.channelNumDiv.opacity = 0.0;
  }, 3000);
};

ChannelList.prototype.jump = function (num) {
  // 跳转后清空频道数字
  this.inputNums = [];
  debug('jump:' + num);

  // 频道号不存在
  if (num <= 0 || num > 999) {
    // this.hideChannelNums();
    debug('channel out');
    return;
  }

  var channelObj = this.getChannelByUserChannelID(num);
  debug('channel:' + JSON.stringify(channelObj));

  if (!channelObj.channel || channelObj.index === -1) {
    // this.hideChannelNums();
    debug('channel not exist');
    return;
  }

  this.updateIndex(channelObj);
};

// 跳台时更新当前索引
ChannelList.prototype.updateIndex = function (channelObj) {

  var channel = channelObj.channel;
  var index = channelObj.index;
  var dataIndex = index < this.rows ? 0 : index;

  this.dataIndex = parseInt(dataIndex / this.rows, 10) * this.rows;
  this.currRow = index % this.rows;

  this.refreshData();

  // 刷新行焦点
  this.refreshFoucsBgColor();

  this.play();
  // this.hideChannelNums();
};


// 隐藏列表
ChannelList.prototype.hide = function () {
  this.parent.style.display = 'none';
  this.isShow = false;
}

// 显示列表
ChannelList.prototype.show = function () {
  this.parent.style.display = 'block';
  this.isShow = true;
};
ChannelList.prototype.setChannelDataDomain = function () {

  this.listServerAddr = GCL_CHANNEL_DATA_DOMIAN;

  return this;
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

  // 拿到用户频道 ID（频道号）
  currChannelUserID = currChannelInfo.UserChannelID;

  that.currPlayUrl = currChannelInfo.ChannelURL;

  // 播放切隐藏列表
  that.hide();

  var url = currChannelUserID;
  that.mpc.play(url);
};

// 根据数据索引(this.dataIndex) 和 当前行索引(this.currRow) 拿到频道索引
ChannelList.prototype._getCurrChannelIndex = function () {
  return (this.dataIndex + this.currRow);
};

// 根据 UserChannelID 获取频道对象
ChannelList.prototype.getChannelByUserChannelID = function (userChannelID) {

  var channels = this.channels;
  var i = 0, len = channels.length;
  var index = -1;
  var channel = null;

  for (; i < len; i++) {
    if (parseInt(userChannelID, 10) == parseInt(channels[i].UserChannelID, 10)) {
      index = i;
      channel = channels[i];
      break;
    }
  }

  return {
    channel: channel,
    index: index
  };
};

// 通过索引获取当前频道
ChannelList.prototype._getCurrChannelByIndex = function (index) {

  if ( index < 0 ) { debug('频道号不存在！'); return null; }

  return this.channels && this.channels[index];
};

/**
 * 上下移动焦点
 * @param  {[type]} direction [description]
 * @return {[type]}           [description]
 */
ChannelList.prototype.move = function (direction, isTurnPage) {

  var that = this,
      count = that.channels.length,
      // 上下到头是否需要翻页标识
      needRound = false;

  if ( direction !== 1 && direction !== -1 ) { return false; }

  // 翻页
  if (typeof(isTurnPage) === 'boolean' && isTurnPage) {
    that.turnPage(direction);
    return;
  }

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
    that.currPage++;
    that.currRow = 0;
    that.dataIndex += that.rows;    // 数据索引加一页行数，及防止越界
    if ( that.dataIndex >= count ) { that.dataIndex = count - 1; }
    needRound = true;
  } else if ( direction > 0 && that.currRow < 0 ) { // 上到头，向上翻页
    that.currPage--;
    that.currRow = that.rows - 1;
    that.dataIndex -= that.rows;    // 数据说因减一页行数，及防止越界
    if ( that.dataIndex <= 0 ) { that.dataIndex = 0; }
    needRound = true;
  }

  // 输出方向，数据索引，和当前行
  // debug('msg: ' + 'd/' + direction + ', currRow/' + that.currRow + ', dataIndex/' + that.dataIndex);

  // 翻页刷新数据
  if ( needRound ) { that.refreshData(); }

  // 刷新行焦点
  that.refreshFoucsBgColor();
};

/**
 * 翻页
 * @param  {[type]}
 * @return {[type]}
 */
ChannelList.prototype.turnPage = function (direction) {

  if (direction !== 1 && direction !== -1) { return false; }

  var that = this;
  var count = that.channels.length;

  if (direction > 0) {
    if (that.currPage === that.totalPages) { return false; }
    that.currPage++;
    that.dataIndex += that.rows;    // 数据索引加一页行数，及防止越界
    if ( that.dataIndex >= count ) { that.dataIndex = count - 1; }
  } else if (direction < 0) {
    if (that.currPage === 1) { return false; }
    that.currPage--;
    that.dataIndex -= that.rows;    // 数据索引减一页行数，及防止越界
    if ( that.dataIndex <= 0 ) { that.dataIndex = 0; }
  }

  that.currRow = 0;

  that.refreshData();

  // 刷新行焦点
  that.refreshFoucsBgColor();

  return false;
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
ChannelList.prototype.init = function (callback) {
  var that = this;
  that.setChannelDataDomain();
  // 先去 session 里的，如果有，就不需要再请求
  if (firstChannel && channelList && channelList.length > 0) {
    that.channels = channelList;
    that.first = firstChannel;
    that._init();
    if (callback) { callback(); }
  }
};

ChannelList.prototype.convertChannels = function () {

  var that = this;

  var len = channels.length;

  var obj = null, channel = null, listChannels = [];
  for (var i = 0; i < len; i++) {
    channel = channels[i];

    listChannels.push({
      ChannelID: i + 1,
      ChannelName: channel.ChannelName,
      UserChannelID: channel.ChannelNumber,
      ChannelURL: channel.LiveUrl
    });
  }

  that.channels = [].slice.call(listChannels, 0);
}

// 内部初始化函数
ChannelList.prototype._init = function () {

  var that = this;

  if ( !that.channels || that.channels.length <= 0 ) { return false; }

  that.totalPages = Math.ceil(that.channels.length / that.rows);

  // 初始化数据(数据索引，当前页)
  that.dataIndex = 0;
  that.currPage = 1;
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
  that.currPlayUrl = that.channels[0].ChannelURL;

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
// 频道号显示区
ChannelList.prototype._generateChannelNumDiv = function () {

  var nums = document.createElement('span');
  nums.className = 'channel-nums';
  document.body.appendChild(nums);

  this.channelNumDiv = nums;
};

// 只会被调用一次，生成列表
ChannelList.prototype._generateList = function (styles) {

  var that = this,
      contents = '',
      i = 0,
      len = that.rows || 10,
      parent = that.parent;

  if ( that.isGenerated ) { debug('dont repeat;');return; }

  contents += '<div id="clist-top">'
    + '<span id="page-tip">' + this.tips[this.language] + '</span>'
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

  // 创建频道显示区
  this._generateChannelNumDiv();

  // 创建音量显示区
  this._generateVolumeBar();

  return contents;
}

// 缓存数据
ChannelList.prototype._cache = function () {
  // unuse
}

/* =========================== START 音量条 =========================== */
// 音量条
ChannelList.prototype._generateVolumeBar = function () {

  var wrapper = document.createElement('div');
  wrapper.className = "vol-wrapper";
  document.body.appendChild(wrapper);

  this.currVolume = this.volume() || 0;

  // debug('curr volume:' + this.currVolume + ', mpc: ' + this.mpc + ', mp: ' + this.mpc.mp);

  wrapper.innerHTML = ''
    + '<div class="vol-bar">'
    + '<div class="vol-line"></div>'
    + '<div class="vol-ball"></div>'
    + '</div>'
    + '<div class="vol-value"></div>';

  this.volumeObj.wrapper = wrapper;
  this.volumeObj.bar = document.querySelector('.vol-bar');
  this.volumeObj.line = document.querySelector('.vol-line');
  this.volumeObj.value = document.querySelector('.vol-value')

  this.changeCurrVolume();
};

ChannelList.prototype.changeCurrVolume = function () {

  var vbar = this.volumeObj.bar || document.querySelector('.vol-bar');
  var vline = this.volumeObj.line || document.querySelector('.vol-line');
  var vvalue = this.volumeObj.value || document.querySelector('.vol-value');
  var vbarW = vbar.offsetWidth;
  var w = this.currVolume / 100 * vbarW;
  var stepW = this.volStep / 100 * vbarW;
  var deltaW = 0;

  if (w < stepW) {
    w = 0;
  } else if (vbarW - w < stepW) {
    w = vbarW
  }
  debug('w:' + w);
  vvalue.innerHTML = this.currVolume;
  vline.style.width = w + 'px';

};

ChannelList.prototype.showVolumeBar = function () {

  var wrapper = this.volumeObj.wrapper || document.querySelector('.vol-wrapper');

  if (wrapper.style.display !== 'block') {
    wrapper.style.display = 'block';
  }

  clearTimeout(this.volumeTimer);
  this.volumeTimer = setTimeout(function () {
    wrapper.style.display = 'none';
  }, 5000);

}
// 声音键处理
ChannelList.prototype.volume = function () {
  if (!this.mpc || !this.mpc.mp) {
    return false;
  }
  var args = arguments;
  var vol = this.mpc.mp.getVolume() || 0;

  if (args.length <= 0) {
    return vol;
  } else if (args[0] > 0) { // volume +
    vol += 5;
  } else if (args[0] < 0) { // volume -
    vol -= 5;
  }

  this.showVolumeBar();

  // 设置每次加减，按5递增递减
  if (vol % 10 < 5) {
    vol = vol - vol % 10;
  } else if ( vol % 10 > 5 ) {
    vol = vol - vol % 10 + 5;
  }

  vol = vol > 100 ? 100
    : vol < 0 ? 0
    : vol;

  this.mpc.mp.setVolume(vol);
  this.currVolume = vol;
  this.changeVolBlock(this.currVolume);
};

// 音量块
ChannelList.prototype.changeVolBlock = function (vol) {
  this.currVolume = vol;
  this.changeCurrVolume();
};

// 静音设置
ChannelList.prototype.mute = function () {
  this.mpc.mp.setMuteFlag(
    this.mpc.mp.getMuteFlag() == 0 ? 1 : 0
  );
};
/* =========================== END 音量条 =========================== */


/* ---------------------------END Channel List --------------------------- */


/* ---------------------------START MediaPlayer --------------------------- */

// 播放器对象
function MediaPlayController() {

  this.mediaStr = '';
  this.playUrl = GCL_TEST_VIDEO_DFT;
  this.channelNo = GCL_TEST_CHAN_NO_DFT;
  this.mp = null;
  this.replayTimer = null;
  this.isChannel = false;
}

MediaPlayController.prototype.setChannelID = function (channelUserId) {
  this.channelID = channelUserId;
  return this;
}

MediaPlayController.prototype.init = function () {
  debug('MPC init');
  this.initMediaPlay();
  return this;
};

// 频道列表错误处理
MediaPlayController.prototype.error = function (msg, code, handler) {

  return;
  var errorContent = '',
      width = 350,
      left = (document.body.clientWidth - width) / 2;

  errorContent = '<div id="mp-error-tips" style="position:absolute;'
    + 'left:' + left
    + 'px;top:40%;'
    + 'width:' + width
    + 'px;background-color:gray;border-radius:2px;'
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

// 虚拟事件处理
MediaPlayController.prototype.virtualEventHandler = function () {

  var eventJson = Utility.getEvent();

  // 这里可能会报错，因为底下传上来的的
  // event json 中的 key 没有带引号，JSON.parse 会解析错误
  // eventJson = JSON.parse(eventJson);
  eventJson = eval('(' + eventJson + ')');

  var type = eventJson.type;

  // this.error('virtualEventHandler code type: ' + type);
  debug(type);
  switch (type) {
  case 'EVENT_MEDIA_BEGINNING':   // 视频开始播放
    break;
  case 'EVENT_MEDIA_END':     // 视频播放结束
    this.play(this.playUrl);
    break;
  case 'EVENT_MEDIA_ERROR':   // 视频播放错误
    break;
  default:return false;break;
  }

  return false;
};

MediaPlayController.prototype.setMediaStr = function (playUrl) {

  if ( !playUrl ) { that.error('setMediaStr 频道地址不存在！'); return; }

  this.playUrl = playUrl;

  this.mediaStr = '[{mediaUrl:"' + playUrl + '",';
  this.mediaStr += 'mediaCode: "jsoncode1",';
  this.mediaStr += 'mediaType:2,';
  this.mediaStr += 'audioType:1,';
  this.mediaStr += 'videoType:1,';
  this.mediaStr += 'streamType:1,';
  this.mediaStr += 'drmType:1,';
  this.mediaStr += 'fingerPrint:0,';
  this.mediaStr += 'copyProtection:1,';
  this.mediaStr += 'allowTrickmode:1,';
  this.mediaStr += 'startTime:0,';
  this.mediaStr += 'endTime:20000,';
  this.mediaStr += 'entryID:"jsonentry1"}]';

  return this;
}

// 获取或设值播放地址
MediaPlayController.prototype.initMediaPlay = function () {

  // debug('initMediaPlay:' + MediaPlayer);
  // this.setMediaStr(this.playUrl);
  if (!window.MediaPlayer) {
    debug('no MediaPlayer.')
    return false
  }
  this.mp = new window.MediaPlayer(); //新建一个mediaplayer对象
  var instanceId = this.mp.getNativePlayerInstanceID(); //读取本地的媒体播放实例的标识

  var playListFlag = 0; //Media Player 的播放模式。 0：单媒体的播放模式 (默认值)，1: 播放列表的播放模式
  var videoDisplayMode = 1; //MediaPlayer 对象对应的视频窗口的显示模式. 1: 全屏显示2: 按宽度显示，3: 按高度显示
  var height = window.innerHeight;
  var width = window.innerWidth;
  var left = 0;
  var top = 0;
  var muteFlag = 0; //0: 设置为有声 (默认值) 1: 设置为静音
  var subtitleFlag = 0; //字幕显示
  var videoAlpha = 0; //视频的透明度
  var cycleFlag = 0;
  var randomFlag = 0;
  var autoDelFlag = 0;
  var useNativeUIFlag = 1;
  //初始话mediaplayer对象
  // alert("开始播放$$$");
  this.mp.initMediaPlayer(instanceId, playListFlag, videoDisplayMode,
                          height, width, left, top, muteFlag, useNativeUIFlag, subtitleFlag, videoAlpha, cycleFlag, randomFlag, autoDelFlag);
  // this.mp.setSingleMedia(this.mediaStr); //设置媒体播放器播放媒体内容
  this.mp.setAllowTrickmodeFlag(0); //设置是否允许trick操作。 0:允许 1：不允许
  this.mp.setVideoDisplayMode(0);
  this.mp.setVideoDisplayArea(left, top, width, height);
  this.mp.setNativeUIFlag(0); //设置播放器本地UI显示功能 0:允许 1：不允许
  this.mp.setAudioTrackUIFlag(1);
  this.mp.setMuteUIFlag(1);
  this.mp.setAudioVolumeUIFlag(1);
  this.mp.refreshVideoDisplay();
}

MediaPlayController.prototype.displayMode = function () {

  var args = [].prototype.slice(arguments, 0);
}

MediaPlayController.prototype.stop = function () {
  if (this.isChannel) {
    this.mp.leaveChannel();
  } else {
    this.mp.stop();
    // this.mp.close();
  }
  if (this.mp) {
    this.mp.releaseMediaPlayer(this.mp.getNativePlayerInstanceID());
  }
  return this;
}

MediaPlayController.prototype.play = function (playUrl) {

  debug('playUrl - play: ' + playUrl);

  if ( !playUrl ) { this.error('play 频道地址不存在！'); return; }

  this.isChannel = !isNaN(playUrl);

  // this.mp.stop(1);
  // this.setDisplayArea(200, 100, 500, 400);
  // this.mp.joinChannel(playUrl);
  // // test
  // this.isChannel = false;
  // // playUrl = 'http://42.236.123.10/iptv/clist/vod/yanguiren.ts';
  // playUrl = 'http://222.221.25.243:6166/iptv/ppthdplay/hotelapps/index/SYHOTEL/assets/video/back_video_4M_out.mp4';

  if (this.isChannel) {
    window.clist.showChannelNums(playUrl);
    if (this.mp && this.mp.joinChannel) {
      this.mp.joinChannel(playUrl);
    }
  } else {
    // 设置播放地址
    this.setMediaStr(playUrl);
    this.mp.setSingleMedia(this.mediaStr); //设置媒体播放器播放媒体内容
    this.mp.playFromStart();
  }

  return this;
};

// 设置播放位置和大小：mode(0: 非全屏，1：全屏)
MediaPlayController.prototype.setDisplayArea = function (left, top, width, height) {

  this.mp.setVideoDisplayMode(0);
  this.mp.setVideoDisplayArea(left, top, width, height);
  // this.mp.refreshVideoDisplay();

}

// 按键处理
MediaPlayController.prototype.eventHandler = function (keycode) {
  // TODO
};

/* ---------------------------END MediaPlayer --------------------------- */

window.onload = function () {

  var played = false;

  setChannels();

  // 频道列表
  window.clist = new ChannelList();

  // 播放器
  window.mpc = new MediaPlayController();

  // 显示列表也需要个播放控制器对象
  clist.mpc = mpc;

  // 频道列表初始化
  clist.init(function () {
    // 初始化完成之后执行

    var channels = clist.channels;
    var ucid = channels[0].UserChannelID;
    var url = channels[0].ChannelURL;
    window.clist.showChannelNums(ucid)

    //如果不是组播就使用播放地址去播放
    url = url.indexOf('igmp://')>= 0?ucid:url;

    debug('init url: ' + url);
    // 如果 session 里的已经播了，就不重复播放
    // if (!played) {
    // 2. 频道地址播放
    mpc.init().play(url);
    // }
  });


  window.onkeydown = function (event) {

    var keycode = event.which ? event.which : event.keycode;

    mpc.error('onkeydown code: ' + keycode);

    // 虚拟事件
    if (keycode === 768) {
      mpc.virtualEventHandler();
      return false;
    }

    clist.eventHandler(event);

    return true;
  };
}

window.onunload = function () {

  // 这里执行销毁播放器实例操作，避免每打开一次直播页面
  // 就会创建一个播放器实例
  if (!window.mpc || !window.mpc.mp) {
    debug('no mpc instance.')
    return false
  }
  window.mpc.mp.stop(); // 停止播放失败，避免关闭页面后视频在后台播放
  window.mpc.mp.close();
  window.mpc.mp.releaseMediaPlayer();
  window.mpc = null;
  window.clist = null;
}

function debug(str) {
  var db = document.getElementById('clist-debug')
  if (!db) {
    db = document.createElement('div');
    db.id = 'clist-debug';
    document.body.appendChild(db);
  }

  if (db) {
    db.innerHTML += '[' + str + ']';
  }
}
