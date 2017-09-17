/*
 * ____ ____ ____ ____ ____ ____ ____ ____ 
 *||F |||L |||S |||G |||A |||M |||E |||S ||
 *||__|||__|||__|||__|||__|||__|||__|||__||
 *|/__\|/__\|/__\|/__\|/__\|/__\|/__\|/__\|Copyright (c) 2017.
 * 
 *
 * Author: FLS <DanielH@FlashLightningstudios.com>
 * Website: http://www.FLSgames.com
 *
 * Latest Update: 09/05/2017
 *
 */

// _TD.a.push begin
_TD.a.push(function (TD) {

	/**
	 * Event Manager
	 */
	TD.eventManager = {
		ex: -1, //  x Event coordinates
		ey: -1, // Event coordinates  y
		_registers: {}, // Registering the elements of a listener event

		// Currently supported event types
		ontypes: [
			"enter", // Mouse to move
			"hover", // The mouse is on the element, equivalent to onmouseover
			"out", // Mouse out
			"click" // Mouse clicks
		],

		// Current Event Type
		current_type: "hover",

		/**
		 * Determines whether an event is on an element, depending on the event coordinates
		 * @param el {Element} Element Element 
		 * @return {Boolean}
		 */
		isOn: function (el) {
			return (this.ex != -1 &&
			this.ey != -1 &&
			this.ex > el.x &&
			this.ex < el.x2 &&
			this.ey > el.y &&
			this.ey < el.y2);
		},

		/**
		 * Generates a string ID, based on the element name, event name, for registering event sniffing
		 * @param el {Element}
		 * @param evt_type {String}
		 * @return evt_name {String} String identification
		 */
		_mkElEvtName: function (el, evt_type) {
			return el.id + "::_evt_::" + evt_type;
		},

		/**
		 * Registering event listeners for an element
		 * Now the implementation is relatively simple, if an element on an event multiple registration listening, the subsequent listening will overwrite the previous
		 *
		 * @param el {Element}
		 * @param evt_type {String}
		 * @param f {Function}
		 */
		on: function (el, evt_type, f) {
			this._registers[this._mkElEvtName(el, evt_type)] = [el, evt_type, f];
		},

		/**
		 * To remove a listener from an element to a specified event
		 * @param el {Element}
		 * @param evt_type {String}
		 */
		removeEventListener: function (el, evt_type) {
			var en = this._mkElEvtName(el, evt_type);
			delete this._registers[en];
		},

		/**
		 * Clear All Listening events
		 */
		clear: function () {
			delete this._registers;
			this._registers = {};
			//this.elements = [];
		},

		/**
		 * 主循环方法
		 */
		step: function () {
			if (!this.current_type) return; // No event is triggered

			var k, a, el, et, f,
			//en,
				j,
				_this = this,
				ontypes_len = this.ontypes.length,
				is_evt_on,
//				reg_length = 0,
				to_del_el = [];

			//var m = TD.stage.current_act.current_scene.map;
			//TD.log([m.is_hover, this.isOn(m)]);

			// Iterate through the currently registered event
			for (k in this._registers) {
//				reg_length ++;
				if (!this._registers.hasOwnProperty(k)) continue;
				a = this._registers[k];
				el = a[0]; // Event-Corresponding Element
				et = a[1]; // Event Type
				f = a[2]; // Event handler function
				if (!el.is_valid) {
					to_del_el.push(el);
					continue;
				}
				if (!el.is_visiable) continue; // Invisible elements do not respond to events

				is_evt_on = this.isOn(el); // Whether an event occurs on an element

				if (this.current_type != "click") {
					// enter / out / hover Event

					if (et == "hover" && el.is_hover && is_evt_on) {
						// English Ordinary. hover
						f();
						this.current_type = "hover";
					} else if (et == "enter" && !el.is_hover && is_evt_on) {
						// enter Event
						el.is_hover = true;
						f();
						this.current_type = "enter";
					} else if (et == "out" && el.is_hover && !is_evt_on) {
						// out Event
						el.is_hover = false;
						f();
						this.current_type = "out";
//					} else {
						// Event is not related to current element
//					continue;
					}

				} else {
					// click Event
					if (is_evt_on && et == "click") f();
				}
			}

			// Deletes the event for the specified element list
			TD.lang.each(to_del_el, function (obj) {
				for (j = 0; j < ontypes_len; j++)
					_this.removeEventListener(obj, _this.ontypes[j]);
			});
//			TD.log(reg_length);
			this.current_type = "";
		},

		/**
		 * Mouse on element
		 * @param ex {Number}
		 * @param ey {Number}
		 */
		hover: function (ex, ey) {
			// If the Click event is not processed then exits, and the Click event has a higher priority
			if (this.current_type == "click") return;

			this.current_type = "hover";
			this.ex = ex;
			this.ey = ey;
		},

		/**
		 * Click event
		 * @param ex {Number}
		 * @param ey {Number}
		 */
		click: function (ex, ey) {
			this.current_type = "click";
			this.ex = ex;
			this.ey = ey;
		}
	};

}); // _TD.a.push end

