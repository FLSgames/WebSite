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

	TD._msg_texts = {
		"_cant_build": "It can't be built here.",
		"_cant_pass": "Monsters can't get through here",
        "entrance": "Starting point",
        "exit": "End",
        "not_enough_money": "Money is insufficient, need $${0}!",
        "wave_info": "The first ${0} wave",
		"panel_money_title": "Money:",
        "panel_score_title": "Integral:",
        "panel_life_title": "Life:",
        "panel_building_title": "Architecture:",
        "panel_monster_title": "Monster:",
        "building_name_wall": "Roadblocks",
        "building_name_cannon": "Fort",
        "bUILDING_NAME_LMG": "Light machine Guns",
        "bUILDING_NAME_HMG": "Heavy machine gun",
        "building_name_laser_gun": "Laser Cannon",
        "building_info": "${0}: Rank ${1}, attack ${2}, Speed ${3}, range ${4}, record ${5}",
        "building_info_wall": "${0}",
        "building_intro_wall": "Roadblocks can stop monsters from passing ($${0})",
        "building_intro_cannon": "Fort Range, lethality more balanced ($${0})",
        "BUILDING_INTRO_LMG": "Light machine guns range far, lethal general ($${0})",
        "BUILDING_INTRO_HMG": "Heavy machine gun quick fire, powerful, range general ($${0})",
        "building_intro_laser_gun": "Laser gun damage is greater, hit rate 100% ($${0})",
        "click_to_build": "Left-click to build ${0} ($${1})",
        "upgrade": "Upgrade ${0} to ${1} level, it takes $${2}.",
        "sell": "Sell ${0}, can get $${1}",
        "upgrade_success": "Upgrade successful, ${0} has been upgraded to ${1} level! The next upgrade requires $${2}. ",
        "monster_info": "Monster: Life ${0}, Defense ${1}, Speed ${2}, Damage ${3}",
        "button_upgrade_text": "Upgrade",
        "button_sell_text": "Sell",
        "button_start_text": "Start",
        "button_restart_text": "Start Again",
        "button_pause_text": "Pause",
        "button_continue_text": "Continue",
        "button_pause_desc_0": "Game Paused",
        "button_pause_desc_1": "The game Continues",
        "blocked": "There is no building here, there must be at least one road between the starting point and the finish line!",
        "monster_be_blocked": "Can't build buildings here, there are monsters surrounded!",
        "entrance_or_exit_be_blocked": "You can't build a building at the beginning or the end!",
		"_": "ERROR",
	};

	TD._t = TD.translate = function (k, args) {
		args = (typeof args == "object" && args.constructor == Array) ? args : [];
		var msg = this._msg_texts[k] || this._msg_texts["_"],
			i,
			l = args.length;
		for (i = 0; i < l; i++) {
			msg = msg.replace("${" + i + "}", args[i]);
		}

		return msg;
	};


}); // _TD.a.push end
