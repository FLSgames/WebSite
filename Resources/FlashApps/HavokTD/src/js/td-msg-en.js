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

	TD._msg_texts = {
		"_cant_build": "Bro, you can't build here!",
		"_cant_pass": "F#¢&'n $H!T, can't pass!",
		"entrance": "DEMON HELL SPAWN",
		"exit": "Escape Portal",
		"not_enough_money": "You are too poor! Not enough coins mate, need $${0}.",
		"wave_info": "Wave: ${0}",
		"panel_money_title": "Coins				 			:",
		"panel_score_title": "Slayer Score	:",
		"panel_life_title": "Lives								:",
		"panel_building_title": "Towers Active:",
		"panel_monster_title": "Demons Left		:",
		"building_name_block": "Path Blocker",
		"building_name_cannon": "Cannon",
		"building_name_LMG": "LMG",
		"building_name_HMG": "HMG",
		"building_name_laser_gun": "Laser gun",
		"building_info": "${0}: Level ${1}, Damage ${2}, Speed ${3}, Range ${4}, Kills ${5}",
		"building_info_wall": "${0}",
		"building_intro_wall": "Path Blocker: monsters could not pass ($${0})",
		"building_intro_cannon": "Cannon: balnce in range and damage ($${0})",
		"building_intro_LMG": "Light Machine Gun: longer range, normal damage ($${0})",
		"building_intro_HMG": "Heavy Machine Gun: fast shoot, good damage, normal range ($${0})",
		"building_intro_Rockets": "Rocket Launcher: fast af bro! Great damage, best range ($${0})",
		"building_intro_laser_gun": "Laser gun: greater damage, 100% hit ($${0})",
		"click_to_build": "Left click to build ${0} ($${1})",
		"upgrade": "Upgrade ${0} to level ${1} , cost $${2}。",
		"sell": "Sell ${0} for $${1}",
		"upgrade_success": "Upgrade success! ${0} upgrade to level ${1}. Next upgrade will cost $${2}.",
		"monster_info": "Demon status: Life ${0}, Shield ${1}, Speed ${2}, Damage ${3}",
		"button_upgrade_text": "Upgrade",
		"button_sell_text": "Peddle",
		"button_start_text": "Release Demons!",
		"button_restart_text": "Restart",
		"button_pause_text": "Pause",
		"button_continue_text": "Continue",
		"button_pause_desc_0": "Pause the game",
		"button_pause_desc_1": "Resume the game",
		"blocked": "Bro! You can't build here, it will block the way from entrance to the exit!",
		"monster_be_blocked": "Dude, no, you can't build that here, some Demon will be blocked!",
		"entrance_or_exit_be_blocked": "Can't build on the entrance or the exit! DUHH!!!",
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
