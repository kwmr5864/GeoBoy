var GeoPosition = (function () {
    function GeoPosition() {
        this.geolocation = null;
        this.options = {};
        if (navigator.geolocation) {
            this.geolocation = navigator.geolocation;
        }
    }
    GeoPosition.prototype.getPosition = function () {
        if (!this.geolocation) {
            return;
        }
        this.geolocation.getCurrentPosition(this.successCallback, this.errorCallback, this.options);
    };
    GeoPosition.prototype.successCallback = function (position) {
        alert(position.coords.latitude + ", " + position.coords.longitude);
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
    $('#btnCheck').click(function () {
        geoPosition.getPosition();
    });
});
