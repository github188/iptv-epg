<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="java.net.URLEncoder"%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.net.*"%>
<%@ page import="java.io.*"%>
<%@ page import="java.util.*"%>
<%@ page import="com.huawei.iptvmw.epg.bean.info.UserProfile"%>
<%
UserProfile profile = new UserProfile(request);
String userGroup = profile.getUserGroupId(); 
String userId = profile.getUserId();
int areaID = profile.getAreaId();
String serverName = "" + request.getServerName();
String serverPort = "" + request.getServerPort();
String remoteAddr = "" + request.getRemoteAddr();
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="zh">
  <head>
    <title>SUNLIGHT EPG</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  </head>
  <<body>

    <script language="javascript" type="text/javascript">
    var userGroup = '<%=userGroup%>';
    var userId = '<%=userId%>';
    var areaID = '<%=areaID%>';
    var sname = '<%=serverName%>';
    var sport = '<%=serverPort%>';
    var remoteaddr = '<%=remoteAddr%>';

    function getEPGUrl(ip) {
      return (
        '' + location.protocol + '//' + ip + '/iptv/portal.html'
        + '?userId=' + userId + '&userGroup=' + userGroup
        + '&areaID=' + areaID + '&servername=' + sname
        + '&serverport=' + sport + '&remoteaddr=' + remoteaddr
        + '&from=huawei'
      );
    }

    function getIPTVUrl() {
      return './clist/index2.htmlfrom=huawei';
    }
    var ips = ['10.253.255.10', '10.253.255.11', '10.253.255.12'];
    var timers = [];
    var isSuccess = false;
    var picName = '/iptv/assets/images/epg_entry_check.png';
    var checkerTimer = null;
    var availableIndex = -1;
    // timeout's total seconds
    var totalTime = 0;
    // request failed times
    var failedTimes = 0; 
    // the base ms of between every request
    var requestInterval = 1000;
    // every request's timeout
    var timeout = 5 * 1000;

    function clear() {
	  clearInterval(checkerTimer);
	  for (var i = 0; i < ips.length; i++) {
	    clearTimeout(timers[i]);
	  }
    }

    function goIptv(error) {
	  // TODO
	  clear();
      window.location.href = getIPTVUrl()
    }

    function jump(ip) {
	  // request successed, will jump and clear all request timer
	  clear();
      window.location.href = getEPGUrl(ip);
    }

    function checkTimeout() {
	  checkerTimer =  setInterval(function () {
	    totalTime += 100;
	    // request failed and timeout
	    if (!isSuccess && totalTime >= timeout * ips.length) {
		  // TODO  go iptv or channel list
		  goIptv('timeout');
	    } else if (failedTimes >= ips.length) {
		  // failed times beyond the all ip's count
		  goIptv('times beyond');
	    } else if (isSuccess) {
		  // go epg
		  jump(ips[availableIndex]);
	    }
	  }, 100);
    }

    // trigger single ip request
    function request(idx, ip) {
	  clearTimeout(timers[idx]);
	  timers[idx] = setTimeout(function () {
	    var img = new Image();
	    // img.src = 'http://' + ip + '/iptv/' + picName;
	    img.src = location.protocol + '//' + ip + picName; // for test
	    img.onload = function () {
		  isSuccess = true;
		  availableIndex = ips.indexOf(ip);
		  jump(ip);
	    };
	    img.onerror = function (error) {
		  isSuccess = false;
		  availableIndex = -1;
		  failedTimes++;
		  console.log('[' + ip + ']image load error.');
		  // console.log(error);
	    };
	  }, requestInterval * idx);
    }

    function getRandIp(ips) {
	  var randIdx = Math.floor(Math.random() * ips.length);
	  console.log('random index: ' + randIdx + ', ip: ' + ips[randIdx]);
	  return ips[randIdx];
    }

    function start() {
	  var ipsBak = [].slice.call(ips, 0);
	  var randIp = '';
	  var index = -1;

	  // open timeout checker
	  checkTimeout();

	  // trigger all request
	  for (var i = 0; i < ips.length; i++) {
	    randIp = getRandIp(ipsBak);
	    console.log('random ip: ' + randIp);
	    index = ipsBak.indexOf(randIp);
	    ipsBak.splice(index, 1);
	    request(i, randIp);
	  }
    }

    start();
    </script>
  </body>
</html>