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

// main stage Initialization method
 	var _stage_main_init = function () {
			var act = new TD.Act(this, "act-1"),
				scene = new TD.Scene(act, "scene-1"),
				cfg = TD.getDefaultStageData("scene_endless");

			this.config = cfg.config;
			TD.life = this.config.life;
			TD.money = this.config.money;
			TD.score = this.config.score;
			TD.difficulty = this.config.difficulty;
			TD.wave_damage = this.config.wave_damage;

			// make map
			var map = new TD.Map("main-map", TD.lang.mix({
				scene: scene,
				is_main_map: true,
				step_level: 1,
				render_level: 2
			}, cfg.map));
			map.addToScene(scene, 1, 2, map.grids);
			scene.map = map;

			// make panel
			scene.panel = new TD.Panel("panel", TD.lang.mix({
				scene: scene,
				main_map: map,
				step_level: 1,
				render_level: 7
			}, cfg.panel));

			this.newWave = cfg.newWave;
			this.map = map;
			this.wait_new_wave = this.config.wait_new_wave;
		},
		_stage_main_step2 = function () {
			//TD.log(this.current_act.current_scene.wave);

			var scene = this.current_act.current_scene,
				wave = scene.wave;
			if ((wave == 0 && !this.map.has_weapon) || scene.state != 1) {
				return;
			}

			if (this.map.monsters.length == 0) {
				if (wave > 0 && this.wait_new_wave == this.config.wait_new_wave - 1) {
					// A wave of monsters just finished.
 					// Reward Life Value
 

					var wave_reward = 0;
					if (wave % 10 == 0) {
						wave_reward = 10;
					} else if (wave % 5 == 0) {
						wave_reward = 5;
					}
					if (TD.life + wave_reward > 100) {
						wave_reward = 100 - TD.life;
					}
					if (wave_reward > 0) {
						TD.recover(wave_reward);
					}
				}

				if (this.wait_new_wave > 0) {
					this.wait_new_wave--;
					return;
				}

				this.wait_new_wave = this.config.wait_new_wave;
				wave++;
				scene.wave = wave;
				this.newWave({
					map: this.map,
					wave: wave
				});
			}
		};

	TD.getDefaultStageData = function (k) {
		var data = {
			stage_main: {
				width: 1187 * _TD.retina, // px
				height: 700 * _TD.retina,
				init: _stage_main_init,
				step2: _stage_main_step2
			},

			scene_endless: {
				// scene 1
				map: {
					grid_x: 31,
					grid_y: 21,
					x: TD.padding,
					y: TD.padding,
					entrance: [0, 0],
					exit: [30, 20],
					grids_cfg: [
						
						{
							pos: [7, 15],
							build_flag: 0
						},
						
						//{
							
							//}, {
							//pos: [11, 9],
							//building: "cannon"
							//}, {
							//pos: [5, 2],
							//building: "HMG"
							//}, {
							//pos: [14, 9],
							//building: "LMG"
							//}, {
							//pos: [3, 14],
							//building: "LMG"
						//}
					]
				},
				panel: {
					x: TD.padding * 2 + TD.grid_size * 31,
					y: TD.padding,
					map: {
						grid_x: 5,
						grid_y: 3,
						x: 4,
						y: 110 * _TD.retina,
						grids_cfg: [
							{
								pos: [4, 0],
								building: "cannon"
							},
							{
								pos: [0, 0],
								building: "LMG"
							},
							{
								pos: [2, 0],
								building: "HMG"
							},
                            {
								pos: [2, 2],
								building: "Rockets"
							},
							{
								pos: [0, 2],
								building: "laser_gun"
							},
							{
								pos: [4, 2],
								building: "wall"
							}
						]
					}
				},
				config: {
					endless: true,
					wait_new_wave: TD.exp_fps * 3, // After how many step, we start a new wave.
					difficulty: 1.5, // Difficulty factor
 					wave: 0,
					max_wave: -1,
					wave_damage: 0, // How many points of life have been harmed by the current wave of monsters?
 					max_monsters_per_wave: 150, // How many monsters per wave?
 					money: 750,
					score: 0, // Points to start
 					life: 99,
					waves: [ // The first 10-wave monsters are defined here, automatically generated from the 11th wave.
 						[],
						// The first parameter is not used (No. 0 wave)
 
						// First wave
						[
							[1, 0] // A 0-Class monster.
						],

						// Second Wave
						[
							[1, 0], // A 0-Class monster.
 							[1, 1] // A 1-Class monster.
						],

						// wave 3
						[
							[2, 0], // 2 0 Categories of monsters
 							[1, 1] // A 1-Class monster.
 						],

						// wave 4
						[
							[2, 0],
							[1, 1]
						],

						// wave 5
						[
							[3, 0],
							[2, 1]
						],

						// wave 6
						[
							[4, 0],
							[2, 1]
						],

						// wave 7
						[
							[5, 0],
							[3, 1],
							[1, 2]
						],

						// wave 8
						[
							[6, 0],
							[4, 1],
							[1, 2]
						],

						// wave 9
						[
							[7, 0],
							[3, 1],
							[2, 2]
						],

						// wave 10
						[
							[8, 0],
							[4, 1],
							[3, 2]
						]
					]
				},

				/**
				 *The method of generating the nth wave Monster
 				 */
				newWave: function (cfg) {
					cfg = cfg || {};
					var map = cfg.map,
						wave = cfg.wave || 1,
					//difficulty = TD.difficulty || 1.0,
						wave_damage = TD.wave_damage || 0;

					// Automatic adjustment of the difficulty factor
					if (wave == 1) {
						//pass
					} else if (wave_damage == 0) {
						// No damage.
						if (wave < 5) {
							TD.difficulty *= 1.05;
						} else if (TD.difficulty > 30) {
							TD.difficulty *= 1.1;
						} else {
							TD.difficulty *= 1.2;
						}
					} else if (TD.wave_damage >= 50) {
						TD.difficulty *= 0.6;
					} else if (TD.wave_damage >= 30) {
						TD.difficulty *= 0.7;
					} else if (TD.wave_damage >= 20) {
						TD.difficulty *= 0.8;
					} else if (TD.wave_damage >= 10) {
						TD.difficulty *= 0.9;
					} else {
						// It's causing damage within 10.
						if (wave >= 10)
							TD.difficulty *= 1.05;
					}
					if (TD.difficulty < 1) TD.difficulty = 1;

					TD.log("wave " + wave + ", last wave damage = " + wave_damage + ", difficulty = " + TD.difficulty);

					//map.addMonsters(100, 7);
					//map.addMonsters2([[10, 7], [5, 0], [5, 5]]);
					//
					var wave_data = this.config.waves[wave] ||
							// Automatically generate monsters
						TD.makeMonsters(Math.min(
							Math.floor(Math.pow(wave, 1.1)),
							this.config.max_monsters_per_wave
						));
					map.addMonsters2(wave_data);

					TD.wave_damage = 0;
				}
			} // end of scene_endless
		};

		return data[k] || {};
	};

}); // _TD.a.push end


