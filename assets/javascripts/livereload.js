(function () {
    var webSocketPath = "ws://127.0.0.1:" + 5001;
    var webSocket = undefined;
    function socket() {
        webSocket = new WebSocket(webSocketPath);
        webSocket.onmessage = function (e) {
            var data = JSON.parse(e.data);
            if (data.r) {
                location.reload();
                webSocket.send('reloaded');
            }
        };
    }
    socket();

    setInterval(function () {
        if (webSocket) {
            if (webSocket.readyState !== 1) {
                socket();
            }
        } else {
            socket();
        }
    }, 1000);
})();

window.contextList = [];