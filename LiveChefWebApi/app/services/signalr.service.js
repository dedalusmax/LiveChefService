(function () {

    var hub;
    var proxy;
    var delegates = [];

    function clientReconnected() {
        /// <summary>Notifies the server that the SignalR client succeeded to reconnect.</summary>

        console.log("SignalR method call: ClientReconnected, NOT HANDLED");
    }

    function disconnectClient() {
        /// <summary>Occurs when server sends the message to client to disconnect himself.</summary>

        console.log("SignalR event: onDisconnectClient");
        $.connection.hub.stop();
        hub = null;
        location.reload();
    }

    function subscribeToEvents() {
        if (proxy) {
            delegates.forEach((d, index) => {
                proxy.on(d.method, d.callback);
                delegates.splice(index);
            });
        }
    }

    function subscribe(method, callback) {
        delegates.push({ method: method, callback: callback });
        if (proxy) {
            subscribeToEvents();
        }
    }

    function send(method, args) {
        if (proxy) {
            proxy.invoke(method, args);
        }
    }

    function init() {
        // initialize SignalR connection
        if ($.connection.hub !== null) {

            hub = $.connection.chefHub;

            var connection = $.hubConnection();
            connection.logging = true;
            proxy = connection.createHubProxy('chefHub');

            $.connection.hub.error(function (error) {
                console.log('Error reported by connection.hub object: ' + error + ' (' + getCurrentTime() + ')');
            });

            $.connection.hub.reconnected(function (data) {
                console.log('SignalR connection.hub reconnected (' + getCurrentTime() + ').');
                clientReconnected();
            });

            $.connection.hub.disconnected(function (data) {
                console.log('SignalR connection.hub disconnected (' + getCurrentTime() + ').');
                hub = null;
                location.reload();
            });

            $.connection.hub.start()
                .done(function () {
                    console.log('SignalR connection.hub connected (' + getCurrentTime() + ').');
                })
                .fail(function (error) {
                    console.log('Error during SignalR connection: ' + error + ' (' + getCurrentTime() + ')');
                });

            $.connection.hub.stateChanged(function (change) {

                if (change.newState === $.signalR.connectionState.connecting) {
                    console.log('SignalR state changed to connecting (' + getCurrentTime() + ').');
                }
                else if (change.newState === $.signalR.connectionState.connected) {
                    console.log('SignalR state changed to connected (' + getCurrentTime() + ').');
                    subscribeToEvents();
                }
                else if (change.newState === $.signalR.connectionState.reconnecting) {
                    console.log('SignalR state changed to reconnecting (' + getCurrentTime() + ').');
                }
                else if (change.newState === $.signalR.connectionState.disconnected) {
                    console.log('SignalR state changed to disconnected (' + getCurrentTime() + ').');
                }
                else {
                    console.log('SignalR state changed to unknown state: ' + change.newState + ' (' + getCurrentTime() + ')');
                }
            });

            // subscribe to server methods ("events"):

            // connect/disconnect messages
            hub.client.onDisconnectClient = disconnectClient;

            // event messages subscriptions

            //hub.client.userLoggedIn = onUserLoggedIn;
            //hub.client.updateCookings = onUpdateCookings;
            //hub.client.cookingAdded = onCookingAdded;
        }
        else {
            alert("Service unreachable");
        }
    }

    window.connector = {
        init: init,
        subscribe: subscribe,
        send: send
        //userLoggedIn: onUserLoggedIn,
        //updateCookings: onUpdateCookings,
        //cookingAdded: onCookingAdded
    };    
})()