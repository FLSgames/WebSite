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
	 * Use the A * algorithm (Dijkstra algorithm?) To find the shortest route from (x1, y1) to (x2, y2)
	 *
	 */
	TD.FindWay = function (w, h, x1, y1, x2, y2, f_passable) {
		this.m = [];
		this.w = w;
		this.h = h;
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.way = [];
		this.len = this.w * this.h;
		this.is_blocked = this.is_arrived = false;
		this.fPassable = typeof f_passable == "function" ? f_passable : function () {
			return true;
		};

		this._init();
	};

	TD.FindWay.prototype = {
		_init: function () {
			if (this.x1 == this.x2 && this.y1 == this.y2) {
				//If the coordinates you entered are already at the end. 
				this.is_arrived = true;
				this.way = [
					[this.x1, this.y1]
				];
				return;
			}

			for (var i = 0; i < this.len; i++)
				this.m[i] = -2; // -2 means not explored,-1 means unreachable

			this.x = this.x1;
			this.y = this.y1;
			this.distance = 0;
			this.current = [
				[this.x, this.y]
			]; //The current one-step exploration of the lattice

			this.setVal(this.x, this.y, 0);

			while (this.next()) {
			}
		},
		getVal: function (x, y) {
			var p = y * this.w + x;
			return p < this.len ? this.m[p] : -1;
		},
		setVal: function (x, y, v) {
			var p = y * this.w + x;
			if (p > this.len) return false;
			this.m[p] = v;
		},
		/**
		* The neighbor with the specified coordinates, that is, from the specified coordinates, within 1 steps can reach the lattice
		* Currently returns the top, bottom, left, and right four neighbourhoods of the specified lattice
		* @param x {Number}
		* @param y {Number}
		*/
		getNeighborsOf: function (x, y) {
			var nbs = [];
			if (y > 0) nbs.push([x, y - 1]);
			if (x < this.w - 1) nbs.push([x + 1, y]);
			if (y < this.h - 1) nbs.push([x, y + 1]);
			if (x > 0) nbs.push([x - 1, y]);

			return nbs;
		},
		/**
		 *Gets all the neighbors of the n grid that are currently reachable by one step
		 */
		getAllNeighbors: function () {
			var nbs = [], nb1, i, c, l = this.current.length;
			for (i = 0; i < l; i++) {
				c = this.current[i];
				nb1 = this.getNeighborsOf(c[0], c[1]);
				nbs = nbs.concat(nb1);
			}
			return nbs;
		},
		/**
		* Backward from the end, looking for the nearest path from the beginning to the end
		* The implementation here is to find the lowest (and more than 0) grid from the current grid, starting from the end point,
		* Until the beginning of the arrival.
		* This implementation needs to be repeated to find the neighborhood, and sometimes the value of more than one lattice in the adjacent lattice is the lowest, then
		* Randomly select one. Another way to do this is to add in the first traversal to each of the squares that have arrived
		* A value that points to the lattice (parent lattice) of its coming.
		*/
		findWay: function () {
			var x = this.x2,
				y = this.y2,
				nb, max_len = this.len,
				nbs_len,
				nbs, i, l, v, min_v = -1,
				closest_nbs;

			while ((x != this.x1 || y != this.y1) && min_v != 0 &&
			this.way.length < max_len) {

				this.way.unshift([x, y]);

				nbs = this.getNeighborsOf(x, y);
				nbs_len = nbs.length;
				closest_nbs = [];

				//Find the smallest V in the neighborhood
				min_v = -1;
				for (i = 0; i < nbs_len; i++) {
					v = this.getVal(nbs[i][0], nbs[i][1]);
					if (v < 0) continue;
					if (min_v < 0 || min_v > v)
						min_v = v;
				}
				//Find all the smallest neighbourhoods in the V
				for (i = 0; i < nbs_len; i++) {
					nb = nbs[i];
					if (min_v == this.getVal(nb[0], nb[1])) {
						closest_nbs.push(nb);
					}
				}

				//Randomly select one from the smallest neighbor of the V as the current grid
				l = closest_nbs.length;
				i = l > 1 ? Math.floor(Math.random() * l) : 0;
				nb = closest_nbs[i];

				x = nb[0];
				y = nb[1];
			}
		},
		/**
		 * Reach the end
		 */
		arrive: function () {
			this.current = [];
			this.is_arrived = true;

			this.findWay();
		},
		/**
		 * Roads are blocked.
		 */
		blocked: function () {
			this.current = [];
			this.is_blocked = true;
		},
		/**
		* Next iteration
		* @return {Boolean} If the return value is true, indicates that the endpoint is not reached and that the path
		* Not blocked, can continue iteration;
		*/
		next: function () {
			var neighbors = this.getAllNeighbors(), nb,
				l = neighbors.length,
				valid_neighbors = [],
				x, y,
				i, v;

			this.distance++;

			for (i = 0; i < l; i++) {
				nb = neighbors[i];
				x = nb[0];
				y = nb[1];
				if (this.getVal(x, y) != -2) continue; //Current lattice has been explored
				//grid = this.map.getGrid(x, y);
				//if (!grid) continue;

				if (this.fPassable(x, y)) {
					// Can be

					/**
					* From the beginning to the cost of the current lattice
					* Here's simply to take a few steps from the beginning to the current grid as a waste.
					* In a more complex situation, it may also be necessary to consider the different road costs,
					* For example, wetlands are more expensive than plains. But the current version of the road is not so complicated,
					* Don't consider it first.
					 */
					v = this.distance;

					valid_neighbors.push(nb);
				} else {
					//Do not pass or have a building block
					v = -1;
				}

				this.setVal(x, y, v);

				if (x == this.x2 && y == this.y2) {
					this.arrive();
					return false;
				}
			}

			if (valid_neighbors.length == 0) {
				this.blocked();
				return false
			}
			this.current = valid_neighbors;

			return true;
		}
	};

}); // _TD.a.push end


