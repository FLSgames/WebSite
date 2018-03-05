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

	TD.lang = {
		/**
		 * Document. Shorthand for getElementById methods
		 * @param el_id {String}
		 */
		$e: function (el_id) {
			return document.getElementById(el_id);
		},

		/**
		 * Create a DOM element
		 * @param tag_name {String}
		 * @param attributes {Object}
		 * @param parent_node {HTMLElement}
		 * @return {HTMLElement}
		 */
		$c: function (tag_name, attributes, parent_node) {
			var el = document.createElement(tag_name);
			attributes = attributes || {};

			for (var k in attributes) {
				if (attributes.hasOwnProperty(k)) {
					el.setAttribute(k, attributes[k]);
				}
			}

			if (parent_node)
				parent_node.appendChild(el);

			return el;
		},

		/**
		 * Intercept n characters from left of string s
         * If the Chinese character is included, the Chinese character is calculated by two characters
		 * @param n {Number}
		 */
		strLeft: function (s, n) {
			var s2 = s.slice(0, n),
				i = s2.replace(/[^\x00-\xff]/g, "**").length;
			if (i <= n) return s2;
			i -= s2.length;
			switch (i) {
				case 0:
					return s2;
				case n:
					return s.slice(0, n >> 1);
				default:
					var k = n - i,
						s3 = s.slice(k, n),
						j = s3.replace(/[\x00-\xff]/g, "").length;
					return j ?
					s.slice(0, k) + this.arguments.callee(s3, j) :
						s.slice(0, k);
			}
		},

		/**
		 * Gets the byte length of a string
         * Chinese characters, such as the length of 2, English, digital and so on 1
		 * @param s {String}
		 */
		strLen2: function (s) {
			return s.replace(/[^\x00-\xff]/g, "**").length;
		},

		/**
		 * Executes the specified method on each element of an array
		 * @param list {Array}
		 * @param f {Function}
		 */
		each: function (list, f) {
			if (Array.prototype.forEach) {
				list.forEach(f);
			} else {
				for (var i = 0, l = list.length; i < l; i++) {
					f(list[i]);
				}
			}
		},

		/**
		 * Executes the specified method in sequence for each item of an array until the return value of an item is true
		 * Returns the first element that has the F value true, and if there is no element to make the F value true,
		 *  null Returns
		 * @param list {Array}
		 * @param f {Function}
		 * @return {Object}
		 */
		any: function (list, f) {
			for (var i = 0, l = list.length; i < l; i++) {
				if (f(list[i]))
					return list[i];
			}
			return null;
		},

		/**
		 * Eject the elements in the list in turn and manipulate them
		 * Note that the original array will be emptied after execution.
		 * Similar to each, the difference is that the original array will be emptied after the function is executed
		 * @param list {Array}
		 * @param f {Function}
		 */
		shift: function (list, f) {
			while (list[0]) {
				f(list.shift());
//			f.apply(list.shift(), args);
			}
		},

		/**
		 * Passing in an array, sorting it randomly and returning
		 * Returns a new array that does not change the original array
		 * @param list {Array}
		 * @return {Array}
		 */
		rndSort: function (list) {
			var a = list.concat();
			return a.sort(function () {
				return Math.random() - 0.5;
			});
		},

		_rndRGB2: function (v) {
			var s = v.toString(16);
			return s.length == 2 ? s : ("0" + s);
		},
		/**
		 * Randomly generate an RGB color
		 */
		rndRGB: function () {
			var r = Math.floor(Math.random() * 256),
				g = Math.floor(Math.random() * 256),
				b = Math.floor(Math.random() * 256);

			return "#" + this._rndRGB2(r) + this._rndRGB2(g) + this._rndRGB2(b);
		},
		/**
		 * Converts an RGB color string to an array
		 * eg: '#ffffff' => [255, 255, 255]
		 * @param rgb_str {string} RGB color string, similar to ' #f8c693 '
		 */
		rgb2Arr: function (rgb_str) {
			if (rgb_str.length != 7) return [0, 0, 0];

			var r = rgb_str.substr(1, 2),
				g = rgb_str.substr(3, 2),
				b = rgb_str.substr(3, 2);

			return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
		},

		/**
		 * Generate a random string of length n
 		 *
		 * @param [n] {Number}
		 */
		rndStr: function (n) {
			n = n || 16;
			var chars = "1234567890abcdefghijklmnopqrstuvwxyz",
				a = [],
				i, chars_len = chars.length, r;

			for (i = 0; i < n; i++) {
				r = Math.floor(Math.random() * chars_len);
				a.push(chars.substr(r, 1));
			}
			return a.join("");
		},

		/**
		 * Null function, commonly used for placeholder
		 */
		nullFunc: function () {
		},

		/**
		 * Determine whether two arrays are equal
		 *
		 * @param arr1 {Array}
		 * @param arr2 {Array}
		 */
		arrayEqual: function (arr1, arr2) {
			var i, l = arr1.length;

			if (l != arr2.length) return false;

			for (i = 0; i < l; i++) {
				if (arr1[i] != arr2[i]) return false;
			}

			return true;
		},

		/**
		 * Copy all properties of S to R
		 * @param r {Object}
		 * @param s {Object}
		 * @param [is_overwrite] {Boolean} If specified as false, the existing value is not overwritten, and other values
		 *      Includes undefined, which means that the property with the same name in S will overwrite the value in R
		 */
		mix: function (r, s, is_overwrite) {
			if (!s || !r) return r;

			for (var p in s) {
				if (s.hasOwnProperty(p) && (is_overwrite !== false || !(p in r))) {
					r[p] = s[p];
				}
			}
			return r;
		}
	};

}); // _TD.a.push end
