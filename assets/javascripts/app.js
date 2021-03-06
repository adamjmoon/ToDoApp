/**
 * Durandal 2.0.0 Copyright (c) 2012 Blue Spire Consulting, Inc. All Rights Reserved.
 * Available via the MIT license.
 * see: http://durandaljs.com or https://github.com/BlueSpire/Durandal for details.
 */

define("durandal/system", ["require", "jquery"], function (e, t) {
    function v(e) {
        var t = "[object " + e + "]";
        o["is" + e] = function (e) {
            return s.call(e) == t
        }
    }

    var n = !1, r = Object.keys, i = Object.prototype.hasOwnProperty, s = Object.prototype.toString, o, u = !1, a = Array.isArray, f = Array.prototype.slice;
    if (Function.prototype.bind && (typeof console == "object" || typeof console == "function") && typeof console.log == "object")try {
        ["log", "info", "warn", "error", "assert", "dir", "clear", "profile", "profileEnd"].forEach(function (e) {
            console[e] = this.call(console[e], console)
        }, Function.prototype.bind)
    } catch (l) {
        u = !0
    }
    e.on && e.on("moduleLoaded", function (e, t) {
        o.setModuleId(e, t)
    }), typeof requirejs != "undefined" && (requirejs.onResourceLoad = function (e, t, n) {
        o.setModuleId(e.defined[t.id], t.id)
    });
    var c = function () {
    }, h = function () {
        try {
            if (typeof console != "undefined" && typeof console.log == "function")if (window.opera) {
                var e = 0;
                while (e < arguments.length)console.log("Item " + (e + 1) + ": " + arguments[e]), e++
            } else f.call(arguments).length == 1 && typeof f.call(arguments)[0] == "string" ? console.log(f.call(arguments).toString()) : console.log.apply(console, f.call(arguments)); else(!Function.prototype.bind || u) && typeof console != "undefined" && typeof console.log == "object" && Function.prototype.call.call(console.log, console, f.call(arguments))
        } catch (t) {
        }
    }, p = function (e) {
        throw e instanceof Error ? e : new Error(e)
    };
    o = {version: "2.0.0", noop: c, getModuleId: function (e) {
        return e ? typeof e == "function" ? e.prototype.__moduleId__ : typeof e == "string" ? null : e.__moduleId__ : null
    }, setModuleId: function (e, t) {
        if (!e)return;
        if (typeof e == "function") {
            e.prototype.__moduleId__ = t;
            return
        }
        if (typeof e == "string")return;
        e.__moduleId__ = t
    }, resolveObject: function (e) {
        return o.isFunction(e) ? new e : e
    }, debug: function (e) {
        return arguments.length == 1 && (n = e, n ? (this.log = h, this.error = p, this.log("Debug:Enabled")) : (this.log("Debug:Disabled"), this.log = c, this.error = c)), n
    }, log: c, error: c, assert: function (e, t) {
        e || o.error(new Error(t || "Assert:Failed"))
    }, defer: function (e) {
        return t.Deferred(e)
    }, guid: function () {
        return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
            var t = Math.random() * 16 | 0, n = e == "x" ? t : t & 3 | 8;
            return n.toString(16)
        })
    }, acquire: function () {
        var t, n = arguments[0], r = !1;
        return o.isArray(n) ? (t = n, r = !0) : t = f.call(arguments, 0), this.defer(function (n) {
            e(t, function () {
                var e = arguments;
                setTimeout(function () {
                    e.length > 1 || r ? n.resolve(f.call(e, 0)) : n.resolve(e[0])
                }, 1)
            }, function (e) {
                n.reject(e)
            })
        }).promise()
    }, extend: function (e) {
        var t = f.call(arguments, 1);
        for (var n = 0; n < t.length; n++) {
            var r = t[n];
            if (r)for (var i in r)e[i] = r[i]
        }
        return e
    }, wait: function (e) {
        return o.defer(function (t) {
            setTimeout(t.resolve, e)
        }).promise()
    }}, o.keys = r || function (e) {
        if (e !== Object(e))throw new TypeError("Invalid object");
        var t = [];
        for (var n in e)i.call(e, n) && (t[t.length] = n);
        return t
    }, o.isElement = function (e) {
        return!!e && e.nodeType === 1
    }, o.isArray = a || function (e) {
        return s.call(e) == "[object Array]"
    }, o.isObject = function (e) {
        return e === Object(e)
    }, o.isBoolean = function (e) {
        return typeof e == "boolean"
    }, o.isPromise = function (e) {
        return e && o.isFunction(e.then)
    };
    var d = ["Arguments", "Function", "String", "Number", "Date", "RegExp"];
    for (var m = 0; m < d.length; m++)v(d[m]);
    return o
}), define("durandal/viewEngine", ["durandal/system", "jquery"], function (e, t) {
    var n;
    return t.parseHTML ? n = function (e) {
        return t.parseHTML(e)
    } : n = function (e) {
        return t(e).get()
    }, {viewExtension: ".html", viewPlugin: "text", isViewUrl: function (e) {
        return e.indexOf(this.viewExtension, e.length - this.viewExtension.length) !== -1
    }, convertViewUrlToViewId: function (e) {
        return e.substring(0, e.length - this.viewExtension.length)
    }, convertViewIdToRequirePath: function (e) {
        return this.viewPlugin + "!" + e + this.viewExtension
    }, parseMarkup: n, processMarkup: function (e) {
        var t = this.parseMarkup(e);
        return this.ensureSingleElement(t)
    }, ensureSingleElement: function (e) {
        if (e.length == 1)return e[0];
        var n = [];
        for (var r = 0; r < e.length; r++) {
            var i = e[r];
            if (i.nodeType != 8) {
                if (i.nodeType == 3) {
                    var s = /\S/.test(i.nodeValue);
                    if (!s)continue
                }
                n.push(i)
            }
        }
        return n.length > 1 ? t(n).wrapAll('<div class="durandal-wrapper"></div>').parent().get(0) : n[0]
    }, createView: function (t) {
        var n = this, r = this.convertViewIdToRequirePath(t);
        return e.defer(function (i) {
            e.acquire(r).then(function (e) {
                var r = n.processMarkup(e);
                r.setAttribute("data-view", t), i.resolve(r)
            }).fail(function (e) {
                n.createFallbackView(t, r, e).then(function (e) {
                    e.setAttribute("data-view", t), i.resolve(e)
                })
            })
        }).promise()
    }, createFallbackView: function (t, n, r) {
        var i = this, s = 'View Not Found. Searched for "' + t + '" via path "' + n + '".';
        return e.defer(function (e) {
            e.resolve(i.processMarkup('<div class="durandal-view-404">' + s + "</div>"))
        }).promise()
    }}
}), define("durandal/viewLocator", ["durandal/system", "durandal/viewEngine"], function (e, t) {
    function n(e, t) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n], i = r.getAttribute("data-view");
            if (i == t)return r
        }
    }

    function r(e) {
        return(e + "").replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1")
    }

    return{useConvention: function (e, t, n) {
        e = e || "viewmodels", t = t || "views", n = n || t;
        var i = new RegExp(r(e), "gi");
        this.convertModuleIdToViewId = function (e) {
            return e.replace(i, t)
        }, this.translateViewIdToArea = function (e, t) {
            return!t || t == "partial" ? n + "/" + e : n + "/" + t + "/" + e
        }
    }, locateViewForObject: function (t, n, r) {
        var i;
        if (t.getView) {
            i = t.getView();
            if (i)return this.locateView(i, n, r)
        }
        if (t.viewUrl)return this.locateView(t.viewUrl, n, r);
        var s = e.getModuleId(t);
        return s ? this.locateView(this.convertModuleIdToViewId(s), n, r) : this.locateView(this.determineFallbackViewId(t), n, r)
    }, convertModuleIdToViewId: function (e) {
        return e
    }, determineFallbackViewId: function (e) {
        var t = /function (.{1,})\(/, n = t.exec(e.constructor.toString()), r = n && n.length > 1 ? n[1] : "";
        return"views/" + r
    }, translateViewIdToArea: function (e, t) {
        return e
    }, locateView: function (r, i, s) {
        if (typeof r == "string") {
            var o;
            t.isViewUrl(r) ? o = t.convertViewUrlToViewId(r) : o = r, i && (o = this.translateViewIdToArea(o, i));
            if (s) {
                var u = n(s, o);
                if (u)return e.defer(function (e) {
                    e.resolve(u)
                }).promise()
            }
            return t.createView(o)
        }
        return e.defer(function (e) {
            e.resolve(r)
        }).promise()
    }}
}), define("durandal/binder", ["durandal/system", "knockout"], function (e, t) {
    function u(t) {
        return t === undefined ? {applyBindings: !0} : e.isBoolean(t) ? {applyBindings: t} : (t.applyBindings === undefined && (t.applyBindings = !0), t)
    }

    function a(a, f, l, c) {
        if (!f || !l) {
            n.throwOnErrors ? e.error(r) : e.log(r, f, c);
            return
        }
        if (!f.getAttribute) {
            n.throwOnErrors ? e.error(i) : e.log(i, f, c);
            return
        }
        var h = f.getAttribute("data-view");
        try {
            var p;
            return a && a.binding && (p = a.binding(f)), p = u(p), n.binding(c, f, p), p.applyBindings ? (e.log("Binding", h, c), t.applyBindings(l, f)) : a && t.utils.domData.set(f, o, {$data: a}), n.bindingComplete(c, f, p), a && a.bindingComplete && a.bindingComplete(f), t.utils.domData.set(f, s, p), p
        } catch (d) {
            d.message = d.message + ";\nView: " + h + ";\nModuleId: " + e.getModuleId(c), n.throwOnErrors ? e.error(d) : e.log(d.message)
        }
    }

    var n, r = "Insufficient Information to Bind", i = "Unexpected View Type", s = "durandal-binding-instruction", o = "__ko_bindingContext__";
    return n = {binding: e.noop, bindingComplete: e.noop, throwOnErrors: !1, getBindingInstruction: function (e) {
        return t.utils.domData.get(e, s)
    }, bindContext: function (e, t, n) {
        return n && e && (e = e.createChildContext(n)), a(n, t, e, n || (e ? e.$data : null))
    }, bind: function (e, t) {
        return a(e, t, e, e)
    }}
}), define("durandal/activator", ["durandal/system", "knockout"], function (e, t) {
    function r(e) {
        return e == undefined && (e = {}), e.closeOnDeactivate || (e.closeOnDeactivate = n.defaults.closeOnDeactivate), e.beforeActivate || (e.beforeActivate = n.defaults.beforeActivate), e.afterDeactivate || (e.afterDeactivate = n.defaults.afterDeactivate), e.affirmations || (e.affirmations = n.defaults.affirmations), e.interpretResponse || (e.interpretResponse = n.defaults.interpretResponse), e.areSameItem || (e.areSameItem = n.defaults.areSameItem), e
    }

    function i(t, n, r) {
        return e.isArray(r) ? t[n].apply(t, r) : t[n](r)
    }

    function s(t, n, r, i, s) {
        if (t && t.deactivate) {
            e.log("Deactivating", t);
            var o;
            try {
                o = t.deactivate(n)
            } catch (u) {
                e.error(u), i.resolve(!1);
                return
            }
            o && o.then ? o.then(function () {
                r.afterDeactivate(t, n, s), i.resolve(!0)
            }, function (t) {
                e.log(t), i.resolve(!1)
            }) : (r.afterDeactivate(t, n, s), i.resolve(!0))
        } else t && r.afterDeactivate(t, n, s), i.resolve(!0)
    }

    function o(t, n, r, s) {
        if (t)if (t.activate) {
            e.log("Activating", t);
            var o;
            try {
                o = i(t, "activate", s)
            } catch (u) {
                e.error(u), r(!1);
                return
            }
            o && o.then ? o.then(function () {
                n(t), r(!0)
            }, function (t) {
                e.log(t), r(!1)
            }) : (n(t), r(!0))
        } else n(t), r(!0); else r(!0)
    }

    function u(t, n, r) {
        return r.lifecycleData = null, e.defer(function (i) {
            if (t && t.canDeactivate) {
                var s;
                try {
                    s = t.canDeactivate(n)
                } catch (o) {
                    e.error(o), i.resolve(!1);
                    return
                }
                s.then ? s.then(function (e) {
                    r.lifecycleData = e, i.resolve(r.interpretResponse(e))
                }, function (t) {
                    e.error(t), i.resolve(!1)
                }) : (r.lifecycleData = s, i.resolve(r.interpretResponse(s)))
            } else i.resolve(!0)
        }).promise()
    }

    function a(t, n, r, s) {
        return r.lifecycleData = null, e.defer(function (o) {
            if (t == n()) {
                o.resolve(!0);
                return
            }
            if (t && t.canActivate) {
                var u;
                try {
                    u = i(t, "canActivate", s)
                } catch (a) {
                    e.error(a), o.resolve(!1);
                    return
                }
                u.then ? u.then(function (e) {
                    r.lifecycleData = e, o.resolve(r.interpretResponse(e))
                }, function (t) {
                    e.error(t), o.resolve(!1)
                }) : (r.lifecycleData = u, o.resolve(r.interpretResponse(u)))
            } else o.resolve(!0)
        }).promise()
    }

    function f(n, i) {
        var f = t.observable(null), l;
        i = r(i);
        var c = t.computed({read: function () {
            return f()
        }, write: function (e) {
            c.viaSetter = !0, c.activateItem(e)
        }});
        return c.__activator__ = !0, c.settings = i, i.activator = c, c.isActivating = t.observable(!1), c.canDeactivateItem = function (e, t) {
            return u(e, t, i)
        }, c.deactivateItem = function (t, n) {
            return e.defer(function (e) {
                c.canDeactivateItem(t, n).then(function (r) {
                    r ? s(t, n, i, e, f) : (c.notifySubscribers(), e.resolve(!1))
                })
            }).promise()
        }, c.canActivateItem = function (e, t) {
            return a(e, f, i, t)
        }, c.activateItem = function (t, n) {
            var r = c.viaSetter;
            return c.viaSetter = !1, e.defer(function (u) {
                if (c.isActivating()) {
                    u.resolve(!1);
                    return
                }
                c.isActivating(!0);
                var a = f();
                if (i.areSameItem(a, t, l, n)) {
                    c.isActivating(!1), u.resolve(!0);
                    return
                }
                c.canDeactivateItem(a, i.closeOnDeactivate).then(function (h) {
                    h ? c.canActivateItem(t, n).then(function (h) {
                        h ? e.defer(function (e) {
                            s(a, i.closeOnDeactivate, i, e)
                        }).promise().then(function () {
                            t = i.beforeActivate(t, n), o(t, f, function (e) {
                                l = n, c.isActivating(!1), u.resolve(e)
                            }, n)
                        }) : (r && c.notifySubscribers(), c.isActivating(!1), u.resolve(!1))
                    }) : (r && c.notifySubscribers(), c.isActivating(!1), u.resolve(!1))
                })
            }).promise()
        }, c.canActivate = function () {
            var e;
            return n ? (e = n, n = !1) : e = c(), c.canActivateItem(e)
        }, c.activate = function () {
            var e;
            return n ? (e = n, n = !1) : e = c(), c.activateItem(e)
        }, c.canDeactivate = function (e) {
            return c.canDeactivateItem(c(), e)
        }, c.deactivate = function (e) {
            return c.deactivateItem(c(), e)
        }, c.includeIn = function (e) {
            e.canActivate = function () {
                return c.canActivate()
            }, e.activate = function () {
                return c.activate()
            }, e.canDeactivate = function (e) {
                return c.canDeactivate(e)
            }, e.deactivate = function (e) {
                return c.deactivate(e)
            }
        }, i.includeIn ? c.includeIn(i.includeIn) : n && c.activate(), c.forItems = function (t) {
            i.closeOnDeactivate = !1, i.determineNextItemToActivate = function (e, t) {
                var n = t - 1;
                return n == -1 && e.length > 1 ? e[1] : n > -1 && n < e.length - 1 ? e[n] : null
            }, i.beforeActivate = function (e) {
                var n = c();
                if (!e)e = i.determineNextItemToActivate(t, n ? t.indexOf(n) : 0); else {
                    var r = t.indexOf(e);
                    r == -1 ? t.push(e) : e = t()[r]
                }
                return e
            }, i.afterDeactivate = function (e, n) {
                n && t.remove(e)
            };
            var n = c.canDeactivate;
            c.canDeactivate = function (r) {
                return r ? e.defer(function (e) {
                    function s() {
                        for (var t = 0; t < i.length; t++)if (!i[t]) {
                            e.resolve(!1);
                            return
                        }
                        e.resolve(!0)
                    }

                    var n = t(), i = [];
                    for (var o = 0; o < n.length; o++)c.canDeactivateItem(n[o], r).then(function (e) {
                        i.push(e), i.length == n.length && s()
                    })
                }).promise() : n()
            };
            var r = c.deactivate;
            return c.deactivate = function (n) {
                return n ? e.defer(function (e) {
                    function o(r) {
                        c.deactivateItem(r, n).then(function () {
                            i++, t.remove(r), i == s && e.resolve()
                        })
                    }

                    var r = t(), i = 0, s = r.length;
                    for (var u = 0; u < s; u++)o(r[u])
                }).promise() : r()
            }, c
        }, c
    }

    var n, l = {closeOnDeactivate: !0, affirmations: ["yes", "ok", "true"], interpretResponse: function (n) {
        return e.isObject(n) && (n = n.can || !1), e.isString(n) ? t.utils.arrayIndexOf(this.affirmations, n.toLowerCase()) !== -1 : n
    }, areSameItem: function (e, t, n, r) {
        return e == t
    }, beforeActivate: function (e) {
        return e
    }, afterDeactivate: function (e, t, n) {
        t && n && n(null)
    }};
    return n = {defaults: l, create: f, isActivator: function (e) {
        return e && e.__activator__
    }}, n
}), define("durandal/composition", ["durandal/system", "durandal/viewLocator", "durandal/binder", "durandal/viewEngine", "durandal/activator", "jquery", "knockout"], function (e, t, n, r, i, s, o) {
    function m(e) {
        var t = [], n = {childElements: t, activeView: null}, r = o.virtualElements.firstChild(e);
        while (r)r.nodeType == 1 && (t.push(r), r.getAttribute(a) && (n.activeView = r)), r = o.virtualElements.nextSibling(r);
        return n.activeView || (n.activeView = t[0]), n
    }

    function g() {
        c--, c === 0 && setTimeout(function () {
            var e = l.length;
            while (e--)l[e]();
            l = []
        }, 1)
    }

    function y(t, n, r) {
        if (r)n(); else if (t.activate && t.model && t.model.activate) {
            var i;
            e.isArray(t.activationData) ? i = t.model.activate.apply(t.model, t.activationData) : i = t.model.activate(t.activationData), i && i.then ? i.then(n) : i || i === undefined ? n() : g()
        } else n()
    }

    function b() {
        var t = this;
        t.activeView && t.activeView.removeAttribute(a), t.child && (t.model && t.model.attached && (t.composingNewView || t.alwaysTriggerAttach) && t.model.attached(t.child, t.parent, t), t.attached && t.attached(t.child, t.parent, t), t.child.setAttribute(a, !0), t.composingNewView && t.model && (t.model.compositionComplete && f.current.complete(function () {
            t.model.compositionComplete(t.child, t.parent, t)
        }), t.model.detached && o.utils.domNodeDisposal.addDisposeCallback(t.child, function () {
            t.model.detached(t.child, t.parent, t)
        })), t.compositionComplete && f.current.complete(function () {
            t.compositionComplete(t.child, t.parent, t)
        })), g(), t.triggerAttach = e.noop
    }

    function w(t) {
        if (e.isString(t.transition)) {
            if (t.activeView) {
                if (t.activeView == t.child)return!1;
                if (!t.child)return!0;
                if (t.skipTransitionOnSameViewId) {
                    var n = t.activeView.getAttribute("data-view"), r = t.child.getAttribute("data-view");
                    return n != r
                }
            }
            return!0
        }
        return!1
    }

    function E(e) {
        for (var t = 0, n = e.length, r = []; t < n; t++) {
            var i = e[t].cloneNode(!0);
            r.push(i)
        }
        return r
    }

    function S(e) {
        var t = E(e.parts), n = f.getParts(t), r = f.getParts(e.child);
        for (var i in n)s(r[i]).replaceWith(n[i])
    }

    function x(t) {
        var n = o.virtualElements.childNodes(t), r, i;
        if (!e.isArray(n)) {
            var s = [];
            for (r = 0, i = n.length; r < i; r++)s[r] = n[r];
            n = s
        }
        for (r = 1, i = n.length; r < i; r++)o.removeNode(n[r])
    }

    var u = {}, a = "data-active-view", f, l = [], c = 0, h = "durandal-composition-data", p = "data-part", d = "[" + p + "]", v = ["model", "view", "transition", "area", "strategy", "activationData"], T = {complete: function (e) {
        l.push(e)
    }};
    return f = {convertTransitionToModuleId: function (e) {
        return"transitions/" + e
    }, defaultTransitionName: null, current: T, addBindingHandler: function (e, t, n) {
        var r, i = "composition-handler-" + e, s;
        t = t || o.bindingHandlers[e], n = n || function () {
            return undefined
        }, s = o.bindingHandlers[e] = {init: function (e, r, s, u, a) {
            var l = {trigger: o.observable(null)};
            return f.current.complete(function () {
                t.init && t.init(e, r, s, u, a), t.update && (o.utils.domData.set(e, i, t), l.trigger("trigger"))
            }), o.utils.domData.set(e, i, l), n(e, r, s, u, a)
        }, update: function (e, t, n, r, s) {
            var u = o.utils.domData.get(e, i);
            if (u.update)return u.update(e, t, n, r, s);
            u.trigger()
        }};
        for (r in t)r !== "init" && r !== "update" && (s[r] = t[r])
    }, getParts: function (t) {
        var n = {};
        e.isArray(t) || (t = [t]);
        for (var r = 0; r < t.length; r++) {
            var i = t[r];
            if (i.getAttribute) {
                var o = i.getAttribute(p);
                o && (n[o] = i);
                var u = s(d, i).not(s("[data-bind] " + d, i));
                for (var a = 0; a < u.length; a++) {
                    var f = u.get(a);
                    n[f.getAttribute(p)] = f
                }
            }
        }
        return n
    }, cloneNodes: E, finalize: function (t) {
        t.transition = t.transition || this.defaultTransitionName;
        if (!t.child && !t.activeView)t.cacheViews || o.virtualElements.emptyNode(t.parent), t.triggerAttach(); else if (w(t)) {
            var r = this.convertTransitionToModuleId(t.transition);
            e.acquire(r).then(function (e) {
                t.transition = e, e(t).then(function () {
                    if (!t.cacheViews)t.child ? x(t.parent) : o.virtualElements.emptyNode(t.parent); else if (t.activeView) {
                        var e = n.getBindingInstruction(t.activeView);
                        e.cacheViews != undefined && !e.cacheViews && o.removeNode(t.activeView)
                    }
                    t.triggerAttach()
                })
            }).fail(function (t) {
                e.error("Failed to load transition (" + r + "). Details: " + t.message)
            })
        } else {
            if (t.child != t.activeView) {
                if (t.cacheViews && t.activeView) {
                    var i = n.getBindingInstruction(t.activeView);
                    i.cacheViews != undefined && !i.cacheViews ? o.removeNode(t.activeView) : s(t.activeView).hide()
                }
                t.child ? (t.cacheViews || x(t.parent), s(t.child).show()) : t.cacheViews || o.virtualElements.emptyNode(t.parent)
            }
            t.triggerAttach()
        }
    }, bindAndShow: function (e, t, i) {
        t.child = e, t.cacheViews ? t.composingNewView = o.utils.arrayIndexOf(t.viewElements, e) == -1 : t.composingNewView = !0, y(t, function () {
            t.binding && t.binding(t.child, t.parent, t);
            if (t.preserveContext && t.bindingContext)t.composingNewView && (t.parts && S(t), s(e).hide(), o.virtualElements.prepend(t.parent, e), n.bindContext(t.bindingContext, e, t.model)); else if (e) {
                var i = t.model || u, a = o.dataFor(e);
                if (a != i) {
                    if (!t.composingNewView) {
                        s(e).remove(), r.createView(e.getAttribute("data-view")).then(function (e) {
                            f.bindAndShow(e, t, !0)
                        });
                        return
                    }
                    t.parts && S(t), s(e).hide(), o.virtualElements.prepend(t.parent, e), n.bind(i, e)
                }
            }
            f.finalize(t)
        }, i)
    }, defaultStrategy: function (e) {
        return t.locateViewForObject(e.model, e.area, e.viewElements)
    }, getSettings: function (t, n) {
        var s = t(), u = o.utils.unwrapObservable(s) || {}, a = i.isActivator(s), f;
        if (e.isString(u))return r.isViewUrl(u) ? u = {view: u} : u = {model: u, activate: !0}, u;
        f = e.getModuleId(u);
        if (f)return u = {model: u, activate: !0}, u;
        !a && u.model && (a = i.isActivator(u.model));
        for (var l in u)o.utils.arrayIndexOf(v, l) != -1 ? u[l] = o.utils.unwrapObservable(u[l]) : u[l] = u[l];
        return a ? u.activate = !1 : u.activate === undefined && (u.activate = !0), u
    }, executeStrategy: function (e) {
        e.strategy(e).then(function (t) {
            f.bindAndShow(t, e)
        })
    }, inject: function (n) {
        if (!n.model) {
            this.bindAndShow(null, n);
            return
        }
        if (n.view) {
            t.locateView(n.view, n.area, n.viewElements).then(function (e) {
                f.bindAndShow(e, n)
            });
            return
        }
        n.strategy || (n.strategy = this.defaultStrategy), e.isString(n.strategy) ? e.acquire(n.strategy).then(function (e) {
            n.strategy = e, f.executeStrategy(n)
        }).fail(function (t) {
            e.error("Failed to load view strategy (" + n.strategy + "). Details: " + t.message)
        }) : this.executeStrategy(n)
    }, compose: function (n, r, i, s) {
        c++, s || (r = f.getSettings(function () {
            return r
        }, n));
        var o = m(n);
        r.activeView = o.activeView, r.parent = n, r.triggerAttach = b, r.bindingContext = i, r.cacheViews && !r.viewElements && (r.viewElements = o.childElements), r.model ? e.isString(r.model) ? e.acquire(r.model).then(function (t) {
            r.model = e.resolveObject(t), f.inject(r)
        }).fail(function (t) {
            e.error("Failed to load composed module (" + r.model + "). Details: " + t.message)
        }) : f.inject(r) : r.view ? (r.area = r.area || "partial", r.preserveContext = !0, t.locateView(r.view, r.area, r.viewElements).then(function (e) {
            f.bindAndShow(e, r)
        })) : this.bindAndShow(null, r)
    }}, o.bindingHandlers.compose = {init: function () {
        return{controlsDescendantBindings: !0}
    }, update: function (e, t, n, i, s) {
        var u = f.getSettings(t, e);
        if (u.mode) {
            var a = o.utils.domData.get(e, h);
            if (!a) {
                var l = o.virtualElements.childNodes(e);
                a = {}, u.mode === "inline" ? a.view = r.ensureSingleElement(l) : u.mode === "templated" && (a.parts = E(l)), o.virtualElements.emptyNode(e), o.utils.domData.set(e, h, a)
            }
            u.mode === "inline" ? u.view = a.view.cloneNode(!0) : u.mode === "templated" && (u.parts = a.parts), u.preserveContext = !0
        }
        f.compose(e, u, s, !0)
    }}, o.virtualElements.allowedBindings.compose = !0, f
}), define("durandal/events", ["durandal/system"], function (e) {
    var t = /\s+/, n = function () {
    }, r = function (e, t) {
        this.owner = e, this.events = t
    };
    return r.prototype.then = function (e, t) {
        return this.callback = e || this.callback, this.context = t || this.context, this.callback ? (this.owner.on(this.events, this.callback, this.context), this) : this
    }, r.prototype.on = r.prototype.then, r.prototype.off = function () {
        return this.owner.off(this.events, this.callback, this.context), this
    }, n.prototype.on = function (e, n, i) {
        var s, o, u;
        if (!n)return new r(this, e);
        s = this.callbacks || (this.callbacks = {}), e = e.split(t);
        while (o = e.shift())u = s[o] || (s[o] = []), u.push(n, i);
        return this
    }, n.prototype.off = function (n, r, i) {
        var s, o, u, a;
        if (!(o = this.callbacks))return this;
        if (!(n || r || i))return delete this.callbacks, this;
        n = n ? n.split(t) : e.keys(o);
        while (s = n.shift()) {
            if (!(u = o[s]) || !r && !i) {
                delete o[s];
                continue
            }
            for (a = u.length - 2; a >= 0; a -= 2)r && u[a] !== r || i && u[a + 1] !== i || u.splice(a, 2)
        }
        return this
    }, n.prototype.trigger = function (e) {
        var n, r, i, s, o, u, a, f;
        if (!(r = this.callbacks))return this;
        f = [], e = e.split(t);
        for (s = 1, o = arguments.length; s < o; s++)f[s - 1] = arguments[s];
        while (n = e.shift()) {
            if (a = r.all)a = a.slice();
            if (i = r[n])i = i.slice();
            if (i)for (s = 0, o = i.length; s < o; s += 2)i[s].apply(i[s + 1] || this, f);
            if (a) {
                u = [n].concat(f);
                for (s = 0, o = a.length; s < o; s += 2)a[s].apply(a[s + 1] || this, u)
            }
        }
        return this
    }, n.prototype.proxy = function (e) {
        var t = this;
        return function (n) {
            t.trigger(e, n)
        }
    }, n.includeIn = function (e) {
        e.on = n.prototype.on, e.off = n.prototype.off, e.trigger = n.prototype.trigger, e.proxy = n.prototype.proxy
    }, n
}), define("durandal/app", ["durandal/system", "durandal/viewEngine", "durandal/composition", "durandal/events", "jquery"], function (e, t, n, r, i) {
    function a() {
        return e.defer(function (t) {
            if (o.length == 0) {
                t.resolve();
                return
            }
            e.acquire(o).then(function (n) {
                for (var r = 0; r < n.length; r++) {
                    var i = n[r];
                    if (i.install) {
                        var s = u[r];
                        e.isObject(s) || (s = {}), i.install(s), e.log("Plugin:Installed " + o[r])
                    } else e.log("Plugin:Loaded " + o[r])
                }
                t.resolve()
            }).fail(function (t) {
                e.error("Failed to load plugin(s). Details: " + t.message)
            })
        }).promise()
    }

    var s, o = [], u = [];
    return s = {title: "Application", configurePlugins: function (t, n) {
        var r = e.keys(t);
        n = n || "plugins/", n.indexOf("/", n.length - 1) === -1 && (n += "/");
        for (var i = 0; i < r.length; i++) {
            var s = r[i];
            o.push(n + s), u.push(t[s])
        }
    }, start: function () {
        return e.log("Application:Starting"), this.title && (document.title = this.title), e.defer(function (t) {
            i(function () {
                a().then(function () {
                    t.resolve(), e.log("Application:Started")
                })
            })
        }).promise()
    }, setRoot: function (r, i, s) {
        var o, u = {activate: !0, transition: i};
        !s || e.isString(s) ? o = document.getElementById(s || "applicationHost") : o = s, e.isString(r) ? t.isViewUrl(r) ? u.view = r : u.model = r : u.model = r, n.compose(o, u)
    }}, r.includeIn(s), s
}), define("ot/localStorage", [], function () {
    function e() {
        var e = undefined, t = this;
        this.get = function (e) {
            return console.log(e), ko.utils.parseJson(amplify.store(e))
        }, this.post = function (e, n) {
            return amplify.store(e, ko.toJSON(n)), t.get(e)
        }, this.put = function (e, n) {
            return amplify.store(e, n), t.get(e)
        }
    }

    return e
}), define("ot/util", [], function () {
    function e() {
        typeof Object.create == "undefined" && (Object.create = function (e) {
            function t() {
            }

            return t.prototype = e, new t
        }), Function.prototype.inherits = function (e) {
            return e.constructor == Function ? (this.prototype = new e, this.prototype.constructor = this, this.prototype.base = e.prototype) : (this.prototype = e, this.prototype.constructor = this, this.prototype.base = e), this
        }, Function.prototype.extends = function (e) {
            if (e instanceof Function) {
                var t = new e;
                for (var n in t)this[n] = t[n]
            } else for (var n in e)this[n] = e[n];
            return this
        }
    }

    return e
}), define("ot/bindingHandlers", [], function () {
    function e() {
        var e = 13;
        ko.bindingHandlers.enterKey = {init: function (t, n, r, i) {
            var s, o;
            s = function (t, r) {
                r.keyCode === e && n().call(this, t, r)
            }, o = function () {
                return{keyup: s}
            }, ko.bindingHandlers.event.init(t, o, r, i)
        }}, ko.bindingHandlers.selectAndFocus = {init: function (e, t, n) {
            ko.bindingHandlers.hasfocus.init(e, t, n), ko.utils.registerEventHandler(e, "focus", function () {
                e.focus()
            })
        }, update: function (e, t) {
            ko.utils.unwrapObservable(t()), setTimeout(function () {
                ko.bindingHandlers.hasfocus.update(e, t)
            }, 0)
        }}
    }

    return e
}), define("ot/dataservice", [], function () {
    function e() {
        $.ajaxSetup({statusCode: {401: function () {
            location.href = "/#login"
        }}}), self.get = function (t) {
            var n = $.Deferred();
            return e("GET", t, {}, {success: function (e) {
                n.resolve(e)
            }, error: function (e, t) {
                n.rejectWith(this, [e, t])
            }}), n.promise()
        }, self.post = function (t, n) {
            var r = $.Deferred();
            return e("POST", t, n, {success: function (e) {
                r.resolve(e)
            }, error: function (e, t) {
                r.rejectWith(this, [e, t])
            }}), r.promise()
        }, self.put = function (t, n) {
            var r = $.Deferred();
            return e("PUT", t, n, {success: function (e) {
                r.resolve(e)
            }, error: function (e, t) {
                r.rejectWith(this, [e, t])
            }}), r.promise()
        }, self.delete = function (t) {
            var n = $.Deferred();
            return e("DELETE", t, "", {success: function (e) {
                n.resolve(e)
            }, error: function (e, t) {
                n.rejectWith(this, [e, t])
            }}), n.promise()
        };
        var e = function (e, t, n, r, i) {
            var s = "/capi" + t, o = "";
            e != "GET" && (o = config.packageData(n)), i === undefined && (i = !0), $.ajax({url: s, type: e, async: i, data: o, contentType: "application/json", success: function (e) {
                typeof e == "string" && e !== "" && (e = JSON.parse(e)), r && r.success && r.success(e)
            }, error: function (e) {
                if ($.disableErrors)return;
                this.eventArgs = {handledError: !1}, r && r.error && r.error(e, this.eventArgs), !this.eventArgs.handledError
            }})
        }
    }

    return e
}), define("ot/ot", ["ot/util", "ot/bindingHandlers", "ot/dataservice"], function (e, t, n) {
    var r = new e, i = new t, s = new n, o = {Util: r, BindingHandlers: r, DataService: s};
    return window.OT = o, o
}), define("plugins/history", ["durandal/system", "jquery"], function (e, t) {
    function o(e, t, n) {
        if (n) {
            var r = e.href.replace(/(javascript:|#).*$/, "");
            e.replace(r + "#" + t)
        } else e.hash = "#" + t
    }

    var n = /^[#\/]|\s+$/g, r = /^\/+|\/+$/g, i = /msie [\w.]+/, s = /\/$/, u = {interval: 50, active: !1};
    return typeof window != "undefined" && (u.location = window.location, u.history = window.history), u.getHash = function (e) {
        var t = (e || u).location.href.match(/#(.*)$/);
        return t ? t[1] : ""
    }, u.getFragment = function (e, t) {
        if (e == null)if (u._hasPushState || !u._wantsHashChange || t) {
            e = u.location.pathname;
            var r = u.root.replace(s, "");
            e.indexOf(r) || (e = e.substr(r.length))
        } else e = u.getHash();
        return e.replace(n, "")
    }, u.activate = function (s) {
        u.active && e.error("History has already been activated."), u.active = !0, u.options = e.extend({}, {root: "/"}, u.options, s), u.root = u.options.root, u._wantsHashChange = u.options.hashChange !== !1, u._wantsPushState = !!u.options.pushState, u._hasPushState = !!(u.options.pushState && u.history && u.history.pushState);
        var o = u.getFragment(), a = document.documentMode, f = i.exec(navigator.userAgent.toLowerCase()) && (!a || a <= 7);
        u.root = ("/" + u.root + "/").replace(r, "/"), f && u._wantsHashChange && (u.iframe = t('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow, u.navigate(o, !1)), u._hasPushState ? t(window).on("popstate", u.checkUrl) : u._wantsHashChange && "onhashchange"in window && !f ? t(window).on("hashchange", u.checkUrl) : u._wantsHashChange && (u._checkUrlInterval = setInterval(u.checkUrl, u.interval)), u.fragment = o;
        var l = u.location, c = l.pathname.replace(/[^\/]$/, "$&/") === u.root;
        if (u._wantsHashChange && u._wantsPushState) {
            if (!u._hasPushState && !c)return u.fragment = u.getFragment(null, !0), u.location.replace(u.root + u.location.search + "#" + u.fragment), !0;
            u._hasPushState && c && l.hash && (this.fragment = u.getHash().replace(n, ""), this.history.replaceState({}, document.title, u.root + u.fragment + l.search))
        }
        if (!u.options.silent)return u.loadUrl()
    }, u.deactivate = function () {
        t(window).off("popstate", u.checkUrl).off("hashchange", u.checkUrl), clearInterval(u._checkUrlInterval), u.active = !1
    }, u.checkUrl = function () {
        var e = u.getFragment();
        e === u.fragment && u.iframe && (e = u.getFragment(u.getHash(u.iframe)));
        if (e === u.fragment)return!1;
        u.iframe && u.navigate(e, !1), u.loadUrl()
    }, u.loadUrl = function (e) {
        var t = u.fragment = u.getFragment(e);
        return u.options.routeHandler ? u.options.routeHandler(t) : !1
    }, u.navigate = function (t, n) {
        if (!u.active)return!1;
        n === undefined ? n = {trigger: !0} : e.isBoolean(n) && (n = {trigger: n}), t = u.getFragment(t || "");
        if (u.fragment === t)return;
        u.fragment = t;
        var r = u.root + t;
        if (u._hasPushState)u.history[n.replace ? "replaceState" : "pushState"]({}, document.title, r); else {
            if (!u._wantsHashChange)return u.location.assign(r);
            o(u.location, t, n.replace), u.iframe && t !== u.getFragment(u.getHash(u.iframe)) && (n.replace || u.iframe.document.open().close(), o(u.iframe.location, t, n.replace))
        }
        if (n.trigger)return u.loadUrl(t)
    }, u.navigateBack = function () {
        u.history.back()
    }, u
}), define("plugins/router", ["durandal/system", "durandal/app", "durandal/activator", "durandal/events", "durandal/composition", "plugins/history", "knockout", "jquery"], function (e, t, n, r, i, s, o, u) {
    function v(e) {
        return e = e.replace(c, "\\$&").replace(a, "(?:$1)?").replace(f,function (e, t) {
            return t ? e : "([^/]+)"
        }).replace(l, "(.*?)"), new RegExp("^" + e + "$")
    }

    function m(e) {
        var t = e.indexOf(":"), n = t > 0 ? t - 1 : e.length;
        return e.substring(0, n)
    }

    function g(e) {
        return e.router && e.router.loadUrl
    }

    function y(e, t) {
        return e.indexOf(t, e.length - t.length) !== -1
    }

    function b(e, t) {
        if (!e || !t)return!1;
        if (e.length != t.length)return!1;
        for (var n = 0, r = e.length; n < r; n++)if (e[n] != t[n])return!1;
        return!0
    }

    var a = /\((.*?)\)/g, f = /(\(\?)?:\w+/g, l = /\*\w+/g, c = /[\-{}\[\]+?.,\\\^$|#\s]/g, h, p, d = /\/$/, w = function () {
        function E(t, n) {
            e.log("Navigation Complete", t, n);
            var r = e.getModuleId(a);
            r && c.trigger("router:navigation:from:" + r), a = t, f = n;
            var i = e.getModuleId(a);
            i && c.trigger("router:navigation:to:" + i), g(t) || c.updateDocumentTitle(t, n), p.explicitNavigation = !1, p.navigatingBack = !1, c.trigger("router:navigation:complete", t, n, c)
        }

        function S(t, n) {
            e.log("Navigation Cancelled"), c.activeInstruction(f), f && c.navigate(f.fragment, !1), u(!1), p.explicitNavigation = !1, p.navigatingBack = !1, c.trigger("router:navigation:cancelled", t, n, c)
        }

        function x(t) {
            e.log("Navigation Redirecting"), u(!1), p.explicitNavigation = !1, p.navigatingBack = !1, c.navigate(t, {trigger: !0, replace: !0})
        }

        function T(e, t, n) {
            p.navigatingBack = !p.explicitNavigation && a != n.fragment, c.trigger("router:route:activating", t, n, c), e.activateItem(t, n.params).then(function (r) {
                if (r) {
                    var i = a;
                    E(t, n), g(t) && A({router: t.router, fragment: n.fragment, queryString: n.queryString}), i == t && c.attached()
                } else e.settings.lifecycleData && e.settings.lifecycleData.redirect ? x(e.settings.lifecycleData.redirect) : S(t, n);
                h && (h.resolve(), h = null)
            })
        }

        function N(t, n, r) {
            var i = c.guardRoute(n, r);
            i ? i.then ? i.then(function (i) {
                i ? e.isString(i) ? x(i) : T(t, n, r) : S(n, r)
            }) : e.isString(i) ? x(i) : T(t, n, r) : S(n, r)
        }

        function C(e, t, n) {
            c.guardRoute ? N(e, t, n) : T(e, t, n)
        }

        function k(e) {
            return f && f.config.moduleId == e.config.moduleId && a && (a.canReuseForRoute && a.canReuseForRoute.apply(a, e.params) || a.router && a.router.loadUrl)
        }

        function L() {
            if (u())return;
            var t = i.shift();
            i = [];
            if (!t)return;
            if (t.router) {
                var r = t.fragment;
                t.queryString && (r += "?" + t.queryString), t.router.loadUrl(r);
                return
            }
            u(!0), c.activeInstruction(t), k(t) ? C(n.create(), a, t) : e.acquire(t.config.moduleId).then(function (n) {
                var r = e.resolveObject(n);
                C(l, r, t)
            }).fail(function (n) {
                e.error("Failed to load routed module (" + t.config.moduleId + "). Details: " + n.message)
            })
        }

        function A(e) {
            i.unshift(e), L()
        }

        function O(e, t, n) {
            var r = e.exec(t).slice(1);
            for (var i = 0; i < r.length; i++) {
                var s = r[i];
                r[i] = s ? decodeURIComponent(s) : null
            }
            var o = c.parseQueryString(n);
            return o && r.push(o), {params: r, queryParams: o}
        }

        function M(t) {
            c.trigger("router:route:before-config", t, c), e.isRegExp(t) ? t.routePattern = t.route : (t.title = t.title || c.convertRouteToTitle(t.route), t.moduleId = t.moduleId || c.convertRouteToModuleId(t.route), t.hash = t.hash || c.convertRouteToHash(t.route), t.routePattern = v(t.route)), c.trigger("router:route:after-config", t, c), c.routes.push(t), c.route(t.routePattern, function (e, n) {
                var r = O(t.routePattern, e, n);
                A({fragment: e, queryString: n, config: t, params: r.params, queryParams: r.queryParams})
            })
        }

        function _(t) {
            if (e.isArray(t.route))for (var n = 0, r = t.route.length; n < r; n++) {
                var i = e.extend({}, t);
                i.route = t.route[n], n > 0 && delete i.nav, M(i)
            } else M(t);
            return c
        }

        function D(e) {
            if (e.isActive)return;
            e.isActive = o.computed(function () {
                var t = l();
                return t && t.__moduleId__ == e.moduleId
            })
        }

        var i = [], u = o.observable(!1), a, f, l = n.create(), c = {handlers: [], routes: [], navigationModel: o.observableArray([]), activeItem: l, isNavigating: o.computed(function () {
            var e = l(), t = u(), n = e && e.router && e.router != c && e.router.isNavigating() ? !0 : !1;
            return t || n
        }), activeInstruction: o.observable(null), __router__: !0};
        return r.includeIn(c), l.settings.areSameItem = function (e, t, n, r) {
            return e == t ? b(n, r) : !1
        }, c.parseQueryString = function (e) {
            var t, n;
            if (!e)return null;
            n = e.split("&");
            if (n.length == 0)return null;
            t = {};
            for (var r = 0; r < n.length; r++) {
                var i = n[r];
                if (i === "")continue;
                var s = i.split("=");
                t[s[0]] = s[1] && decodeURIComponent(s[1].replace(/\+/g, " "))
            }
            return t
        }, c.route = function (e, t) {
            c.handlers.push({routePattern: e, callback: t})
        }, c.loadUrl = function (t) {
            var n = c.handlers, r = null, i = t, o = t.indexOf("?");
            o != -1 && (i = t.substring(0, o), r = t.substr(o + 1));
            if (c.relativeToParentRouter) {
                var u = this.parent.activeInstruction();
                i = u.params.join("/"), i && i[0] == "/" && (i = i.substr(1)), i || (i = ""), i = i.replace("//", "/").replace("//", "/")
            }
            i = i.replace(d, "");
            for (var a = 0; a < n.length; a++) {
                var l = n[a];
                if (l.routePattern.test(i))return l.callback(i, r), !0
            }
            return e.log("Route Not Found"), c.trigger("router:route:not-found", t, c), f && s.navigate(f.fragment, {trigger: !1, replace: !0}), p.explicitNavigation = !1, p.navigatingBack = !1, !1
        }, c.updateDocumentTitle = function (e, n) {
            n.config.title ? t.title ? document.title = n.config.title + " | " + t.title : document.title = n.config.title : t.title && (document.title = t.title)
        }, c.navigate = function (e, t) {
            return e && e.indexOf("://") != -1 ? (window.location.href = e, !0) : (p.explicitNavigation = !0, s.navigate(e, t))
        }, c.navigateBack = function () {
            s.navigateBack()
        }, c.attached = function () {
            setTimeout(function () {
                u(!1), c.trigger("router:navigation:attached", a, f, c), L()
            }, 10)
        }, c.compositionComplete = function () {
            c.trigger("router:navigation:composition-complete", a, f, c)
        }, c.convertRouteToHash = function (e) {
            if (c.relativeToParentRouter) {
                var t = c.parent.activeInstruction(), n = t.config.hash + "/" + e;
                return s._hasPushState && (n = "/" + n), n = n.replace("//", "/").replace("//", "/"), n
            }
            return s._hasPushState ? e : "#" + e
        }, c.convertRouteToModuleId = function (e) {
            return m(e)
        }, c.convertRouteToTitle = function (e) {
            var t = m(e);
            return t.substring(0, 1).toUpperCase() + t.substring(1)
        }, c.map = function (t, n) {
            if (e.isArray(t)) {
                for (var r = 0; r < t.length; r++)c.map(t[r]);
                return c
            }
            return e.isString(t) || e.isRegExp(t) ? (n ? e.isString(n) && (n = {moduleId: n}) : n = {}, n.route = t) : n = t, _(n)
        }, c.buildNavigationModel = function (t) {
            var n = [], r = c.routes;
            t = t || 100;
            for (var i = 0; i < r.length; i++) {
                var s = r[i];
                s.nav && (e.isNumber(s.nav) || (s.nav = t), D(s), n.push(s))
            }
            return n.sort(function (e, t) {
                return e.nav - t.nav
            }), c.navigationModel(n), c
        }, c.mapUnknownRoutes = function (t, n) {
            var r = "*catchall", i = v(r);
            return c.route(i, function (o, u) {
                var a = O(i, o, u), f = {fragment: o, queryString: u, config: {route: r, routePattern: i}, params: a.params, queryParams: a.queryParams};
                if (!t)f.config.moduleId = o; else if (e.isString(t))f.config.moduleId = t, n && s.navigate(n, {trigger: !1, replace: !0}); else if (e.isFunction(t)) {
                    var l = t(f);
                    if (l && l.then) {
                        l.then(function () {
                            c.trigger("router:route:before-config", f.config, c), c.trigger("router:route:after-config", f.config, c), A(f)
                        });
                        return
                    }
                } else f.config = t, f.config.route = r, f.config.routePattern = i;
                c.trigger("router:route:before-config", f.config, c), c.trigger("router:route:after-config", f.config, c), A(f)
            }), c
        }, c.reset = function () {
            return f = a = undefined, c.handlers = [], c.routes = [], c.off(), delete c.options, c
        }, c.makeRelative = function (t) {
            return e.isString(t) && (t = {moduleId: t, route: t}), t.moduleId && !y(t.moduleId, "/") && (t.moduleId += "/"), t.route && !y(t.route, "/") && (t.route += "/"), t.fromParent && (c.relativeToParentRouter = !0), c.on("router:route:before-config").then(function (e) {
                t.moduleId && (e.moduleId = t.moduleId + e.moduleId), t.route && (e.route === "" ? e.route = t.route.substring(0, t.route.length - 1) : e.route = t.route + e.route)
            }), c
        }, c.createChildRouter = function () {
            var e = w();
            return e.parent = c, e
        }, c
    };
    return p = w(), p.explicitNavigation = !1, p.navigatingBack = !1, p.activate = function (t) {
        return e.defer(function (n) {
            h = n, p.options = e.extend({routeHandler: p.loadUrl}, p.options, t), s.activate(p.options);
            if (s._hasPushState) {
                var r = p.routes, i = r.length;
                while (i--) {
                    var o = r[i];
                    o.hash = o.hash.replace("#", "")
                }
            }
            u(document).delegate("a", "click", function (e) {
                p.explicitNavigation = !0;
                if (s._hasPushState && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                    var t = u(this).attr("href"), n = this.protocol + "//";
                    if (!t || t.charAt(0) !== "#" && t.slice(n.length) !== n)e.preventDefault(), s.navigate(t)
                }
            })
        }).promise()
    }, p.deactivate = function () {
        s.deactivate()
    }, p.install = function () {
        o.bindingHandlers.router = {init: function () {
            return{controlsDescendantBindings: !0}
        }, update: function (e, t, n, r, s) {
            var u = o.utils.unwrapObservable(t()) || {};
            if (u.__router__)u = {model: u.activeItem(), attached: u.attached, compositionComplete: u.compositionComplete, activate: !1}; else {
                var a = o.utils.unwrapObservable(u.router || r.router) || p;
                u.model = a.activeItem(), u.attached = a.attached, u.compositionComplete = a.compositionComplete, u.activate = !1
            }
            i.compose(e, u, s)
        }}, o.virtualElements.allowedBindings.router = !0
    }, p
}), define("viewmodels/shell", ["plugins/router", "durandal/app"], function (e, t) {
    return{router: e, activate: function () {
        return e.map([
            {route: "", title: "Todo", moduleId: "viewmodels/todo", nav: !1},
            {route: "todo(/:showMode)", title: "Todos", moduleId: "viewmodels/todo", hash: "#todo", nav: !0},
            {route: "personal(/:subType)(/:showMode)", title: "Personal", moduleId: "viewmodels/personal", hash: "#personal", nav: !0},
            {route: "work(/:subType)(/:showMode)", title: "Work", moduleId: "viewmodels/work", hash: "#work", nav: !0}
        ]).buildNavigationModel(), e.activate()
    }}
}), define("app/todo", [], function () {
    function e(e, t) {
        this.title = ko.observable(e), this.completed = ko.observable(t), this.editing = ko.observable(!1)
    }

    return e
}), define("ot/model", ["ot/ot"], function (e) {
    function t(t, n, r, i) {
        var s = this;
        this.apiRoute = t || "", this.observe = n, this.subscribeCallback = i, this.isList = r, this.get = function (n, r) {
            var i = e.DataService.get(n);
            return s.observe ? s.isList ? s.mapToObservableList(i) : s.mapToObservables(i) : i
        }, this.post = function (n, r) {
            return e.DataService.post(n, r)
        }, this.put = function (n, r) {
            return e.DataService.put(n, r)
        }, this.mapToObservableList = function (e) {
            var t = ko.observableArray([]);
            return _.map(e, function (e) {
                t.push(s.mapToObservables(e))
            }), t
        }, this.mapToObservables = function (e) {
            var t = {};
            for (var r in e)n ? (t[r] = ko.observable(e[r]), i && t[r].subscribe(new Function("newValue", "self.model.subscribeCallback('" + r + "',newValue);"))) : t[r] = e[r];
            return t
        }
    }

    return t
}), define("viewmodels/todo", ["app/todo", "ot/model", "ot/ot"], function (e, t, n) {
    function r() {
    }

    var i = r.prototype;
    return i.showModes = {active: !0, completed: !0, all: !0}, i.baseName = "todos", i.baseRoute = "todo", i.model = new t, i.currentToDo = ko.observable(), i.currentRoute = ko.observable(""), i.currentRoute.subscribe(function (e) {
        i.getTodos()
    }), i.newSubList = ko.observable(), i.showMode = ko.observable("all"), i.name = ko.observable(i.baseName), i.todos = ko.observableArray([]), i.subLists = ko.observableArray([]), i.subList = ko.observable(), i.subLists.subscribe(function (e) {
        e && e.length > 0 && i.model.put(i.name() + "/subLists", ko.toJSON(i.subLists))
    }), i.setSubLists = function (e) {
        i.getSubLists(function (t) {
            t || i.subLists(ko.utils.arrayMap(e || [], function (e) {
                return e
            }))
        })
    }, i.getSubLists = function (e) {
        var t = i.model.get(i.name() + "/subLists");
        i.subLists(ko.utils.arrayMap(t || [], function (e) {
            return e
        })), e && (t && t.length > 0 ? e(!0) : e(!1))
    }, i.getTodos = function () {
        i.todos(ko.utils.arrayMap(i.model.get(i.currentRoute()) || [], function (t) {
            return new e(t.title, t.completed)
        }))
    }, i.activate = function (e) {
        i.currentRoute(i.baseRoute), i.name(i.baseName), i.subLists = ko.observableArray([]), e && i.showMode(e)
    }, i.activateChild = function (e, t, n, r) {
        e && i.name(e), n && i.currentRoute(n + (r ? "/" + r : "")), r ? i.subList(r) : i.subList(""), t ? i.showMode(t) : i.showMode("all")
    }, i.filteredTodos = ko.computed(function () {
        switch (i.showMode()) {
            case"active":
                return i.todos().filter(function (e) {
                    return!e.completed()
                });
            case"completed":
                return i.todos().filter(function (e) {
                    return e.completed()
                });
            default:
                return i.todos()
        }
    }), i.addSubList = function () {
        var e = i.newSubList().trim();
        e.length > 0 && (i.subLists.push(e), i.newSubList(""))
    }, i.add = function () {
        i.currentToDo(i.currentToDo().trim()), i.currentToDo().length > 0 && (i.todos.push(new e(i.currentToDo(), !1)), i.currentToDo(""))
    }, i.remove = function (e) {
        i.todos.remove(e)
    }, i.removeCompleted = function () {
        i.todos.remove(function (e) {
            return e.completed()
        })
    }, i.editItem = function (e) {
        e.editing(!0)
    }, i.stopEditing = function (e) {
        e.editing(!1), e.title().trim() || i.remove(e)
    }, i.completedCount = ko.computed(function () {
        return ko.utils.arrayFilter(i.todos(),function (e) {
            return e.completed()
        }).length
    }), i.remainingCount = ko.computed(function () {
        return i.todos().length - i.completedCount()
    }), i.allCompleted = ko.computed({read: function () {
        return!i.remainingCount()
    }, write: function (e) {
        ko.utils.arrayForEach(i.todos(), function (t) {
            t.completed(e)
        })
    }}), ko.computed(function () {
        i.todos().length > 0 && i.model.put(i.currentRoute(), ko.toJSON(i.todos))
    }).extend({throttle: 1e3}), r
}), define("viewmodels/personal", ["viewmodels/todo", "ot/model", "app/todo"], function (e, t, n) {
    function r() {
    }

    return r.inherits(e), r.prototype.name("personal"), r.prototype.activate = function (e, t) {
        var n, r, i;
        i = ["grocery", "clean", "organize", "outdoor"], this.base.showModes[e] ? n = e : r = e, t && this.base.showModes[t] && (n = t), this.base.activateChild("personal", n, "personal", r), this.base.setSubLists(i)
    }, r
}), define("viewmodels/work", ["viewmodels/todo", "ot/model", "app/todo"], function (e, t, n) {
    function r() {
    }

    return r.inherits(e), r.prototype.activate = function (e, t) {
        var n, r;
        this.base.showModes[e] ? n = e : r = e, t && this.base.showModes[t] && (n = t), this.base.activateChild("work", n, "work", r), this.base.setSubLists(["pomodoro"])
    }, r
}), define("text", {load: function (e) {
    throw new Error("Dynamic load not allowed: " + e)
}}), define("text!views/shell.html", [], function () {
    return'\n<div>\n  <nav role="navigation" class="navbar navbar-default col-md-12">\n    <div class="navbar-header">\n      <button type="button" data-toggle="collapse" data-target=".navbar-collapse" class="navbar-toggle"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a data-bind="attr: { href: router.navigationModel()[0].hash }" class="navbar-brand">Todo Durandal</a>\n      <button type="button" style="cursor: pointer;" data-bind="click: function(){location.reload();}" class="navbar-toggle refreshButton"><i class="glyphicon glyphicon-refresh visible-xs refresh pull-left"></i></button>\n    </div>\n    <nav role="navigation" style="height: auto;" class="collapse navbar-collapse navbar-collapse">\n      <ul data-bind="foreach: router.navigationModel" class="nav navbar-nav">\n        <li data-bind="css: { active: isActive }" data-toggle="collapse" data-target=".navbar-collapse"><a data-bind="attr: { href: hash }, html: title"></a></li>\n      </ul>\n      <div data-bind="visible: router.isNavigating" class="loader pull-right"><span class="label label-info">.....</span></div>\n    </nav>\n  </nav>\n  <div data-bind="router: { cacheViews:true }" class="page-host"></div>\n</div>'
}), define("text!views/todo.html", [], function () {
    return'\n<header id="todoHeader" class="col-md-12">\n  <div data-bind="visible: subLists().length&gt;0" class="row todoHeaderRow">\n    <ul data-bind="foreach: subLists, visible: subLists().length&gt;0" class="nav nav-pills navbar-inverse collapse sublists-collapse in">\n      <li data-bind="css: { active: $data == $parent.subList() }"><a data-bind="attr: { href: \'#\' + $parent.name()  + \'/\' + $data  }, html: $data"></a></li>\n    </ul>\n    <div class="collapse in addlist-collapse col-xs-12 visible-xs form-horizontal">\n      <input type="text" data-bind="value: newSubList, valueUpdate: \'afterkeydown\', enterKey: addSubList" class="col-xs-10"/>\n      <div data-bind="click: addSubList" style="margin-left:5px;" class="btn btn-sm btn-success"><i class="glyphicon glyphicon-save"></i></div>\n    </div>\n    <div class="hidden-xs form-horizontal">\n      <input type="text" placeholder="Add Custom List" data-bind="value: newSubList, valueUpdate: \'afterkeydown\', enterKey: addSubList" class="input-sm customListInput"/><a data-bind="click: addSubList" title="Add Custom List" class="btn btn-sm btn-success"><i class="glyphicon glyphicon-save"></i></a>\n    </div>\n  </div>\n  <h1 data-bind="text: name,visible: subLists().length===0"></h1>\n</header>\n<div id="todoappWrapper" class="todoappWrapper">\n  <div class="currentToDoHeader"></div>\n  <div class="currentToDo">\n    <div id="currentToDo" class="col-md-12">\n      <input id="toggle-all" data-bind="checked: allCompleted" type="checkbox"/>\n      <label for="toggle-all">Mark all as complete</label>\n      <input id="new-todo" data-bind="value: currentToDo, valueUpdate: \'afterkeydown\', enterKey: add" placeholder="What needs to be done?" autofocus="" class="col-md-11 col-md-offset-2"/>\n    </div>\n  </div>\n  <div id="todoapp">\n    <ul id="todo-list" data-bind="foreach: filteredTodos">\n      <li data-bind="css: { completed: completed, editing: editing }">\n        <input data-bind="checked: completed" type="checkbox" class="toggle"/>\n        <label data-bind="text: title, event: { dblclick: $root.editItem }"></label>\n        <button data-bind="click: $root.remove" class="destroy btn btn-danger pull-right"></button>\n        <input data-bind="value: title, valueUpdate: &quot;afterkeydown&quot;, enterKey: $root.stopEditing, selectAndFocus: editing, event: { blur: $root.stopEditing }" class="edit"/>\n      </li>\n    </ul>\n  </div>\n  <div id="footer" data-bind="visible: completedCount() || remainingCount()" class="col-md-12 col-lg-12">\n    <div class="footer-inner"><span id="todo-count" class="col-md-2 col-xs-3"><strong data-bind="text: remainingCount">1</strong><span> left</span></span><span class="col-md-8 col-xs-7">\n        <ul id="filters">\n          <li><a data-bind="css: { selected: showMode() === \'all\' }, attr: { href: \'#\' +currentRoute() + \'/all\' }" class="selected">All</a></li>\n          <li><a data-bind="css: { selected: showMode() === \'active\' }, attr: { href: \'#\' + currentRoute()+ \'/active\' }">Active</a></li>\n          <li><a data-bind="css: { selected: showMode() === \'completed\' }, attr: { href:  \'#\' + currentRoute() + \'/completed\' }">Completed</a></li>\n        </ul></span>\n      <button data-bind="visible: completedCount, click: removeCompleted" class="pull-right visible-xs">(<span data-bind="text: completedCount">0</span>)</button>\n      <button data-bind="visible: completedCount, click: removeCompleted" class="pull-right hidden-xs">Clear completed (<span data-bind="text: completedCount">0</span>)</button>\n    </div>\n  </div>\n</div>'
}), define("text!views/work.html", [], function () {
    return"\n<div data-bind=\"compose: 'todo.html'\"></div>"
}), define("text!views/personal.html", [], function () {
    return"\n<div data-bind=\"compose: 'todo.html'\"></div>"
}), require.config({baseUrl: "./assets/javascripts/", paths: {text: "lib/require/text", viewmodels: "app/viewmodels", durandal: "lib/durandal/js", plugins: "lib/durandal/js/plugins", transitions: "lib/durandal/js/transitions"}}), define("knockout", function () {
    return window.ko
}), define("jquery", function () {
    return window.$
}), require(["durandal/app", "durandal/viewLocator", "durandal/system", "ot/localStorage", "ot/ot", "viewmodels/shell", "viewmodels/personal", "viewmodels/work", "text!views/shell.html", "text!views/todo.html", "text!views/work.html", "text!views/personal.html"], function (e, t, n, r, i) {
    i.DataService = new r, e.title = "Todo Durandal", e.configurePlugins({router: !0}), e.start().then(function () {
        t.useConvention(), e.setRoot("viewmodels/shell")
    })
}), define("main", function () {
});
