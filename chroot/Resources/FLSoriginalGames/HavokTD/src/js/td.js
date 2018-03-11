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
 
var _TD = {
	a: [],
	retina: window.devicePixelRatio || 1,
	init: function (td_board, is_debug) {
		delete this.init; //Once initialized, this entry reference is deleted to prevent the initialization method from being called again

		var i, TD = {
			version: "1.0.1", //English Version naming specification Reference: http://FLSgames.com
			is_debug: !!is_debug,
			is_paused: true,
			width: 16, //Horizontal number of squares
			height: 16, // Longitudinal number of squares
			show_monster_life: true, // Whether to display the life value of a monster
			fps: 0,
			exp_fps: 24, // Expectations of fps
			exp_fps_half: 12,
			exp_fps_quarter: 6,
			exp_fps_eighth: 4,
			stage_data: {},
			defaultSettings: function () {
				return {
					step_time: 36, // How many milliseconds between each step cycle 
					grid_size: 32 * _TD.retina, // px
					padding: 10 * _TD.retina, // px
					global_speed: 0.1 // Global Velocity coefficients 
				};
			},

			/**
			 * .
			 * @param ob_board
			 */
			init: function (ob_board/*, ob_info*/) {
				this.obj_board = TD.lang.$e(ob_board);
				this.canvas = this.obj_board.getElementsByTagName("canvas")[0];
				//this.obj_info = TD.lang.$e(ob_info);
				if (!this.canvas.getContext) return; // does not support canvas
				this.ctx = this.canvas.getContext("2d");
				this.monster_type_count = TD.getDefaultMonsterAttributes(); // How many kinds of monsters are there?
				this.iframe = 0; // Current playback to the first few frames
				this.last_iframe_time = (new Date()).getTime();
				this.fps = 0;

				this.start();
			},

			/**
			 * Start the game, or start the game again 
			 */
			start: function () {
				clearTimeout(this._st);
				TD.log("Start!");
				var _this = this;
				this._exp_fps_0 = this.exp_fps - 0.4; // Lower
				this._exp_fps_1 = this.exp_fps + 0.4; // Ceiling

				this.mode = "normal"; // Mode is divided into two types: Normail (normal mode) and build (construction mode)
				this.eventManager.clear(); // Purge events that are listening in the event manager
				this.lang.mix(this, this.defaultSettings());
				this.stage = new TD.Stage("stage-main", TD.getDefaultStageData("stage_main"));

				this.canvas.setAttribute("width", this.stage.width);
				this.canvas.setAttribute("height", this.stage.height);
				this.canvas.style.width = (this.stage.width / _TD.retina) + "px";
				this.canvas.style.height = (this.stage.height / _TD.retina) + "px";

				this.canvas.onmousemove = function (e) {
					var xy = _this.getEventXY.call(_this, e);
					_this.hover(xy[0], xy[1]);
				};
				this.canvas.onclick = function (e) {
					var xy = _this.getEventXY.call(_this, e);
					_this.click(xy[0], xy[1]);
				};

				this.is_paused = false;
				this.stage.start();
				this.step();

				return this;
			},

			/**
			 * Cheating methods
			 * @param cheat_code
			 *
			 * Example：
			 * 1, add 1 million money: javascript: _td cheat= "money+"; void (0);
			 * 2, more difficult: javascript: _td cheat= "difficulty+"; void (0);
			 * 3, Half difficulty: javascript: _td cheat= "difficulty-"; void (0);
			 * 4, Life Value recovery: javascript: _td cheat= "life+"; void (0);
			 * 5, the lowest life value: javascript: _td. cheat= "life-"; void (0);
			 */
			checkCheat: function (cheat_code) {
				switch (cheat_code) {
					case "money+":
						this.money += 1000000;
						this.log("cheat success!");
						break;
					case "life+":
						this.life = 100;
						this.log("cheat success!");
						break;
					case "life-":
						this.life = 1;
						this.log("cheat success!");
						break;
					case "difficulty+":
						this.difficulty *= 2;
						this.log("cheat success! difficulty = " + this.difficulty);
						break;
					case "difficulty-":
						this.difficulty /= 2;
						this.log("cheat success! difficulty = " + this.difficulty);
						break;
				}
			},

			/**
			 * Main Loop method
			 */
			step: function () {

				if (this.is_debug && _TD && _TD.cheat) {
					// Check cheat Codes
					this.checkCheat(_TD.cheat);
					_TD.cheat = "";
				}

				if (this.is_paused) return;

				this.iframe++; // Current total number of frames
				if (this.iframe % 50 == 0) {
					// Calculation fps
					var t = (new Date()).getTime(),
						step_time = this.step_time;
					this.fps = Math.round(500000 / (t - this.last_iframe_time)) / 10;
					this.last_iframe_time = t;

					// Dynamically adjust step_time to ensure that FPS constant is around 24
					if (this.fps < this._exp_fps_0 && step_time > 1) {
						step_time--;
					} else if (this.fps > this._exp_fps_1) {
						step_time++;
					}
//					if (step_time != this.step_time)
//						TD.log("FPS: " + this.fps + ", Step Time: " + step_time);
					this.step_time = step_time;
				}
				if (this.iframe % 2400 == 0) TD.gc(); // Automatically recycle rubbish every once in a while

				this.stage.step();
				this.stage.render();

				var _this = this;
				this._st = setTimeout(function () {
					_this.step();
				}, this.step_time);
			},

			/**
			 * Gets the coordinates of the event relative to the upper-left corner of the canvas 
			 * @param e
			 */
			getEventXY: function (e) {
				var wra = TD.lang.$e("wrapper"),
					x = e.clientX - wra.offsetLeft - this.canvas.offsetLeft + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft),
					y = e.clientY - wra.offsetTop - this.canvas.offsetTop + Math.max(document.documentElement.scrollTop, document.body.scrollTop);

				return [x * _TD.retina, y * _TD.retina];
			},

			/**
			 * Mouse over the specified location event
			 * @param x
			 * @param y
			 */
			hover: function (x, y) {
				this.eventManager.hover(x, y);
			},

			/**
			 * Click event
			 * @param x
			 * @param y
			 */
			click: function (x, y) {
				this.eventManager.click(x, y);
			},

			/**
			 * Change the mouse pointer in canvas to the shape of the hand 
			 * @param v {Boolean}
			 */
			mouseHand: function (v) {
				this.canvas.style.cursor = v ? "pointer" : "default";
			},

			/**
			 * Display debug information, valid only if Is_debug is true
			 * @param txt
			 */
			log: function (txt) {
				this.is_debug && window.console && console.log && console.log(txt);
			},

			/**
			 * Reclaim Memory
			 * Note: CollectGarbage only works under IE
			 */
			gc: function () {
				if (window.CollectGarbage) {
					CollectGarbage();
					setTimeout(CollectGarbage, 1);
				}
			}
		};

		for (i = 0; this.a[i]; i++) {
			//Perform functions added to list in sequence
			this.a[i](TD);
		}
		delete this.a;

		TD.init(td_board);
	}
};
