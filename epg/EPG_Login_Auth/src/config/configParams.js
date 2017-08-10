/*
  各地的配置
*/

import { ss } from '../tool/utils';
import { config as configYunnanParams } from './yunnan';
import { config as configHubeiParams } from './hubei';
import { config as configShanxiParams } from './shanxi';
import { config as configHenanParams } from './henan';
import { config as configShenzhenParams } from './shenzhen';

const province = ss('province');

export function configParams() {
    if (!province) {
        return false;
    }
    switch (province) {
    case '云南':
        configYunnanParams();
        break;
    case '湖北':
        configHubeiParams();
        break;
    case '陕西':
        configShanxiParams();
        break;
    case '河南':
        configHenanParams();
        break;
    case '深圳':
        configShenzhenParams();
        break;
    default: break;
    }
};

