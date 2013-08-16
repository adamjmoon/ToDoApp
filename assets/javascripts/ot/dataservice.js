define('dataservice', function () {
    function dataservice() {
        $.ajaxSetup({
            statusCode: {
                401: function () {

                    // Redirect the to the login page.
                    location.href = "/#login";
                }
            }
        });

        self.get = function (partialUrl) {
            var deferred = $.Deferred();
            sendRequest("GET", partialUrl, {}, {
                success: function (response) {
                    deferred.resolve(response);
                },
                error: function (xhr, eventArgs) {
                    deferred.rejectWith(this, [xhr, eventArgs]);
                }
            });
            return deferred.promise();
        };

        self.post = function (partialUrl, data) {
            var deferred = $.Deferred();
            sendRequest("POST", partialUrl, data, {
                success: function (response) {
                    deferred.resolve(response);
                },
                error: function (xhr, eventArgs) {
                    deferred.rejectWith(this, [xhr, eventArgs]);
                }
            });
            return deferred.promise();
        };

        self.put = function (partialUrl, data) {
            var deferred = $.Deferred();
            sendRequest("PUT", partialUrl, data, {
                success: function (response) {
                    deferred.resolve(response);
                },
                error: function (xhr, eventArgs) {
                    deferred.rejectWith(this, [xhr, eventArgs]);
                }
            });
            return deferred.promise();
        };

        self.delete = function (partialUrl) {
            var deferred = $.Deferred();
            sendRequest("DELETE", partialUrl, "", {
                success: function (response) {
                    deferred.resolve(response);
                },
                error: function (xhr, eventArgs) {
                    deferred.rejectWith(this, [xhr, eventArgs]);

                }
            });
            return deferred.promise();
        };

        var sendRequest = function (method, partialUrl, data, callbacks, async) {
            var url = '/capi' + partialUrl;
            var requestData = "";
            if (method != "GET") {
                requestData = config.packageData(data);
            }
            if (async === undefined) {
                async = true;
            }
            $.ajax({
                url: url,
                type: method,
                async: async,
                data: requestData,
                contentType: "application/json",
                success: function (response) {

                    if (typeof response == "string" && response !== "") {
                        response = JSON.parse(response);
                    }
                    if (callbacks && callbacks.success) callbacks.success(response);
                },
                error: function (xhr) {
                    if ($.disableErrors) {
                        return;
                    }
                    this.eventArgs = { handledError: false };
                    if (callbacks && callbacks.error) {
                        callbacks.error(xhr, this.eventArgs);
                    }

                    if (!this.eventArgs.handledError) {

                    }
                }
            });
        };
    }

    return dataservice;
});