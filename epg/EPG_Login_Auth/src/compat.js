/*
  EPG各种兼容处理
*/

export function iPanelCompat() {
    if (!!window.iPanel) {
        iPanel.focusWidth = 0;
    }
}
