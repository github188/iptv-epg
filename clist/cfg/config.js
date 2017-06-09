
var GCL_LOCALE_DOMAIN = '113.136.46.36';

// domian -> window.document.location.href 取 ip + /clist/data/channel.json
var GCL_CHANNEL_DATA_DOMIAN = 'http://' + GCL_LOCALE_DOMAIN + '/iptv/clist/data/channel.json';

// 测试入口页面
var GCL_TEST_ENTRY_PAGE = 'http://' + GCL_LOCALE_DOMAIN + '/iptv/clist/entry.html'

// 测试视频
var GCL_TEST_VIDEO_MP4 = 'http://' + GCL_LOCALE_DOMAIN + '/iptv/clist/vod/yanguiren.mp4';
var GCL_TEST_VIDEO_TS = 'http://' + GCL_LOCALE_DOMAIN + '/iptv/clist/vod/yanguiren.ts';
var GCL_TEST_VIDEO_DFT = GCL_TEST_VIDEO_TS;

// 测试链接
var GCL_TEST_LINKS = [
    {   // 认证入口
        link: 'http://113.136.46.37/iptv/portal_main.html', 
        icon: '<i class="fa fa-sign-in" aria-hidden="true"></i>',
        text: '当前：陕西EPG'
    }, {    // 首页
        link: 'http://222.221.25.243:6166/iptv/ppthdplay/hotelapps/index/index_epg.html', 
        icon: '<i class="fa fa-bed" aria-hidden="true"></i>',
        text: '首页'
    }, {    // 酒店入口 - 测试 1
        link: 'http://222.221.25.243:6166/iptv/ppthdplay/hotelapps/index/SYHOTEL/epggroup_mains/main_test/main.html',
        icon: '<i class="fa fa-bed" aria-hidden="true"></i>',
        text: '酒店入口 - 测试 1'
    }, {    // 直播页面
        link: 'http://113.136.46.37/iptv/clist/index2.html',
        icon: '<i class="fa fa-youtube-play" aria-hidden="true"></i>',
        text: '直播页面'
    }, {    // 无MP直播页面
        link: 'http://113.136.46.37/iptv/clist/index-bw.html',
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
    }
];