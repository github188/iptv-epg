/*
  开机初始化

  1. 常量声明定义
  2. 进入EPG前的基础配置
  3. 进入Portal前的配置处理
  4. 等等
*/

import { type } from 'tools/utils';
// import fateInit from 'config/fate';

export default function (global) {
    /*
      全局常量: 小于该值才会被打印
      1: console output
      2: required output
      3. important output
      4. optioanal output
      5. div output
      6. other output
      7. remain
      8. remian

      生产环境至少要 >= 1
    */
    global.EPG_LOG_LEVEL = 4;

    (() => {
        let level = sessionStorage.getItem('EPG_LOG_LEVEL');
        level = parseInt(level, 10);
        if (type(level) === 'number') {
            level = level > 7 ? 7: level;
            global.EPG_LOG_LEVEL = level;
        }
    })(); // EPG_LOG_LEVEL end.

    // fateInit();
}

