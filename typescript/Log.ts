class Log {
	private createdAt: number
	constructor(public index: number, public lat: number, public lon: number) {
		this.createdAt = new Date().getTime()
	}
}