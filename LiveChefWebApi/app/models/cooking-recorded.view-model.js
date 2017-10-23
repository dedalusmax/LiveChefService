var CookingRecordedViewModel = function (data) {
    var self = data;
    self.storedSnapshots = ko.observableArray();
    self.storedChatHistory = ko.observableArray();

    self.recordedBlobs = [];

    $(document).ready(function () {

        self.video = document.querySelector('#archivedVideo');

        var snapshots = self.snapshots;

        snapshots.forEach(function (snapshot) {

            var s = {
                id: snapshot.id,
                snapshotId: 'snapshot' + snapshot.id,
                timeTaken: snapshot.timeTaken,
                timeTakenText: moment(snapshot.timeTaken).format('HH:mm:ss'),
                width: self.video.clientWidth / 2, // 50% video width
                height: self.video.clientHeight / 2, // 50% video height,
                description: snapshot.description,
                editMode: false
            };

            self.storedSnapshots.push(s);

            var image = new Image();
            image.onload = function () {
                var canvas = document.querySelector('#' + s.snapshotId);
                var ctx = canvas.getContext("2d");
                ctx.drawImage(this, 0, 0, s.width, s.height);
            };
            image.src = 'data:image/png;base64,' + snapshot.image;
        });

        var c = self.chatHistory;
        c.forEach(function (chatMessage) {

            var c = new ChatViewModel(chatMessage.sender, chatMessage.text, chatMessage.time);

            self.storedChatHistory.push(c);
          
        });

        self.getVideo();
    });
}

CookingRecordedViewModel.prototype.cookingMediaTransferStarted = function (cookingId) {
    var self = this;

    self.recordedBlobs = [];
}

CookingRecordedViewModel.prototype.cookingMediaTransferSend = function (cookingId, blob) {
    var self = this;

    self.recordedBlobs.push(blob);
}

CookingRecordedViewModel.prototype.cookingMediaTransferEnded = function (cookingId) {
    var self = this;

    var superBuffer = new Blob(self.recordedBlobs, { type: 'video/webm' });
    var archivedVideo = document.querySelector('#archivedVideo');
    archivedVideo.src = window.URL.createObjectURL(superBuffer);
}

CookingRecordedViewModel.prototype.getVideo = function () {
    var self = this;
    console.log('Media stream transfer requested: ' + self.id);
    self.index = 0;

    var superBuffer = new Blob([], { type: 'video/webm' });
    // Play video from begining
    playVideo();
    
    function playVideo() {
        ajax.getData(self.id, self.index, function (response) {
            if (response.Type == 1) {
                var arrayFormatted = new Uint8Array(response.Data);
                superBuffer = new Blob([superBuffer, arrayFormatted], { type: 'video/webm' });
                self.index++;
                // Continue stream
                playVideo();
            }
            else {
                console.log('Playing video');
                self.video.src = window.URL.createObjectURL(superBuffer);
                self.video.play();
            }
        });
    }
}