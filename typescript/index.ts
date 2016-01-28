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

var appStorage = new AppStorage()

var vmAddMemoModal = new Vue({
    el: '#addMemoModal',
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

var vmEditMemoModal = new Vue({
    el: '#editMemoModal',
    data: {
        targetIndex: 0,
        memo: '',
        zoom: '11'
    },
    methods: {
        updateMemo: function() {
            appStorage.updateLog(this.targetIndex, {
                memo: this.memo,
                zoom: +this.zoom
            })
        }
    }
})

var vmSettings = new Vue({
    el: '#settings',
    data: {
        zoom: appStorage.getDefaultZoom(),
    },
    methods: {
        settingZoom: function() {
            appStorage.updateDefaults({
                zoom: +this.zoom
            })
        }
    }
})

var vmTags = new Vue({
    el: '#tags',
    data: {
        index: appStorage.getTagIndex(),
        tag: '',
        tags: appStorage.getTags()
    },
    methods: {
        addTag: function() {
            this.tags.unshift({
                id: this.index,
                name: this.tag
            })
            this.index++
            appStorage.saveTags(this.tags, this.index)
        },
        deleteTag: function(id: number) {
            for (var i in this.tags) {
                var tag = this.tags[i]
                if (tag['id'] == id) {
                    this.tags.splice(i, 1)
                    appStorage.saveTags(this.tags, this.index)
                    break
                }
            }
        }
    }
})

var vm = new Vue({
    el: '#main',
    data: {
        message: 'ジオボーイで今いる場所をチェックしよう！',
        logs: appStorage.getLogs(),
        geoPosition: new GeoPosition(),
        defaultZoom: appStorage.getDefaultZoom()
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
        displayZoom: function(zoom: any) {
            return zoom ? `[ズーム: ${zoom}]` : ''
        },
        redraw: function(x: Log) {
            var homeTab: any = $('a[href="#home"]')
            homeTab.tab('show')
            GeoPosition.showPosition(x)
            let message = x.memo ? x.memo : `チェックNo.${x.index}`
            this.displayMessage(`${message}を表示したよ！ <small>${this.displayZoom(x.zoom)}</small> `)
        },
        openEditForm: function(x: Log) {
            vmEditMemoModal.targetIndex = x.index
            vmEditMemoModal.memo = x.memo
            vmEditMemoModal.zoom = x.zoom
            var targetModal: any = $('#editMemoModal')
            targetModal.modal()
        }
    }
})