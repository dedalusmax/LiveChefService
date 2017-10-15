var CookingRecordedViewModel = function (data) {
    var self = data;

    self.storedSnapshots = ko.observableArray();
    self.storedChatHistory = ko.observableArray();

    $(document).ready(function () {

        var video = document.querySelector('#archivedVideo');

        var snapshots = self.snapshots;

        snapshots.forEach(function (snapshot) {

            var s = {
                id: snapshot.id,
                snapshotId: 'snapshot' + snapshot.id,
                timeTaken: snapshot.timeTaken,
                timeTakenText: moment(snapshot.timeTaken).format('HH:mm:ss'),
                width: video.clientWidth / 2, // 50% video width
                height: video.clientHeight / 2, // 50% video height,
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

            var c = new ChatViewModel(chatMessage.sender, chatMessage.text);

            self.storedChatHistory.push(c);
          
        });
    });
}