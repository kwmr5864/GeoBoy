class GeoPosition {
    private geolocation: Geolocation = null
    private watchId: number = null

    static showPosition(lat: number, lon: number) {
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
            vm.message = '今いる場所をウォッチするよ！'
            this.watchId = this.geolocation.watchPosition(this.successCallback, this.errorCallback, {
                enableHighAccuracy: true,
                timeout : 5000,
                maximumAge: 0
            })
        } else {
            this.geolocation.clearWatch(this.watchId)
            vm.message = 'ウォッチするのを止めたよ！'
        }
    }
    private successCallback(position: Position) {
        let lat = position.coords.latitude
        let lon = position.coords.longitude
        let index = appStorage.getIndex()
        appStorage.addLog(new Log(index, lat, lon))
        GeoPosition.showPosition(lat, lon)
        vm.message = '今いる場所をチェックしたよ！'
    }
    private errorCallback(error) {
        alert('お使いのアプリでは位置情報を取得できません')
    }
}