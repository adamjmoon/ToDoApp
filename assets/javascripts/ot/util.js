define("util", function () {
    function util() {
        "use strict";

        // Inheritance Helpers
        if (typeof Object.create === "undefined") {
            Object.create = function (o) {
                function F() {
                }

                F.prototype = o;
                return new F();
            };
        }

        Function.prototype.inherits = function (ParentClassOrObject) {
            if (ParentClassOrObject.constructor == Function) {
                //Normal Inheritance
                this.prototype = new ParentClassOrObject();
                this.prototype.constructor = this;
                this.prototype.base = ParentClassOrObject.prototype;
            }
            else {
                //Pure Virtual Inheritance
                this.prototype = ParentClassOrObject;
                this.prototype.constructor = this;
                this.prototype.base = ParentClassOrObject;
            }
            return this;
        };

        Function.prototype.extends = function (parent) {
            if (parent instanceof Function) {
                var parentInstance = new parent();
                for (var key in parentInstance) {
                    this[key] = parentInstance[key];
                }
            }
            else {
                for (var key in parent) {
                    this[key] = parent[key];
                }
            }

            return this;
        }
    }

    return util;
})
;

