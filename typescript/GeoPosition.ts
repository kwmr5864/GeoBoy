class GeoPosition {
    private geolocation: Geolocation = null
    private watchId: number = null
    constructor() {
        if (navigator.geolocation) {
            this.geolocation = navigator.geolocation
        }
    }
    getPosition() {
        if (!this.geolocation) { return }
        this.geolocation.getCurrentPosition(this.successCallback, this.errorCallback, {
            enableHighAccuracy: true
        })
    }
    watchPosition(watchable: boolean) {
        if (!this.geolocation) { return }
        if (watchable) {
            this.watchId = this.geolocation.watchPosition(this.successCallback, this.errorCallback, {
                enableHighAccuracy: true,
                timeout : 5000,
                maximumAge: 0
            })
        } else {
            this.geolocation.clearWatch(this.watchId)
        }
    }
    private successCallback(position: Position) {
        let lat = position.coords.latitude
        let lon = position.coords.longitude
        appStorage.addLog(new Log(lat, lon))
        var position = new google.maps.LatLng(lat, lon)
        var map = new google.maps.Map($('#map')[0], {
            zoom: 14,
            center: position,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scaleControl: true
        })
        var marker = new google.maps.Marker({
            map: map,
            position: position
        })
    }
    private errorCallback(error) {
        alert('お使いのアプリでは位置情報を取得できません')
    }
}