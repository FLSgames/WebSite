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

	// The properties and methods of the building object. Note that there are no arrays, objects, etc. in the attribute
	// Reference property, or the related properties of multiple instances conflict
	var building_obj = {
		_init: function (cfg) {
			this.is_selected = false;
			this.level = 0;
			this.killed = 0; // How many monsters are killed by the current building?
			this.target = null;

			cfg = cfg || {};
			this.map = cfg.map || null;
			this.grid = cfg.grid || null;炮台

			/**
			 * Bullet types, you can have the following types:
			 * 1: Ordinary bullets
			 * 2: Laser type, hit immediately after launch, not realized
			 * 3: Missile class, hit will explode, bring face attack, temporarily not realized
			 */
			this.bullet_type = cfg.bullet_type || 1;

			/**
			 * type Possible values are:
			 *         "wall": Wall, no aggressiveness
			 *         "cannon": Fort
			 *         "LMG": Guns
			 *         "HMG": Heavy machine guns
			 *         "laser_gun": Laser gun
			 *
			 */
			this.type = cfg.type;

			this.speed = cfg.speed;
			this.bullet_speed = cfg.bullet_speed;
			this.is_pre_building = !!cfg.is_pre_building;
			this.blink = this.is_pre_building;
			this.wait_blink = this._default_wait_blink = 20;
			this.is_weapon = (this.type != "wall"); // Walls and other non-attack buildings this is false and the remaining weapons are true

			var o = TD.getDefaultBuildingAttributes(this.type);
			TD.lang.mix(this, o);
			this.range_px = this.range * TD.grid_size;
			this.money = this.cost; // Purchase and upgrade the cost of the building

			this.caculatePos();
		},

		/**
		 * Cost of upgrading the building
		 */
		getUpgradeCost: function () {
			return Math.floor(this.money * 0.75);
		},

		/**
		 * How much does it cost to sell the building?
		 */
		getSellMoney: function () {
			return Math.floor(this.money * 0.5) || 1;
		},

		/**
		 * Toggle Checked/Unchecked
		 */
		toggleSelected: function () {
			this.is_selected = !this.is_selected;
			this.grid.hightLight(this.is_selected); // 高亮
			var _this = this;

			if (this.is_selected) {
				// If the current building is selected

				this.map.eachBuilding(function (obj) {
					obj.is_selected = obj == _this;
				});
				// Cancel the selected state of the selected building in another map
				(
					this.map.is_main_map ? this.scene.panel_map : this.scene.map
				).eachBuilding(function (obj) {
						obj.is_selected = false;
						obj.grid.hightLight(false);
					});
				this.map.selected_building = this;

				if (!this.map.is_main_map) {
					// In the face map, the architecture is selected and the building mode is entered.
					this.scene.map.preBuild(this.type);
				} else {
					// Cancel Building Mode
					this.scene.map.cancelPreBuild();
				}

			} else {
				// If the current building is switched to unchecked

				if (this.map.selected_building == this)
					this.map.selected_building = null;

				if (!this.map.is_main_map) {
					// Cancel Building Mode
					this.scene.map.cancelPreBuild();
				}
			}

			// If you select/uncheck the building on the main map, show/hide the corresponding action button
			if (this.map.is_main_map) {
				if (this.map.selected_building) {
					this.scene.panel.btn_upgrade.show();
					this.scene.panel.btn_sell.show();
					this.updateBtnDesc();
				} else {
					this.scene.panel.btn_upgrade.hide();
					this.scene.panel.btn_sell.hide();
				}
			}
		},

		/**
		 * Generate and update the description text for the upgrade button
		 */
		updateBtnDesc: function () {
			this.scene.panel.btn_upgrade.desc = TD._t(
				"upgrade", [
					TD._t("building_name_" + this.type),
					this.level + 1,
					this.getUpgradeCost()
				]);
			this.scene.panel.btn_sell.desc = TD._t(
				"sell", [
					TD._t("building_name_" + this.type),
					this.getSellMoney()
				]);
		},

		/**
		 * Put the building into a lattice
		 * @param grid {Element} Designated lattice
		 */
		locate: function (grid) {
			this.grid = grid;
			this.map = grid.map;
			this.cx = this.grid.cx;
			this.cy = this.grid.cy;
			this.x = this.grid.x;
			this.y = this.grid.y;
			this.x2 = this.grid.x2;
			this.y2 = this.grid.y2;
			this.width = this.grid.width;
			this.height = this.grid.height;

			this.px = this.x + 0.5;
			this.py = this.y + 0.5;

			this.wait_blink = this._default_wait_blink;
			this._fire_wait = Math.floor(Math.max(2 / (this.speed * TD.global_speed), 1));
			this._fire_wait2 = this._fire_wait;

		},

		/**
		 * Remove the building completely
		 */
		remove: function () {
//			TD.log("remove building #" + this.id + ".");
			if (this.grid && this.grid.building && this.grid.building == this)
				this.grid.building = null;
			this.hide();
			this.del();
		},

		/**
		 * Looking for a target (monster)
		 */
		findTaget: function () {
			if (!this.is_weapon || this.is_pre_building || !this.grid) return;

			var cx = this.cx, cy = this.cy,
				range2 = Math.pow(this.range_px, 2);

			// If the current building has a goal, and the target is still valid, and the target is still within range
			if (this.target && this.target.is_valid &&
				Math.pow(this.target.cx - cx, 2) + Math.pow(this.target.cy - cy, 2) <= range2)
				return;

			// Looking for new targets in the range of monsters.
			this.target = TD.lang.any(
				TD.lang.rndSort(this.map.monsters), // Randomly sort the monsters
				function (obj) {
					return Math.pow(obj.cx - cx, 2) + Math.pow(obj.cy - cy, 2) <= range2;
				});
		},

		/**
		 * Gets the coordinates of the target (relative to the upper-left corner of the map)
		 */
		getTargetPosition: function () {
			if (!this.target) {
				// To entrance As a target
				var grid = this.map.is_main_map ? this.map.entrance : this.grid;
				return [grid.cx, grid.cy];
			}
			return [this.target.cx, this.target.cy];
		},

		/**
		 * Fire on your target.
		 */
		fire: function () {
			if (!this.target || !this.target.is_valid) return;

			if (this.type == "laser_gun") {
				// If it's a laser gun, the target is hit right away.
				this.target.beHit(this, this.damage);
				return;
			}

			var muzzle = this.muzzle || [this.cx, this.cy], // The position of the muzzle
				cx = muzzle[0],
				cy = muzzle[1];

			new TD.Bullet(null, {
				building: this,
				damage: this.damage,
				target: this.target,
				speed: this.bullet_speed,
				x: cx,
				y: cy
			});
		},

		tryToFire: function () {
			if (!this.is_weapon || !this.target)
				return;

			this._fire_wait--;
			if (this._fire_wait > 0) {
//			return;
			} else if (this._fire_wait < 0) {
				this._fire_wait = this._fire_wait2;
			} else {
				this.fire();
			}
		},

		_upgrade2: function (k) {
			if (!this._upgrade_records[k])
				this._upgrade_records[k] = this[k];
			var v = this._upgrade_records[k],
				mk = "max_" + k,
				uk = "_upgrade_rule_" + k,
				uf = this[uk] || TD.default_upgrade_rule;
			if (!v || isNaN(v)) return;

			v = uf(this.level, v);
			if (this[mk] && !isNaN(this[mk]) && this[mk] < v)
				v = this[mk];
			this._upgrade_records[k] = v;
			this[k] = Math.floor(v);
		},

		/**
		 * Upgrade Building
		 */
		upgrade: function () {
			if (!this._upgrade_records)
				this._upgrade_records = {};

			var attrs = [
				// Upgradeable variables
				"damage", "range", "speed", "life", "shield"
			], i, l = attrs.length;
			for (i = 0; i < l; i++)
				this._upgrade2(attrs[i]);
			this.level++;
			this.range_px = this.range * TD.grid_size;
		},

		tryToUpgrade: function (btn) {
			var cost = this.getUpgradeCost(),
				msg = "";
			if (cost > TD.money) {
				msg = TD._t("not_enough_money", [cost]);
			} else {
				TD.money -= cost;
				this.money += cost;
				this.upgrade();
				msg = TD._t("upgrade_success", [
					TD._t("building_name_" + this.type), this.level,
					this.getUpgradeCost()
				]);
			}

			this.updateBtnDesc();
			this.scene.panel.balloontip.msg(msg, btn);
		},

		tryToSell: function () {
			if (!this.is_valid) return;

			TD.money += this.getSellMoney();
			this.grid.removeBuilding();
			this.is_valid = false;
			this.map.selected_building = null;
			this.map.select_hl.hide();
			this.map.checkHasWeapon();
			this.scene.panel.btn_upgrade.hide();
			this.scene.panel.btn_sell.hide();
			this.scene.panel.balloontip.hide();
		},

		step: function () {
			if (this.blink) {
				this.wait_blink--;
				if (this.wait_blink < -this._default_wait_blink)
					this.wait_blink = this._default_wait_blink;
			}

			this.findTaget();
			this.tryToFire();
		},

		render: function () {
			if (!this.is_visiable || this.wait_blink < 0) return;

			var ctx = TD.ctx;

			TD.renderBuilding(this);

			if (
				this.map.is_main_map &&
				(
					this.is_selected || (this.is_pre_building) ||
					this.map.show_all_ranges
				) &&
				this.is_weapon && this.range > 0 && this.grid
			) {
				// Draw Range
				ctx.lineWidth = _TD.retina;
				ctx.fillStyle = "rgba(187, 141, 32, 0.15)";
				ctx.strokeStyle = "#bb8d20";
				ctx.beginPath();
				ctx.arc(this.cx, this.cy, this.range_px, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			}

			if (this.type == "laser_gun" && this.target && this.target.is_valid) {
				// Painting laser
				ctx.lineWidth = 3 * _TD.retina;
				ctx.strokeStyle = "rgba(50, 50, 200, 0.5)";
				ctx.beginPath();
				ctx.moveTo(this.cx, this.cy);
				ctx.lineTo(this.target.cx, this.target.cy);
				ctx.closePath();
				ctx.stroke();
				ctx.lineWidth = _TD.retina;
				ctx.strokeStyle = "rgba(150, 150, 255, 0.5)";
				ctx.beginPath();
				ctx.lineTo(this.cx, this.cy);
				ctx.closePath();
				ctx.stroke();
			}
		},

		onEnter: function () {
			if (this.is_pre_building) return;

			var msg = "建筑工事";
			if (this.map.is_main_map) {
				msg = TD._t("building_info" + (this.type == "wall" ? "_wall" : ""), [TD._t("building_name_" + this.type), this.level, this.damage, this.speed, this.range, this.killed]);
			} else {
				msg = TD._t("building_intro_" + this.type, [TD.getDefaultBuildingAttributes(this.type).cost]);
			}

			this.scene.panel.balloontip.msg(msg, this.grid);
		},

		onOut: function () {
			if (this.scene.panel.balloontip.el == this.grid) {
				this.scene.panel.balloontip.hide();
			}
		},

		onClick: function () {
			if (this.is_pre_building || this.scene.state != 1) return;
			this.toggleSelected();
		}
	};

	/**
	 * @param id {String}
	 * @param cfg {object} Configuration Object
	 *         At a minimum, you need to include the following:
	 *         {
	 *			 type: Building type, optional values have
	 *				 "wall"
	 *				 "cannon"
	 *				 "LMG"
	 *				 "HMG"
	 *				 "laser_gun"
	 *		 }
	 */
	TD.Building = function (id, cfg) {
		cfg.on_events = ["enter", "out", "click"];
		var building = new TD.Element(id, cfg);
		TD.lang.mix(building, building_obj);
		building._init(cfg);

		return building;
	};


	// bullet The properties and methods of the object. Note that there are no arrays, objects, etc. in the attribute
	// Reference property, or the related properties of multiple instances conflict
	var bullet_obj = {
		_init: function (cfg) {
			cfg = cfg || {};

			this.speed = cfg.speed;
			this.damage = cfg.damage;
			this.target = cfg.target;
			this.cx = cfg.x;
			this.cy = cfg.y;
			this.r = cfg.r || Math.max(Math.log(this.damage), 2);
			if (this.r < 1) this.r = 1;
			if (this.r > 6) this.r = 6;

			this.building = cfg.building || null;
			this.map = cfg.map || this.building.map;
			this.type = cfg.type || 1;
			this.color = cfg.color || "#000";

			this.map.bullets.push(this);
			this.addToScene(this.map.scene, 1, 6);

			if (this.type == 1) {
				this.caculate();
			}
		},

		/**
		 * Calculate the number of bullets
		 */
		caculate: function () {
			var sx, sy, c,
				tx = this.target.cx,
				ty = this.target.cy,
				speed;
			sx = tx - this.cx;
			sy = ty - this.cy;
			c = Math.sqrt(Math.pow(sx, 2) + Math.pow(sy, 2));
			speed = 20 * this.speed * TD.global_speed;
			this.vx = sx * speed / c;
			this.vy = sy * speed / c;
		},

		/**
		 * Check if the current bullet is out of the map range
		 */
		checkOutOfMap: function () {
			this.is_valid = !(
				this.cx < this.map.x ||
				this.cx > this.map.x2 ||
				this.cy < this.map.y ||
				this.cy > this.map.y2
			);

			return !this.is_valid;
		},

		/**
		 * Check if the current bullet hit the monster.
		 */
		checkHit: function () {
			var cx = this.cx,
				cy = this.cy,
				r = this.r * _TD.retina,
				monster = this.map.anyMonster(function (obj) {
					return Math.pow(obj.cx - cx, 2) + Math.pow(obj.cy - cy, 2) <= Math.pow(obj.r + r, 2) * 2;
				});

			if (monster) {
				// Hit the monster
				monster.beHit(this.building, this.damage);
				this.is_valid = false;

				// Bullet small explosion effect
				TD.Explode(this.id + "-explode", {
					cx: this.cx,
					cy: this.cy,
					r: this.r,
					step_level: this.step_level,
					render_level: this.render_level,
					color: this.color,
					scene: this.map.scene,
					time: 0.2
				});

				return true;
			}
			return false;
		},

		step: function () {
			if (this.checkOutOfMap() || this.checkHit()) return;

			this.cx += this.vx;
			this.cy += this.vy;
		},

		render: function () {
			var ctx = TD.ctx;
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.arc(this.cx, this.cy, this.r, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.fill();
		}
	};

	/**
	 * @param id {String} Configuration Object
	 * @param cfg {Object} Configuration Object
	 *         At a minimum, you need to include the following:
	 *         {
	 *			 x: The location of the bullet
	 *			 y: The location of the bullet
	 *			 speed:
	 *			 damage:
	 *			 target: Target, a monster object.
	 *			 building: The building that belongs to
	 *		 }
	 * Bullet types, you can have the following types:
	 *         1: Ordinary Bullets
	 *         2: Laser type, hit immediately after launch
	 *         3: Missile class, hit will explode, bring face attack
	 */
	TD.Bullet = function (id, cfg) {
		var bullet = new TD.Element(id, cfg);
		TD.lang.mix(bullet, bullet_obj);
		bullet._init(cfg);

		return bullet;
	};

}); // _TD.a.push end

