
// 将对象以 'key=value, key1=value' 格式拼接起来
function joinObj(obj) {
    var str = [];

    for (var prop in obj) {
        str.push(prop + '="' + obj[prop] + '"');
    }

    return str.join(',');
}

/* ----------------------- START 直播频道相关 ----------------------- */
/*
'ChannelID="215",
ChannelName="............",
UserChannelID="31",
ChannelURL="igmp://225.1.4.51:1080|rtsp://10.254.178.6/PLTV/88888888/224/3221225663/10000100000000060000000000009818_0.smil?rrsip=10.254.178.4,rrsip=10.254.178.5&icpid=SSPID&accounttype=1&limitflux=-1&limitdur=-1&accountinfo=Puq3hg5/vQldTgB0/HCAqRzmu3Y6W7rFip5CzGepbrTr0ONw4qr86LvTl6duEs+RfWAihONT+ES1w5bojk5WiYHAfLfWmJw9Ehxkp5tePXU8YaiUrZCpgrtI1zCi26yoyt3Ctk0+WiGCPVZjLjaMXg==:20170612152949,4322,10.217.185.32,20170612152949,00000001000000050000000000000085,3478D3B85CB721B920AF6CFCCCE5F746,-1,0,1,,,2,,,,2,END",T
imeShift="1",
TimeShiftLength="10800",
ChannelSDP="igmp://225.1.4.51:1080|rtsp://10.254.178.6/PLTV/88888888/224/3221225663/10000100000000060000000000009818_0.smil?rrsip=10.254.178.4,rrsip=10.254.178.5&icpid=SSPID&accounttype=1&limitflux=-1&limitdur=-1&accountinfo=Puq3hg5/vQldTgB0/HCAqRzmu3Y6W7rFip5CzGepbrTr0ONw4qr86LvTl6duEs+RfWAihONT+ES1w5bojk5WiYHAfLfWmJw9Ehxkp5tePXU8YaiUrZCpgrtI1zCi26yoyt3Ctk0+WiGCPVZjLjaMXg==:20170612152949,4322,10.217.185.32,20170612152949,00000001000000050000000000000085,3478D3B85CB721B920AF6CFCCCE5F746,-1,0,1,,,2,,,,2,END",
TimeShiftURL="rtsp://10.254.178.6/PLTV/88888888/224/3221225663/10000100000000060000000000009818_0.smil?rrsip=10.254.178.4,rrsip=10.254.178.5&icpid=SSPID&accounttype=1&limitflux=-1&limitdur=-1&accountinfo=Puq3hg5/vQldTgB0/HCAqRzmu3Y6W7rFip5CzGepbrTr0ONw4qr86LvTl6duEs+RfWAihONT+ES1w5bojk5WiYHAfLfWmJw9Ehxkp5tePXU8YaiUrZCpgrtI1zCi26yo0ZwdWOyVUmD9Hjf8EHnUNg==:20170612152949,4322,10.217.185.32,20170612152949,00000001000000050000000000000085,3478D3B85CB721B920AF6CFCCCE5F746,-1,1,1,,,7,,,,4,END",
ChannelType="1",
IsHDChannel="2",
PreviewEnable="0",
ChannelPurchased="0",
ChannelLocked="0",
ChannelLogURL="",
PositionX="null",
PositionY="null",
BeginTime="null",
Interval="null",
Lasting="null",
ActionType="1",
FCCEnable="0",
ChannelFECPort="0"'

*/

// 下发频道信息
function setChannels2(channels) {
    
    var len = channels.length;
    Authentication.CUSetConfig('ChannelCount', len);

    console.log('channel count: ' + len);

    var obj = null, channel = null;
    for (var i = 0; i < len; i++) {
        channel = channels[i];
        obj = {
            ChannelID: i + 1,
            ChannelName: channel.ChannelName,
            UserChannelID: channel.ChannelNumber,
            ChannelURL: channel.LiveUrl,
            TimeShift: "0",
            TimeShiftLength: "0",
            ChannelSDP: channel.LiveUrl,
            IsHDChannel: '1',
            PreviewEnable: "0",
            ChannelPurchased: "1",
            ChannelLocked: "0",
            ChannelLogURL: channel.LogoUrl,
            PositionX: "null",
            PositionY: "null",
            BeginTime: "null",
            Interval: "null",
            Lasting: "null",
            ActionType: "1",
            FCCEnable: "0",
            ChannelFECPort: "0",
        };

        obj = joinObj(channels[i]);
        Authentication.CUSetConfig('Channel', obj);
    }

    console.log('first channel: ' + JSON.stringify(channels[0]));

    // 将第一个频道保存到session
    sessionStorage.setItem('FirstChannel', JSON.stringify(channels[0]));
}

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