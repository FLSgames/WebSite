/*
 * ____ ____ ____ ____ ____ ____ ____ ____ 
 *||F |||L |||S |||G |||A |||M |||E |||S ||
 *||__|||__|||__|||__|||__|||__|||__|||__||
 *|/__\|/__\|/__\|/__\|/__\|/__\|/__\|/__\|Copyright (c) 2017.
 * 
 *
 * Author: FLS <DanielH@FlashLightningstudios.com.com>
 * Website: http://www.FLSgames.com
 *
 * Latest Update: 09/05/2017
 *
 */


// _TD.a.push begin
_TD.a.push(function (TD) {

	/**
	 * Stage class
	 * @param id {String} stageID
	 * @param cfg {Object} Configuration 配置
	 */
	TD.Stage = function (id, cfg) {
		this.id = id || ("stage-" + TD.lang.rndStr());
		this.cfg = cfg || {};
		this.width = this.cfg.width || 640;
		this.height = this.cfg.height || 540;

		/**
		 * mode 有以下状态：
		 *         "normal": Normal state普通状态
		 *         "build": Construction mode 建造模式
		 */
		this.mode = "normal";

		/*
		 * state There are several states: 有以下几种状态：
		 * 0: Waiting in 等待中
		 * 1: In operation 运行中
		 * 2: Time out 暂停
		 * 3: Has ended 已结束
		 */
		this.state = 0;
		this.acts = [];
		this.current_act = null;
		this._step2 = TD.lang.nullFunc;

		this._init();
	};

	TD.Stage.prototype = {
		_init: function () {
			if (typeof this.cfg.init == "function") {
				this.cfg.init.call(this);
			}
			if (typeof this.cfg.step2 == "function") {
				this._step2 = this.cfg.step2;
			}
		},
		start: function () {
			this.state = 1;
			TD.lang.each(this.acts, function (obj) {
				obj.start();
			});
		},
		pause: function () {
			this.state = 2;
		},
		gameover: function () {
			//this.pause();
			this.current_act.gameover();
		},
		/**
		 * Clear the 清除本 stage 所有物品 All items
		 */
		clear: function () {
			this.state = 3;
			TD.lang.each(this.acts, function (obj) {
				obj.clear();
			});
//		delete this;
		},
		/**
		 * Main loop function 主循环函数
		 */
		step: function () {
			if (this.state != 1 || !this.current_act) return;
			TD.eventManager.step();
			this.current_act.step();

			this._step2();
		},
		/**
		 * Drawing functions 绘制函数
		 */
		render: function () {
			if (this.state == 0 || this.state == 3 || !this.current_act) return;
			this.current_act.render();
		},
		addAct: function (act) {
			this.acts.push(act);
		},
		addElement: function (el, step_level, render_level) {
			if (this.current_act)
				this.current_act.addElement(el, step_level, render_level);
		}
	};

}); // _TD.a.push end


// _TD.a.push begin
_TD.a.push(function (TD) {

	TD.Act = function (stage, id) {
		this.stage = stage;
		this.id = id || ("act-" + TD.lang.rndStr());

		/*
		 * state There are several states  有以下几种状态：
		 * 0: Waiting in 等待中
		 * 1: In operation 运行中
		 * 2: Time out 暂停
		 * 3: Has ended 已结束
		 */
		this.state = 0;
		this.scenes = [];
		this.end_queue = []; // 本 act The queue to execute after the end, and when added, make sure that it's full of functions. 结束后要执行的队列，添加时请保证里面全是函数
		this.current_scene = null;

		this._init();
	};

	TD.Act.prototype = {
		_init: function () {
			this.stage.addAct(this);
		},
		/*
		 * Start the current 开始当前 act
		 */
		start: function () {
			if (this.stage.current_act && this.stage.current_act.state != 3) {
				// queue...
				this.state = 0;
				this.stage.current_act.queue(this.start);
				return;
			}
			// start
			this.state = 1;
			this.stage.current_act = this;
			TD.lang.each(this.scenes, function (obj) {
				obj.start();
			});
		},
		pause: function () {
			this.state = 2;
		},
		end: function () {
			this.state = 3;
			var f;
			while (f = this.end_queue.shift()) {
				f();
			}
			this.stage.current_act = null;
		},
		queue: function (f) {
			this.end_queue.push(f);
		},
		clear: function () {
			this.state = 3;
			TD.lang.each(this.scenes, function (obj) {
				obj.clear();
			});
//		delete this;
		},
		step: function () {
			if (this.state != 1 || !this.current_scene) return;
			this.current_scene.step();
		},
		render: function () {
			if (this.state == 0 || this.state == 3 || !this.current_scene) return;
			this.current_scene.render();
		},
		addScene: function (scene) {
			this.scenes.push(scene);
		},
		addElement: function (el, step_level, render_level) {
			if (this.current_scene)
				this.current_scene.addElement(el, step_level, render_level);
		},
		gameover: function () {
			//this.is_paused = true;
			//this.is_gameover = true;
			this.current_scene.gameover();
		}
	};

}); // _TD.a.push end


