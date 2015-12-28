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

var appStorage = new AppStorage()

var vm = new Vue({
    el: '#main',
    data: {
        message: 'ジオボーイで今いる場所をチェックしよう！',
        logs: appStorage.getLogs(),
        geoPosition: new GeoPosition()
    },
    methods: {
        deleteLog: function(index) {
            appStorage.deleteLog(index)
        },
        displayDate: function(datetime: number): string {
            return moment(datetime).format('YYYY/MM/DD')
        },
        displayTime: function(datetime: number): string {
            return moment(datetime).format('HH:mm')
        },
        redraw: function(x: Log) {
            $('a[href="#home"]').tab('show')
            GeoPosition.showPosition(x.lat, x.lon)
            this.message = `ログNo.${x.index}のチェックを表示したよ！`
        }
    }
})

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var tab = e.target
    switch(tab.hash) {
    case '#home':
        vm.message = '今いる場所をチェックできるよ！'
        break
    case '#logs':
        vm.message = 'チェックしたログが見れるよ！'
        break
    default:
        vm.message = 'タブ切り替えエラー'
        break
    }
})