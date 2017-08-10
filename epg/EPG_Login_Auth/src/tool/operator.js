/*
  Operator Relative Functions
*/

import { ss } from './utils';

const province = ss('province');

function CUConfig(k, v) {
    if (!k || k === '') {
        return '';
    }
    console.log('operator cu province:' + province + ', k:' + k + ', v:' + v);

    if (v) {
        Authentication.CUSetConfig('' + k, '' + v);
    }

    return Authentication.CUGetConfig(k);
}

function CTCConfig(k, v) {
    if (!k || k === '') {
        return '';
    }

    console.log('operator ctc province:' + province + ', k:' + k + ', v:' + v);

    if (v) {
        Authentication.CTCSetConfig('' + k, '' + v);
    }

    return Authentication.CTCGetConfig(k);
}

export default function (k, v) {
    switch(province) {
    case '云南': return CTCConfig(k, v); break;
    case '陕西': return CTCConfig(k, v); break;
    case '河南': return CUConfig(k, v); break;
    case '深圳': return CTCConfig(k, v); break;
    case '湖北': return CTCConfig(k, v); break;
    default:
        break;
    }
}
