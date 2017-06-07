

function GCLDebug(id) {
    
    this.no = 1;
    this.id = id || 'gcl-test-div';
    this.switch = false;
    this.created = false;
    this.style = {
        position: 'absolute',
        right: '0px',
        top: '0px',
        backgroundColor: 'gray',
        height: '100%',
        width: '200px',
        fontSize: '16px',
        textAlign: 'left',
        paddingTop: '10px'
    };
    this.split = '';
    this.div = null;
    this.tag = null;
    this.refresh = null;
    this.off = null;

    this.destory = function () {
        
        document.body.removeChild(this.refresh);
        document.body.removeChild(this.tag);
        document.body.removeChild(this.div);
        document.body.removeChild(this.off);
    }

    this.createRefresh = function () {
        
        var refresh = document.createElement('button');

        refresh.style.position = 'absolute';
        refresh.style.left = '20px';
        refresh.style.bottom = '20px';
        refresh.style.width = '80px';
        refresh.style.backgroundColor = 'green';
        refresh.style.borderRadius = '3px';
        refresh.style.textAlign = 'center';
        refresh.style.color = 'white';

        document.body.appendChild(refresh);   

        refresh.innerHTML = '<i class="fa fa-refresh" aria-hidden="true"></i> 刷新'

        this.refresh = refresh;
        
        this.refresh.onclick = function (e) {
            window.document.location.href = window.document.location.href;

            console.log(e.target);
            // if (e.target)
        };

        return this;
    };

    this.createTag = function () {
        
        var tag = document.createElement('span');
        tag.className = 'test-tag';

        tag.style.position = 'absolute';
        tag.style.right = '10px';
        tag.style.bottom = '20px';
        tag.style.backgroundColor = 'red';
        tag.style.color = 'white';
        tag.style.fontSize = '12px';
        tag.style.borderRadius = '5px';
        tag.style.padding = '5px';
        tag.style.zIndex = 50;

        document.body.appendChild(tag);

        tag.innerHTML = 'Attention Please!(Testing...)';

        this.tag = tag;

        return this;
    };

    this.createOff = function () {
        var off = document.createElement('button');

        off.style.position = 'absolute';
        off.style.left = '120px';
        off.style.bottom = '20px';
        off.style.width = '80px';
        off.style.backgroundColor = 'red';
        off.style.borderRadius = '3px';
        off.style.textAlign = 'center';
        off.style.color = 'white';

        document.body.appendChild(off);   

        off.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i> DEBUG OFF'

        this.off = off;
        var _this = this;
        this.off.onclick = function (e) {
            _this.destory();
        };

        return this;
    }

    this.setSplit = function (split) {
        this.split = split;
    };

    this.create = function () {
        var info = document.createElement('div');

        info.id = this.id;

        for (var prop in this.style) {
            info.style[prop] = this.style[prop];
        }
        
        document.body.appendChild(info);

        this.div = info;

        this.created = true;

        this.createTag();
        this.createRefresh();
        this.createOff();

        return this;
    };

    this._print = function (str) {

        this.div.innerHTML += '<input class="test-content" type="text" value="[' + (this.split ? this.split : this.no++) + ']' + str + '" />' 
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
        this.no++;

        this._print(key + ': ' + value); 

        return this;  
    };

    this.open = this.start = this.on = function () {
        
        if (!this.created) {
            this.create();
        }

        this.switch = true;
    };

    this.close = this.off = function () {

        this.switch = false;
        this.div.innerHTML = '';
        // document.body.removeChild(this.div);
    }
}
