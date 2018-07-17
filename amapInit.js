
//加载高德地图
export function AmapInit(options) {

    // 第二步：初始化map，并加载AMapUI组件库
    window.init = function () {
        let map = new AMap.Map(options.id, options.mapParams);

        let uiUrl = 'https://webapi.amap.com/ui/1.0/main.js';
        handleCreateFnRunCallback(uiUrl, 'initAmapUi');

        // 检测资源是否加载完成
        checkSourceIsLoadSuccess(window.AMapUI);

        function checkSourceIsLoadSuccess(source) {
            setTimeout(function () {
                if (!source) {
                    checkSourceIsLoadSuccess(window.AMapUI)
                } else {

                    // 第三部：AMap、AMapUI加载完毕
                    // AMap、AMapUI加载完毕, 开始执行UI组件
                    options && typeof options.callback === 'function' && options.callback(map);
                }
            }, 100);
        }
    };

    // 第一步：加载map资源
    let url = 'https://webapi.amap.com/maps?v=1.4.6&key=`你自己在高德申请的key`&callback=init';
    handleCreateFnRunCallback(url, 'initAmap', options);
}

// 动态创建script并添加到body中
function handleCreateFnRunCallback(url, id, options){
    if ($('#' + id).length > 0) {
        let map = new AMap.Map(options.id, options.mapParams);
        options && typeof options.callback === 'function' && options.callback(map);
        return false;
    }
    const jsApi = document.createElement('script');
    jsApi.charset = 'utf-8';
    jsApi.src = url;
    jsApi.id = id;
    document.head.appendChild(jsApi);
}