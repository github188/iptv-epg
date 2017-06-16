
/**
    1. 113.136.46.36    陕西西安
    2. 42.236.123.10    河南郑州

*/
var GCL_LOCALE_DOMAIN = '10.253.255.4';

// domian -> window.document.location.href 取 ip + /clist/data/channel.json
var GCL_CHANNEL_DATA_DOMIAN = 'http://' + GCL_LOCALE_DOMAIN + '/iptv/clist/data/channel.json';

// 测试入口页面
var GCL_TEST_ENTRY_PAGE = 'http://' + GCL_LOCALE_DOMAIN + '/iptv/clist/entry.html'

// 测试视频
var GCL_TEST_VIDEO_MP4 = 'http://' + GCL_LOCALE_DOMAIN + '/iptv/clist/vod/yanguiren.mp4';
var GCL_TEST_VIDEO_TS = 'http://' + GCL_LOCALE_DOMAIN + '/iptv/clist/vod/yanguiren.ts';
var GCL_TEST_VIDEO_DFT = GCL_TEST_VIDEO_TS;
var GCL_TEST_CHAN_NO_DFT = '1';

// 测试链接
var GCL_TEST_LINKS = [
    {   // 认证入口
        link: 'http://10.253.255.4/iptv/portal.html', 
        icon: '<i class="fa fa-sign-in" aria-hidden="true"></i>',
        text: '当前：河南EPG'
    }, {    // 首页
        link: 'http://222.221.25.243:6166/iptv/ppthdplay/hotelapps/index/index_epg.html', 
        icon: '<i class="fa fa-bed" aria-hidden="true"></i>',
        text: '首页'
    }, {    // 酒店入口 - 测试 1
        link: 'http://222.221.25.243:6166/iptv/ppthdplay/hotelapps/index/SYHOTEL/epggroup_mains/main_test/main.html',
        icon: '<i class="fa fa-bed" aria-hidden="true"></i>',
        text: '酒店入口 - 测试 1'
    }, {    // 直播页面
        link: 'http://10.253.255.4/iptv/clist/index2.html',     // 113.136.46.37
        icon: '<i class="fa fa-youtube-play" aria-hidden="true"></i>',
        text: '直播页面'
    }, {    // 无MP直播页面
        link: 'http://10.253.255.4/iptv/clist/index-bw.html',
        icon: '<i class="fa fa-television" aria-hidden="true"></i>',
        text: '无MP直播页面'
    }, {
        link: 'http://222.221.25.243:6166/iptv/ppthdplay/hotelapps/index/SYHOTEL/portal.html',
        icon: '<i class="fa fa-sign-in" aria-hidden="true"></i>',
        text: '云南EPG入口'
    }, {
        link: 'http://222.221.25.243:6166/iptv/ppthdplay/hotelapps/index/SYHOTEL/portal.html',
        icon: '<i class="fa fa-sign-in" aria-hidden="true"></i>',
        text: '重庆EPG入口'
    }, {
        link: 'http://113.136.46.37/iptv/portal_main.html',
        icon: '<i class="fa fa-sign-in" aria-hidden="true"></i>',
        text: '陕西EPG入口'
    }, {
        link: 'http://113.136.96.196:8282/EPG/jsp/ywbz/en/Category.jsp', // xagqftkdb
        icon: '<i class="fa fa-sign-in" aria-hidden="true"></i>',
        text: '陕西IPTV入口'
    }, {
        link: 'http://113.136.46.37/iptv/portal.html',
        icon: '<i class="fa fa-sign-in" aria-hidden="true"></i>',
        text: '陕西: 113.136.46.37'
    }, {
        link: 'http://113.136.46.36/iptv/portal.html',
        icon: '<i class="fa fa-sign-in" aria-hidden="true"></i>',
        text: '陕西: 113.136.46.36'
    }, {
        link: 'http://10.253.255.4/iptv/portal.html',
        icon: '<i class="fa fa-sign-in" aria-hidden="true"></i>',
        text: '河南: 10.253.255.4'
    }, {
        link: 'http://202.99.114.71:40001/hnlthotel/homePage.html?'
            + 'userId=4322&carrierId=204&industry=hotel&state=1&categoryid=dc00005223&'
            + 'returnurl=http%3A%2F%2F10.253.255.4%2Fiptv%2Fportal.html',
        icon: '<i class="fa fa-sign-in" aria-hidden="true"></i>',
        text: '河南IPTV'
    }, {
        link: 'http://10.253.255.4/iptv/clist/play.html',
        icon: '<i class="fa fa-sign-in" aria-hidden="true"></i>',
        text: '测试播放'
    }
];



// setChannels(GCL_CHANNEL_DATAS);


