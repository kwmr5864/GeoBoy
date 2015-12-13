var GeoPosition = (function () {
    function GeoPosition() {
        this.geolocation = null;
        this.watchId = null;
        if (navigator.geolocation) {
            this.geolocation = navigator.geolocation;
        }
    }
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
            this.watchId = this.geolocation.watchPosition(this.successCallback, this.errorCallback, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        }
        else {
            this.geolocation.clearWatch(this.watchId);
        }
    };
    GeoPosition.prototype.successCallback = function (position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        $('#txtLat').val(lat);
        $('#txtLon').val(lon);
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
var geoPosition = new GeoPosition();
$(function () {
    $('#btnGetPosition').click(function () {
        geoPosition.getPosition();
    });
    $('#btnWatchPositionOn').click(function () {
        geoPosition.watchPosition(true);
    });
    $('#btnWatchPositionOff').click(function () {
        geoPosition.watchPosition(false);
    });
});
