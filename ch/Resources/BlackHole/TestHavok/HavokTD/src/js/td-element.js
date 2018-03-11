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
 * Latest Update: 09/18/2017
 *
 */
 
// _TD.a.push begin
_TD.a.push(function (TD) {

	/**
	 * element is the base class for all controllable elements in the game
	 * @param ID {String} gives this element a unique, distinct ID that is randomly generated if not specified
	 * @param the configuration information for the CFG {Object} element
	 */
	TD.Element = function (id, cfg) {
		this.id = id || ("el-" + TD.lang.rndStr());
		this.cfg = cfg || {};

		this.is_valid = true;
		this.is_visiable = typeof cfg.is_visiable != "undefined" ? cfg.is_visiable : true;
		this.is_paused = false;
		this.is_hover = false;
		this.x = this.cfg.x || -1;
		this.y = this.cfg.y || -1;
		this.width = this.cfg.width || 0;
		this.height = this.cfg.height || 0;
		this.step_level = cfg.step_level || 1;
		this.render_level = cfg.render_level;
		this.on_events = cfg.on_events || [];

		this._init();
	};

	TD.Element.prototype = {
		_init: function () {
			var _this = this,
				i, en, len;

			// Listening for specified events
			for (i = 0, len = this.on_events.length; i < len; i++) {
				en = this.on_events[i];
				switch (en) {

					// Mouse into element
					case "enter":
						this.on("enter", function () {
							_this.onEnter();
						});
						break;

					// Move the mouse out of the element
 					case "out":
						this.on("out", function () {
							_this.onOut();
						});
						break;

					// The mouse is on the element, equivalent to the onmouseover in the DOM
 					case "hover":
						this.on("hover", function () {
							_this.onHover();
						});
						break;

					// The mouse clicked on the element
 					case "click":
						this.on("click", function () {
							_this.onClick();
						});
						break;
				}
			}
			this.caculatePos();
		},
		/**
		 * Recalculate the location information for an element
 		 */
		caculatePos: function () {
			this.cx = this.x + this.width / 2; // The location of the center
 			this.cy = this.y + this.height / 2;
			this.x2 = this.x + this.width; // Right border
			this.y2 = this.y + this.height; // Lower boundary
 		},
		start: function () {
			this.is_paused = false;
		},
		pause: function () {
			this.is_paused = true;
		},
		hide: function () {
			this.is_visiable = false;
			this.onOut();
		},
		show: function () {
			this.is_visiable = true;
		},
		/**
		 * Delete this element
 		 */
		del: function () {
			this.is_valid = false;
		},
		/**
		 * Binding events of the specified type
		 * @param evt_type {String} event type
		 * @param f {Function} processing method
		 */
		on: function (evt_type, f) {
			TD.eventManager.on(this, evt_type, f);
		},

		// The following methods are empty by default and are overloaded as needed in the instance
 		onEnter: TD.lang.nullFunc,
		onOut: TD.lang.nullFunc,
		onHover: TD.lang.nullFunc,
		onClick: TD.lang.nullFunc,
		step: TD.lang.nullFunc,
		render: TD.lang.nullFunc,

		/**
		 * Add current element to scene scene
		 * add element in pre_add_list before adding this element
		 * @param scene
		 * @param step_level {Number}
		 * @param render_level {Number}
		 * @param pre_add_list{array}optional[element1,element2,...]
		 */
		addToScene: function (scene, step_level, render_level, pre_add_list) {
			this.scene = scene;
			if (isNaN(step_level)) return;
			this.step_level = step_level || this.step_level;
			this.render_level = render_level || this.render_level;

			if (pre_add_list) {
				TD.lang.each(pre_add_list, function (obj) {
					scene.addElement(obj, step_level, render_level);
				});
			}
			scene.addElement(this, step_level, render_level);
		}
	};

}); // _TD.a.push end

