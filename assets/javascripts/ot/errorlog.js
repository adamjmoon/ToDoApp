define('errorlog', [],
    function () {
        function errorlog() {
            var log = function (uri, message, timeout) {
                if (!timeout) {
                    timeout = 0;
                }
                return sendRequest("POST", uri, { message: message }, timeout);
            };

            this.init = function () {
                config.init();
            };

            this.info = function (message, timeout) {
                return log("/log/info", message, timeout);
            };

            this.warning = function (message, timeout) {
                return log("/log/warning", message, timeout);
            };

            this.error = function (message, timeout) {
                return log("/log/error", message, timeout);
            };

            this.critical = function (message, timeout) {
                return log("/log/critical", message, timeout);
            };
        }

        return errorlog;
    });