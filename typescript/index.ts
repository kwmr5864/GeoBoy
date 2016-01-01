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
        displayMessage: function(message: string) {
            this.message = `${message}<small>(${this.displayTime(new Date().getTime(), true)})</small>`
        },
        deleteLog: function(index) {
            appStorage.deleteLog(index)
        },
        displayDate: function(datetime: number): string {
            return moment(datetime).format('YYYY/MM/DD')
        },
        displayTime: function(datetime: number, withSeconds: boolean = false): string {
            let format = withSeconds ? 'HH:mm:ss' : 'HH:mm'
            return moment(datetime).format(format)
        },
        redraw: function(x: Log) {
            $('a[href="#home"]').tab('show')
            GeoPosition.showPosition(x.lat, x.lon)
            this.displayMessage(`ログNo.${x.index}のチェックを表示したよ！`)
        }
    }
})

var modal = new Vue({
    el: '#modal',
    data: {
        targetIndex: 0,
        memo: ''
    },
    methods: {
        addMemo: function() {
            appStorage.updateLog(this.targetIndex, {memo: this.memo})
        }
    }
})