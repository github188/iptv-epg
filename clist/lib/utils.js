
// 将对象以 'key=value, key1=value' 格式拼接起来
function joinObj(obj) {
    var str = [];

    for (var prop in obj) {
        str.push(prop + '="' + obj[prop] + '"');
    }

    return str.join(',');
}

/* ----------------------- START 直播频道相关 ----------------------- */

// 下发频道信息
function setChannels(channels) {
    
    var len = channels.length;
    Authentication.CUSetConfig('ChannelCount', len);

    console.log('channel count: ' + len);

    var obj = null;
    for (var i = 0; i < len; i++) {
        obj = joinObj(channels[i]);
        Authentication.CUSetConfig('Channel', obj);
    }

    console.log('first channel: ' + JSON.stringify(channels[0]));

    // 将第一个频道保存到session
    sessionStorage.setItem('FirstChannel', JSON.stringify(channels[0]));
}

var isRequestStatus = false;

// 请求频道信息
function configChannels(callback) {

    var xhr;

    if (isRequestStatus) {
        return;
    }
    isRequestStatus = true;

    if ( window.XMLHttpRequest ) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    xhr.open('get', GCL_CHANNEL_DATA_DOMIAN, true);
    xhr.onreadystatechange = function () {
        that.error('ready: ' + xhr.readyState + ', status: ' + xhr.status);
        if ( xhr.readyState === 4 && xhr.status === 200 ) {

            var _data = JSON.parse(xhr.responseText);
            var _msgBody = _data.Message.MessageBody;

            if (_msgBody.ResultCode == 200) {

                var channels = _msgBody.ChannelList.Channel;

                if ( channels && channels.length > 0 ) {
                    setChannels(channels);
                    if (callback) { callback(); }
                } else {
                    // nil
                }
            }

            isRequestStatus = false;
        }
    };

    xhr.send(null);
}

/* ----------------------- END 直播频道相关 ----------------------- */