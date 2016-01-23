class GeoPosition {
    private geolocation: Geolocation = null
    private watchId: number = null

    static showPosition(log: Log) {
        var position = new google.maps.LatLng(log.lat, log.lon)
        var map = new google.maps.Map($('#map')[0], {
            zoom: log.zoom ? log.zoom : appStorage.getDefaultZoom(),
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
        vm.displayMessage('チェック中・・・')
        this.geolocation.getCurrentPosition(this.successCallback, this.errorCallback, {
            enableHighAccuracy: true
        })
    }
    watchPosition(watchable: boolean) {
        if (!this.geolocation) { return }
        if (watchable) {
            vm.displayMessage('今いる場所をウォッチするよ！')
            this.watchId = this.geolocation.watchPosition(this.successCallback, this.errorCallback, {
                enableHighAccuracy: true,
                timeout : 5000,
                maximumAge: 0
            })
        } else {
            this.geolocation.clearWatch(this.watchId)
            vm.displayMessage('ウォッチするのを止めたよ！')
        }
    }
    private successCallback(position: Position) {
        let lat = position.coords.latitude
        let lon = position.coords.longitude
        let index = appStorage.getIndex()
        let zoom = appStorage.getDefaultZoom()
        let log = new Log(index, lat, lon, zoom)
        appStorage.addLog(log)
        GeoPosition.showPosition(log)
        vm.displayMessage('今いる場所をチェックしたよ！')
        vmAddMemoModal.targetIndex = index
        var targetModal: any = $('#addMemoModal')
        targetModal.modal()
    }
    private errorCallback(error) {
        alert('お使いのアプリでは位置情報を取得できません')
    }
}