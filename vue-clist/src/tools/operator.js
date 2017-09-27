/*
   Operator Relative Functions
 */

import { ss, type } from './utils';

if (!!!window.Authentication) {
    window.Authentication = {
        CUSetConfig: function (k, v) { ss(k, v); },
        CTCSetConfig: function (k, v) { ss(k, v); },
        CUGetConfig: function (k) { return ss(k); },
        CTCGetConfig: function (k) { return ss(k); }
    };
}

function CUConfig(k, v) {
    if (!k || k === '') {
        return '';
    }

    if (v) {
        if (type(v) === 'array') {
            for (let i = 0; i < v.length; i++) {
                Authentication.CUSetConfig('' + k, '' + v[i]);
            }
        } else {
            Authentication.CUSetConfig('' + k, '' + v);
        }
        return true;
    }

    return Authentication.CUGetConfig(k);
}

function CTCConfig(k, v) {
    if (!k || k === '') {
        return '';
    }

    if (v) {
        if (type(v) === 'array') {
            for (let i = 0; i < v.length; i++) {
                Authentication.CTCSetConfig('' + k, '' + v[i]);
            }
        } else {
            Authentication.CTCSetConfig('' + k, '' + v);
        }
        return true;
    }

    return Authentication.CTCGetConfig(k);
}

export default function (k, v) {
    switch(ss('province')) {
        case '云南': return CTCConfig(k, v); break;
        case '陕西': return CTCConfig(k, v); break;
        case '河南': return CUConfig(k, v); break;
        case '深圳': return CTCConfig(k, v); break;
        case '湖北': return CTCConfig(k, v); break;
        case '广西': return CTCConfig(k, v); break;
        case '山西': return CUConfig(k, v); break;
        default:
            break;
    }
}
