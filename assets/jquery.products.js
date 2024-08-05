/**
 * Module to show Recently Viewed Products
 *
 * Copyright (c) 2014 Caroline Schnapp (11heavens.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
 Shopify.Products = function() {
    var e = {
        howManyToShow: 3,
        howManyToStoreInMemory: 10,
        wrapperId: "recently-viewed-products",
        templateId: "recently-viewed-product-template",
        onComplete: null
    };
    var t = [];
    var n = null;
    var r = null;
    var i = 0;
    var s = {
        configuration: {
            expires: 90,
            path: "/",
            domain: window.location.hostname
        },
        name: "shopify_recently_viewed",
        write: function(e) {
            jQuery.cookie(this.name, e.join(" "), this.configuration)
        },
        read: function() {
            var e = [];
            var t = jQuery.cookie(this.name);
            if (t !== null && t != undefined) {
                e = t.split(" ")
            }
            return e
        },
        destroy: function() {
            jQuery.cookie(this.name, null, this.configuration)
        },
        remove: function(e) {
            var t = this.read();
            var n = jQuery.inArray(e, t);
            if (n !== -1) {
                t.splice(n, 1);
                this.write(t)
            }
        }
    };
    var o = function() {
        n.show();
        if (e.onComplete) {
            try {
                e.onComplete()
            } catch (t) {}
        }
    };
    var u = function() {
        if (t.length && i < e.howManyToShow) {
            jQuery.ajax({
                dataType: "json",
                url: "/products/" + t[0] + ".js",
                cache: false,
                success: function(e) {
                    r.tmpl(e).appendTo(n);
                    t.shift();
                    i++;
                    u()
                },
                error: function() {
                    s.remove(t[0]);
                    t.shift();
                    u()
                }
            })
        } else {
            o()
        }
    };
    return {
        resizeImage: function(e, t) {
            if (t == null) {
                return e
            }
            if (t == "master") {
                return e.replace(/http(s)?:/, "")
            }
            var n = e.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?/i);
            if (n != null && n != undefined) {
                var r = e.split(n[0]);
                var i = n[0];
                return (r[0] + "_" + t + i).replace(/http(s)?:/, "")
            } else {
                return null
            }
        },
        showRecentlyViewed: function(i) {
            var i = i || {};
            jQuery.extend(e, i);
            t = s.read();
            r = jQuery("#" + e.templateId);
            n = jQuery("#" + e.wrapperId);
            e.howManyToShow = Math.min(t.length, e.howManyToShow);
            if (e.howManyToShow && r.length && n.length) {
                u()
            }
        },
        getConfig: function() {
            return e
        },
        clearList: function() {
            s.destroy()
        },
        recordRecentlyViewed: function(t) {
            var t = t || {};
            jQuery.extend(e, t);
            var n = s.read();
            if (window.location.pathname.indexOf("/products/") !== -1) {
                var r = window.location.pathname.match(/\/products\/([a-z0-9\-]+)/)[1];
                var i = jQuery.inArray(r, n);
                if (i === -1) {
                    n.unshift(r);
                    n = n.splice(0, e.howManyToStoreInMemory)
                } else {
                    n.splice(i, 1);
                    n.unshift(r)
                }
                s.write(n)
            }
        }
    }
}()