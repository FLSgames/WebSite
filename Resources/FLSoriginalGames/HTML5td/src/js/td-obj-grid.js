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

	// grid The properties and methods of the grid object. Note that there are no arrays, objects, etc. in the attribute
	// Reference property, or the related properties of multiple instances conflict
    	var grid_obj = {
		_init: function (cfg) {
			cfg = cfg || {};
			this.map = cfg.map;
			this.scene = this.map.scene;
			this.mx = cfg.mx; // Lattice coordinates in map
			this.my = cfg.my;
			this.width = TD.grid_size;
			this.height = TD.grid_size;
			this.is_entrance = this.is_exit = false;
			this.passable_flag = 1; // 0: 不可通过; 1: 可通过
			this.build_flag = 1;// 0: 不可修建; 1: 可修建; 2: 已修建
			this.building = null;
			this.caculatePos();
		},

		/**
		 * Calculates the grid position according to the map location and the grid's (MX, my)
 		 */
		caculatePos: function () {
			this.x = this.map.x + this.mx * TD.grid_size;
			this.y = this.map.y + this.my * TD.grid_size;
			this.x2 = this.x + TD.grid_size;
			this.y2 = this.y + TD.grid_size;
			this.cx = Math.floor(this.x + TD.grid_size / 2);
			this.cy = Math.floor(this.y + TD.grid_size / 2);
		},

		/**
		 * Check if building something in the current grid will cause the starting point and end point to be blocked
 		 */
		checkBlock: function () {
			if (this.is_entrance || this.is_exit) {
				this._block_msg = TD._t("entrance_or_exit_be_blocked");
				return true;
			}

			var is_blocked,
				_this = this,
				fw = new TD.FindWay(
					this.map.grid_x, this.map.grid_y,
					this.map.entrance.mx, this.map.entrance.my,
					this.map.exit.mx, this.map.exit.my,
					function (x, y) {
						return !(x == _this.mx && y == _this.my) && _this.map.checkPassable(x, y);
					}
				);

			is_blocked = fw.is_blocked;

			if (!is_blocked) {
				is_blocked = !!this.map.anyMonster(function (obj) {
					return obj.chkIfBlocked(_this.mx, _this.my);
				});
				if (is_blocked)
					this._block_msg = TD._t("monster_be_blocked");
			} else {
				this._block_msg = TD._t("blocked");
			}

			return is_blocked;
		},

		/**
		 * Buy Building
 		 * @param building_type {String}
		 */
		buyBuilding: function (building_type) {
			var cost = TD.getDefaultBuildingAttributes(building_type).cost || 0;
			if (TD.money >= cost) {
				TD.money -= cost;
				this.addBuilding(building_type);
			} else {
				TD.log(TD._t("not_enough_money", [cost]));
				this.scene.panel.balloontip.msg(TD._t("not_enough_money", [cost]), this);
			}
		},

		/**
		 * Add the specified type of building in the current grid
 		 * @param building_type {String}
		 */
		addBuilding: function (building_type) {
			if (this.building) {
				// If the current grid already has a construction, remove it first
 				this.removeBuilding();
			}

			var building = new TD.Building("building-" + building_type + "-" + TD.lang.rndStr(), {
				type: building_type,
				step_level: this.step_level,
				render_level: this.render_level
			});
			building.locate(this);

			this.scene.addElement(building, this.step_level, this.render_level + 1);
			this.map.buildings.push(building);
			this.building = building;
			this.build_flag = 2;
			this.map.checkHasWeapon();
			if (this.map.pre_building)
				this.map.pre_building.hide();
		},

		/**
		 * Remove the construction of the current lattice
 		 */
		removeBuilding: function () {
			if (this.build_flag == 2)
				this.build_flag = 1;
			if (this.building)
				this.building.remove();
			this.building = null;
		},

		/**
		 * Add a monster to the current building
 		 * @param monster
		 */
		addMonster: function (monster) {
			monster.beAddToGrid(this);
			this.map.monsters.push(monster);
			monster.start();
		},

		/**
		 * Highlight current lattice
 		 * @param show {Boolean}
		 */
		hightLight: function (show) {
			this.map.select_hl[show ? "show" : "hide"](this);
		},

		render: function () {
			var ctx = TD.ctx,
				px = this.x + 0.5,
				py = this.y + 0.5;

			//if (this.map.is_main_map) {
			//ctx.drawImage(this.map.res,
			//0, 0, 32, 32, this.x, this.y, 32, 32
			//);
			//}

			if (this.is_hover) {
				ctx.fillStyle = "rgba(255, 255, 200, 0.2)";
				ctx.beginPath();
				ctx.fillRect(px, py, this.width, this.height);
				ctx.closePath();
				ctx.fill();
			}

			if (this.passable_flag == 0) {
				// Not available
 				ctx.fillStyle = "#fcc";
				ctx.beginPath();
				ctx.fillRect(px, py, this.width, this.height);
				ctx.closePath();
				ctx.fill();
			}

			/**
			 * Painting entrances and exits
 			 */
			if (this.is_entrance || this.is_exit) {
				ctx.lineWidth = 1;
				ctx.fillStyle = "#ccc";
				ctx.beginPath();
				ctx.fillRect(px, py, this.width, this.height);
				ctx.closePath();
				ctx.fill();

				ctx.strokeStyle = "#666";
				ctx.fillStyle = this.is_entrance ? "#fff" : "#666";
				ctx.beginPath();
				ctx.arc(this.cx, this.cy, TD.grid_size * 0.325, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			}

			ctx.strokeStyle = "#eee";
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.strokeRect(px, py, this.width, this.height);
			ctx.closePath();
			ctx.stroke();
		},

		/**
		 * Mouse into current lattice event
		 */
		onEnter: function () {
			if (this.map.is_main_map && TD.mode == "build") {
				if (this.build_flag == 1) {
					this.map.pre_building.show();
					this.map.pre_building.locate(this);
				} else {
					this.map.pre_building.hide();
				}
			} else if (this.map.is_main_map) {
				var msg = "";
				if (this.is_entrance) {
					msg = TD._t("entrance");
				} else if (this.is_exit) {
					msg = TD._t("exit");
				} else if (this.passable_flag == 0) {
					msg = TD._t("_cant_pass");
				} else if (this.build_flag == 0) {
					msg = TD._t("_cant_build");
				}

				if (msg) {
					this.scene.panel.balloontip.msg(msg, this);
				}
			}
		},

		/**
		 * Mouse out of current lattice event
 		 */
		onOut: function () {
			// If the current balloon tip points to the grid, hide it
 			if (this.scene.panel.balloontip.el == this) {
				this.scene.panel.balloontip.hide();
			}
		},

		/**
		 * Mouse clicked the current lattice event
 		 */
		onClick: function () {
			if (this.scene.state != 1) return;

			if (TD.mode == "build" && this.map.is_main_map && !this.building) {
				// If you are in construction mode and click on the empty grid on the main map, try to build the designated building
				if (this.checkBlock()) {
					// Between the beginning and the end is blocked, cannot build
 					this.scene.panel.balloontip.msg(this._block_msg, this);
				} else {
					// Buy Building
 					this.buyBuilding(this.map.pre_building.type);
				}
			} else if (!this.building && this.map.selected_building) {
				// Cancel the selected building
 				this.map.selected_building.toggleSelected();
				this.map.selected_building = null;
			}
		}
	};

	/**
	 * @param id {String}
	 * @param cfg {object} Configuration Object
 	 *         At a minimum, you need to include the following:
 	 *         {
	 * MX: The horizontal coordinates in the map grid,
	 * my: The vertical coordinates in the map grid,
	 * Map: Which map belongs to,
	 *		 }
	 */
	TD.Grid = function (id, cfg) {
		cfg.on_events = ["enter", "out", "click"];

		var grid = new TD.Element(id, cfg);
		TD.lang.mix(grid, grid_obj);
		grid._init(cfg);

		return grid;
	};

}); // _TD.a.push end
