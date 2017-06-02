
// domian -> window.document.location.href 取 ip + /clist/data/channel.json
var GCL_CHANNEL_DATA_DOMIAN = 'http://192.168.88.36/iptv/clist/data/channel.json';

// 测试入口页面
var GCL_TEST_ENTRY_PAGE = 'http://192.168.88.36/iptv/clist/entry.html'

// 测试视频
var GCL_TEST_VIDEO_MP4 = 'http://192.168.88.36/iptv/clist/vod/yanguiren.mp4';
var GCL_TEST_VIDEO_TS = 'http://192.168.88.36/iptv/clist/vod/yanguiren.ts';
var GCL_TEST_VIDEO_DFT = GCL_TEST_VIDEO_TS;

// 测试链接
var GCL_TEST_LINKS = [
    {   // 认证入口
        link: 'http://222.221.25.243:6166/iptv/ppthdplay/hotelapps/index/index_epg.html', 
        icon: '<i class="fa fa-sign-in" aria-hidden="true"></i>',
        text: '认证入口'
    }, {    // 首页
        link: 'http://222.221.25.243:6166/iptv/ppthdplay/hotelapps/index/index_epg.html', 
        icon: '<i class="fa fa-bed" aria-hidden="true"></i>',
        text: '首页'
    }, {    // 酒店入口 - 测试 1
        link: 'http://222.221.25.243:6166/iptv/ppthdplay/hotelapps/index/SYHOTEL/epggroup_mains/main_test/main.html',
        icon: '<i class="fa fa-bed" aria-hidden="true"></i>',
        text: '酒店入口 - 测试 1'
    }, {    // 直播页面
        link: 'http://192.168.88.36/iptv/clist/index2.html',
        icon: '<i class="fa fa-youtube-play" aria-hidden="true"></i>',
        text: '直播页面'
    }, {    // 无MP直播页面
        link: 'http://192.168.88.36/iptv/clist/index-bw.html',
        icon: '<i class="fa fa-television" aria-hidden="true"></i>',
        text: '无MP直播页面'
    }
];