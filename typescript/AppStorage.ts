/// <reference path="Log.ts" />

class AppStorage {
	private static STORAGE_KEY = 'GeoApp'
	private storage: {[key: string]: any}
	constructor() {
		var data: string = localStorage.getItem(AppStorage.STORAGE_KEY)
		this.storage = data ? JSON.parse(data) : {
			index: 0,
			logs: []
		}
	}
	addLog(log: Log) {
		this.storage['logs'].push(log)
		this.storage['index']++
		this.save()
		this.refresh()
	}
	getLogs(): [Log] {
		return this.storage['logs']
	}
	private save() {
		localStorage[AppStorage.STORAGE_KEY] = JSON.stringify(this.storage)
	}
	private refresh() {
        var targetElement = document.getElementById('controller')
		var targetScope = angular.element(targetElement).scope()
        targetScope.$apply()
	}
}