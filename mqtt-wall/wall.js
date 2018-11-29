(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WallClient = exports.WallClient = function () {
    function WallClient(uri, username, password) {
        var _this = this;

        var qos = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        _classCallCheck(this, WallClient);

        this.username = username;
        this.password = password;
        this.qos = qos;
        this.clientId = WallClient.generateClientId();

        // paho documentation: http://www.eclipse.org/paho/files/jsdoc/index.html
        this.client = new Paho.MQTT.Client(uri, this.clientId);

        this.client.onMessageArrived = function (message) {

            var payload = void 0,
                binary = void 0;

            try {
                payload = message.payloadString;
            } catch (e) {
                payload = message.payloadBytes;
                binary = true;
            }

            //console.log("Message arrived ", message.destinationName);
            _this.onMessage(message.destinationName, payload, message.retained, message.qos, binary);
        };

        this.client.onConnectionLost = function (error) {
            console.info("Connection lost ", error);

            if (WallClient.isNetworkError(error.errorCode)) {
                _this._reconnect();
                return;
            }

            _this.onError("Connection lost (" + error.errorMessage + ")", true);
        };

        this.currentTopic = null;

        this.onConnected = $.noop();
        this.onMessage = $.noop();
        this.onError = $.noop();
        this.onStateChanged = $.noop();

        this.firstConnection = true;
        this.attempts = 0;
        this._setState(WallClient.STATE.NEW);
    }

    _createClass(WallClient, [{
        key: "subscribe",
        value: function subscribe(topic, fn) {
            var _this2 = this;

            // unsubscribe current topic (if exists)
            if (this.currentTopic !== null && this.currentTopic !== topic) {
                var oldTopic = this.currentTopic;
                this.client.unsubscribe(oldTopic, {
                    onSuccess: function onSuccess() {
                        console.info("Unsubscribe '%s' success", oldTopic);
                    },
                    onFailure: function onFailure(error) {
                        console.error("Unsubscribe '%s' failure", oldTopic, error);
                    }
                });
            }

            // subscribe new topic
            this.client.subscribe(topic, {
                qos: this.qos,
                onSuccess: function onSuccess(r) {
                    console.info("Subscribe '%s' success", topic, r);
                    if (fn) {
                        fn();
                    }
                },
                onFailure: function onFailure(r) {
                    console.error("subscribe '%s' failure", topic, r);
                    _this2.onError("Subscribe failure");
                }
            });

            this.currentTopic = topic;
        }
    }, {
        key: "connect",
        value: function connect() {
            var _this3 = this;

            var connectOptions = {

                onSuccess: function onSuccess() {
                    console.info("Connect success");

                    _this3.attempts = 0;
                    _this3._setState(WallClient.STATE.CONNECTED);

                    if (_this3.firstConnection) {
                        _this3.firstConnection = false;
                        _this3.onConnected();
                    } else {
                        _this3.subscribe(_this3.currentTopic);
                    }
                },

                onFailure: function onFailure(error) {
                    console.error("Connect fail ", error);

                    if (WallClient.isNetworkError(error.errorCode)) {
                        _this3._reconnect();
                        return;
                    }

                    _this3.onError("Fail to connect", true);
                }
            };

            if (this.username && this.password) {
                connectOptions.userName = this.username;
                connectOptions.password = this.password;
            }

            this._setState(this.firstConnection ? WallClient.STATE.CONNECTING : WallClient.STATE.RECONNECTING);

            this.client.connect(connectOptions);
        }
    }, {
        key: "_reconnect",
        value: function _reconnect() {
            var _this4 = this;

            this.attempts++;
            this._setState(this.firstConnection ? WallClient.STATE.CONNECTING : WallClient.STATE.RECONNECTING);

            var t = (this.attempts - 1) * 2000;
            t = Math.max(Math.min(t, 30000), 100);

            setTimeout(function () {
                _this4.connect();
            }, t);
        }
    }, {
        key: "_setState",
        value: function _setState(state) {
            this.state = state;

            if (this.onStateChanged) this.onStateChanged(state);
        }
    }, {
        key: "toString",
        value: function toString() {
            // _getURI is undocumented function (it is URI used for underlying WebSocket connection)
            // see https://github.com/eclipse/paho.mqtt.javascript/blob/master/src/mqttws31.js#L1622
            return this.client._getURI();
        }
    }], [{
        key: "generateClientId",
        value: function generateClientId() {
            var time = Date.now() % 1000;
            var rnd = Math.round(Math.random() * 1000);
            return "wall" + (time * 1000 + rnd);
        }
    }, {
        key: "isNetworkError",
        value: function isNetworkError(code) {
            // possible codes: https://github.com/eclipse/paho.mqtt.javascript/blob/master/src/mqttws31.js#L166
            var networkErrors = [1 /* CONNECT_TIMEOUT */
            , 2 /* SUBSCRIBE_TIMEOUT */
            , 3 /* UNSUBSCRIBE_TIMEOUT */
            , 4 /* PING_TIMEOUT */
            , 6 /* CONNACK_RETURNCODE */
            , 7 /* SOCKET_ERROR */
            , 8 /* SOCKET_CLOSE */
            , 9 /* MALFORMED_UTF */
            , 11 /* INVALID_STATE */
            , 12 /* INVALID_TYPE */
            , 15 /* INVALID_STORED_DATA */
            , 16 /* INVALID_MQTT_MESSAGE_TYPE */
            , 17 /* MALFORMED_UNICODE */
            ];
            return networkErrors.indexOf(code) >= 0;
        }
    }]);

    return WallClient;
}();

WallClient.STATE = {
    NEW: 0,
    CONNECTING: 1,
    CONNECTED: 2,
    RECONNECTING: 3,
    ERROR: 99
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Toolbar = exports.Footer = exports.MessageContainer = exports.MessageLine = exports.UI = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils.js');

var _client = require('./client.js');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UI = exports.UI = {};

UI.setTitle = function (topic) {
    document.title = "MQTT Wall" + (topic ? " for " + topic : "");
};

UI.toast = function (message) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "info";
    var persistent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    return new Toast(message, type, persistent);
};

var Toast = function () {
    function Toast(message) {
        var _this = this;

        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "info";
        var persistent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        _classCallCheck(this, Toast);

        this.$root = $("<div class='toast-item'>").text(message).addClass(type).hide().appendTo("#toast").fadeIn();

        if (persistent) {
            this.$root.addClass("persistent");
        } else {
            setTimeout(function () {
                _this.hide();
            }, 5000);
        }
    }

    _createClass(Toast, [{
        key: 'hide',
        value: function hide() {
            var _this2 = this;

            this.$root.slideUp().queue(function () {
                _this2.remove();
            });
        }
    }, {
        key: 'remove',
        value: function remove() {
            this.$root.remove();
        }
    }, {
        key: 'setMessage',
        value: function setMessage(message) {
            this.$root.text(message);
        }
    }]);

    return Toast;
}();

var MessageLine = exports.MessageLine = function () {
    function MessageLine(topic) {
        _classCallCheck(this, MessageLine);

        this.topic = topic;
        this.counter = 0;
        this.isNew = true;
        this.init();
    }

    _createClass(MessageLine, [{
        key: 'init',
        value: function init() {
            this.$root = $("<article class='message'>");

            var header = $("<header>").appendTo(this.$root);

            $("<h2>").text(this.topic).appendTo(header);

            if (window.config.showCounter) {
                this.$counterMark = $("<span class='mark counter' title='Message counter'>0</span>").appendTo(header);
            }

            this.$retainMark = $("<span class='mark retain' title='Retain message'>R</span>").appendTo(header);

            this.$qosMark = $("<span class='mark qos' title='Received message QoS'>QoS</span>").appendTo(header);

            this.$payload = $("<p>").appendTo(this.$root);
        }
    }, {
        key: 'highlight',
        value: function highlight() {
            var line = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            (line ? this.$root : this.$payload).stop().css({ backgroundColor: "#0CB0FF" }).animate({ backgroundColor: "#fff" }, 2000);
        }
    }, {
        key: 'update',
        value: function update(payload, retained, qos, binary) {
            this.counter++;
            this.isRetained = retained;

            if (this.$counterMark) {
                this.$counterMark.text(this.counter);
            }

            if (this.$qosMark) {
                if (qos == 0) {
                    this.$qosMark.hide();
                } else {
                    this.$qosMark.show();
                    this.$qosMark.text('QoS ' + qos);
                    this.$qosMark.attr("data-qos", qos);
                }
            }

            if (binary) {
                payload = "HEX: " + formatByteArray(payload);
                this.isSystemPayload = true;
            } else {
                if (payload == "") {
                    payload = "NULL";
                    this.isSystemPayload = true;
                } else {
                    this.isSystemPayload = false;
                }
            }

            this.$payload.text(payload);
            this.highlight(this.isNew);

            if (this.isNew) {
                this.isNew = false;
            }
        }
    }, {
        key: 'isRetained',
        set: function set(value) {
            this.$retainMark[value ? 'show' : 'hide']();
        }
    }, {
        key: 'isSystemPayload',
        set: function set(value) {
            this.$payload.toggleClass("sys", value);
        }
    }]);

    return MessageLine;
}();

function formatByteArray(a) {
    var a2 = new Array(a.length);

    for (var i = a.length - 1; i >= 0; i--) {
        a2[i] = (a[i] <= 0x0F ? "0" : "") + a[i].toString(16).toUpperCase();
    }

    return a2.join(" ");
}

var MessageContainer = exports.MessageContainer = function () {
    function MessageContainer($parent) {
        _classCallCheck(this, MessageContainer);

        this.sort = 'Alphabetically';
        this.$parent = $parent;
        this.init();
    }

    _createClass(MessageContainer, [{
        key: 'init',
        value: function init() {
            this.reset();
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.lines = {};
            this.topics = [];
            this.$parent.html("");
        }
    }, {
        key: 'update',
        value: function update(topic, payload, retained, qos, binary) {

            if (!this.lines[topic]) {

                var line = new MessageLine(topic, this.$parent);

                this['addLine' + this.sort](line);
                this.lines[topic] = line;
            }

            this.lines[topic].update(payload, retained, qos, binary);
        }
    }, {
        key: 'addLineAlphabetically',
        value: function addLineAlphabetically(line) {

            if (this.topics.length == 0) {
                this.addLineChronologically(line);
                return;
            }

            var topic = line.topic;

            this.topics.push(topic);
            this.topics.sort();

            var n = this.topics.indexOf(topic);

            if (n == 0) {
                this.$parent.prepend(line.$root);
                return;
            }

            var prev = this.topics[n - 1];
            line.$root.insertAfter(this.lines[prev].$root);
        }
    }, {
        key: 'addLineChronologically',
        value: function addLineChronologically(line) {
            this.topics.push(line.topic);
            this.$parent.append(line.$root);
        }
    }]);

    return MessageContainer;
}();

MessageContainer.SORT_APLHA = "Alphabetically";
MessageContainer.SORT_CHRONO = "Chronologically";

var Footer = exports.Footer = function () {
    function Footer() {
        _classCallCheck(this, Footer);
    }

    _createClass(Footer, [{
        key: 'clientId',
        set: function set(value) {
            $("#status-client").text(value);
        }
    }, {
        key: 'uri',
        set: function set(value) {
            $("#status-host").text(value);
        }
    }, {
        key: 'state',
        set: function set(value) {
            var text = void 0,
                className = void 0;

            switch (value) {
                case _client.WallClient.STATE.NEW:
                    text = "";
                    className = "connecting";
                    break;
                case _client.WallClient.STATE.CONNECTING:
                    text = "connecting...";
                    className = "connecting";
                    break;
                case _client.WallClient.STATE.CONNECTED:
                    text = "connected";
                    className = "connected";
                    break;
                case _client.WallClient.STATE.RECONNECTING:
                    text = "reconnecting...";
                    className = "connecting";
                    break;
                case _client.WallClient.STATE.ERROR:
                    text = "not connected";
                    className = "fail";
                    break;
                default:
                    throw new Error("Unknown WallClient.STATE");
            }

            if (this.reconnectAttempts > 1) {
                text += ' (' + this.reconnectAttempts + ')';
            }

            $("#status-state").removeClass().addClass(className);
            $("#status-state span").text(text);
        }
    }]);

    return Footer;
}();

var Toolbar = exports.Toolbar = function (_EventEmitter) {
    _inherits(Toolbar, _EventEmitter);

    function Toolbar(parent) {
        _classCallCheck(this, Toolbar);

        var _this3 = _possibleConstructorReturn(this, (Toolbar.__proto__ || Object.getPrototypeOf(Toolbar)).call(this));

        _this3.$parent = parent;
        _this3.$topic = parent.find("#topic");

        _this3.initEventHandlers();
        _this3.initDefaultTopic();
        return _this3;
    }

    _createClass(Toolbar, [{
        key: 'initEventHandlers',
        value: function initEventHandlers() {
            var _this4 = this;

            var inhibitor = false;

            this.$topic.keyup(function (e) {
                if (e.which === 13) {
                    // ENTER
                    _this4.$topic.blur();
                }

                if (e.keyCode === 27) {
                    // ESC
                    inhibitor = true;
                    _this4.$topic.blur();
                }
            });

            this.$topic.focus(function (e) {
                inhibitor = false;
            });

            this.$topic.blur(function (e) {
                if (inhibitor) {
                    _this4.updateUi(); // revert changes
                } else {
                    _this4.inputChanged();
                }
            });
        }
    }, {
        key: 'inputChanged',
        value: function inputChanged() {
            var newTopic = this.$topic.val();

            if (newTopic === this._topic) {
                return;
            }

            this._topic = newTopic;
            this.emit("topic", newTopic);
        }
    }, {
        key: 'initDefaultTopic',
        value: function initDefaultTopic() {
            // URL hash 
            if (location.hash !== "") {
                this._topic = location.hash.substr(1);
            } else {
                this._topic = config.defaultTopic || "/#";
            }

            this.updateUi();
        }
    }, {
        key: 'updateUi',
        value: function updateUi() {
            this.$topic.val(this._topic);
        }
    }, {
        key: 'topic',
        get: function get() {
            return this._topic;
        },
        set: function set(value) {
            this._topic = value;
            this.updateUi();
            this.emit("topic", value);
        }
    }]);

    return Toolbar;
}(_utils.EventEmitter);

},{"./client.js":1,"./utils.js":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Simple version of node.js's EventEmiter class
 */
var EventEmitter = exports.EventEmitter = function () {
    function EventEmitter() {
        _classCallCheck(this, EventEmitter);
    }

    _createClass(EventEmitter, [{
        key: 'on',


        /**
         * Add event handler of givent type
         */
        value: function on(type, fn) {
            if (this['_on' + type] === undefined) {
                this['_on' + type] = [];
            }

            this['_on' + type].push(fn);
        }

        /**
         * Emit event of type.
         * 
         * All arguments will be applay to callback, preserve context of object this.
         */

    }, {
        key: 'emit',
        value: function emit(type) {
            var _this = this;

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            if (this['_on' + type]) {
                this['_on' + type].forEach(function (fn) {
                    return fn.apply(_this, args);
                });
            }
        }
    }]);

    return EventEmitter;
}();

},{}],4:[function(require,module,exports){
"use strict";

var _client = require("./client.js");

var _ui = require("./ui.js");

// --- Main -------------------------------------------------------------------

// decode password base64 (if empty leve it)
var password = config.server.password !== undefined ? atob(config.server.password) : undefined;

var client = new _client.WallClient(config.server.uri, config.server.username, password, config.qos);
var messages = new _ui.MessageContainer($("section.messages"));
var footer = new _ui.Footer();
var toolbar = new _ui.Toolbar($("#header"));

messages.sort = config.alphabeticalSort ? _ui.MessageContainer.SORT_APLHA : _ui.MessageContainer.SORT_CHRONO;

footer.clientId = client.clientId;
footer.uri = client.toString();
footer.state = 0;

function load() {
    var topic = toolbar.topic;

    client.subscribe(topic, function () {
        _ui.UI.setTitle(topic);
        location.hash = "#" + topic;
    });

    messages.reset();
}

toolbar.on("topic", function () {
    load();
});

client.onConnected = function () {
    load();
    _ui.UI.toast("Connected to host " + client.toString());
};

client.onError = function (description, isFatal) {
    _ui.UI.toast(description, "error", isFatal);
};

var reconnectingToast = null;

client.onStateChanged = function (state) {
    footer.reconnectAttempts = client.attempts;
    footer.state = state;

    if ((state === _client.WallClient.STATE.CONNECTING || state === _client.WallClient.STATE.RECONNECTING) && client.attempts >= 2) {
        var msg = state === _client.WallClient.STATE.CONNECTING ? "Fail to connect. Trying to connect... (" + client.attempts + " attempts)" : "Connection lost. Trying to reconnect... (" + client.attempts + " attempts)";

        if (reconnectingToast === null) {
            reconnectingToast = _ui.UI.toast(msg, "error", true);
        } else {
            reconnectingToast.setMessage(msg);
        }
    }

    if (state === _client.WallClient.STATE.CONNECTED && reconnectingToast !== null) {
        reconnectingToast.hide();
        reconnectingToast = null;

        if (client.firstConnection == false) {
            _ui.UI.toast("Reconnected");
        }
    }
};

client.onMessage = function (topic, msg, retained, qos, binary) {
    messages.update(topic, msg, retained, qos, binary);
};

client.connect();

},{"./client.js":1,"./ui.js":2}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY2xpZW50LmpzIiwic3JjL2pzL3VpLmpzIiwic3JjL2pzL3V0aWxzLmpzIiwic3JjL2pzL3dhbGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQWEsVSxXQUFBLFU7QUFFVCx3QkFBWSxHQUFaLEVBQWlCLFFBQWpCLEVBQTJCLFFBQTNCLEVBQThDO0FBQUE7O0FBQUEsWUFBVCxHQUFTLHVFQUFILENBQUc7O0FBQUE7O0FBRTFDLGFBQUssUUFBTCxHQUFnQixRQUFoQjtBQUNBLGFBQUssUUFBTCxHQUFnQixRQUFoQjtBQUNBLGFBQUssR0FBTCxHQUFXLEdBQVg7QUFDQSxhQUFLLFFBQUwsR0FBZ0IsV0FBVyxnQkFBWCxFQUFoQjs7QUFFQTtBQUNBLGFBQUssTUFBTCxHQUFjLElBQUksS0FBSyxJQUFMLENBQVUsTUFBZCxDQUFxQixHQUFyQixFQUEwQixLQUFLLFFBQS9CLENBQWQ7O0FBRUEsYUFBSyxNQUFMLENBQVksZ0JBQVosR0FBK0IsVUFBQyxPQUFELEVBQWE7O0FBRXhDLGdCQUFJLGdCQUFKO0FBQUEsZ0JBQWEsZUFBYjs7QUFFQSxnQkFBRztBQUNDLDBCQUFVLFFBQVEsYUFBbEI7QUFDSCxhQUZELENBRUUsT0FBTSxDQUFOLEVBQVM7QUFDUCwwQkFBVSxRQUFRLFlBQWxCO0FBQ0EseUJBQVMsSUFBVDtBQUNIOztBQUVEO0FBQ0Esa0JBQUssU0FBTCxDQUFlLFFBQVEsZUFBdkIsRUFBd0MsT0FBeEMsRUFBaUQsUUFBUSxRQUF6RCxFQUFtRSxRQUFRLEdBQTNFLEVBQWdGLE1BQWhGO0FBQ0gsU0FiRDs7QUFlQSxhQUFLLE1BQUwsQ0FBWSxnQkFBWixHQUErQixVQUFDLEtBQUQsRUFBVztBQUN0QyxvQkFBUSxJQUFSLENBQWEsa0JBQWIsRUFBaUMsS0FBakM7O0FBRUEsZ0JBQUksV0FBVyxjQUFYLENBQTBCLE1BQU0sU0FBaEMsQ0FB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TUFFTztBQUNILDhCQUFrQixVQUFsQixDQUE2QixHQUE3QjtBQUNIO0FBQ0o7O0FBRUQsUUFBSSxVQUFVLG1CQUFXLEtBQVgsQ0FBaUIsU0FBM0IsSUFBd0Msc0JBQXNCLElBQWxFLEVBQXdFO0FBQ3BFLDBCQUFrQixJQUFsQjtBQUNBLDRCQUFvQixJQUFwQjs7QUFFQSxZQUFJLE9BQU8sZUFBUCxJQUEwQixLQUE5QixFQUFxQztBQUNqQyxtQkFBRyxLQUFILENBQVMsYUFBVDtBQUNIO0FBQ0o7QUFDSixDQXhCRDs7QUEwQkEsT0FBTyxTQUFQLEdBQW1CLFVBQUMsS0FBRCxFQUFRLEdBQVIsRUFBYSxRQUFiLEVBQXVCLEdBQXZCLEVBQTRCLE1BQTVCLEVBQXVDO0FBQ3RELGFBQVMsTUFBVCxDQUFnQixLQUFoQixFQUF1QixHQUF2QixFQUE0QixRQUE1QixFQUFzQyxHQUF0QyxFQUEyQyxNQUEzQztBQUNILENBRkQ7O0FBSUEsT0FBTyxPQUFQIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiZXhwb3J0IGNsYXNzIFdhbGxDbGllbnQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHVyaSwgdXNlcm5hbWUsIHBhc3N3b3JkLCBxb3MgPSAwKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy51c2VybmFtZSA9IHVzZXJuYW1lO1xyXG4gICAgICAgIHRoaXMucGFzc3dvcmQgPSBwYXNzd29yZDtcclxuICAgICAgICB0aGlzLnFvcyA9IHFvcztcclxuICAgICAgICB0aGlzLmNsaWVudElkID0gV2FsbENsaWVudC5nZW5lcmF0ZUNsaWVudElkKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gcGFobyBkb2N1bWVudGF0aW9uOiBodHRwOi8vd3d3LmVjbGlwc2Uub3JnL3BhaG8vZmlsZXMvanNkb2MvaW5kZXguaHRtbFxyXG4gICAgICAgIHRoaXMuY2xpZW50ID0gbmV3IFBhaG8uTVFUVC5DbGllbnQodXJpLCB0aGlzLmNsaWVudElkKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNsaWVudC5vbk1lc3NhZ2VBcnJpdmVkID0gKG1lc3NhZ2UpID0+IHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBwYXlsb2FkLCBiaW5hcnk7XHJcblxyXG4gICAgICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgICAgICBwYXlsb2FkID0gbWVzc2FnZS5wYXlsb2FkU3RyaW5nO1xyXG4gICAgICAgICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICAgICAgICAgIHBheWxvYWQgPSBtZXNzYWdlLnBheWxvYWRCeXRlcyBcclxuICAgICAgICAgICAgICAgIGJpbmFyeSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJNZXNzYWdlIGFycml2ZWQgXCIsIG1lc3NhZ2UuZGVzdGluYXRpb25OYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5vbk1lc3NhZ2UobWVzc2FnZS5kZXN0aW5hdGlvbk5hbWUsIHBheWxvYWQsIG1lc3NhZ2UucmV0YWluZWQsIG1lc3NhZ2UucW9zLCBiaW5hcnkpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY2xpZW50Lm9uQ29ubmVjdGlvbkxvc3QgPSAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5pbmZvKFwiQ29ubmVjdGlvbiBsb3N0IFwiLCBlcnJvcik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoV2FsbENsaWVudC5pc05ldHdvcmtFcnJvcihlcnJvci5lcnJvckNvZGUpKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlY29ubmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9uRXJyb3IoYENvbm5lY3Rpb24gbG9zdCAoJHtlcnJvci5lcnJvck1lc3NhZ2V9KWAsIHRydWUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFRvcGljID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5vbkNvbm5lY3RlZCA9ICQubm9vcCgpO1xyXG4gICAgICAgIHRoaXMub25NZXNzYWdlID0gJC5ub29wKCk7XHJcbiAgICAgICAgdGhpcy5vbkVycm9yID0gJC5ub29wKCk7XHJcbiAgICAgICAgdGhpcy5vblN0YXRlQ2hhbmdlZCA9ICQubm9vcCgpO1xyXG5cclxuICAgICAgICB0aGlzLmZpcnN0Q29ubmVjdGlvbiA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5hdHRlbXB0cyA9IDA7XHJcbiAgICAgICAgdGhpcy5fc2V0U3RhdGUoV2FsbENsaWVudC5TVEFURS5ORVcpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZW5lcmF0ZUNsaWVudElkKCkge1xyXG4gICAgICAgIHZhciB0aW1lID0gRGF0ZS5ub3coKSAlIDEwMDA7XHJcbiAgICAgICAgdmFyIHJuZCA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDEwMDApO1xyXG4gICAgICAgIHJldHVybiBgd2FsbCR7dGltZSoxMDAwICsgcm5kfWA7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGlzTmV0d29ya0Vycm9yIChjb2RlKSB7XHJcbiAgICAgICAgLy8gcG9zc2libGUgY29kZXM6IGh0dHBzOi8vZ2l0aHViLmNvbS9lY2xpcHNlL3BhaG8ubXF0dC5qYXZhc2NyaXB0L2Jsb2IvbWFzdGVyL3NyYy9tcXR0d3MzMS5qcyNMMTY2XHJcbiAgICAgICAgY29uc3QgbmV0d29ya0Vycm9ycyA9IFsgXHJcbiAgICAgICAgICAgIDEgLyogQ09OTkVDVF9USU1FT1VUICovLFxyXG4gICAgICAgICAgICAyIC8qIFNVQlNDUklCRV9USU1FT1VUICovLCBcclxuICAgICAgICAgICAgMyAvKiBVTlNVQlNDUklCRV9USU1FT1VUICovLFxyXG4gICAgICAgICAgICA0IC8qIFBJTkdfVElNRU9VVCAqLyxcclxuICAgICAgICAgICAgNiAvKiBDT05OQUNLX1JFVFVSTkNPREUgKi8sXHJcbiAgICAgICAgICAgIDcgLyogU09DS0VUX0VSUk9SICovLFxyXG4gICAgICAgICAgICA4IC8qIFNPQ0tFVF9DTE9TRSAqLyxcclxuICAgICAgICAgICAgOSAvKiBNQUxGT1JNRURfVVRGICovLFxyXG4gICAgICAgICAgICAxMSAvKiBJTlZBTElEX1NUQVRFICovLFxyXG4gICAgICAgICAgICAxMiAvKiBJTlZBTElEX1RZUEUgKi8sXHJcbiAgICAgICAgICAgIDE1IC8qIElOVkFMSURfU1RPUkVEX0RBVEEgKi8sXHJcbiAgICAgICAgICAgIDE2IC8qIElOVkFMSURfTVFUVF9NRVNTQUdFX1RZUEUgKi8sXHJcbiAgICAgICAgICAgIDE3IC8qIE1BTEZPUk1FRF9VTklDT0RFICovLFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgcmV0dXJuIG5ldHdvcmtFcnJvcnMuaW5kZXhPZihjb2RlKSA+PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHN1YnNjcmliZSAodG9waWMsIGZuKSB7XHJcbiAgICBcclxuICAgICAgICAvLyB1bnN1YnNjcmliZSBjdXJyZW50IHRvcGljIChpZiBleGlzdHMpXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRvcGljICE9PSBudWxsICYmIHRoaXMuY3VycmVudFRvcGljICE9PSB0b3BpYykge1xyXG4gICAgICAgICAgICBsZXQgb2xkVG9waWMgPSB0aGlzLmN1cnJlbnRUb3BpYztcclxuICAgICAgICAgICAgdGhpcy5jbGllbnQudW5zdWJzY3JpYmUob2xkVG9waWMsIHtcclxuICAgICAgICAgICAgICAgIG9uU3VjY2VzczogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhcIlVuc3Vic2NyaWJlICclcycgc3VjY2Vzc1wiLCBvbGRUb3BpYyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgb25GYWlsdXJlOiAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiVW5zdWJzY3JpYmUgJyVzJyBmYWlsdXJlXCIsIG9sZFRvcGljLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIC8vIHN1YnNjcmliZSBuZXcgdG9waWNcclxuICAgICAgICB0aGlzLmNsaWVudC5zdWJzY3JpYmUodG9waWMsIHtcclxuICAgICAgICAgICAgcW9zOiB0aGlzLnFvcyxcclxuICAgICAgICAgICAgb25TdWNjZXNzOiAocikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKFwiU3Vic2NyaWJlICclcycgc3VjY2Vzc1wiLCB0b3BpYywgcik7XHJcbiAgICAgICAgICAgICAgICBpZiAoZm4pIHtcclxuICAgICAgICAgICAgICAgICAgICBmbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkZhaWx1cmU6IChyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwic3Vic2NyaWJlICclcycgZmFpbHVyZVwiLCB0b3BpYywgcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uRXJyb3IoXCJTdWJzY3JpYmUgZmFpbHVyZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRUb3BpYyA9IHRvcGljO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbm5lY3QgKCkge1xyXG5cclxuICAgICAgICBsZXQgY29ubmVjdE9wdGlvbnMgPSB7XHJcblxyXG4gICAgICAgICAgICBvblN1Y2Nlc3MgOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmluZm8oXCJDb25uZWN0IHN1Y2Nlc3NcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5hdHRlbXB0cyA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRTdGF0ZShXYWxsQ2xpZW50LlNUQVRFLkNPTk5FQ1RFRCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpcnN0Q29ubmVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RDb25uZWN0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkNvbm5lY3RlZCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmliZSh0aGlzLmN1cnJlbnRUb3BpYyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBvbkZhaWx1cmUgOiAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDb25uZWN0IGZhaWwgXCIsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKFdhbGxDbGllbnQuaXNOZXR3b3JrRXJyb3IoZXJyb3IuZXJyb3JDb2RlKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVjb25uZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uRXJyb3IoXCJGYWlsIHRvIGNvbm5lY3RcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAodGhpcy51c2VybmFtZSAmJiB0aGlzLnBhc3N3b3JkKSB7XHJcbiAgICAgICAgICAgIGNvbm5lY3RPcHRpb25zLnVzZXJOYW1lID0gdGhpcy51c2VybmFtZTtcclxuICAgICAgICAgICAgY29ubmVjdE9wdGlvbnMucGFzc3dvcmQgPSB0aGlzLnBhc3N3b3JkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fc2V0U3RhdGUodGhpcy5maXJzdENvbm5lY3Rpb24gPyBXYWxsQ2xpZW50LlNUQVRFLkNPTk5FQ1RJTkcgOiBXYWxsQ2xpZW50LlNUQVRFLlJFQ09OTkVDVElORylcclxuXHJcbiAgICAgICAgdGhpcy5jbGllbnQuY29ubmVjdChjb25uZWN0T3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgX3JlY29ubmVjdCAoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYXR0ZW1wdHMgKys7XHJcbiAgICAgICAgdGhpcy5fc2V0U3RhdGUodGhpcy5maXJzdENvbm5lY3Rpb24gPyBXYWxsQ2xpZW50LlNUQVRFLkNPTk5FQ1RJTkcgOiBXYWxsQ2xpZW50LlNUQVRFLlJFQ09OTkVDVElORyk7XHJcblxyXG4gICAgICAgIGxldCB0ID0gKHRoaXMuYXR0ZW1wdHMtMSkgKiAyMDAwO1xyXG4gICAgICAgIHQgPSBNYXRoLm1heChNYXRoLm1pbih0LCAzMDAwMCksIDEwMCk7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNvbm5lY3QoKTtcclxuICAgICAgICB9LCB0KTtcclxuICAgIH1cclxuXHJcbiAgICBfc2V0U3RhdGUgKHN0YXRlKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vblN0YXRlQ2hhbmdlZClcclxuICAgICAgICAgICAgdGhpcy5vblN0YXRlQ2hhbmdlZChzdGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcgKCkge1xyXG4gICAgICAgIC8vIF9nZXRVUkkgaXMgdW5kb2N1bWVudGVkIGZ1bmN0aW9uIChpdCBpcyBVUkkgdXNlZCBmb3IgdW5kZXJseWluZyBXZWJTb2NrZXQgY29ubmVjdGlvbilcclxuICAgICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2VjbGlwc2UvcGFoby5tcXR0LmphdmFzY3JpcHQvYmxvYi9tYXN0ZXIvc3JjL21xdHR3czMxLmpzI0wxNjIyXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50Ll9nZXRVUkkoKTtcclxuICAgIH1cclxufVxyXG5cclxuV2FsbENsaWVudC5TVEFURSA9IHtcclxuICAgIE5FVzogMCxcclxuICAgIENPTk5FQ1RJTkc6IDEsXHJcbiAgICBDT05ORUNURUQ6IDIsXHJcbiAgICBSRUNPTk5FQ1RJTkc6IDMsXHJcbiAgICBFUlJPUjogOTlcclxufTtcclxuIiwiaW1wb3J0IHtFdmVudEVtaXR0ZXJ9IGZyb20gJy4vdXRpbHMuanMnO1xyXG5pbXBvcnQge1dhbGxDbGllbnR9IGZyb20gJy4vY2xpZW50LmpzJztcclxuXHJcbmV4cG9ydCB2YXIgVUkgPSB7fTtcclxuXHJcblVJLnNldFRpdGxlID0gZnVuY3Rpb24gKHRvcGljKSB7XHJcbiAgICBkb2N1bWVudC50aXRsZSA9IFwiTVFUVCBXYWxsXCIgKyAodG9waWMgPyAoXCIgZm9yIFwiICsgdG9waWMpIDogXCJcIik7XHJcbn07XHJcbiBcclxuVUkudG9hc3QgPSBmdW5jdGlvbiAobWVzc2FnZSwgdHlwZSA9IFwiaW5mb1wiLCBwZXJzaXN0ZW50ID0gZmFsc2UpIHtcclxuICAgIHJldHVybiBuZXcgVG9hc3QobWVzc2FnZSwgdHlwZSwgcGVyc2lzdGVudCk7XHJcbn07XHJcblxyXG5jbGFzcyBUb2FzdCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKG1lc3NhZ2UsIHR5cGUgPSBcImluZm9cIiwgcGVyc2lzdGVudCA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIHRoaXMuJHJvb3QgPSAkKFwiPGRpdiBjbGFzcz0ndG9hc3QtaXRlbSc+XCIpXHJcbiAgICAgICAgICAgIC50ZXh0KG1lc3NhZ2UpXHJcbiAgICAgICAgICAgIC5hZGRDbGFzcyh0eXBlKVxyXG4gICAgICAgICAgICAuaGlkZSgpXHJcbiAgICAgICAgICAgIC5hcHBlbmRUbyhcIiN0b2FzdFwiKVxyXG4gICAgICAgICAgICAuZmFkZUluKCk7XHJcblxyXG4gICAgICAgIGlmIChwZXJzaXN0ZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuJHJvb3QuYWRkQ2xhc3MoXCJwZXJzaXN0ZW50XCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLmhpZGUoKTsgfSwgNTAwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhpZGUgKCkge1xyXG4gICAgICAgIHRoaXMuJHJvb3Quc2xpZGVVcCgpLnF1ZXVlKCgpID0+IHsgdGhpcy5yZW1vdmUoKTsgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlICgpIHtcclxuICAgICAgICB0aGlzLiRyb290LnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldE1lc3NhZ2UgKG1lc3NhZ2UpIHtcclxuICAgICAgICB0aGlzLiRyb290LnRleHQobWVzc2FnZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBNZXNzYWdlTGluZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IodG9waWMpe1xyXG4gICAgICAgIHRoaXMudG9waWMgPSB0b3BpYztcclxuICAgICAgICB0aGlzLmNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHRoaXMuaXNOZXcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgdGhpcy4kcm9vdCA9ICQoXCI8YXJ0aWNsZSBjbGFzcz0nbWVzc2FnZSc+XCIpO1xyXG5cclxuICAgICAgICB2YXIgaGVhZGVyID0gJChcIjxoZWFkZXI+XCIpLmFwcGVuZFRvKHRoaXMuJHJvb3QpO1xyXG5cclxuICAgICAgICAkKFwiPGgyPlwiKVxyXG4gICAgICAgICAgICAudGV4dCh0aGlzLnRvcGljKVxyXG4gICAgICAgICAgICAuYXBwZW5kVG8oaGVhZGVyKTtcclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5jb25maWcuc2hvd0NvdW50ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy4kY291bnRlck1hcmsgPSAkKFwiPHNwYW4gY2xhc3M9J21hcmsgY291bnRlcicgdGl0bGU9J01lc3NhZ2UgY291bnRlcic+MDwvc3Bhbj5cIilcclxuICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhoZWFkZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy4kcmV0YWluTWFyayA9ICQoXCI8c3BhbiBjbGFzcz0nbWFyayByZXRhaW4nIHRpdGxlPSdSZXRhaW4gbWVzc2FnZSc+Ujwvc3Bhbj5cIilcclxuICAgICAgICAgICAgLmFwcGVuZFRvKGhlYWRlcik7XHJcblxyXG4gICAgICAgIHRoaXMuJHFvc01hcmsgPSAkKFwiPHNwYW4gY2xhc3M9J21hcmsgcW9zJyB0aXRsZT0nUmVjZWl2ZWQgbWVzc2FnZSBRb1MnPlFvUzwvc3Bhbj5cIilcclxuICAgICAgICAgICAgLmFwcGVuZFRvKGhlYWRlcik7XHJcblxyXG4gICAgICAgIHRoaXMuJHBheWxvYWQgPSAkKFwiPHA+XCIpLmFwcGVuZFRvKHRoaXMuJHJvb3QpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBpc1JldGFpbmVkKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy4kcmV0YWluTWFya1t2YWx1ZSA/ICdzaG93JyA6ICdoaWRlJ10oKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgaXNTeXN0ZW1QYXlsb2FkKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy4kcGF5bG9hZC50b2dnbGVDbGFzcyhcInN5c1wiLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlnaGxpZ2h0KGxpbmUgPSBmYWxzZSkge1xyXG4gICAgICAgIChsaW5lID8gdGhpcy4kcm9vdCA6IHRoaXMuJHBheWxvYWQpXHJcbiAgICAgICAgICAgIC5zdG9wKClcclxuICAgICAgICAgICAgLmNzcyh7YmFja2dyb3VuZENvbG9yOiBcIiMwQ0IwRkZcIn0pXHJcbiAgICAgICAgICAgIC5hbmltYXRlKHtiYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZlwifSwgMjAwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKHBheWxvYWQsIHJldGFpbmVkLCBxb3MsIGJpbmFyeSkge1xyXG4gICAgICAgIHRoaXMuY291bnRlciArKztcclxuICAgICAgICB0aGlzLmlzUmV0YWluZWQgPSByZXRhaW5lZDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuJGNvdW50ZXJNYXJrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGNvdW50ZXJNYXJrLnRleHQodGhpcy5jb3VudGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuJHFvc01hcmspIHtcclxuICAgICAgICAgICAgaWYgKHFvcyA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRxb3NNYXJrLmhpZGUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJHFvc01hcmsuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kcW9zTWFyay50ZXh0KGBRb1MgJHtxb3N9YCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRxb3NNYXJrLmF0dHIoXCJkYXRhLXFvc1wiLCBxb3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYmluYXJ5KSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBheWxvYWQgPSBcIkhFWDogXCIgKyBmb3JtYXRCeXRlQXJyYXkocGF5bG9hZCk7XHJcbiAgICAgICAgICAgIHRoaXMuaXNTeXN0ZW1QYXlsb2FkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHBheWxvYWQgPT0gXCJcIikgXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHBheWxvYWQgPSBcIk5VTExcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNTeXN0ZW1QYXlsb2FkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNTeXN0ZW1QYXlsb2FkID0gZmFsc2U7ICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiRwYXlsb2FkLnRleHQocGF5bG9hZCk7XHJcbiAgICAgICAgdGhpcy5oaWdobGlnaHQodGhpcy5pc05ldyk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzTmV3KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNOZXcgPSBmYWxzZTtcclxuICAgICAgICB9ICAgICAgIFxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JtYXRCeXRlQXJyYXkoYSkge1xyXG4gICAgdmFyIGEyID0gbmV3IEFycmF5KGEubGVuZ3RoKTtcclxuXHJcbiAgICBmb3IodmFyIGkgPSBhLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgYTJbaV0gPSAoKGFbaV0gPD0gMHgwRikgPyBcIjBcIiA6IFwiXCIpICsgYVtpXS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYTIuam9pbihcIiBcIik7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBNZXNzYWdlQ29udGFpbmVyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigkcGFyZW50KSB7XHJcbiAgICAgICAgdGhpcy5zb3J0ID0gJ0FscGhhYmV0aWNhbGx5JztcclxuICAgICAgICB0aGlzLiRwYXJlbnQgPSAkcGFyZW50O1xyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgdGhpcy5yZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0KCkge1xyXG4gICAgICAgIHRoaXMubGluZXMgPSB7fTtcclxuICAgICAgICB0aGlzLnRvcGljcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuJHBhcmVudC5odG1sKFwiXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSAodG9waWMsIHBheWxvYWQsIHJldGFpbmVkLCBxb3MsIGJpbmFyeSkge1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMubGluZXNbdG9waWNdKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgbGluZSA9IG5ldyBNZXNzYWdlTGluZSh0b3BpYywgdGhpcy4kcGFyZW50KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXNbYGFkZExpbmUke3RoaXMuc29ydH1gXShsaW5lKTtcclxuICAgICAgICAgICAgdGhpcy5saW5lc1t0b3BpY10gPSBsaW5lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5saW5lc1t0b3BpY10udXBkYXRlKHBheWxvYWQsIHJldGFpbmVkLCBxb3MsIGJpbmFyeSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTGluZUFscGhhYmV0aWNhbGx5IChsaW5lKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRvcGljcy5sZW5ndGggPT0gMCkgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmFkZExpbmVDaHJvbm9sb2dpY2FsbHkobGluZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB0b3BpYyA9IGxpbmUudG9waWM7XHJcblxyXG4gICAgICAgIHRoaXMudG9waWNzLnB1c2godG9waWMpO1xyXG4gICAgICAgIHRoaXMudG9waWNzLnNvcnQoKTtcclxuXHJcbiAgICAgICAgdmFyIG4gPSB0aGlzLnRvcGljcy5pbmRleE9mKHRvcGljKTtcclxuXHJcbiAgICAgICAgaWYgKG4gPT0gMCl7XHJcbiAgICAgICAgICAgIHRoaXMuJHBhcmVudC5wcmVwZW5kKGxpbmUuJHJvb3QpO1xyXG4gICAgICAgICAgICByZXR1cm47ICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHByZXYgPSB0aGlzLnRvcGljc1tuIC0gMV07XHJcbiAgICAgICAgbGluZS4kcm9vdC5pbnNlcnRBZnRlcih0aGlzLmxpbmVzW3ByZXZdLiRyb290KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRMaW5lQ2hyb25vbG9naWNhbGx5IChsaW5lKSB7XHJcbiAgICAgICAgdGhpcy50b3BpY3MucHVzaChsaW5lLnRvcGljKTtcclxuICAgICAgICB0aGlzLiRwYXJlbnQuYXBwZW5kKGxpbmUuJHJvb3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5NZXNzYWdlQ29udGFpbmVyLlNPUlRfQVBMSEEgPSBcIkFscGhhYmV0aWNhbGx5XCI7XHJcbk1lc3NhZ2VDb250YWluZXIuU09SVF9DSFJPTk8gPSBcIkNocm9ub2xvZ2ljYWxseVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEZvb3RlciB7XHJcblxyXG4gICAgc2V0IGNsaWVudElkKHZhbHVlKSB7XHJcbiAgICAgICAgJChcIiNzdGF0dXMtY2xpZW50XCIpLnRleHQodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB1cmkodmFsdWUpIHtcclxuICAgICAgICAkKFwiI3N0YXR1cy1ob3N0XCIpLnRleHQodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBzdGF0ZSh2YWx1ZSkge1xyXG4gICAgICAgIGxldCB0ZXh0LCBjbGFzc05hbWU7XHJcblxyXG4gICAgICAgIHN3aXRjaCAodmFsdWUpIHtcclxuICAgICAgICAgICAgY2FzZSBXYWxsQ2xpZW50LlNUQVRFLk5FVzpcclxuICAgICAgICAgICAgICAgIHRleHQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lID0gXCJjb25uZWN0aW5nXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBXYWxsQ2xpZW50LlNUQVRFLkNPTk5FQ1RJTkc6XHJcbiAgICAgICAgICAgICAgICB0ZXh0ID0gXCJjb25uZWN0aW5nLi4uXCI7XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgPSBcImNvbm5lY3RpbmdcIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFdhbGxDbGllbnQuU1RBVEUuQ09OTkVDVEVEOlxyXG4gICAgICAgICAgICAgICAgdGV4dCA9IFwiY29ubmVjdGVkXCI7XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgPSBcImNvbm5lY3RlZFwiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgV2FsbENsaWVudC5TVEFURS5SRUNPTk5FQ1RJTkc6XHJcbiAgICAgICAgICAgICAgICB0ZXh0ID0gXCJyZWNvbm5lY3RpbmcuLi5cIjtcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZSA9IFwiY29ubmVjdGluZ1wiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgV2FsbENsaWVudC5TVEFURS5FUlJPUjpcclxuICAgICAgICAgICAgICAgIHRleHQgPSBcIm5vdCBjb25uZWN0ZWRcIjtcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZSA9IFwiZmFpbFwiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIFdhbGxDbGllbnQuU1RBVEVcIilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnJlY29ubmVjdEF0dGVtcHRzID4gMSkge1xyXG4gICAgICAgICAgICB0ZXh0ICs9IGAgKCR7dGhpcy5yZWNvbm5lY3RBdHRlbXB0c30pYDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoXCIjc3RhdHVzLXN0YXRlXCIpLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoY2xhc3NOYW1lKTtcclxuICAgICAgICAkKFwiI3N0YXR1cy1zdGF0ZSBzcGFuXCIpLnRleHQodGV4dCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUb29sYmFyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAocGFyZW50KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLiRwYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgICAgdGhpcy4kdG9waWMgPSBwYXJlbnQuZmluZChcIiN0b3BpY1wiKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmluaXRFdmVudEhhbmRsZXJzKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RGVmYXVsdFRvcGljKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdEV2ZW50SGFuZGxlcnMgKCkge1xyXG4gICAgICAgIGxldCBpbmhpYml0b3IgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy4kdG9waWMua2V5dXAoKGUpID0+IHtcclxuICAgICAgICAgICAgaWYoZS53aGljaCA9PT0gMTMpIHsgLy8gRU5URVJcclxuICAgICAgICAgICAgICAgIHRoaXMuJHRvcGljLmJsdXIoKTtcclxuICAgICAgICAgICAgfSAgXHJcblxyXG4gICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09PSAyNykgeyAvLyBFU0NcclxuICAgICAgICAgICAgICAgIGluaGliaXRvciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiR0b3BpYy5ibHVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy4kdG9waWMuZm9jdXMoKGUpID0+IHtcclxuICAgICAgICAgICAgaW5oaWJpdG9yID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuJHRvcGljLmJsdXIoKGUpID0+IHtcclxuICAgICAgICAgICAgaWYgKGluaGliaXRvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVVaSgpOyAvLyByZXZlcnQgY2hhbmdlc1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dENoYW5nZWQoKTtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpbnB1dENoYW5nZWQgKCkge1xyXG4gICAgICAgIHZhciBuZXdUb3BpYyA9IHRoaXMuJHRvcGljLnZhbCgpOyBcclxuXHJcbiAgICAgICAgaWYgKG5ld1RvcGljID09PSB0aGlzLl90b3BpYykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl90b3BpYyA9IG5ld1RvcGljO1xyXG4gICAgICAgIHRoaXMuZW1pdChcInRvcGljXCIsIG5ld1RvcGljKTtcclxuICAgIH0gXHJcblxyXG4gICAgaW5pdERlZmF1bHRUb3BpYyAoKSB7XHJcbiAgICAgICAgLy8gVVJMIGhhc2ggXHJcbiAgICAgICAgaWYgKGxvY2F0aW9uLmhhc2ggIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5fdG9waWMgPSBsb2NhdGlvbi5oYXNoLnN1YnN0cigxKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl90b3BpYyA9IGNvbmZpZy5kZWZhdWx0VG9waWMgfHwgXCIvI1wiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVVaSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVVpICgpIHtcclxuICAgICAgICB0aGlzLiR0b3BpYy52YWwodGhpcy5fdG9waWMpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB0b3BpYyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RvcGljO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB0b3BpYyAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl90b3BpYyA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVWkoKTtcclxuICAgICAgICB0aGlzLmVtaXQoXCJ0b3BpY1wiLCB2YWx1ZSk7XHJcbiAgICB9XHJcbn0iLCIvKipcclxuICogU2ltcGxlIHZlcnNpb24gb2Ygbm9kZS5qcydzIEV2ZW50RW1pdGVyIGNsYXNzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRXZlbnRFbWl0dGVyIHtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgZXZlbnQgaGFuZGxlciBvZiBnaXZlbnQgdHlwZVxyXG4gICAgICovXHJcbiAgICBvbiAodHlwZSwgZm4pIHtcclxuICAgICAgICBpZiAodGhpc1snX29uJyArIHR5cGVdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpc1snX29uJyArIHR5cGVdID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzWydfb24nICsgdHlwZV0ucHVzaChmbik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbWl0IGV2ZW50IG9mIHR5cGUuXHJcbiAgICAgKiBcclxuICAgICAqIEFsbCBhcmd1bWVudHMgd2lsbCBiZSBhcHBsYXkgdG8gY2FsbGJhY2ssIHByZXNlcnZlIGNvbnRleHQgb2Ygb2JqZWN0IHRoaXMuXHJcbiAgICAgKi9cclxuICAgIGVtaXQgKHR5cGUsIC4uLmFyZ3MpIHtcclxuICAgICAgICBpZiAodGhpc1snX29uJyArIHR5cGVdKSB7XHJcbiAgICAgICAgICAgIHRoaXNbJ19vbicgKyB0eXBlXS5mb3JFYWNoKChmbikgPT4gZm4uYXBwbHkodGhpcywgYXJncykpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSBcclxuIiwiaW1wb3J0IHtXYWxsQ2xpZW50fSBmcm9tICcuL2NsaWVudC5qcyc7XHJcbmltcG9ydCB7VUksIE1lc3NhZ2VMaW5lLCBNZXNzYWdlQ29udGFpbmVyLCBGb290ZXIsIFRvb2xiYXJ9IGZyb20gXCIuL3VpLmpzXCI7XHJcblxyXG4vLyAtLS0gTWFpbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4vLyBkZWNvZGUgcGFzc3dvcmQgYmFzZTY0IChpZiBlbXB0eSBsZXZlIGl0KVxyXG5sZXQgcGFzc3dvcmQgPSBjb25maWcuc2VydmVyLnBhc3N3b3JkICE9PSB1bmRlZmluZWQgPyBhdG9iKGNvbmZpZy5zZXJ2ZXIucGFzc3dvcmQpIDogdW5kZWZpbmVkO1xyXG5cclxubGV0IGNsaWVudCA9IG5ldyBXYWxsQ2xpZW50KGNvbmZpZy5zZXJ2ZXIudXJpLCBjb25maWcuc2VydmVyLnVzZXJuYW1lLCBwYXNzd29yZCwgY29uZmlnLnFvcyk7XHJcbmxldCBtZXNzYWdlcyA9IG5ldyBNZXNzYWdlQ29udGFpbmVyKCQoXCJzZWN0aW9uLm1lc3NhZ2VzXCIpKTtcclxubGV0IGZvb3RlciA9IG5ldyBGb290ZXIoKTtcclxubGV0IHRvb2xiYXIgPSBuZXcgVG9vbGJhcigkKFwiI2hlYWRlclwiKSk7XHJcblxyXG5tZXNzYWdlcy5zb3J0ID0gY29uZmlnLmFscGhhYmV0aWNhbFNvcnQgPyBNZXNzYWdlQ29udGFpbmVyLlNPUlRfQVBMSEEgOiBNZXNzYWdlQ29udGFpbmVyLlNPUlRfQ0hST05PO1xyXG5cclxuZm9vdGVyLmNsaWVudElkID0gY2xpZW50LmNsaWVudElkO1xyXG5mb290ZXIudXJpID0gY2xpZW50LnRvU3RyaW5nKCk7XHJcbmZvb3Rlci5zdGF0ZSA9IDA7XHJcblxyXG5mdW5jdGlvbiBsb2FkKCkge1xyXG4gICAgbGV0IHRvcGljID0gdG9vbGJhci50b3BpYztcclxuXHJcbiAgICBjbGllbnQuc3Vic2NyaWJlKHRvcGljLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgVUkuc2V0VGl0bGUodG9waWMpO1xyXG4gICAgICAgIGxvY2F0aW9uLmhhc2ggPSBcIiNcIiArIHRvcGljO1xyXG4gICAgfSk7XHJcblxyXG4gICAgbWVzc2FnZXMucmVzZXQoKTtcclxufVxyXG5cclxudG9vbGJhci5vbihcInRvcGljXCIsICgpID0+IHtcclxuICAgIGxvYWQoKTtcclxufSk7XHJcblxyXG5jbGllbnQub25Db25uZWN0ZWQgPSAoKSA9PiB7XHJcbiAgICBsb2FkKCk7XHJcbiAgICBVSS50b2FzdChcIkNvbm5lY3RlZCB0byBob3N0IFwiICsgY2xpZW50LnRvU3RyaW5nKCkpO1xyXG59O1xyXG5cclxuY2xpZW50Lm9uRXJyb3IgPSAoZGVzY3JpcHRpb24sIGlzRmF0YWwpID0+IHtcclxuICAgIFVJLnRvYXN0KGRlc2NyaXB0aW9uLCBcImVycm9yXCIsIGlzRmF0YWwpO1xyXG59O1xyXG5cclxubGV0IHJlY29ubmVjdGluZ1RvYXN0ID0gbnVsbDtcclxuXHJcbmNsaWVudC5vblN0YXRlQ2hhbmdlZCA9IChzdGF0ZSkgPT4ge1xyXG4gICAgZm9vdGVyLnJlY29ubmVjdEF0dGVtcHRzID0gY2xpZW50LmF0dGVtcHRzO1xyXG4gICAgZm9vdGVyLnN0YXRlID0gc3RhdGU7XHJcblxyXG4gICAgaWYgKChzdGF0ZSA9PT0gV2FsbENsaWVudC5TVEFURS5DT05ORUNUSU5HIHx8IHN0YXRlID09PSBXYWxsQ2xpZW50LlNUQVRFLlJFQ09OTkVDVElORykgJiYgY2xpZW50LmF0dGVtcHRzID49IDIpIHtcclxuICAgICAgICBsZXQgbXNnID0gc3RhdGUgPT09IFdhbGxDbGllbnQuU1RBVEUuQ09OTkVDVElORyA/XHJcbiAgICAgICAgICAgIGBGYWlsIHRvIGNvbm5lY3QuIFRyeWluZyB0byBjb25uZWN0Li4uICgke2NsaWVudC5hdHRlbXB0c30gYXR0ZW1wdHMpYDpcclxuICAgICAgICAgICAgYENvbm5lY3Rpb24gbG9zdC4gVHJ5aW5nIHRvIHJlY29ubmVjdC4uLiAoJHtjbGllbnQuYXR0ZW1wdHN9IGF0dGVtcHRzKWA7XHJcblxyXG4gICAgICAgIGlmIChyZWNvbm5lY3RpbmdUb2FzdCA9PT0gbnVsbCl7XHJcbiAgICAgICAgICAgIHJlY29ubmVjdGluZ1RvYXN0ID0gVUkudG9hc3QobXNnLCBcImVycm9yXCIsIHRydWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlY29ubmVjdGluZ1RvYXN0LnNldE1lc3NhZ2UobXNnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN0YXRlID09PSBXYWxsQ2xpZW50LlNUQVRFLkNPTk5FQ1RFRCAmJiByZWNvbm5lY3RpbmdUb2FzdCAhPT0gbnVsbCkge1xyXG4gICAgICAgIHJlY29ubmVjdGluZ1RvYXN0LmhpZGUoKTtcclxuICAgICAgICByZWNvbm5lY3RpbmdUb2FzdCA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmIChjbGllbnQuZmlyc3RDb25uZWN0aW9uID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIFVJLnRvYXN0KFwiUmVjb25uZWN0ZWRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGllbnQub25NZXNzYWdlID0gKHRvcGljLCBtc2csIHJldGFpbmVkLCBxb3MsIGJpbmFyeSkgPT4ge1xyXG4gICAgbWVzc2FnZXMudXBkYXRlKHRvcGljLCBtc2csIHJldGFpbmVkLCBxb3MsIGJpbmFyeSk7XHJcbn07XHJcblxyXG5jbGllbnQuY29ubmVjdCgpO1xyXG4iXX0=
