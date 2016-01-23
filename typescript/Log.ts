class Log {
	private createdAt: number
	public memo: string
	constructor(public index: number, public lat: number, public lon: number, public zoom: number) {
		this.createdAt = new Date().getTime()
		this.memo = ''
	}
}