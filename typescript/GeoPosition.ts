class GeoPosition {
    private geolocation: Geolocation = null
    private options: {string?: string} = {}
    constructor() {
        if (navigator.geolocation) {
            this.geolocation = navigator.geolocation
        }
    }
    getPosition() {
        if (!this.geolocation) { return }
        this.geolocation.getCurrentPosition(this.successCallback, this.errorCallback, this.options)
    }
    private successCallback(position: Position) {
        alert(`${position.coords.latitude}, ${position.coords.longitude}`)
    }
    private errorCallback(error) {
        alert('お使いのアプリでは位置情報を取得できません')
    }
}