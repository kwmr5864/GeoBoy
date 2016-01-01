/// <reference path="Log.ts" />

class AppStorage {
	private static STORAGE_KEY = 'GeoApp'
	private storage: {[key: string]: any}
	constructor() {
		var data: string = localStorage.getItem(AppStorage.STORAGE_KEY)
		this.storage = data ? JSON.parse(data) : {
			index: 1,
			logs: []
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
	            this.storage['logs'] = logs
	            this.save()
	            break
	        }
	    }
	}
	getLogs(): [Log] {
		return this.get('logs')
	}
	getIndex(): number {
	    return this.get('index')
	}
	private get(name: string): string {
	    return this.storage[name]
	}
	private save() {
		localStorage[AppStorage.STORAGE_KEY] = JSON.stringify(this.storage)
	}
}