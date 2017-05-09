


// 播放列表     -> lizc channel list
var ChannelListTable = {

    // 当前焦点行
    currFocus: 0,

    // 一页列表行数
    lines: 8,

    // 行高
    rowHeight: 80,

    // 总页数
    pages: 0,

    // 当前页
    currPage: 1,

    // 数据索引
    dataIndex: 0,

    // 期间是否有按键发生
    keydown: false,

    // 自动隐藏计时器
    autoHideTimer: -1,

    // 列表行 ID 前缀
    prefix: 'chanList',

    // 列表是否显示
    isShow: false,

    ids: {

        currPage: 'curr_page',
        totalPage: 'total_page',
        table: 'lc_progs',
        list: 'clist'
    },

    keys: [ 13, 38, 40, 8 ],

    focus: function () {

        var that    = this,
            trH     = that.rowHeight,
            id      = that.prefix + that.currFocus,
            focusDiv= that.focusDiv,
            tds     = null,
            supportTstv = false;

        debug( 'focus --- prefix = ' + that.prefix + ', focus = ' + that.currFocus + ', focusId = ' + focusDiv.id );

        tds = $ID( id ).getElementsByTagName( 'td' );

        trH = pcPX2Num( $ID( id ).style.height );

        debug( 'focus --- trH = ' + trH );

        tds[0].style.fontSize = '35px';

        $ID( id ).style.color = '#FFFFFF';

        supportTstv = ChannelDatas.channels[ that.dataIndex + that.currFocus ].TimeShift;

        debug( 'focus --- supportTstv = ' + supportTstv );

        // 支持时移显示回看图标
        if ( supportTstv ) {

            $ID( focusDiv.tvodIconId ).style.background = 'url(' + focusDiv.tvodIconPath + ') no-repeat 315px center';
        } else {

            $ID( focusDiv.tvodIconId ).style.background = '';
        }

        $ID( focusDiv.id ).style.top = ( focusDiv.top + trH * that.currFocus ) + 'px';
    },

    blur: function () {

        var that    = this,
            tds     = null,
            id      = that.prefix + that.currFocus;

        tds = $ID( id ).getElementsByTagName( 'td' );

        tds[0].style.fontSize = '35px';

        $ID( id ).style.color = '#a0a2a4';
    },

    showData: function ( start ) {

        var that    = this,
            tds     = null, td       = null, tr = null,
            spans   = null, textNode = null,
            chanLen = 0,    number   = 0, i = 0,
            len     = that.lines,
            channels        = ChannelDatas.channels;

        chanLen = channels.length;

        debug( 'showData --- chanLen = ' + chanLen + ', start = ' + start );

        if ( chanLen < len ) {

            len = chanLen;

            start = 0;
        } else if ( start > 0 && chanLen >= len ) {

            len = chanLen - start;

            if ( len > that.lines ) {

                len = that.lines;
            }
        }

        debug( 'showData --- len = ' + len + ', prefix = ' + that.prefix );

        for ( ; i < len; i++ ) {

            tr = $ID( that.prefix + i );

            // programs time
            tds = tr.getElementsByTagName( 'td' );

            number = parseInt( channels[i + start].UserChannelID, 10 );

            // id
            tds[0].innerText = pcAdd0ToNum( number );

            // prog
            tds[1].innerText = channels[i + start].ChannelName;
        }
    },

    dataInit: function () {

        var that = this,
            ids  = that.ids;

        that.pages = Math.ceil( that.channelDatas.count / that.lines );

        debug( 'dataInit ----------- pages = ' + pages );

        $ID( ids.currPage ).innerText = that.currPage;
        $ID( ids.totalPage ).innerText = that.pages;
    },

    init: function () {

        var that = this;

        // that.currFocus = 0;

        that.dataInit();

        debug( 'init ----------- dataIndex = ' + that.dataIndex );

        that.showData( 0 );

        that.focus();
    },

    // 更新当前页码
    updateCurrPageIndex: function ( page ) {

        debug( 'updateCurrPageIndex --- page = ' + page );

        this.currPage = page;

        $ID( this.ids.currPage ).innerText = page;
    },

    // 清空列表
    clear: function () {

        var that = this,
            len  = that.lines,
            i    = 0,
            tr, tds;

        for ( ; i < len; i++ ) {

            tr = $ID( that.prefix + i );

            // programs time
            tds = tr.getElementsByTagName( 'td' );

            // id
            tds[0].innerText = '';

            tds[1].innerText = '';
        }
    },

    // 刷新列表数据
    refresh: function ( start ) {

        var that = this;

        that.clear();

        debug( 'refresh --- currpage = ' + that.currPage + ', dataIndex = ' + that.dataIndex );

        start = start || that.dataIndex ;

        that.updateCurrPageIndex( start / that.lines + 1 );

        that.showData( start );

        that.focus();
    },

    change: function ( direction ) {

        var that = this,
            line = that.lines,
            start = 0,
            count = that.channelDatas.count;

        if ( direction !== -1 && direction !== 1 ) {

            return false;
        } 

        debug( 'change --- 0000000 dataIndex = ' + that.dataIndex );
        debug( 'change --- 0000000 count = ' + count );
        if ( count < that.lines ) {

            line = count;

            that.dataIndex = 0;

        } else if ( direction > 0 && that.dataIndex > 0 && count - that.dataIndex < that.lines ) {

            line = count - that.dataIndex;  
        }

        debug( 'change --- chanLines = ' + count );
        debug( 'change --- direction = ' + direction );
        debug( 'change --- line = ' + line );
        debug( 'change --- currFocus = ' + that.currFocus );
        debug( 'change --- dataIndex = ' + that.dataIndex );

        if ( ( direction < 0 &&  that.currFocus === 0 && that.dataIndex === 0 ) || 
            ( direction > 0 && ( that.dataIndex + that.currFocus + 1 === count ) ) ) {

            debug( 'change ---- do nothing' );

            return;
        }

        that.blur();

        if ( direction > 0 && that.currFocus === that.lines - 1 && count > that.lines ) {

            // 重新刷新数据
            that.dataIndex += that.lines;

            // 焦点归零
            that.currFocus = 0;

            debug( 'change 33333 dataIndex = ' + that.dataIndex );

            that.refresh( that.dataIndex );

        } else if ( direction < 0 && that.currFocus === 0 && that.dataIndex > 0 ) {

            that.dataIndex = that.dataIndex - that.lines > 0 ? that.dataIndex - that.lines : 0;

            that.currFocus = that.lines - 1;

            debug( 'change 44444 that.dataIndex = ' + that.dataIndex );

            that.refresh( that.dataIndex );
        } else {

            that.currFocus = direction > 0 ? that.currFocus + 1 : that.currFocus - 1;
        }

        if ( that.currFocus < 0 ) {

            that.currFocus = 0;
        } else if ( that.currFocus >= line ) {

            that.currFocus = line - 1;
        }

        debug( 'change 222 that.currFocus = ' + that.currFocus );
        debug( 'change 222 that.dataIndex = ' + that.dataIndex );

        that.focus();
    },

    eventHandler: function ( keycode ) {

        var that    = this,
            index   = -1,
            chanNum = -1,
            channels = ChannelDatas.channels;

        // 每次按键都重启一次计时器，直到 10s 后无按键发生，隐藏列表
        that.startTimer();

        debug( 'ChannelListTable --- eventHandler --- keycode = ' + keycode );

        switch ( keycode ) {
            case 13:

                debug( 'ChannelListTable --- eventHandler --- dataIndex = ' + that.dataIndex );
                debug( 'ChannelListTable --- eventHandler --- currFocus = ' + that.currFocus );

                index = that.dataIndex + that.currFocus;

                chanNum = channels[ index ].UserChannelID;

                debug( 'ChannelListTable --- eventHandler --- chanNum = ' + chanNum );


                ChannelProgress.joinChannel( chanNum );

                that.hide();

                return false;
                break;
            case 38:
                that.change( -1 );
                return false;
                break;
            case 40:
                that.change( 1 );
                return false;
                break;  
            case 8: // 关闭列表

                that.hide();

                chanNum = ChannelDatas.channelUserIds[ ChannelDatas.currChannelIndex ];

                debug( 'ChannelListTable --- eventHandler --- 8 - chanNum = ' + chanNum );

                ChannelProgress.joinChannel( chanNum );

                return false;
                break;
            default:
                return true;
                break;
        }
    },

    generateTable: function () {

        var that = this,
            i = 0,
            len = that.lines,
            content = '';

        debug( 'ChannelListTable --- generateTable --- len = ' + len );

        for ( ; i < len; i++ ) {

            content += '<tr id=' + that.prefix + i + ' style="height: 80px; color: #a0a2a4;">'
                         + '<td style="width: 85px; font-size: 30px;"></td>'
                         + '<td style="width: 245px; font-size: 30px;"></td>'
                     + '</tr>';
        }

        $ID( that.ids.table ).innerHTML = content;
    },

    // 启动自动隐藏计时器
    startTimer: function () {
        
        var that = this;

        debug( 'startTimer -------------- start' );

        clearTimeout( that.autoHideTimer ); 
        that.autoHideTimer = setTimeout( function () {

            that.hide();

        }, 10000 );
    },

    show: function () {

        var that = this;

        debug( 'ChannelListTable --- show --- isShow = ' + that.isShow );

        if ( !that.isShow ) {

            that.isShow = true;

            $ID( that.ids.list ).style.display = 'block';
        }

        that.generateTable();

        that.init();

        that.startTimer();
    },

    hide: function () {

        var that = this;

        debug( 'ChannelListTable --- hide --- isShow = ' + that.isShow );

        if ( that.isShow ) {

            that.isShow = false;

            $ID( that.ids.list ).style.display = 'none';
        }
    }
}; /////////////// 频道列表 END