// _TD.a.push begin
_TD.a.push(function (TD) {

	TD.Scene = function (act, id) {
		this.act = act;
		this.stage = act.stage;
		this.is_gameover = false;
		this.id = id || ("scene-" + TD.lang.rndStr());
		/*
		 * state 有以下几种状态： There are several states
		 * 0: Waiting in 等待中
		 * 1: In operation 运行中
		 * 2: Time out 暂停
		 * 3: Has ended 已结束
		 */
		this.state = 0;
		this.end_queue = []; // 本 scene 结束后要执行的队列，添加时请保证里面全是函数 The queue to execute after the end, and when added, make sure that it's full of functions.
		this._step_elements = [
			// step 共分为 3 层 Divided into 3 layers
			[],
			// 0
			[],
			// 1 默认 Default
			[] // 2
		];
		this._render_elements = [ // Rendering is divided into 10 layers rendering is divided into ten layers
                [],//0 background 1 background picture Background pictures
                [],//1 background 2 Background
                [],//2 background 3 map, grid 2 Background 3 maps, lattices
                [],//3 ground 11 Building 3 floors, one by one buildings.
                [],//4 Ground 2 people, NPC etc 4 Ground 2 characters, NPC, etc
                [],//5 Ground 3 5 Ground 3
                [],//6 Sky 1 bullets etc. 6 sky, 1 bullets.
                [],//7 Sky 2 main map outside of the mask, panel 7 Sky 2 main maps outside of the mask, panel
                [],//8 Skies 3 8 Sky 3
                []//9 System Special operation, such as highlight, hint, text cover and other 9 systems Special operation, such as highlight, hint, text cover, etc.
		];

		this._init();
	};

	TD.Scene.prototype = {
		_init: function () {
			this.act.addScene(this);
			this.wave = 0; // 第几波 The first few waves
		},
		start: function () {
			if (this.act.current_scene &&
				this.act.current_scene != this &&
				this.act.current_scene.state != 3) {
				// queue...
				this.state = 0;
				this.act.current_scene.queue(this.start);
				return;
			}
			// start
			this.state = 1;
			this.act.current_scene = this;
		},
		pause: function () {
			this.state = 2;
		},
		end: function () {
			this.state = 3;
			var f;
			while (f = this.end_queue.shift()) {
				f();
			}
			this.clear();
			this.act.current_scene = null;
		},
		/**
		 * 清空场景 Empty scene
		 */
		clear: function () {
			// 清空本 scene 中引用的所有对象以回收内存 Empty all objects referenced in this scene to reclaim memory
			TD.lang.shift(this._step_elements, function (obj) {
				TD.lang.shift(obj, function (obj2) {
					// element
					//delete this.scene;
					obj2.del();
//				delete this;
				});
//			delete this;
			});
			TD.lang.shift(this._render_elements, function (obj) {
				TD.lang.shift(obj, function (obj2) {
					// element
					//delete this.scene;
					obj2.del();
//				delete this;
				});
//			delete this;
			});
//		delete this;
		},
		queue: function (f) {
			this.end_queue.push(f);
		},
		gameover: function () {
			if (this.is_gameover) return;
			this.pause();
			this.is_gameover = true;
		},
		step: function () {
			if (this.state != 1) return;
			if (TD.life <= 0) {
				TD.life = 0;
				this.gameover();
			}

			var i, a;
			for (i = 0; i < 3; i++) {
				a = [];
				var level_elements = this._step_elements[i];
				TD.lang.shift(level_elements, function (obj) {
					if (obj.is_valid) {
						if (!obj.is_paused)
							obj.step();
						a.push(obj);
					} else {
						setTimeout(function () {
							obj = null;
						}, 500); // 一会儿之后将这个对象彻底删除以收回内存 After a while, remove the object completely to recover the memory.
					}
				});
				this._step_elements[i] = a;
			}
		},
		render: function () {
			if (this.state == 0 || this.state == 3) return;
			var i, a,
				ctx = TD.ctx;

			ctx.clearRect(0, 0, this.stage.width, this.stage.height);

			for (i = 0; i < 10; i++) {
				a = [];
				var level_elements = this._render_elements[i];
				TD.lang.shift(level_elements, function (obj) {
					if (obj.is_valid) {
						if (obj.is_visiable)
							obj.render();
						a.push(obj);
					}
				});
				this._render_elements[i] = a;
			}

			if (this.is_gameover) {
				this.panel.gameover_obj.show();
			}
		},
		addElement: function (el, step_level, render_level) {
			//TD.log([step_level, render_level]);
			step_level = step_level || el.step_level || 1;
			render_level = render_level || el.render_level;
			this._step_elements[step_level].push(el);
			this._render_elements[render_level].push(el);
			el.scene = this;
			el.step_level = step_level;
			el.render_level = render_level;
		}
	};

}); // _TD.a.push end
