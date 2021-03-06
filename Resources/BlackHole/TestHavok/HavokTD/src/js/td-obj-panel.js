﻿/*
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

	// The properties and methods of the Panel object. Note that there are no arrays, objects,etc. in the attribute
	// Reference property, or the related properties of multiple instances conflict
	var panel_obj = {
		_init: function (cfg) {
			cfg = cfg || {};
			this.x = cfg.x;
			this.y = cfg.y;
			this.scene = cfg.scene;
			this.map = cfg.main_map;

			// make panel map
			var panel_map = new TD.Map("panel-map", TD.lang.mix({
					x: this.x + cfg.map.x,
					y: this.y + cfg.map.y,
					scene: this.scene,
					step_level: this.step_level,
					render_level: this.render_level
				}, cfg.map, false));

			this.addToScene(this.scene, 1, 7);
			panel_map.addToScene(this.scene, 1, 7, panel_map.grids);
			this.scene.panel_map = panel_map;
			this.gameover_obj = new TD.GameOver("panel-gameover", {
				panel: this,
				scene: this.scene,
				step_level: this.step_level,
				is_visiable: false,
				x: 0,
				y: 0,
				width: this.scene.stage.width,
				height: this.scene.stage.height,
				render_level: 9
			});

			this.balloontip = new TD.BalloonTip("panel-balloon-tip", {
				scene: this.scene,
				step_level: this.step_level,
				render_level: 9
			});
			this.balloontip.addToScene(this.scene, 1, 9);

			// make buttons
			// Pause button
			this.btn_pause = new TD.Button("panel-btn-pause", {
				scene: this.scene,
				x: this.x,
				y: this.y + 500 * _TD.retina,
				text: TD._t("button_pause_text"),
				//desc: TD._t("button_pause_desc_0"),
				step_level: this.step_level,
				render_level: this.render_level + 1,
				onClick: function () {
					if (this.scene.state == 1) {
						this.scene.pause();
						this.text = TD._t("button_continue_text");
						this.scene.panel.btn_upgrade.hide();
						this.scene.panel.btn_sell.hide();
						this.scene.panel.btn_restart.show();
						//this.desc = TD._t("button_pause_desc_1");
					} else if (this.scene.state == 2) {
						this.scene.start();
						this.text = TD._t("button_pause_text");
						this.scene.panel.btn_restart.hide();
						if (this.scene.map.selected_building) {
							this.scene.panel.btn_upgrade.show();
							this.scene.panel.btn_sell.show();
						}
						//this.desc = TD._t("button_pause_desc_0");
					}
				}
			});
			//Restart button
			this.btn_restart = new TD.Button("panel-btn-restart", {
				scene: this.scene,
				x: this.x,
				y: this.y + 530 * _TD.retina,
				is_visiable: false,
				text: TD._t("button_restart_text"),
				step_level: this.step_level,
				render_level: this.render_level + 1,
				onClick: function () {
					setTimeout(function () {
						TD.stage.clear();
						TD.is_paused = true;
						TD.start();
						TD.mouseHand(false);
					}, 0);
				}
			});
			// Building Upgrade button
			this.btn_upgrade = new TD.Button("panel-btn-upgrade", {
				scene: this.scene,
				x: this.x,
				y: this.y + 540 * _TD.retina,
				is_visiable: false,
				text: TD._t("button_upgrade_text"),
				step_level: this.step_level,
				render_level: this.render_level + 1,
				onClick: function () {
					this.scene.map.selected_building.tryToUpgrade(this);
				}
			});
			// Construction Sale button
			this.btn_sell = new TD.Button("panel-btn-sell", {
				scene: this.scene,
				x: this.x,
				y: this.y + 580 * _TD.retina,
				is_visiable: false,
				text: TD._t("button_sell_text"),
				step_level: this.step_level,
				render_level: this.render_level + 1,
				onClick: function () {
					this.scene.map.selected_building.tryToSell(this);
				}
			});
		},
		step: function () {
			if (TD.life_recover) {
				this._life_recover = this._life_recover2 = TD.life_recover;
				this._life_recover_wait = this._life_recover_wait2 = TD.exp_fps * 3;
				TD.life_recover = 0;
			}

			if (this._life_recover && (TD.iframe % TD.exp_fps_eighth == 0)) {
				TD.life ++;
				this._life_recover --;
			}

		},
		render: function () {
			//Draw State Text
			var ctx = TD.ctx;

			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			ctx.fillStyle = "#000";
			ctx.font = "normal " + (12 * _TD.retina) + "px 'Courier New'";
			ctx.beginPath();
			ctx.fillText(TD._t("panel_money_title") + TD.money, this.x, this.y);
			ctx.fillText(TD._t("panel_score_title") + TD.score, this.x, this.y + 20 * _TD.retina);
			ctx.fillText(TD._t("panel_life_title") + TD.life, this.x, this.y + 40 * _TD.retina);
			ctx.fillText(TD._t("panel_building_title") + this.map.buildings.length,
				this.x, this.y + 60 * _TD.retina);
			ctx.fillText(TD._t("panel_monster_title") + this.map.monsters.length,
				this.x, this.y + 80 * _TD.retina);
			ctx.closePath();

			if (this._life_recover_wait) {
				// Draw Life Recovery Tips
				var a = this._life_recover_wait / this._life_recover_wait2;
				ctx.fillStyle = "rgba(255, 0, 0, " + a + ")";
				ctx.font = "bold " + (12 * _TD.retina) + "px 'Verdana'";
				ctx.beginPath();
				ctx.fillText("+" + this._life_recover2, this.x + 60 * _TD.retina, this.y + 40 * _TD.retina);
				ctx.closePath();
				this._life_recover_wait --;
			}
			
			//Wave  Info
			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			ctx.fillStyle = "#000000";
			ctx.font = "normal " + (45 * _TD.retina) + "px 'Trebuchet MS'";
			ctx.beginPath();
			ctx.fillText(TD._t("wave_info", [this.scene.wave]), this.x, this.y + 220 * _TD.retina);
			ctx.closePath();
			
			// Draw version information in the lower-right corner
 			ctx.textAlign = "right";
			ctx.fillStyle = "#000000";
			ctx.font = "normal " + (10 * _TD.retina) + "px 'Courier New'";
			ctx.beginPath();
			ctx.fillText("version: " + TD.version + " | FLSgames.com", TD.stage.width - TD.padding,
				TD.stage.height - TD.padding * 1.5);
			ctx.closePath();

			// Draw FPS information in the lower left corner
			ctx.textAlign = "left";
			ctx.fillStyle = "#000000";
			ctx.font = "normal " + (10 * _TD.retina) + "px 'Courier New'";
			ctx.beginPath();
			ctx.fillText("FPS: " + TD.fps, TD.padding, TD.stage.height - TD.padding * 1.5);
			ctx.closePath();
		}
	};

	/**
	* @param id {String}
	* @param cfg {Object} Configuration Object
	* 	Need to include at least the following:
	*	{
	* 		Life: The value of monsters
	* 		Shield: The monster's defensive value
	* 		Speed: The speed of the monster
	*	}
	 */
	TD.Panel = function (id, cfg) {
		var panel = new TD.Element(id, cfg);
		TD.lang.mix(panel, panel_obj);
		panel._init(cfg);

		return panel;
	};

	// Balloon the properties and methods of the Tip object. Note that there are no arrays, objects, etc. in the attribute
	// Reference property, or the related properties of multiple instances conflict
	var balloontip_obj = {
		_init: function (cfg) {
			cfg = cfg || {};
			this.scene = cfg.scene;
		},
		caculatePos: function () {
			var el = this.el;

			this.x = el.cx + 0.5;
			this.y = el.cy + 0.5;

			if (this.x + this.width > this.scene.stage.width - TD.padding) {
				this.x = this.x - this.width;
			}

			this.px = this.x + 5 * _TD.retina;
			this.py = this.y + 4 * _TD.retina;
		},
		msg: function (txt, el) {
			this.text = txt;
			var ctx = TD.ctx;
			ctx.font = "normal " + (12 * _TD.retina) + "px 'Courier New'";
			this.width = Math.max(
				ctx.measureText(txt).width + 10 * _TD.retina,
				TD.lang.strLen2(txt) * 6 + 10 * _TD.retina
				);
			this.height = 20 * _TD.retina;

			if (el && el.cx && el.cy) {
				this.el = el;
				this.caculatePos();

				this.show();
			}
		},
		step: function () {
			if (!this.el || !this.el.is_valid) {
				this.hide();
				return;
			}

			if (this.el.is_monster) {
				// Monster will move, so you need to recalculate the tip position
				this.caculatePos();
			}
		},
		render: function () {
			if (!this.el) return;
			var ctx = TD.ctx;

			ctx.lineWidth = _TD.retina;
			ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
			ctx.strokeStyle = "rgba(222, 222, 0, 0.9)";
			ctx.beginPath();
			ctx.rect(this.x, this.y, this.width, this.height);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			ctx.fillStyle = "#000";
			ctx.font = "normal " + (12 * _TD.retina) + "px 'Courier New'";
			ctx.beginPath();
			ctx.fillText(this.text, this.px, this.py);
			ctx.closePath();

		}
	};

	/**
	 * @param id {String}
	 * @param cfg {Object} Configuration Object
	 * Need to include at least the following:
	 *		 {
	 *			 scene: scene
	 *		 }
	 */
	TD.BalloonTip = function (id, cfg) {
		var balloontip = new TD.Element(id, cfg);
		TD.lang.mix(balloontip, balloontip_obj);
		balloontip._init(cfg);

		return balloontip;
	};

	// The properties and methods of the button object. Note that there are no arrays, objects, etc. in the attribute
	// Reference property, or the related properties of multiple instances conflict
	var button_obj = {
		_init: function (cfg) {
			cfg = cfg || {};
			this.text = cfg.text;
			this.onClick = cfg.onClick || TD.lang.nullFunc;
			this.x = cfg.x;
			this.y = cfg.y;
			this.width = cfg.width || 80 * _TD.retina;
			this.height = cfg.height || 30 * _TD.retina;
			this.font_x = this.x + 8 * _TD.retina;
			this.font_y = this.y + 9 * _TD.retina;
			this.scene = cfg.scene;
			this.desc = cfg.desc || "";

			this.addToScene(this.scene, this.step_level, this.render_level);
			this.caculatePos();
		},
		onEnter: function () {
			TD.mouseHand(true);
			if (this.desc) {
				this.scene.panel.balloontip.msg(this.desc, this);
			}
		},
		onOut: function () {
			TD.mouseHand(false);
			if (this.scene.panel.balloontip.el == this) {
				this.scene.panel.balloontip.hide();
			}
		},
		render: function () {
			var ctx = TD.ctx;

			ctx.lineWidth = 2 * _TD.retina;
			ctx.fillStyle = this.is_hover ? "#eee" : "#ccc";
			ctx.strokeStyle = "#999";
			ctx.beginPath();
			ctx.rect(this.x, this.y, this.width, this.height);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			ctx.fillStyle = "#000";
			ctx.font = "normal " + (12 * _TD.retina) + "px 'Courier New'";
			ctx.beginPath();
			ctx.fillText(this.text, this.font_x, this.font_y);
			ctx.closePath();
			ctx.fill();
		}
	};

	/**
	 * @param id {String}
	 * @param cfg {Object} Configuration Object
	 * Need to include at least the following:
 	 *		 {
	 *			 x:
	 *			 y:
	 *			 text:
	 *			 onClick: function
	 *			 sence:
	 *		 }
	 */
	TD.Button = function (id, cfg) {
		cfg.on_events = ["enter", "out", "click"];
		var button = new TD.Element(id, cfg);
		TD.lang.mix(button, button_obj);
		button._init(cfg);

		return button;
	};


	// gameover The properties and methods of the object. Note that there are no arrays, objects, etc. in the attribute
	// Reference property, or the related properties of multiple instances conflict
	var gameover_obj = {
		_init: function (cfg) {
			this.panel = cfg.panel;
			this.scene = cfg.scene;

			this.addToScene(this.scene, 1, 9);
		},
		render: function () {

			this.panel.btn_pause.hide();
			this.panel.btn_upgrade.hide();
			this.panel.btn_sell.hide();
			this.panel.btn_restart.show();

			var ctx = TD.ctx;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillStyle = "#ccc";
			ctx.font = "bold 62px 'Verdana'";
			ctx.beginPath();
			ctx.fillText("GAME OVER", this.width / 2, this.height / 2);
			ctx.closePath();
			ctx.fillStyle = "#f00";
			ctx.font = "bold 60px 'Verdana'";
			ctx.beginPath();
			ctx.fillText("GAME OVER", this.width / 2, this.height / 2);
			ctx.closePath();

		}
	};

	/**
	 * @param id {String}
	 * @param cfg {Object}Configuration Object
	 * Need to include at least the following:
	 *		 {
	 *			 panel:
	 *			 scene:
	 *		 }
	 */
	TD.GameOver = function (id, cfg) {
		var obj = new TD.Element(id, cfg);
		TD.lang.mix(obj, gameover_obj);
		obj._init(cfg);

		return obj;
	};


	/**
	 * Restore N-point life value
	 * @param n
	 */
	TD.recover = function (n) {
//		TD.life += n;
		TD.life_recover = n;
		TD.log("life recover: " + n);
	};

}); // _TD.a.push end

