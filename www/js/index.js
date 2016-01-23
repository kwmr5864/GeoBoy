var Log = (function () {
    function Log(index, lat, lon, zoom) {
        this.index = index;
        this.lat = lat;
        this.lon = lon;
        this.zoom = zoom;
        this.createdAt = new Date().getTime();
        this.memo = '';
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
                break;
            }
        }
    };
    AppStorage.prototype.updateLog = function (index, data) {
        var logs = this.getLogs();
        for (var i in logs) {
            var log = logs[i];
            if (log.index == index) {
                for (var k in data) {
                    log[k] = data[k];
                }
                logs[i] = log;
                logs.push();
                this.storage['logs'] = logs;
                this.save();
                break;
            }
        }
    };
    AppStorage.prototype.updateDefaults = function (data) {
        var defaults = {};
        for (var k in data) {
            defaults[k] = data[k];
        }
        this.storage['defaults'] = defaults;
        this.save();
    };
    AppStorage.prototype.getLogs = function () {
        return this.get('logs');
    };
    AppStorage.prototype.getIndex = function () {
        return this.get('index');
    };
    AppStorage.prototype.getDefaultZoom = function () {
        var defaults = this.getDefaults();
        var zoom = defaults['zoom'];
        return zoom ? zoom : 14;
    };
    AppStorage.prototype.getDefaults = function () {
        var defaults = this.get('defaults');
        return defaults ? defaults : {};
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
    GeoPosition.showPosition = function (log) {
        var position = new google.maps.LatLng(log.lat, log.lon);
        var map = new google.maps.Map($('#map')[0], {
            zoom: log.zoom ? log.zoom : appStorage.getDefaultZoom(),
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
        vm.displayMessage('チェック中・・・');
        this.geolocation.getCurrentPosition(this.successCallback, this.errorCallback, {
            enableHighAccuracy: true
        });
    };
    GeoPosition.prototype.watchPosition = function (watchable) {
        if (!this.geolocation) {
            return;
        }
        if (watchable) {
            vm.displayMessage('今いる場所をウォッチするよ！');
            this.watchId = this.geolocation.watchPosition(this.successCallback, this.errorCallback, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        }
        else {
            this.geolocation.clearWatch(this.watchId);
            vm.displayMessage('ウォッチするのを止めたよ！');
        }
    };
    GeoPosition.prototype.successCallback = function (position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        var index = appStorage.getIndex();
        var zoom = appStorage.getDefaultZoom();
        var log = new Log(index, lat, lon, zoom);
        appStorage.addLog(log);
        GeoPosition.showPosition(log);
        vm.displayMessage('今いる場所をチェックしたよ！');
        vmAddMemoModal.targetIndex = index;
        var targetModal = $('#addMemoModal');
        targetModal.modal();
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
/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="GeoPosition.ts" />
/// <reference path="AppStorage.ts" />
var appStorage = new AppStorage();
var vmAddMemoModal = new Vue({
    el: '#addMemoModal',
    data: {
        targetIndex: 0,
        memo: ''
    },
    methods: {
        addMemo: function () {
            appStorage.updateLog(this.targetIndex, { memo: this.memo });
        }
    }
});
var vmEditMemoModal = new Vue({
    el: '#editMemoModal',
    data: {
        targetIndex: 0,
        memo: '',
        zoom: '11'
    },
    methods: {
        updateMemo: function () {
            appStorage.updateLog(this.targetIndex, {
                memo: this.memo,
                zoom: +this.zoom
            });
        }
    }
});
var vmSettings = new Vue({
    el: '#settings',
    data: {
        zoom: appStorage.getDefaultZoom()
    },
    methods: {
        settingZoom: function () {
            appStorage.updateDefaults({
                zoom: +this.zoom
            });
        }
    }
});
var vm = new Vue({
    el: '#main',
    data: {
        message: 'ジオボーイで今いる場所をチェックしよう！',
        logs: appStorage.getLogs(),
        geoPosition: new GeoPosition()
    },
    methods: {
        displayMessage: function (message) {
            this.message = message + "<small>(" + this.displayTime(new Date().getTime(), true) + ")</small>";
        },
        deleteLog: function (index) {
            appStorage.deleteLog(index);
        },
        displayDate: function (datetime) {
            return moment(datetime).format('YYYY/MM/DD');
        },
        displayTime: function (datetime, withSeconds) {
            if (withSeconds === void 0) { withSeconds = false; }
            var format = withSeconds ? 'HH:mm:ss' : 'HH:mm';
            return moment(datetime).format(format);
        },
        redraw: function (x) {
            var homeTab = $('a[href="#home"]');
            homeTab.tab('show');
            GeoPosition.showPosition(x);
            if (x.memo) {
                this.displayMessage(x.memo + "\u3092\u8868\u793A\u3057\u305F\u3088\uFF01");
            }
            else {
                this.displayMessage("\u30C1\u30A7\u30C3\u30AFNo." + x.index + "\u3092\u8868\u793A\u3057\u305F\u3088\uFF01");
            }
        },
        openEditForm: function (x) {
            vmEditMemoModal.targetIndex = x.index;
            vmEditMemoModal.memo = x.memo;
            vmEditMemoModal.zoom = x.zoom;
            var targetModal = $('#editMemoModal');
            targetModal.modal();
        }
    }
});
