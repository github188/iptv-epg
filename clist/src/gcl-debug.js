
var GCL_DEBUG_ON = true;


function GCLDebug(config) {
    
    this.config = config || {
        id: 'gcl-test-div',
    };

    this.no = 1;
    this.id = this.config.id;
    this.switch = false;
    this.created = false;
    this.style = {
        position: 'absolute',
        right: '0px',
        top: '0px',
        backgroundColor: 'gray',
        height: '100%',
        width: '20%',
        fontSize: '16px',
        textAlign: 'left',
        // paddingTop: '2%',
        overflow: 'scroll'
    };
    this.split = '';
    this.div = null;
    this.tag = null;
    this.btnList = null;
    this.root = document.body;

    this.destory = function () {

        this.root.removeChild(this.tag);
        this.root.removeChild(this.div);
        this.root.removeChild(this.btnList);

        GCL_DEBUG_ON = false;
    }

    this.createBtnList = function () {

        var _this = this;

        var list = document.createElement('ul');

        list.style.position = 'absolute';
        list.style.right = '20%';
        list.style.bottom = '3%';
        list.style.padding = '0 8px';

        // 按钮列表
        var refresh = this.createBtnItem({
            text: '刷新',
            bgColor: 'green',
            icon: '<i class="fa fa-refresh" aria-hidden="true"></i>',
            handler: function (e) {
                window.document.location.href = window.document.location.href;
            }
        });

        var debugOff = this.createBtnItem({
            text: '关闭',
            bgColor: 'red',
            icon: '<i class="fa fa-times" aria-hidden="true"></i>',
            handler: function (e) {
                _this.destory();    
            }
        });

        var clear = this.createBtnItem({
            text: '清空',
            bgColor: '#3067FD',
            icon: '<i class="fa fa-eraser" aria-hidden="true"></i>',
            handler: function (e) {
                _this.div.innerHTML = '';    
            }
        });

        var hd = this.createBtnItem({
            text: '高清/标清',
            bgColor: '#FEF070',
            icon: '<i class="fa fa-eraser" aria-hidden="true"></i>',
            handler: function (e) {
                _this.switchDefinition();   
            }
        });

        list.appendChild(refresh);
        list.appendChild(debugOff);
        list.appendChild(clear);

        this.btnList = list;
        this.root.appendChild(list);   

    };

    this.createBtnItem = function (config) {
        var that = this;

        var item = document.createElement('li');

        // item.style.float = 'left';
        item.style.marginTop = '8px';
        item.style.listStyle = 'none';
        item.style.width = '80px';
        item.style.height = '30px';

        // 按钮
        var btn = document.createElement('button');
        btn.style.backgroundColor = config.bgColor;
        btn.style.width = '100%';
        btn.style.height = '100%';
        // btn.style.padding = '4px';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.innerHTML = config.icon + ' ' + config.text; 
        btn.onclick = config.handler;
        item.appendChild(btn);

        return item;
    };

    this.createTag = function () {
        var tag = document.createElement('span');
        tag.className = 'test-tag';

        tag.style.position = 'absolute';
        tag.style.left = '10%';
        tag.style.bottom = '2%';
        tag.style.backgroundColor = 'red';
        tag.style.color = 'white';
        tag.style.fontSize = '12px';
        tag.style.borderRadius = '5px';
        tag.style.padding = '5px';
        tag.style.zIndex = 50;
        tag.innerHTML = 'Attention Please!(Testing...)';

        this.tag = tag;
        return tag;
    };

    this.setSplit = function (split) {
        this.split = split;
    };

    this.create = function () {
        var info = document.createElement('div');

        info.id = this.id;

        for (var prop in this.style) {
            info.style[prop] = this.style[prop];
        }

        var tag = this.createTag();
        info.appendChild(tag);
        
        document.body.appendChild(info);

        this.div = info;
        this.created = true;
        this.createBtnList();

        return this;
    };

    this._print = function (str) {

        if (!GCL_DEBUG_ON) { return; }

        this.div.innerHTML += '<input class="test-content" type="text" value="[' 
            + (this.split ? this.split : this.no++) + ']' + str + '"'
            + 'style="width:100%"'
            + '/>' 
            + '<br>';
    };

    this.print = function (obj, desc, isValue) {
        
        if (!this.switch) { return false; }

        var content = '';
        var tmp = null;

        if (Array.isArray(obj)) {
            for (var i = 0; i < obj.length; i++) {
                tmp = obj[i];

                if (tmp.isValue) {
                    content = tmp.desc + ': ' + tmp.key;
                } else {
                    content = tmp.key ? tmp.desc + ': true' : tmp.desc + ': false';
                }

                this._print(content);
            }
        } else {
            this._print(
                isValue
                    ? desc + ':' + JSON.stringify(obj)
                    : obj 
                        ? desc + ': true' 
                        : desc + ': false'
            );
        }
    };

    this.append = function (key, value) {
        // this.no++;

        this._print(key + (value ? ': ' + value : ''));

        return this;  
    };

    this.open = this.start = this.on = function () {
        
        if (!this.created) {
            this.create();
        }

        GCL_DEBUG_ON = true;
        this.switch = true;
    };

    this.close = this.off = function () {

        this.switch = false;
        this.div.innerHTML = '';
        // document.body.removeChild(this.div);
    }
}
