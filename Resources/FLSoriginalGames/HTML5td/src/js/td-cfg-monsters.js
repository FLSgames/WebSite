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
	 * Default Monster Rendering method
	 */
	function defaultMonsterRender() {
		if (!this.is_valid || !this.grid) return;
		var ctx = TD.ctx;

		// Draw a circle to represent the monster
		ctx.strokeStyle = "#000";
		ctx.lineWidth = 1;
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.cx, this.cy, this.r, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		// Draw the life of the monster
		if (TD.show_monster_life) {
			var s = Math.floor(TD.grid_size / 4),
				l = s * 2 - 2 * _TD.retina;
			ctx.fillStyle = "#000";
			ctx.beginPath();
			ctx.fillRect(this.cx - s, this.cy - this.r - 6, s * 2, 4 * _TD.retina);
			ctx.closePath();
			ctx.fillStyle = "#f00";
			ctx.beginPath();
			ctx.fillRect(this.cx - s + _TD.retina, this.cy - this.r - (6 - _TD.retina), this.life * l / this.life0, 2 * _TD.retina);
			ctx.closePath();
		}
	}

	/**
	 * Get the default properties for monsters
	 * @param [monster_idx] {Number} Types of Monsters
	 * @return attributes {Object}
	 */
	TD.getDefaultMonsterAttributes = function (monster_idx) {

		var monster_attributes = [
			{
				// idx: 0
				name: "monster 1",
				desc: "The weakest monster.",
				speed: 3,
				max_speed: 10,
				life: 50,
				damage: 1, // How much damage will be done when you reach the end (1 ~ 10)
				shield: 0,
				money: 5 // How much money is available to destroy this monster (optional)
			},
			{
				// idx: 1
				name: "monster 2",
				desc: "Slightly stronger little Monsters",
				speed: 6,
				max_speed: 20,
				life: 50,
				damage: 2, // How much damage will be done when you reach the end (1 ~ 10)
				shield: 1
			},
			{
				// idx: 2
				name: "monster speed",
				desc: "The fast-moving little monsters.",
				speed: 12,
				max_speed: 30,
				life: 50,
				damage: 3, //How much damage will be done when you reach the end (1 ~ 10)
				shield: 1
			},
			{
				// idx: 3
				name: "monster life",
				desc: "A very strong little monster of life.",
				speed: 5,
				max_speed: 10,
				life: 500,
				damage: 3, // How much damage will be done when you reach the end (1 ~ 10)
				shield: 1
			},
			{
				// idx: 4
				name: "monster shield",
				desc: "A very strong defensive little freak.",
				speed: 5,
				max_speed: 10,
				life: 50,
				damage: 3, // How much damage will be done when you reach the end (1 ~ 10)
				shield: 20
			},
			{
				// idx: 5
				name: "monster damage",
				desc: "The little freak with the big damage.",
				speed: 7,
				max_speed: 14,
				life: 50,
				damage: 10, // How much damage will be done when you reach the end (1 ~ 10)
 				shield: 2
			},
			{
				// idx: 6
				name: "monster speed-life",
				desc: "Monsters with high speed and life",
				speed: 15,
				max_speed: 30,
				life: 100,
				damage: 3, // How much damage will be done when you reach the end (1 ~ 10)
 				shield: 3
			},
			{
				// idx: 7
				name: "monster speed-2",
				desc: "Fast Monsters.",
				speed: 30,
				max_speed: 40,
				life: 30,
				damage: 4, // How much damage will be done when you reach the end (1 ~ 10)
 				shield: 1
			},
			{
				// idx: 8
				name: "monster shield-life",
				desc: "A monster with very strong defenses and high life values.",
				speed: 3,
				max_speed: 10,
				life: 300,
				damage: 5, // How much damage will be done when you reach the end (1 ~ 10) 
				shield: 15
			}
		];

		if (typeof monster_idx == "undefined") {
			// If only one argument is passed, only the number of monsters defined (for TD. JS) is returned.
			return monster_attributes.length;
		}

		var attr = monster_attributes[monster_idx] || monster_attributes[0],
			attr2 = {};

		TD.lang.mix(attr2, attr);
		if (!attr2.render) {
			// If you do not specify a rendering method for the current monster
			attr2.render = defaultMonsterRender
		}

		return attr2;
	};


	/**
	 * Generate a list of monsters,
 	 * Contains n monsters
 	 * The monster type is specified in the range and is random if unspecified
 	 */
	TD.makeMonsters = function (n, range) {
		var a = [], count = 0, i, c, d, r, l = TD.monster_type_count;
		if (!range) {
			range = [];
			for (i = 0; i < l; i++) {
				range.push(i);
			}
		}

		while (count < n) {
			d = n - count;
			c = Math.min(
				Math.floor(Math.random() * d) + 1,
				3 //Monsters of the same type show up to 3 at a time, preventing a large number of high defense or high speed monsters in a particular wave.
 			);
			r = Math.floor(Math.random() * l);
			a.push([c, range[r]]);
			count += c;
		}

		return a;
	};


}); // _TD.a.push end
