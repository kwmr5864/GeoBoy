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
        memo: '',
        tags: appStorage.getTags(),
        checkedTags: [],
    },
    methods: {
        add: function() {
            appStorage.updateLog(this.targetIndex, {
                memo: this.memo,
                tags: this.checkedTags,
            })
        }
    }
})

var vmEditMemoModal = new Vue({
    el: '#editMemoModal',
    data: {
        targetIndex: 0,
        memo: '',
        zoom: '11',
        tags: appStorage.getTags(),
        checkedTags: [],
    },
    methods: {
        update: function() {
            appStorage.updateLog(this.targetIndex, {
                memo: this.memo,
                zoom: +this.zoom,
                tags: this.checkedTags,
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

var vmHome = new Vue({
    el: '#home',
    data: {
        geoPosition: new GeoPosition(),
    },
    methods: {
        check: function() {
            this.geoPosition.getPosition()
        },
        watch: function() {
            this.geoPosition.watchPosition(true)
        },
        stop: function() {
            this.geoPosition.watchPosition(false)
        }
    }
})

var vm = new Vue({
    el: '#main',
    data: {
        message: 'ジオボーイで今いる場所をチェックしよう！',
        logs: appStorage.getLogs(),
        searchTags: appStorage.getTags(),
        checkedSearchTags: [],
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
        searchLogs: function() {
            let allLogs = appStorage.getLogs()
            var logs = []
            var message = ''
            if (0 < this.checkedSearchTags.length) {
                for (let logIndex in allLogs) {
                    let log = allLogs[logIndex]
                    let tags = log.tags
                    if (tags != null && 0 < tags.length) {
                        var pushable: boolean = true
                        for (let i in this.checkedSearchTags) {
                            let checkedSearchTag = this.checkedSearchTags[i]
                            if ($.inArray(checkedSearchTag, tags) < 0) {
                                pushable = false
                                break
                            }
                        }
                        if (pushable) {
                            logs.push(log)
                        }
                    }
                }
                var checkedTagNames = []
                for (let i in this.searchTags) {
                    let tag = this.searchTags[i]
                    if (-1 < $.inArray(String(tag.id), this.checkedSearchTags)) {
                        checkedTagNames.push(tag.name)
                    }
                    if (checkedTagNames.length == this.checkedSearchTags.length) {
                        break
                    }
                }
                if (0 < logs.length) {
                    message = `${checkedTagNames.join(',')}のタグがついてるログが見れるよ！`
                } else {
                    message = `${checkedTagNames.join(',')}のタグがついてるログはまだないよ！`
                }
            } else {
                logs = allLogs
                message = '全部のログが見れるよ！'
            }
            this.logs = logs
            this.displayMessage(`${message} <small>[${logs.length}件]</small> `)
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
            vmEditMemoModal.checkedTags = x.tags ? x.tags : []
            var targetModal: any = $('#editMemoModal')
            targetModal.modal()
        }
    }
})

vm.$watch('checkedSearchTags', function() {
    vm.searchLogs()
})