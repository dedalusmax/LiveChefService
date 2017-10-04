var CookingViewerViewModel = function (data) {
    var self = data;

    self.stream = null;
    self.connection = null;

    // chat implementation
    $(document).ready(function () {

        // peer connection is going to handle negotiating a network connection with another client, 
        // and keep an open session allowing the two to communicate directly
        self.connection = new RTCPeerConnection(null);
        console.log('Created new peer connection.');

        self.connection.onicecandidate = function (event) {
            if (event.candidate) {

                // each time the client finds a new candidate, it will send it over to the remote peer
                var candidate = JSON.stringify(event.candidate);
                root.hub.server.setIceCandidate(self.id, candidate).done(function () {
                    console.log("ICE candidate send to the server: " + candidate);
                });
            }
        };

        // new remote media stream is added
        self.connection.onaddstream = function (event) {

            console.log('Remote media stream retrieved added.');
            var video = document.querySelector('video');
            self.stream = event.stream;
            video.srcObject = event.stream;
        }

        // remote media stream is added
        self.connection.onremovestream = function (event) {

            console.log('Remote media stream retrieved removed.');
        }
    });
}