# File Name

[sunlingt.epg.tar.gz]

# Usage

$ tar xzf sunlight.epg.tar.gz ./

解包之后，里面有 

portal.jsp  : 对应中兴平台模版文件

Category.jsp : 对应中兴平台的模版文件

模版文件放置到平台方对应的盛阳酒店分组陌路下面，然后平台方不采用直接链接方式到盛阳EPG，
而是跳转到对应的模板文件。

之后模版文件中有三个IP，以及测试EPG服务器是否可通的逻辑，首先会随机从三个IP中取一个，不通再从剩下的两个中随机取一个，最后到第三个，如果三个都不通，会跳转到 `index2.html?plat=huawei` 或 `plat=zte` 到直播页面。


# Channel List Page

直播页面的地址来源于 `xml` 文件，如果要更新频道地址，需要如下操作：


1. 将 `xml` 文件去掉 `\n` 换行符，转成字符串，然后使用插件 `xml2json.js` 去格式化成字符串

由于盒子上测试直接使用该插件无效，故请在浏览器上使用。

2. 然后调用 `xml2json.js` 格式化 

`var x2js = new X2JS()`

`x2js.xml_str2json(......xmlstr)`

`xmlstr` 即 `xml` 文件格式化后的字符串。

3. 得到最终频道列表

经过 2 之后，会得到列表对象 `channelObj`, 调用 `var listStr = JSON.stringify(channelObj)` 序列化之后的结果就是我们需要的最终的列表数据。

然后将序列化后的字符串存放到 `/src/mydatas.js` 中

中兴： `var ZTE_XML_STR = listStr`

华为： `var HW_XML_STR = listStr`

上面步骤完成之后，即可替换频道数据。
