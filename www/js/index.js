var Log = (function () {
    function Log(index, lat, lon) {
        this.index = index;
        this.lat = lat;
        this.lon = lon;
        this.createdAt = new Date().getTime();
    }
    return Log;
})();
/// <reference path="Log.ts" />
var AppStorage = (function () {
    function AppStorage() {
        var data = localStorage.getItem(AppStorage.STORAGE_KEY);
        this.storage = data ? JSON.parse(data) : {
            index: 1,
            logs: []
        };
    }
    AppStorage.prototype.addLog = function (log) {
        this.storage['logs'].push(log);
        this.storage['index']++;
        this.save();
    };
    AppStorage.prototype.deleteLog = function (index) {
        var logs = this.getLogs();
        for (var i in logs) {
            var log = logs[i];
            if (log.index == index) {
                logs.splice(i, 1);
                this.storage['logs'] = logs;
                this.save();
            }
        }
    };
    AppStorage.prototype.getLogs = function () {
        return this.get('logs');
    };
    AppStorage.prototype.getIndex = function () {
        return this.get('index');
    };
    AppStorage.prototype.get = function (name) {
        return this.storage[name];
    };
    AppStorage.prototype.save = function () {
        localStorage[AppStorage.STORAGE_KEY] = JSON.stringify(this.storage);
    };
    AppStorage.STORAGE_KEY = 'GeoApp';
    return AppStorage;
})();
var GeoPosition = (function () {
    function GeoPosition() {
        this.geolocation = null;
        this.watchId = null;
        if (navigator.geolocation) {
            this.geolocation = navigator.geolocation;
        }
    }
    GeoPosition.showPosition = function (lat, lon) {
        var position = new google.maps.LatLng(lat, lon);
        var map = new google.maps.Map($('#map')[0], {
            zoom: 14,
            center: position,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scaleControl: true
        });
        var marker = new google.maps.Marker({
            map: map,
            position: position
        });
    };
    GeoPosition.prototype.getPosition = function () {
        if (!this.geolocation) {
            return;
        }
        this.geolocation.getCurrentPosition(this.successCallback, this.errorCallback, {
            enableHighAccuracy: true
        });
    };
    GeoPosition.prototype.watchPosition = function (watchable) {
        if (!this.geolocation) {
            return;
        }
        if (watchable) {
            vm.message = '今いる場所をウォッチするよ！';
            this.watchId = this.geolocation.watchPosition(this.successCallback, this.errorCallback, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        }
        else {
            this.geolocation.clearWatch(this.watchId);
            vm.message = 'ウォッチするのを止めたよ！';
        }
    };
    GeoPosition.prototype.successCallback = function (position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        var index = appStorage.getIndex();
        appStorage.addLog(new Log(index, lat, lon));
        GeoPosition.showPosition(lat, lon);
        vm.message = '今いる場所をチェックしたよ！';
    };
    GeoPosition.prototype.errorCallback = function (error) {
        alert('お使いのアプリでは位置情報を取得できません');
    };
    return GeoPosition;
})();
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/// <reference path="GeoPosition.ts" />
/// <reference path="AppStorage.ts" />
var appStorage = new AppStorage();
var vm = new Vue({
    el: '#main',
    data: {
        message: 'ジオボーイで今いる場所をチェックしよう！',
        logs: appStorage.getLogs(),
        geoPosition: new GeoPosition()
    },
    methods: {
        deleteLog: function (index) {
            appStorage.deleteLog(index);
        },
        displayDate: function (datetime) {
            return moment(datetime).format('YYYY/MM/DD');
        },
        displayTime: function (datetime) {
            return moment(datetime).format('HH:mm');
        },
        redraw: function (x) {
            $('a[href="#home"]').tab('show');
            GeoPosition.showPosition(x.lat, x.lon);
            this.message = "\u30ED\u30B0No." + x.index + "\u306E\u30C1\u30A7\u30C3\u30AF\u3092\u8868\u793A\u3057\u305F\u3088\uFF01";
        }
    }
});
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var tab = e.target;
    switch (tab.hash) {
        case '#home':
            vm.message = '今いる場所をチェックできるよ！';
            break;
        case '#logs':
            vm.message = 'チェックしたログが見れるよ！';
            break;
        default:
            vm.message = 'タブ切り替えエラー';
            break;
    }
});
