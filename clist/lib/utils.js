
// 将对象以 'key=value, key1=value' 格式拼接起来
function joinObj(obj) {
    var str = [];

    for (var prop in obj) {
        str.push(prop + '="' + obj[prop] + '"');
    }

    return str.join(',');
}

/* ----------------------- END 直播频道相关 ----------------------- */

/**
 * 淡入淡出动画
 * @param  {DOMElement} 需要执行动画的元素
 * @param  {[type]} inout   取值为 'in'：淡入，'out'：淡出
 * @param  {[type]} refV    参考值，用来递增递减，最后值会赋值给元素的 opacity
 * @param  {[type]} opacity 元素的初始透明度
 * @return {[type]}
 */
function fadeFn(el, inout, refV, opacity) {

    var value = refV;

    if (inout === 'in') {
        el.style.display = 'block';
    }

    el.style.opacity = opacity;

    return function (start, end, stepV) {
        var startV = start || 0;
        var endV = end || 100;
        var step = stepV || 1;
        var condition = inout === 'in' ? value >= endV : value <= startV;
        var args = arguments;
        console.log(condition)
        if (condition) {
            el.style.opacity = value / 100;
            if (inout === 'out') {
                el.style.display = 'none';
            }
            clearTimeout(timer);
            return;
        }

        value = inout === 'in' ? value + step : value - step;

        el.style.opacity = value / 100;

            console.log(el.style.opacity);

        clearTimeout(timer);
        timer = setTimeout(function () {
            fade(el, inout, startV, endV, step);
        }, 10); 
    };
};

