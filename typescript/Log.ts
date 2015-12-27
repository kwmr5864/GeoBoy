class Log {
	private createdAt: Date
	constructor(private index: number, private lat: number, private lon: number) {
		this.createdAt = new Date().getTime()
	}
}