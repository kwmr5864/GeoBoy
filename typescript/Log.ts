class Log {
	private createdAt: Date
	constructor(private lat: number, private lon: number) {
		this.createdAt = new Date()
	}
}