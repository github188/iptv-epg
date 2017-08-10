/*
  测试代码
*/

function type(obj) {
    return Object.prototype.toString
        .call(obj)
        .split(' ')[1]
        .replace(/]/, '')
        .toLowerCase();
}

function ss(k, v) {
    const get = (k) => sessionStorage.getItem(k);
    const set = (k, v) => sessionStorage.setItem(k, v);

    if (!k || k === '') {
        return false;
    }

    // to get
    if (k && !!!v) {
        if (type(k) === 'array') {
            // 1. 数组，返回结果数组
            let result = [];
            for (let i = 0, len = k.length; i < len; i++) {
                result.push(get(k[i]));
            }

            return result;
        } else if (type(k) === 'object') {
            // 2. 对象，设置
            for (let prop in k) {
                set(prop, k[prop]);
            }
        }
        return get('' + k);
    }

    get('' + k, '' + v);
    return true;
}

// 测试 ss
function test(name, desc, cb) {

    head(name + ', DESC: ' + desc);

    if (name === 'ss') {
        title('设置单个值');
        ss('name', 'lizc');
        debug('name: ' + ss('name'));
        title('设置对象');
        ss({
            name: 'fll',
            age: 25
        });
        debug('name: ' + ss('name'));
        debug('age: ' + ss('age'));
        title('通过数组获取');
        debug(ss(['name', 'age']));
    }
}

test('ss', 'H5 SessionStorge');

function debug(str) {
    if (type(str) === 'object' || type(str) === 'array') {
        str = JSON.stringify(str);
    }
    console.log('    ' + str);
}

function title(str) {
    console.log('    CURRENT ===============> ' + str);
}

function head(str) {
    console.log('<<<<<<< TESTING FN: ' + str);
}
