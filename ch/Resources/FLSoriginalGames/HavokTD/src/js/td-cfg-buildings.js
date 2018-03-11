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
	 * Default upgrade Rules
 	 * @param old_level {Number}
	 * @param old_value {Number}
	 * @return new_value {Number}
	 */
	TD.default_upgrade_rule = function (old_level, old_value) {
		return old_value * 1.2;
	};

	/**
	 * Get the default properties for buildings
	 * @param building_type {String} Type of building
	 */
	TD.getDefaultBuildingAttributes = function (building_type) {

		var building_attributes = {
			// Path Blockers
			"wall": {
				damage: 0,
				range: 0,
				speed: 0,
				bullet_speed: 0,
				life: 100,
				shield: 500,
				cost: 10
			},
			// Guns
            "LMG": {
				damage: 13,
				range: 6,
				max_range: 13,
				speed: 3,
				bullet_speed: 9,
				life: 100,
				shield: 60,
				cost: 25
			},
			// Fort
            "cannon": {
				damage: 40,
				range: 4,
				max_range: 15,
				speed: 2,
				bullet_speed: 6,
				life: 100,
				shield: 100,
				cost: 100,
				_upgrade_rule_damage: function (old_level, old_value) {
					return old_value * (old_level <= 10 ? 1.2 : 1.3);
				}
			},		
			// Heavy machine guns
			"HMG": {
				damage: 60,
				range: 3,
				max_range: 16,
				speed: 3,
				bullet_speed: 5,
				life: 100,
				shield: 200,
				cost: 250,
				_upgrade_rule_damage: function (old_level, old_value) {
					return old_value * 1.3;
					}
			},
            // Rocket Lancher
            "Rockets": {
				damage: 90,
				range: 10,
				max_range: 5,
				speed: 10,
				bullet_speed: 15,
				life: 100,
				shield: 200,
				cost: 10000,
				_upgrade_rule_damage: function (old_level, old_value) {
					return old_value * 1.3;
				}
			},
			// Laser gun
			"laser_gun": {
				damage: 60,
				range: 6,
				max_range: 20,
				speed: 20,
//				bullet_speed: 10, // laser_gun 的 bullet_speed property is not used
				life: 100,
				shield: 100,
				cost: 500,
			}
		};

		return building_attributes[building_type] || {};
	};

}); // _TD.a.push end
