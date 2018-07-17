import React, {Component} from "react"
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'

import {AmapInit} from './amapInit'

class AmapDemo extends Component {
    state = {
        lat: 120.11,
        lng: 31.11,
        cityCode: '021',
        firstDrag: true,
    };


    componentDidMount() {
        const that = this;

        AmapInit({
            id: 'map-container',
            mapParams: {
                scrollWheel: false,
                center: [that.state.lng, that.state.lat],
                zoom: 17
            },
            callback: function (map) {
                AMap.plugin('AMap.Geocoder', function () {
                    let geocoder = new AMap.Geocoder({
                        city: that.state.cityCode
                    });

                    let inputAddress = document.getElementById('inputAddress');

                    //输入地址获取经纬度重置map的center--此时会触发拖拽事件
                    inputAddress.onchange = function () {
                        let address = inputAddress.value;
                        if (address) {
                            geocoder.getLocation(address, function (status, result) {
                                let position = result.geocodes[0].location;
                                map.setCenter([position.lng, position.lat]);
                            })
                        }
                    };

                    AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {
                        let positionPicker = new PositionPicker({
                            mode: 'dragMap',
                            map: map,
                        });
                        positionPicker.on('success', function (positionResult) {
                            that.setState({cityCode: positionResult.regeocode.addressComponent.citycode});
                            geocoder.getLocation(that.state.address, function (status, result) {
                                that.setState({systemStatus: false});
                                let position = result.geocodes[0].location;
                                map.setCenter([position.lng, position.lat]);
                            });
                            // 过滤掉初始化地图后的第一次拖拽
                            if (!that.state.dragStatus) {
                                that.setState({dragStatus: true});
                            } else {
                                if (that.state.firstDrag && positionResult.info === 'OK') {
                                    console.log(positionResult)
                                    //此处可以根据返回的结果通过ajax获取服务端数据 或者设置数据
                                }
                                that.setState({firstDrag: true});
                            }
                        });
                        positionPicker.on('fail', function () {
                            Toast.info('位置信息获取失败', 1.2)
                        });

                        positionPicker.start();
                        map.panBy(0, 1);
                    });
                });
            }
        })
    }


    render() {

        return ReactDOM.createPortal(
           <div className="amap-box">
               <div className="address-map" id="map-container">这里是个容器元素</div>
               <input type="text" id="inputAddress" placeholder="通过输入框输入的文字获取经纬度和商圈信息"/>
           </div>,
           document.getElementsByTagName("body")[0]
        )
    }
}

export default connect(null, {})(AmapDemo)
