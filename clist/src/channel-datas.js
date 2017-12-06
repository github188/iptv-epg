var FateChannelDatas = [];
var objstr = ''
if (location.href.indexOf('zte') > -1) {
  objstr = ZTE_XML_STR;
} else {
  objstr = HW_XML_STR;
}

FateChannelDatas = JSON.parse(objstr);
/*

  由于xml2json插件在盒子上跑不了，new之后得到的是空对象，因此采用下面的方式：

  如果要替换频道信息，先将xml文件内容格式化成字符串去掉换行，
  然后引入 xml2json.js，去掉下面的注释，将xml转成object，
  然后使用JSON.stringify格式化成字符串，在mydatas.js里面替换掉，
  在这里调用 JSON.parse(objstr)


for (var i = 0; i < items.length; i++) {
  var item = items[i]
  FateChannelDatas.push({
    ChannelID: (1000000 + i + 1) + '',
    ChannelName: item.channelname,
    ChannelNumber: i + 1,
    UserChannelID: item.channelno,
    LiveUrl: item.liveurl,
    LogoUrl: item.logourl,
    ChannelURL: item.liveurl
  })
}

FateChannelDatas = FateChannelDatas.sort(function(a, b) {
  var fir = Number.parseInt(a.UserChannelID, 10);
  var sec = Number.parseInt(b.UserChannelID, 10);
  return fir - sec;
}) */
