/// <reference path="Log.ts" />

class AppStorage {
	private static STORAGE_KEY = 'GeoApp'
	private storage: {[key: string]: any}
	constructor() {
		var data: string = localStorage.getItem(AppStorage.STORAGE_KEY)
		this.storage = data ? JSON.parse(data) : {
			index: 1,
			logs: [],
		}
		if (this.storage['tagIndex'] == null || this.storage['tags'] == null) {
			this.storage['tagIndex'] = 1
			this.storage['tags'] = []
		}
	}
	addLog(log: Log) {
		this.storage['logs'].push(log)
		this.storage['index']++
		this.save()
	}
	deleteLog(index: number) {
	    var logs = this.getLogs()
	    for(var i in logs) {
	        var log = logs[i]
	        if(log.index == index) {
	            logs.splice(i, 1)
	            this.storage['logs'] = logs
	            this.save()
	            break
	        }
	    }
	}
	updateLog(index: number, data: {[key: string]: any}) {
	    var logs = this.getLogs()
	    for(var i in logs) {
	        var log = logs[i]
	        if(log.index == index) {
	            for (var k in data) {
	                log[k] = data[k]
	            }
	            logs[i] = log
	            logs.push()
	            this.storage['logs'] = logs
	            this.save()
	            break
	        }
	    }
	}
	updateDefaults(data: {[key: string]: any}) {
	    var defaults = {}
	    for (var k in data) {
	        defaults[k] = data[k]
	    }
	    this.storage['defaults'] = defaults
	    this.save()
	}
    saveTags(tags: [{[key: string]: any}], index: number) {
		this.storage['tags'] = tags
		this.storage['tagIndex'] = index
		this.save()
	}
	getLogs(): [Log] {
		return this.get('logs')
	}
	getIndex(): number {
	    return this.get('index')
	}
	getTags(): [{[key: string]: any}] {
	    return this.get('tags')
	}
	getTagIndex(): number {
	    return this.get('tagIndex')
	}
	getDefaultZoom(): number {
	    var defaults = this.getDefaults()
	    var zoom = defaults['zoom']
	    return zoom ? zoom : 14
	}
	private getDefaults(): {[key: string]: any} {
	    var defaults = this.get('defaults')
	    return defaults ? defaults : {}
	}
	private get(name: string): any {
	    return this.storage[name]
	}
	private save() {
		localStorage[AppStorage.STORAGE_KEY] = JSON.stringify(this.storage)
	}
}