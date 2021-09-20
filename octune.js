const OCTUNE_VERSION = '1.0.0a';

//Are we in debug mode? See browser console.
var debug = false;

//Declared Statistics Variables
var stats_totalwatts = 0;
var stats_uptime = 0;
var stats_hwerrors = 0;
var systemSettings = [];
var stats_gputemp = [];
var stats_vramtemp = [];
var dark_theme_enabled = false;


$('#oc-profiles a').on('click', function (e) {
  e.preventDefault()
  $(this).tab('show')
})

/////////////////////////////////////////////////////////////
// @Internal Web Storage
// Provide a way to store data for our small app.
////////////////////////////////////////////////////////////
if (typeof(Storage) !== "undefined") {
		
	/////////////////////////////////////////////////
	// @System Settings
	////////////////////////////////////////////////
	if(localStorage.getItem("systemSettings") ==null) {
		
		systemSettings = { 'host': 'localhost', 'port': 18000, 'auth': '', 'voltage': 240, 'cpkwh': 0.18, 'currency': '£', vram_temp: 90, gpu_temp: 70, theme: 0 };
		localStorage.setItem("systemSettings", JSON.stringify(systemSettings));
		if(debug) {
			console.log("No system settings detected. Creating system settings.");
		}
		
	} else {
		systemSettings = JSON.parse(localStorage.getItem("systemSettings"));
        if(debug) {
            console.log("System settings detected. Loading from storage.");
            console.log(systemSettings);
        }
		
	}
	
	//Prefil Forms
	document.getElementById('settings_hostname').value = systemSettings['host'];
	document.getElementById('settings_port').value = systemSettings['port'];
	document.getElementById('settings_authtoken').value = systemSettings['auth'];
	document.getElementById('settings_voltage').value = systemSettings['voltage'];
	document.getElementById('settings_cpkwh').value = systemSettings['cpkwh'];
	$("#settings_currency").val(systemSettings['currency']);
	document.getElementById('settings_vram_temp').value = systemSettings['vram_temp'];
	document.getElementById('settings_gpu_temp').value = systemSettings['gpu_temp'];
	$("#settings_theme").val(systemSettings['theme']);
	
	//Prefill Elements
	document.getElementById('stats_voltage').innerHTML = systemSettings['voltage'];
	
	//Theme Dark
	if(systemSettings['theme'] == 1){
		
		//Enable DT
		dark_theme_enabled = true;
		
		$('body').css('background','#1f1f1f');
		$('body').css('color','#d2d2d2');
		
		//Navigation Bar
		$(".navbar ").removeClass("bg-light");
		$('.navbar').css('background','#2b2b2b');
		
		$('.btn-outline-secondary').addClass('btn-primary');
		$('.btn-outline-secondary').removeClass('btn-outline-secondary');
		
		//$('.navbar .btn-outline-secondary').css('background-color','transparent');
		//$('.navbar .btn-outline-secondary').css('border-color', '#FFFFFF');
		$('.navbar .btn-outline-secondary').removeAttr('style');
		
		//Stats Cards
		$(".stats-card").removeClass("bg-body");
		$(".stats-card").removeClass("border-0");
		$('.stats-card').css('color','#d2d2d2');
		$('.stats-card .card-title').css('color','#d2d2d2');
		$('.stats-card .card-text').css('color','#d2d2d2');
		$('.stats-card').css('background','#252525');
		$('.stats-card').css('border','1px solid #2b2b2b');
		
		//Cards
		$('.card').css('background','#232323');
		$('.card .card-header').css('background','#252525');
		$('.card').css('border','1px solid #2b2b2b');
		
		//Buttons
		$('.btn-primary').css('background-color','transparent');
		
		//Tables
		$('table').css('color','#d2d2d2');	
		$('table').each(function() {
            $('tr:odd',  this).addClass('odd').removeClass('even');
            $('tr:even', this).addClass('even').removeClass('odd');
        });
		
		$('table thead tr').css('background','#252525');
		$('table thead tr').css('color','#d2d2d2');
		$('tbody, td, tfoot, th, thead, tr').css('border-width','0px');	
		
		//Modal
		$('.modal.fade .modal-dialog').css('color', '#272727');
		$('.modal .btn-primary').removeAttr('style');
		
		//Tabs
		$('.tab-pane').removeClass('border');
		$('.tab-pane').css('border', '1px solid #2b2b2b');
		
		
		$('.nav-tabs ').css('border-color', '#2b2b2b');
		$('.nav-tabs ').css('color', '#d2d2d2');
		
		$('.nav-tabs .nav-link').css('color','#d2d2d2');
		$('.nav-tabs .nav-link').css('border-color', '#2b2b2b');
		$('.nav-tabs .nav-link').css('background-color', '#232323');
		
		$('.nav-tabs .nav-link.active').css('border-color', '#2b2b2b');
		$('.nav-tabs .nav-link.active').css('background-color', '#242424');
	}
	
	
	////////////////////////////////////////////////////
	//@Preset Settings (Prefill Fields)
	////////////////////////////////////////////////////
	for(var preset_id = 1; preset_id <= 5; preset_id++) {
		
		if(localStorage.getItem("presetSettings_p"+preset_id) !== null) {
					
			var presetSettings = JSON.parse(localStorage.getItem("presetSettings_p"+preset_id));

			//Preset Name
			document.getElementById('p'+preset_id + '-preset-name').value = presetSettings.preset_name;

			//OC Settings
			document.getElementById('p'+preset_id + '-selected-core').value = presetSettings.core_clock_delta;
			document.getElementById('p'+preset_id + '-selected-memory').value = presetSettings.mem_clock_delta;
			document.getElementById('p'+preset_id + '-selected-power').value = presetSettings.power_limit;
			document.getElementById('p'+preset_id + '-selected-core-volt2').value = presetSettings.max_core_voltage;

			//Fan Controller
			document.getElementById('p'+preset_id + '-selected-fan-mode').value = presetSettings.fan_mode;
			document.getElementById('p'+preset_id + '-selected-fan-speed').value = presetSettings.fixed_fan_speed;
			document.getElementById('p'+preset_id + '-selected-fan-temp-gpu').value = presetSettings.target_gpu_temp;
			document.getElementById('p'+preset_id + '-selected-fan-temp-vram').value = presetSettings.target_vram_hotspot;
			document.getElementById('p'+preset_id + '-selected-fan-level-max').value = presetSettings.max_fan_speed;

			//Set Preset Tab
			document.getElementById('nav-p'+preset_id+'-tab').innerHTML = presetSettings.preset_name;

			if(debug) {
				console.log("Preset settings detected. Loading from storage.");
				console.log(systemSettings);
			}
		
		}
			
	}
		
} else {
	
  // Sorry! No Web Storage support..
	alert('You do not have local web storage enabled for this browser. The settings have been set but will be lost on page refresh.');	
	
	if(debug) {
		console.log("Web Storage is disabled, loading default settings.");
		var systemSettings = { 'host': 'localhost', 'port': 18000, 'auth': 3, 'voltage': 220, 'cpkwh': 0.18, 'currency': '£' };
	}
}

/////////////////////////////////////////////////////////////
// @System Settings Save
// Allows us to save the current settings to browser.
////////////////////////////////////////////////////////////
function saveSettings() {
	
	//Do we have web storage enabled?
	if (typeof(Storage) == "undefined") {
		alert('You do not have local web storage enabled for this browser. The settings have been set but will be lost on page refresh.');	
	}
	
	var settings_host = document.getElementById('settings_hostname').value;
	var settings_port = document.getElementById('settings_port').value;
	var settings_authtoken = document.getElementById('settings_authtoken').value;
	var settings_voltage = document.getElementById('settings_voltage').value;
	var settings_cpkwh = document.getElementById('settings_cpkwh').value;
	var settings_currency = document.getElementById('settings_currency').value;
	var settings_vram = document.getElementById('settings_vram_temp').value;
	var settings_gpu = document.getElementById('settings_gpu_temp').value;
	var settings_theme = document.getElementById('settings_theme').value;
	
	systemSettings = { 'host': settings_host, 'port': settings_port, 'auth': settings_authtoken, 'voltage': settings_voltage, 'cpkwh': settings_cpkwh, 'currency': settings_currency, vram_temp: settings_vram, gpu_temp: settings_gpu, theme:  settings_theme};
	localStorage.setItem("systemSettings", JSON.stringify(systemSettings));
	
	if(localStorage.getItem("systemSettings") !== "undefined") {
		systemSettings = JSON.parse(localStorage.getItem("systemSettings"));
	}
	
	//Prefill Elements
	document.getElementById('stats_voltage').innerHTML = systemSettings['voltage'];
	
}

document.getElementById("settings_save").onclick = function(){ 
	saveSettings(); 
	location.reload();
};

/////////////////////////////////////////////////////////////
// @Overclocking Preset Profiles
// Allows the user to quicly apply preset overclocks.
////////////////////////////////////////////////////////////
function preset_save(preset_id) {
	
	//Show Loading
	document.getElementById('p'+preset_id + '-save-spinner').style.display = 'block';
		
	//Preset Name
	var preset_name = document.getElementById('p'+preset_id + '-preset-name').value;
	
	//OC Settings
	var core_clock_delta = document.getElementById('p'+preset_id + '-selected-core').value;
	var mem_clock_delta = document.getElementById('p'+preset_id + '-selected-memory').value;
	var power_limit = document.getElementById('p'+preset_id + '-selected-power').value;
	var max_core_voltage = document.getElementById('p'+preset_id + '-selected-core-volt2').value;
	
	//Fan Controller
	var fan_mode = document.getElementById('p'+preset_id + '-selected-fan-mode').value;
	var fixed_fan_speed = document.getElementById('p'+preset_id + '-selected-fan-speed').value;
	var target_gpu_temp = document.getElementById('p'+preset_id + '-selected-fan-temp-gpu').value;
	var target_vram_hotspot = document.getElementById('p'+preset_id + '-selected-fan-temp-vram').value;
	var max_fan_speed = document.getElementById('p'+preset_id + '-selected-fan-level-max').value;
	
	//Set Preset Tab
	document.getElementById('nav-p'+preset_id+'-tab').innerHTML = preset_name;
	
	//Can we store locally?
	if (typeof(Storage) == "undefined") {
		$('#overclock_profiles_danger').html('You do not have local web storage enabled for this browser. The settings have been set but will be lost on page refresh.');;
		$('#overclock_profiles_danger').show();
		setTimeout(function() {
			$('#overclock_profiles_danger').hide();
		}, 5000);
		return;
	}
	
	//Store Settings Locally
	presetSettings = { 'preset_name': preset_name, 'core_clock_delta': core_clock_delta, mem_clock_delta: mem_clock_delta,  power_limit: power_limit, max_core_voltage: max_core_voltage, fan_mode: fan_mode, fixed_fan_speed: fixed_fan_speed, target_gpu_temp: target_gpu_temp, target_vram_hotspot: target_vram_hotspot, max_fan_speed:max_fan_speed};
	localStorage.setItem("presetSettings_p"+preset_id, JSON.stringify(presetSettings));
	
	if(debug) {
		console.log('Preset id ' + preset_id + ' has been saved.')
	}
	
	//Hide Loading
	document.getElementById('p'+preset_id + '-save-spinner').style.display = 'none';
	
	//Success
	$('#overclock_profiles_danger').hide();
	$('#overclock_profiles_success').html('Overclock settings have been saved for ' + preset_name + '.');
    $('#overclock_profiles_success').show();
    setTimeout(function() {
        $('#overclock_profiles_success').hide();
    }, 5000);
	
}

function preset_apply(preset_id) {
	
	//Detect Selected Devices
	detect_selected_devices();
	
	//Do we have any devices?
	if(selected_devices.length < 1) { 
		$('#overclock_profiles_danger').html('Please select a device to apply the preset to.');;
		$('#overclock_profiles_danger').show();
		setTimeout(function() {
			$('#overclock_profiles_danger').hide();
		}, 5000);
		return; 
	}
	
	//Show Loading
	document.getElementById('p'+preset_id + '-apply-spinner').style.display = 'inline-block';
	
	//Preset Name
	var preset_name = document.getElementById('p'+preset_id + '-preset-name').value;
	
	//OC Settings
	var core_clock_delta = document.getElementById('p'+preset_id + '-selected-core').value;
	var mem_clock_delta = document.getElementById('p'+preset_id + '-selected-memory').value;
	var power_limit = document.getElementById('p'+preset_id + '-selected-power').value;
	var max_core_voltage = document.getElementById('p'+preset_id + '-selected-core-volt2').value;
	
	//Fan Controller
	var fan_mode = document.getElementById('p'+preset_id + '-selected-fan-mode').value;
	var fan_speed = document.getElementById('p'+preset_id + '-selected-fan-speed').value;
	var fan_temp_gpu = document.getElementById('p'+preset_id + '-selected-fan-temp-gpu').value;
	var fan_temp_vram = document.getElementById('p'+preset_id + '-selected-fan-temp-vram').value;
	var fan_level_max = document.getElementById('p'+preset_id + '-selected-fan-level-max').value;
	
	//Set Preset Tab
	document.getElementById('nav-p'+preset_id+'-tab').innerHTML = preset_name;
	
	//For each device selected.
    for (var i = 0; i < selected_devices.length; ++i) {
        		
		/////////////////////////////////////////////////////////
		//@OApply Overclock Settings
		/////////////////////////////////////////////////////////
		var mv_opt = parseInt(max_core_voltage);
		if (!uvolt_unlocked2 || isNaN(mv_opt)) mv_opt = null;
		else if (mv_opt <= 0) mv_opt = 0;
		else if (mv_opt < 500) mv_opt = 500;
		else if (mv_opt > 1100) mv_opt = 1100;
		apply_oc_with_params(selected_devices[i], core_clock_delta, mem_clock_delta, power_limit, mv_opt);
		
		if(debug) {
			console.log('Preset id ' + preset_id + ' overclocks applied.');
		}
		
		/////////////////////////////////////////////////////////
		//@OApply Fan Settings
		/////////////////////////////////////////////////////////
		var strurl;
		
		//@Fan Mode 1
		if (fan_mode === '1') {
			strurl = url + 'fanset?id=' + selected_devices[i] + '&level=' + fan_speed;
			log_write('normal', 'Applying FAN device #' + selected_devices[i] + ' fixed speed=' + fan_speed);
		} else {
			strurl = url + 'smartfanset?id=' + selected_devices[i] + '&mode=' + fan_mode;
			if (fan_mode !== '0') {
				strurl += '&gputarg=' + fan_temp_gpu + '&vramtarg=' + fan_temp_vram + '&levelmax=' + fan_level_max;
				log_write('normal', 'Applying FAN device #' + selected_devices[i] + ' mode=' + fan_mode + ' GPU target=' + fan_temp_gpu + ' VRAM target=' + fan_temp_vram + ' FAN max=' + fan_level_max);
			} else {
				log_write('normal', 'Applying FAN device #' + selected_devices[i] + ' reset to default/auto');
			}
		}
			
		$.ajax({
			url: strurl,
			headers: { 'Authorization': auth_token },
			success: function (data) {
				
				if (data.error !== null) {
					log_write('normal', 'Failed to apply FAN');
				}
				else {
					log_write('normal', 'Applied FAN successfully');
				}
				
				
			},
			error: function () { },
		}).done(function() {
			console.log('Setting preset fans completed.');
			document.getElementById('p'+preset_id + '-apply-spinner').style.display = 'none';	
		});

		//@ Fan Mode 2
		if (fan_mode === '2') {
			
			var fl_max = parseInt(fan_level_max);

			if (!isNaN(fl_max) || fl_max < -1)
				fl_max = -1;
			else if (fl_max > 100)
				fl_max = 100;

			log_write('normal', 'Applying max FAN for device #' + selected_devices[i] + ' max: ' + fl_max);
			var strurl1 = url + 'smartfansetlevelmax?id=' + selected_devices[i] + '&level=' + fl_max;
			
			$.ajax({
				url: strurl1,
				headers: { 'Authorization': auth_token },
				success: function (data) {
					if (data.error !== null) {
						log_write('normal', 'Failed to apply max FAN');
					}
					else {
						log_write('normal', 'Applied max FAN successfully');
					}					
				}
			}).done(function() {
				log_write('normal', 'Applied FAN successfully');
				document.getElementById('p'+preset_id + '-apply-spinner').style.display = 'none';	
			});
		}
		
		if(debug) {
			console.log('Setting preset fans completed.');
		}
	}
	
	//Success
	$('#overclock_profiles_danger').hide();
	$('#overclock_profiles_success').html('Preset overclock settings have been applied.');
    $('#overclock_profiles_success').show();
    setTimeout(function() {
        $('#overclock_profiles_success').hide();
    }, 5000);
	
	//Save Settings
	save_current_cmds();
	
	if(debug) {
		console.log('Preset id ' + preset_id + ' has been applied.')
	}
	
	
}

/////////////////////////////////////////////////////////////
// @Kilowatts Calculator
// 0 = Hourly, 1 = Daily, 2 = Monthly, 3 = Total Since Uptime
////////////////////////////////////////////////////////////
function cost_kwh(type) {
	
	var kwh_hours = 0;
	var kwh_total = 0;
	
	//Lets switch!
	switch(type) {
			
		//Hourly Calculation
		case 0: {
			kwh_hours = 1;
			kwh_total = systemSettings['cpkwh'] * (kwh_hours * (stats_totalwatts / 1000));
			break;
		} 
		
		//Daily Calculation
		case 1: {
			kwh_hours = 24;
			kwh_total = systemSettings['cpkwh'] * (kwh_hours * (stats_totalwatts / 1000));
			break;		
		}
			
		//Monthly Calculation
		case 2: {
			kwh_hours = 24 * 7 * 4;
			kwh_total = systemSettings['cpkwh'] * (kwh_hours * (stats_totalwatts / 1000));			
			break;
		}
			
		//Total Calculation		
		case 3: {
			kwh_hours = (stats_uptime / 60) / 60;
			kwh_total = systemSettings['cpkwh'] * (kwh_hours * (stats_totalwatts / 1000));			 
			break;
		}
	}
	
	return kwh_total.toFixed(2);	
	
}

/////////////////////////////////////////////////////////////
// @Stop Miner
// Allows us to stop Excavator
////////////////////////////////////////////////////////////
document.getElementById("stop_miner").onclick = function(){
	$.ajax({
        url: url + "api?command={\"id\":1,\"method\":\"miner.stop\",\"params\":[]}",
        /*beforeSend: function (xhr) {
            xhr.setRequestHeader('OCTune-ID', session_id);
        },*/
        headers: { 'Authorization': auth_token },
        success: function (data) {
			alert('Miner Stopped!');
		}
	});
}

/////////////////////////////////////////////////////////////
// @Restart Miner
// Allows us to restart Excavator
////////////////////////////////////////////////////////////
document.getElementById("restart_miner").onclick = function(){
	$.ajax({
        url: url + "api?command={\"id\":1,\"method\":\"restart\",\"params\":[]}",
        /*beforeSend: function (xhr) {
            xhr.setRequestHeader('OCTune-ID', session_id);
        },*/
        headers: { 'Authorization': auth_token },
        success: function (data) {
			alert('Miner Stopped!');
		}
	});
}

/////////////////////////////////////////////////////////////
// @Reboot Rig
// Allows us to reboot the entire rig.
////////////////////////////////////////////////////////////
document.getElementById("reboot_rig").onclick = function(){
	$.ajax({
        url: url + "reboot",
        /*beforeSend: function (xhr) {
            xhr.setRequestHeader('OCTune-ID', session_id);
        },*/
        headers: { 'Authorization': auth_token },
        success: function (data) {
			alert('Rig is rebooting!');
		}
	});
}

/////////////////////////////////////////////////////////////
// @NiceHash
// Nicehash code below, we will keep this to save time. (Dear NH, your code was messy tut. I took care of it. Comments Added, Updates made.)
////////////////////////////////////////////////////////////

var url;
var auth_token = null;
var devices = null;
var devices_count = 0;
var refresh_time = 2000;
var first_time = true;
var devices_indices = new Array();
var log_lines = new Array();
var log_index = 0;
var MAX_LOG_SIZE = 200;
var last_update_failed = false;
var tick_handler = null;
var selected_devices = new Array();
var session_id = null;
var session_missmatch_count = 0;
var uvolt_unlocked = false;
var uvolt_unlocked2 = false;

//GDDR6 Memory Ranges
var GDDR6MemoryClockRange = [5800, 8800];
var GDDR6XMemoryClockRange3080 = [8250, 11250];
var GDDR6XMemoryClockRange3090 = [8500, 11500];

//Subvendor Identities
var SubvendorMap = new Array();
SubvendorMap['10DE'] = 'NVIDIA';
SubvendorMap['1043'] = 'ASUS';
SubvendorMap['1462'] = 'MSI';
SubvendorMap['1458'] = 'Gigabyte';
SubvendorMap['3842'] = 'EVGA';
SubvendorMap['19DA'] = 'ZOTAC';
SubvendorMap['1569'] = 'Palit';
SubvendorMap['196E'] = 'PNY';
SubvendorMap['10B0'] = "Gainward";

//Run on page load.
function start_code() {
	
    //$('#span-version').html(OCTUNE_VERSION);
    session_id = gen_random_str();
		
	var excavator_hostname = systemSettings['host'];
    var excavator_port = systemSettings['port'];
    
    url = 'http://' + excavator_hostname + ':' + excavator_port.toString() + '/';

    auth_token = getUrlParameter('auth');
    if (!auth_token) auth_token = null;

    clear_logs();
    log_write('normal', 'Starting up...');

    _tick();
}

//Get Url Parameters
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

//Get GPU Subvendor Names
function get_subvendor_name(dev) {
    if (dev == undefined) return 'Unknown';
    if (dev.details == undefined || dev.details == null) return 'Unknown';
    var pciident = dev.details.pci_ident;
    if (pciident == undefined || pciident == null || pciident.length == 0) return 'Unknown';

    var res = pciident.split('&');
    if (res.length != 4) return 'Unknown';
    // SUBSYS_250310DE
    if (res[2].length != 15) return 'Unknown';
    var end = res[2].substring(11).toUpperCase();
    var subn = SubvendorMap[end];
    if (subn == undefined)
        return 'Unknown';
    return subn;
}

//Get PCI Dev Names
function get_pcidev_name(dev) {
    if (dev == undefined) return null;
    if (dev.details == undefined || dev.details == null) return null;
    var pciident = dev.details.pci_ident;
    if (pciident == undefined || pciident == null || pciident.length == 0) return null;

    var res = pciident.split('&');
    if (res.length < 2) return null;
    // SUBSYS_250310DE
    if (res[1].length < 8) return null;
    var end = res[1].substring(4).toUpperCase();
    return end;
}

//Random string generator for session handling.
var rg_alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
function gen_random_str() {
    var gen_str = '';
    var c_count = rg_alphabet.length;
    for (var i = 0; i < 16; ++i)
        gen_str += rg_alphabet[Math.floor(Math.random() * c_count)];

    return gen_str;
}

//Log Writing function.
function log_write(t, s) {

    //if (first_time) return;

    var d = new Date();
    var str = '<span class="log-class-' + t + '">[' + d.toLocaleString() + '] ';
    str += s + '</span><br />';
    log_lines[log_index] = str;
    var start = log_index;
    log_index = (log_index + 1) % MAX_LOG_SIZE;
    var end = log_index;

    // print whole log now
    var all = '';
    var i = 0;
    while (start !== end) {
        all += log_lines[start];
        if (start === 0) start = MAX_LOG_SIZE - 1;
        else --start;
    }

    $('#log-view-div').html(all);
}

//Clear Logs Function
function clear_logs() {
    log_lines = new Array();
    log_index = 0;
    $('#log-view-div').html('');
    for (var i = 0; i < MAX_LOG_SIZE; ++i)
        log_lines[i] = '';
}

//Time just keeps ticking. Timed Update
function _tick() {
    var rf_time = 10000;
    if (!last_update_failed) rf_time = refresh_time + 13;
    tick_handler = setTimeout(_tick, rf_time);
    updateAll();
}

//Manul or Optimization Mode?
function is_optimize_locked(dev_id) {
    return false;
}

/////////////////////////////////////////////////////////////////////////////
// @Overclocking
// Functions below this point are related to overclocking.
/////////////////////////////////////////////////////////////////////////////

//Allow undervolt
function allow_uvolt(enable) {
    if (enable != null)
        uvolt_unlocked = enable;
    else
        uvolt_unlocked = !uvolt_unlocked;
    $('#selected-core-volt').attr('disabled', !uvolt_unlocked);
    $('#core-uvolt').prop('checked', uvolt_unlocked);

    if (uvolt_unlocked) {
        var dev_id = $('#selected-device').val();
        var dd = devices[dev_id];
        var device_ocs = devices[dev_id].oc_data;
        if (device_ocs.core_uvolt.length > 0 &&
            device_ocs.core_uvolt[0].clock != undefined) {
            $('#selected-core-volt').val(device_ocs.core_uvolt[0].mV);
        }
    }
}

//Allow undervolt 2? (To be looked at)
function allow_uvolt2(enable) {

    var dev_id = $('#selected-device').val();
    var dd = devices[dev_id];
    var device_ocs = devices[dev_id].oc_data;
    $('#selected-core').val(device_ocs.core_clock_delta);

    if (enable != null)
        uvolt_unlocked2 = enable;
    else
        uvolt_unlocked2 = !uvolt_unlocked2;

    $('#selected-core-volt2').attr('disabled', !uvolt_unlocked2);
    $('#core-uvolt2').prop('checked', uvolt_unlocked2);

    if (uvolt_unlocked2) {
        $('#core-delta-text').html('Max core clock: ');
        $('#core-delta-limits').hide();
        $('#core-max-limits').show();
        if (device_ocs.core_uvolt.length > 0 &&
            device_ocs.core_uvolt[0].max_clock != undefined) {
            $('#selected-core').val(device_ocs.core_uvolt[0].max_clock);
            $('#selected-core-volt2').val(device_ocs.core_uvolt[0].max_mV);
        }
        else if (device_ocs.core_clock_delta < 300)
            $('#selected-core').val('510');
    }
    else {
        $('#core-delta-text').html('Core clock delta: ');
        $('#core-delta-limits').show();
        $('#core-max-limits').hide();
    }
}

//Timed Update Function, Run every X seconds.
function updateAll() {
		
	//Device Cuda Query - Get all cuda enabled devices?
	//Not in the documentation of Excavator, assuming device_list?
    $.ajax({
        url: url + "devices_cuda",
        headers: { 'Authorization': auth_token },
        success: function (data, textS, request) {
			
            var reconn = last_update_failed;
            last_update_failed = false;

            if (data.error !== null) {
                log_write('error', 'Failed to get cuda devices');
                return;
			}
			
            if (devices == null) {
                log_write('normal', 'Connected to Excavator: success');
            }
			
			//Get a list of devices, lets see what we got.
            devices = data.devices;
			
            devices_count = data.devices.length;
            
			//Loop and set known memory clock ranges.
			for (var i = 0; i < devices.length; ++i) {
                var dd = devices[i];
                if (dd.name === "GeForce RTX 3080")
                    dd.GDDRData = GDDR6XMemoryClockRange3080;
                else if (dd.name === "GeForce RTX 3090")
                    dd.GDDRData = GDDR6XMemoryClockRange3090;
                else if (parseInt(dd.details.sm_major) >= 7)
                    dd.GDDRData = GDDR6MemoryClockRange;
                else
                    dd.GDDRData = null;
            }
			
			///////////////////////////////////////////////////////////
			// @First Run Time
			// If this is the first time, lets get that table setup.
			//////////////////////////////////////////////////////////
            if (first_time) {
				
				//We have not yet run once.
                first_time = false;
				
                // build table for the first time
                var disp_health = '';
                var disp = '';
                
				//For each device, append devices to tables.
				for (var i = 0; i < devices_count; ++i) {
					
                    var k = devices[i].device_id;
					var subn = get_subvendor_name(devices[i]);
					
                    devices_indices[k] = i;
                    disp += '<tr><td>' + k + '</td>';
                    disp += '<td>' + devices[i].name +  '<br /><small>Subvendor: ' + subn + '</small></td>';
                    disp += '<td id="device-' + k + '-kt-min"></td>';
                    disp += '<td id="device-' + k + '-kt-avg"></td>';
                    disp += '<td id="device-' + k + '-kt-umed"></td>';
                    disp += '<td id="device-' + k + '-hwerr"></td>';
                    disp += '<td id="device-' + k + '-hwok"></td>';

                    disp += '<td id="device-' + k + '-oc-core"></td>';
                    disp += '<td id="device-' + k + '-oc-mem"></td>';
                    disp += '<td id="device-' + k + '-oc-pwr"></td>';
                    disp += '<td id="device-' + k + '-oc-tdp"></td>';

                    disp += '<td id="device-' + k + '-power"></td>';

                    disp += '<td id="device-' + k + '-speed"></td>';
                    disp += '<th id="device-' + k + '-eff"></th>';
                    disp += '</tr>';

                    $('#selected-device').append($('<option>', {
                        value: k,
                        text: k + '. ' + devices[i].name
                    }));

                    disp_health += '<tr><td>' + k + '</td>';
                    disp_health += '<td>' + devices[i].name + '<br /><small>Subvendor: ' + subn + '</small></td >';
                    										
                    disp_health += '<td id="device-' + k + '-temp"></td>';
                    disp_health += '<td><nobr>GPU: <span id="device-' + k +
                        '-util-gpu"></span></nobr><br/><nobr>MEM: <span id="device-' + k + '-util-mem"></span></nobr></td>';
                    disp_health += '<td id="device-' + k + '-fan-rpm"></td>';
                    disp_health += '<td id="device-' + k + '-fan-perc"></td>';
                    disp_health += '<td id="device-' + k + '-fan-data"></td>';
                    disp_health += '<td id="device-' + k + '-clock-core"></td>';
                    disp_health += '<td id="device-' + k + '-oc-core-limit"></td>';
                    disp_health += '<td id="device-' + k + '-volt-core"></td>';
                    disp_health += '<td id="device-' + k + '-clock-mem"></td>';
                    disp_health += '<td><input type="checkbox" id="device-' + k + '-selected" class="auto-tune-disable form-check-input"></td>';
                    disp_health += '</tr>';
					
					//Append Devices to OC Profiles
					$('#preset_device').append('<option value="'+k+'">'+k+'. ' + devices[i].name+' - '+subn+'</option>');
                }
				
				//Append all devices to overclocking and health table.
                $('#table-main-oc').html(disp);
                $('#table-main-health').html(disp_health);
				
				//Prefill overclock forms.
                pre_oc_fill();
				
            }
			
			//If we are reconnecting, prefill overclock forms. If not, set the selected devices ID.
            if (reconn) {
				pre_oc_fill();
			} else {
                var dev_id = $('#selected-device').val();
                var ddi = devices_indices[dev_id];
                var dd = devices[ddi];
                refresh_mt(dd);
            }
			
			///////////////////////////////////////////////////////////
			// @Resume Run Time
			// If this is the first time, lets get that table setup.
			//////////////////////////////////////////////////////////
            for (var i = 0; i < devices.length; ++i) {
				
                devices[i].oc_data.power_limit_watts = Math.floor(devices[i].oc_data.power_limit_watts);
				
                var dd = devices[i];
                var k = dd.device_id;
				
				var subn = get_subvendor_name(devices[i]);
												
                $('#device-' + k + '-id').html(dd.device_id);
                $('#device-' + k + '-name').html(dd.name + '<br /><small>Subvendor: ' + subn + '</small>');
                
                if (dd.fans.length > 0) {
                    var rpm_text = '';
                    var level_text = '';
                    for (var d = 0; d < dd.fans.length; ++d) {
                        var fan = dd.fans[d];
                        if (d > 0) {
                            rpm_text += ' <br/>';
                            level_text += ' %<br/>';
                        }
                        rpm_text += fan.current_rpm;
                        level_text += fan.current_level;
                    }
                    level_text += ' %';
                    $('#device-' + k + '-fan-rpm').html(rpm_text);
                    $('#device-' + k + '-fan-perc').html(level_text);
                    dd.gpu_fan_speed = dd.fans[0].current_level;
                }
                else {
                    if (dd.gpu_fan_speed_rpm >= 0)
                        $('#device-' + k + '-fan-rpm').html(dd.gpu_fan_speed_rpm);
                    else
                        $('#device-' + k + '-fan-rpm').html('N/A');
                    if (dd.gpu_fan_speed >= 0)
                        $('#device-' + k + '-fan-perc').html(dd.gpu_fan_speed + ' %');
                    else
                        $('#device-' + k + '-fan-perc').html('N/A');
                }
                
                $('#fan-level-' + k).val(dd.gpu_fan_speed);

                if (dd.kernel_times.min > 0)
                    $('#device-' + k + '-kt-min').html(dd.kernel_times.min);
                if (dd.kernel_times.umed > 0)
                    $('#device-' + k + '-kt-umed').html(dd.kernel_times.umed);
                if (dd.kernel_times.avg > 0)
                    $('#device-' + k + '-kt-avg').html(dd.kernel_times.avg);
				
				/////////////////////////////////
				//@Hardware Errors 
				/////////////////////////////////
                $('#device-' + k + '-hwerr').html(dd.hw_errors);
                $('#device-' + k + '-hwok').html(dd.hw_errors_success);
				
				//Update Dashboard total hardware Errors
				stats_hwerrors += dd.hw_errors;
				
				/////////////////////////////////
				//@Undervolting
				/////////////////////////////////
                var uvolt_text = dd.gpu_mvolt_core;
                if (dd.oc_data.core_uvolt != undefined &&
                    dd.oc_data.core_uvolt != null &&
                    dd.oc_data.core_uvolt.length > 0) {
                    uvolt_text += '<br /><small>';
                    if (dd.oc_data.core_uvolt[0].max_mV != undefined) {
                        uvolt_text += 'Max: ' + dd.oc_data.core_uvolt[0].max_clock + ' @ ';
                        uvolt_text += dd.oc_data.core_uvolt[0].max_mV + 'mV';
                    }
                    else {
                        uvolt_text += dd.oc_data.core_uvolt[0].clock + ' @ -';
                        uvolt_text += dd.oc_data.core_uvolt[0].mV + 'mV';
                    }
                    uvolt_text += '</small>';
                }
				
				/////////////////////////////////
				//@OC Statistics
				/////////////////////////////////
                $('#device-' + k + '-volt-core').html(uvolt_text);
                $('#device-' + k + '-clock-core').html(dd.gpu_clock_core);
                $('#device-' + k + '-clock-mem').html(dd.gpu_clock_memory);
                $('#device-' + k + '-oc-core').html(dd.oc_data.core_clock_delta);
                $('#device-' + k + '-oc-mem').html(dd.oc_data.memory_clock_delta);
                $('#device-' + k + '-oc-core-limit').html(dd.oc_data.core_clock_limit);
                $('#device-' + k + '-oc-pwr').html(Math.floor(dd.gpu_power_limit_current));
                $('#device-' + k + '-oc-tdp').html(Math.floor(dd.gpu_tdp_current));

                if (dd.gpu_power_usage != null)
                    $('#device-' + k + '-power').html(dd.gpu_power_usage.toFixed(2));
                else
                    $('#device-' + k + '-power').html('N/A');

                var temp_dsp = 'GPU: <span class="'; 
                var int_temp = parseInt(dd.gpu_temp);
				
				/////////////////////////////////
				//@Device Temps
				/////////////////////////////////
				stats_gputemp.push(parseInt(dd.gpu_temp));
				stats_vramtemp.push(parseInt(dd.__vram_temp));
												
                if (int_temp > 85)
                    temp_dsp += 'temp-mem-high';
                else if (int_temp > 75)
                    temp_dsp += 'temp-mem-med';
                else
                    temp_dsp += 'temp-mem-low';
                temp_dsp += '">' + dd.gpu_temp + '</span>';

                if (dd.__vram_temp != undefined) {
                    temp_dsp += '<br />VRAM: <span class="';
                    int_temp = parseInt(dd.__vram_temp);
                    if (int_temp > 105)
                        temp_dsp += 'temp-mem-high';
                    else if (int_temp > 95)
                        temp_dsp += 'temp-mem-med';
                    else
                        temp_dsp += 'temp-mem-low';

                    if (int_temp >= 110) {
                        log_write('warning', 'WARNING! Device #' + k + ' video card memory is OVERHEATING! Temperature: ' + int_temp + ' &#8451;');
                    }
                    temp_dsp += '">' + dd.__vram_temp + '</span>';
                }
                else if (dd.__hotspot_temp != undefined) {
                    temp_dsp += '<br />HotSpot: <span class="';
                    int_temp = parseInt(dd.__hotspot_temp);
                    if (int_temp > 95)
                        temp_dsp += 'temp-mem-high';
                    else if (int_temp > 85)
                        temp_dsp += 'temp-mem-med';
                    else
                        temp_dsp += 'temp-mem-low';

                    temp_dsp += '">' + dd.__hotspot_temp + '</span>';
                }

                $('#device-' + k + '-temp').html(temp_dsp);

                $('#device-' + k + '-util-gpu').html(dd.gpu_load);
                $('#device-' + k + '-util-mem').html(dd.gpu_load_memctrl);
				
				
				/////////////////////////////////
				//@Fan Stats 
				/////////////////////////////////
                var fanset_dsp = '<small>Fan mode: ';
                fanset_dsp += $('#selected-fan-mode-' + dd.smartfan.mode).html();
                if (dd.smartfan.mode === 1) fanset_dsp += '<br />Fixed speed: ' + dd.smartfan.fixed_speed + ' %';
                else if (dd.smartfan.mode === 2 ||
                    dd.smartfan.mode === 3 ||
                    dd.smartfan.mode === 4)
                    fanset_dsp += '<br />Target GPU: ' + dd.smartfan.target_gpu +
                        ' &#8451; Target VRAM: ' + dd.smartfan.target_vram + ' &#8451;';
                if (dd.smartfan.mode === 4 && dd.smartfan.override_level_max >= 0)
                    fanset_dsp += '<br />Max fan speed: ' + dd.smartfan.override_level_max + '%';
                fanset_dsp += '</small>';
                $('#device-' + k + '-fan-data').html(fanset_dsp);
				
				
            } 
			
			////////////////////////////////////////////////////
			// @Workers
			// Report speed for all workers.
			///////////////////////////////////////////////////
            $.ajax({
                url: url + "workers",
                headers: { 'Authorization': auth_token },
                success: function (data) {
                    if (data.error !== null) return;

                    for (var i = 0; i < devices.length; ++i)
                        devices[i].speed = 0;

                    for (var i = 0; i < data.workers.length; ++i) {
                        var dev_id = data.workers[i].device_id;
                        dev_id = devices_indices[dev_id];
                        var speed = data.workers[i].algorithms[0].speed / 1000000;
                        devices[dev_id].speed = speed;
                        var th_per_ke_str = data.workers[i].params_used; // "B=21888,TPB=64,S=2,KT=2"
                        var ssplit = th_per_ke_str.split(",");
                        var _blocks = 1;
                        var _tpb = 1;
                        var _streams = 1;
                        for (var t = 0; t < ssplit.length; ++t) {
                            var ssplit2 = ssplit[t].split("=");
                            if (ssplit2[0] === "B")
                                _blocks = parseInt(ssplit2[1]);
                            else if (ssplit2[0] === "TPB")
                                _tpb = parseInt(ssplit2[1]);
                            else if (ssplit2[0] === "S")
                                _streams = parseInt(ssplit2[1]);
                        }
                        devices[dev_id].hashes_per_ke = _blocks * _tpb * _streams;
                    }

                    for (var i = 0; i < devices.length; ++i) {
                        var dev_id = devices[i].device_id;
                        $('#device-' + dev_id + '-speed').html(devices[i].speed.toFixed(2));
                        if (devices[i].gpu_power_usage != null && devices[i].gpu_power_usage > 0) {
                            devices[i].eff = devices[i].speed * 1000 / devices[i].gpu_power_usage;
                            $('#device-' + dev_id + '-eff').html((devices[i].eff).toFixed(2));
                        }
                    }

                    // update totals
                    var t_speed = 0;
                    var t_power = 0;
                    for (var i = 0; i < devices_count; ++i) {
                        if (devices[i].gpu_power_usage != null) {
                            t_speed += devices[i].speed;
                            t_power += devices[i].gpu_power_usage;
                        }
                    }
										
					$('.stats_hashrate .value').html(t_speed.toFixed(2));
					$('.stats_wattage .value').html(t_power.toFixed(2));
					$('.stats_devices .value').html(devices.length);
					$('.stats_hwerrors .value').html(stats_hwerrors);
					$('.stats_amps .value').html((t_power / systemSettings['voltage']).toFixed(2));		
                    $('#total-speed').html(t_speed.toFixed(2));
                    $('#total-power').html(t_power.toFixed(2));
										
					stats_totalwatts = t_power.toFixed(2);
										
					$('.stats_cpkwh .value_cpkwh').html(systemSettings['currency'] + cost_kwh(0));
					$('.stats_cpkwh .value_cpkwhm').html(systemSettings['currency'] + cost_kwh(2));
					$('.stats_cpkwh .value_total').html(systemSettings['currency'] + cost_kwh(3));
					
                    if (t_power > 0)
                        $('#total-eff').html((t_speed * 1000 / t_power).toFixed(2));
						$('.stats_efficiency .value').html((t_speed * 1000 / t_power).toFixed(2));
                },
                error: function (data) {
                    log_write('error', 'Cannot connect: /workers');
                }
            });
			
			////////////////////////////////////////////////////
			// @Info
			// Returns basic information about Excavator.
			///////////////////////////////////////////////////
			$.ajax({
                url: url + "info",
                headers: { 'Authorization': auth_token },
                success: function (data) {
                    if (data.error !== null) return;
					
					var date = new Date(0);
					date.setSeconds(data.uptime); // specify value for SECONDS here
					var timeString = date.toISOString().substr(11, 8);
					
					//Set Uptime Variable
					stats_uptime = data.uptime;
					
					$('.stats_uptime .value').html(timeString);
                    $('.stats_memory .value_ram_load').html(data.ram_load);
					$('.stats_memory .value_ram_usage').html(data.ram_usage.toFixed(2));
					$('.stats_cpu .value_cpu_usage').html(data.cpu_usage.toFixed(2));
					$('.stats_cpu .value_cpu_load').html(data.cpu_load.toFixed(2));
					
					
					
                },
                error: function (data) {
                    log_write('error', 'Cannot connect: /info');
                }
            });
			
			////////////////////////////////////////////////////
			// @Algorithm
			// List all currently running algorithms.
			///////////////////////////////////////////////////
			$.ajax({
				url: url + "api?command={\"id\":1,\"method\":\"algorithm.list\",\"params\":[]}",
				/*beforeSend: function (xhr) {
					xhr.setRequestHeader('OCTune-ID', session_id);
				},*/
				headers: { 'Authorization': auth_token },
				success: function (data) {
					if (data.error !== null) return;
										
					var algo_list = '';
					
					for (var i = 0; i < data.algorithms.length; ++i) {
						
						var date = new Date(0);
						date.setSeconds(data.algorithms[i].uptime); // specify value for SECONDS here
						var timeString = date.toISOString().substr(11, 8);
						
						algo_list += '<tr>';
						
						algo_list += '<td>' + data.algorithms[i].algorithm_id + '</td>';
						algo_list += '<td>' + data.algorithms[i].name + '</td>';
						algo_list += '<td>' + (data.algorithms[i].speed / 1000000).toFixed(2) + '</td>';
						algo_list += '<td>' + timeString + '</td>';
						algo_list += '<td>' + data.algorithms[i].benchmark + '</td>';
						algo_list += '<td>' + data.algorithms[i].accepted_shares + '</td>';
						algo_list += '<td>' + data.algorithms[i].rejected_shares + '</td>';
						algo_list += '<td>' + data.algorithms[i].got_job + '</td>';
						algo_list += '<td>' + data.algorithms[i].received_jobs + '</td>';
						algo_list += '<td>' + data.algorithms[i].current_job_difficulty.toFixed(6) + '</td>';
						
						
						algo_list += '</tr>'; 
						
					}
					
					$('#table-main-algorithms').html(algo_list);
					
				}
			});
			
        }, error: function () {
            log_write('error', 'Cannot connect: /cuda_devices');
            last_update_failed = true;
        }
    });
	
	//Sort Highest Temps
	var gpu_temp_high = stats_gputemp.sort(function(a, b){return b-a});
	var vram_temp_high =stats_vramtemp.sort(function(a, b){return b-a});
	var gpu_normal = true;
	var vram_normal = true;
	
	//Push GPU Temps to Dashboard
	$('.stats_temp .gpu').html(gpu_temp_high[0]);
	$('.stats_temp .vram').html(vram_temp_high[0]);
	
	//Warning at GPU Temp Max
	if(gpu_temp_high >= systemSettings['gpu_temp']) {
		
		$('.stats_temp svg').css('fill', 'red');
		$('.stats_temp .gpu').css('color', 'red');
		$('.stats_temp .gpu').css('font-weight', 'bold');
		
		function blink(){
			$('.stats_temp svg').delay(100).fadeTo(100,0.5).delay(100).fadeTo(100,1, blink);
		}
		$(document).ready(function() {
			blink();
		});
		
		$('#system_danger div').html('<i class="bi bi-exclamation-circle"></i> WARNING: One or more of your devices have hit a critical GPU temperature!');
		$('#system_danger').show();
		
		gpu_normal = false;
		
	} else {
		gpu_normal = true;
	}
	
	//Warning at VRAM Temp Max
	if(vram_temp_high >= systemSettings['vram_temp']) {
		
		$('.stats_temp svg').css('fill', 'red');
		$('.stats_temp .vram').css('color', 'red');
		$('.stats_temp .vram').css('font-weight', 'bold');
		
		function blink(){
			$('.stats_temp svg').delay(100).fadeTo(100,0.5).delay(100).fadeTo(100,1, blink);
		}
		blink();
		
		$('#system_danger div').html('<i class="bi bi-exclamation-circle"></i> WARNING: One or more of your devices have hit a critical VRAM temperature!');
		$('#system_danger').show();
		
		vram_normal = false;
		
	} else {
		vram_normal = true;
	}
	
	if(gpu_normal && vram_normal) {
		$('.stats_temp svg').stop(true).fadeTo(200,1);
		$('.stats_temp svg').css('fill', '#fba342');
		
		$('.stats_temp .gpu').css('font-weight', '500');
		
		if(dark_theme_enabled) {
			$('.stats_temp .gpu').css('color', '#d2d2d2');
			$('.stats_temp .vram').css('color', '#d2d2d2');
		} else {
			$('.stats_temp .gpu').css('color', '#1A1A1A');
			$('.stats_temp .vram').css('color', '#1A1A1A');
		}
		
		
		
		$('.stats_temp .vram').css('font-weight', '500');
		$('#system_danger').hide();
	}
	
	//Reset Temp Arrays
	stats_gputemp  = [];
	stats_vramtemp = [];
	
	
	//Hardware Error Warnings
	if(stats_hwerrors > 0) {
				
		$('.stats_hwerrors svg').css('fill', 'red');
		$('.stats_hwerrors .value').css('color', 'red');
		$('.stats_hwerrors .value').css('font-weight', 'bold');
		
		function blink(){
			$('.stats_hwerrors svg').delay(100).fadeTo(100,0.5).delay(100).fadeTo(100,1, blink);
		}
		$(document).ready(function() {
			blink();
		});
		
		$('#system_danger div').html('<i class="bi bi-exclamation-circle"></i> WARNING: One or more of your devices is emitting hardware errors!');
		$('#system_danger').show();
		
	} else {
		$('.stats_hwerrors svg').stop(true).fadeTo(200,1);
		$('.stats_hwerrors svg').css('fill', '#fba342');
		
		if(dark_theme_enabled) {
			$('.stats_hwerrors .value').css('color', '#d2d2d2');
		} else {
			$('.stats_hwerrors .value').css('color', '#1a1a1a');
		}
		
		$('.stats_hwerrors .value').css('font-weight', '500');
		$('#system_danger').hide();
	}
	
	//Reset Hardware Errors
	stats_hwerrors = 0;
	
}

//Restart nvidia drivers
function restart_driver() {

    if (!confirm('Are you sure you want to restart NVIDIA Driver?')) {
        return;
    }

    $.ajax({
        url: url + 'restart.driver.nvidia',
        headers: { 'Authorization': auth_token },
        success: function (data) {
            if (data.error !== null) {
                log_write('normal', 'Failed to restart driver');
            }
            else {
                log_write('normal', 'Driver restarted!');
            }
        },
        error: function () { }
    });
}

//Restart Excavator
function restart_miner() {

    if (!confirm('Are you sure you want to restart Excavator application?')) {
        return;
    }

    $.ajax({
        url: url + 'quit', // NHQM will start it back up
        headers: { 'Authorization': auth_token },
        success: function (data) {
            if (data.error !== null) {
                log_write('normal', 'Failed to restart Excavator');
            }
            else {
                log_write('normal', 'Excavator quit/restarted!');
            }
        },
        error: function () { }
    });
}

//Reboot Rig
function reboot_miner() {

    if (!confirm('Are you sure you want to reboot the rig?')) {
        return;
    }

    $.ajax({
        url: url + 'reboot',
        headers: { 'Authorization': auth_token },
        success: function (data) {
            if (data.error !== null) {
                log_write('normal', 'Failed to reboot');
            }
            else {
                log_write('normal', 'Rebooting rig in 5 seconds!');
            }
        },
        error: function () { }
    });
}

//Set GPU Memory Timings
function set_memory_timings(dev_id) {
    if (dev_id == null)
        dev_id = $('#selected-device').val();

    if (is_optimize_locked(dev_id)) return;

    var mttext = $('#mt-text-box2').val();
    var strurl = url + 'api?command={"id":1,"method":"device.set.memory.timings","params":["' + dev_id + '",';
    strurl += mttext;
    strurl += ']}';

    log_write('normal', 'Setting memory timings for device #' + dev_id + ': ' + mttext);

    $.ajax({
        url: strurl,
        headers: { 'Authorization': auth_token },
        success: function (data) {
            if (data.error !== null) {
                log_write('normal', 'Failed to set memory timings');
            }
            else {
                log_write('normal', 'Memory timings set!');
            }
        },
        error: function () { }
    });

    $("#opt-bt-mt").removeClass('button-optimize');
}

//Apply Fan Speeds to a single device
function apply_fan(dev_id) {
    if (dev_id == null)
        dev_id = $('#selected-device').val();

    if (is_optimize_locked(dev_id)) return;

    var fan_mode = $('#selected-fan-mode').val();
    var fan_speed = $('#selected-fan-speed').val();
    var fan_temp_gpu = $('#selected-fan-temp-gpu').val();
    var fan_temp_vram = $('#selected-fan-temp-vram').val();
    var fan_level_max = $('#selected-fan-level-max').val();

    var strurl;
    if (fan_mode === '1') {
        strurl = url + 'fanset?id=' + dev_id + '&level=' + fan_speed;
        log_write('normal', 'Applying FAN device #' + dev_id + ' fixed speed=' + fan_speed);
    }
    else {
        strurl = url + 'smartfanset?id=' + dev_id + '&mode=' + fan_mode;
        if (fan_mode !== '0') {
            strurl += '&gputarg=' + fan_temp_gpu + '&vramtarg=' + fan_temp_vram + '&levelmax=' + fan_level_max;
            log_write('normal', 'Applying FAN device #' + dev_id + ' mode=' + fan_mode + ' GPU target=' + fan_temp_gpu + ' VRAM target=' + fan_temp_vram + ' FAN max=' + fan_level_max);
        }
        else {
            log_write('normal', 'Applying FAN device #' + dev_id + ' reset to default/auto');
        }
    }

    $.ajax({
        url: strurl,
        headers: { 'Authorization': auth_token },
        success: function (data) {
            if (data.error !== null) {
                log_write('normal', 'Failed to apply FAN');
            }
            else {
                log_write('normal', 'Applied FAN successfully');
            }
        },
        error: function () { }
    });

    if (fan_mode === '2') {
        var fl_max = parseInt(fan_level_max);

        if (!isNaN(fl_max) || fl_max < -1)
            fl_max = -1;
        else if (fl_max > 100)
            fl_max = 100;

        log_write('normal', 'Applying max FAN for device #' + dev_id + ' max: ' + fl_max);
        var strurl1 = url + 'smartfansetlevelmax?id=' + dev_id + '&level=' + fl_max;
        $.ajax({
            url: strurl1,
            headers: { 'Authorization': auth_token },
            success: function (data) {
                if (data.error !== null) {
                    log_write('normal', 'Failed to apply max FAN');
                }
                else {
                    log_write('normal', 'Applied max FAN successfully');
                }
            }
        });
    }

    $("#opt-bt-fan").removeClass('button-optimize');
}

//Force Clean All Settings
function force_clean_all() {

    if (!confirm('Are you sure you want to remove all fan&overclocks and reset all devices to stock settings?')) {
        return;
    }

    log_write('normal', 'Resetting OCs and FANs for all devices');

    for (var i = 0; i < devices.length; ++i) {

        if (is_optimize_locked(devices[i].device_id)) continue;

        $.ajax({
            url: url + 'fanreset?id=' + devices[i].device_id,
            indexValue: devices[i].device_id,
            headers: { 'Authorization': auth_token },
            success: function (data, indexValue) {
                if (data.error !== null) {
                    log_write('normal', 'Failed to reset FAN for device #' + this.indexValue);
                }
                else {
                    log_write('normal', 'FAN reset for device #' + this.indexValue);
                }
            }
        });
    }

    for (var i = 0; i < devices.length; ++i) {

        if (is_optimize_locked(devices[i].device_id)) continue;

        $.ajax({
            url: url + "resetoc?id=" + devices[i].device_id + "&clean=1",
            indexValue: devices[i].device_id,
            headers: { 'Authorization': auth_token },
            success: function (data, indexValue) {
                if (data.error !== null) {
                    // handle err case
                }
                else {
                     log_write('normal', 'Reset OC (clean) successfully for device #' + this.indexValue);
                }
            }
        });
    }
}

//Force clean and reset all devices to default.
function force_clean_all_restart() {
    if (!confirm('Are you sure you want to remove all fan&overclocks and reset all devices to stock settings? This procedure will also reset any saved OC and return your mining back to the original configuration state. It may take up to 5 seconds to be fully performed.')) {
        return;
    }

    if (tick_handler != null) {
        clearTimeout(tick_handler);
    }

    $(':button').prop('disabled', true);

    force_clean_all();

    setTimeout(save_current_cmds, 1000);
    setTimeout(restart_miner, 1500);

    setTimeout(function () {
        location.reload(true);
    }, 4000);
}

//Apply fan speeds to all devices.
function apply_fan_all() {

    var fan_mode = $('#selected-fan-mode').val();
    var fan_speed = $('#selected-fan-speed').val();
    var fan_temp_gpu = $('#selected-fan-temp-gpu').val();
    var fan_temp_vram = $('#selected-fan-temp-vram').val();
    var fan_level_max = $('#selected-fan-level-max').val();

    //if (fan_mode !== '0') {
    //    var fan_level_min = $('#selected-fan-level-min').val();
    //    var fan_level_max = $('#selected-fan-level-max').val();

    //    var fl_min = parseInt(fan_level_min);

    //    if (!isNaN(fl_min) && fl_min >= -1 && fl_min <= 100)
    //    {
    //        log_write('normal', 'Applying min FAN for all: ' + fl_min);
    //        var strurl1 = url + 'api?command={"id":1,"method":"device.smartfan.set.level.min","params":["';
    //        var endurl1 = '","' + fl_min + '"]}';
    //        for (var i = 0; i < devices.length; ++i) {

    //            if (is_optimize_locked(devices[i].device_id)) continue;

    //            $.ajax({
    //                url: strurl1 + devices[i].device_id + endurl1,
    //                indexValue: devices[i].device_id,
    //                headers: { 'Authorization': auth_token },
    //                success: function (data, indexValue) {
    //                    if (data.error !== null) {
    //                        log_write('normal', 'Failed to apply min FAN for device #' + this.indexValue);
    //                    }
    //                    else {
    //                        log_write('normal', 'Applied min FAN successfully for device #' + this.indexValue);
    //                    }
    //                }
    //            });
    //        }
    //    }

    //    var fl_max = parseInt(fan_level_max);

    //    if (!isNaN(fl_max) && fl_max >= -1 && fl_max <= 100) {
    //        log_write('normal', 'Applying max FAN for all: ' + fl_max);
    //        var strurl1 = url + 'api?command={"id":1,"method":"device.smartfan.set.level.max","params":["';
    //        var endurl1 = '","' + fl_max + '"]}';
    //        for (var i = 0; i < devices.length; ++i) {

    //            if (is_optimize_locked(devices[i].device_id)) continue;

    //            $.ajax({
    //                url: strurl1 + devices[i].device_id + endurl1,
    //                indexValue: devices[i].device_id,
    //                headers: { 'Authorization': auth_token },
    //                success: function (data, indexValue) {
    //                    if (data.error !== null) {
    //                        log_write('normal', 'Failed to apply max FAN for device #' + this.indexValue);
    //                    }
    //                    else {
    //                        log_write('normal', 'Applied max FAN successfully for device #' + this.indexValue);
    //                    }
    //                }
    //            });
    //        }
    //    }
    //}

    var strurl = url + 'fanset?id=';
    var endurl = '';
    if (fan_mode === '1') {
        endurl = '&level=' + fan_speed;
        log_write('normal', 'Applying FAN for all: fixed speed=' + fan_speed);
    }
    else {
        strurl = url + 'smartfanset?id=';
        endurl = '&mode=' + fan_mode;
        if (fan_mode !== '0') {
            endurl += '&gputarg=' + fan_temp_gpu + '&vramtarg=' + fan_temp_vram + '&levelmax=' + fan_level_max;
            log_write('normal', 'Applying FAN for all: mode=' + fan_mode + ' GPU target=' + fan_temp_gpu + ' VRAM target=' + fan_temp_vram + ' FAN max=' + fan_level_max);
        }
        else {
            log_write('normal', 'Applying FAN for all: reset to default/auto');
        }
    }

    for (var i = 0; i < devices.length; ++i) {

        if (is_optimize_locked(devices[i].device_id)) continue;

        $.ajax({
            url: strurl + devices[i].device_id + endurl,
            indexValue: devices[i].device_id,
            headers: { 'Authorization': auth_token },
            success: function (data, indexValue) {
                if (data.error !== null) {
                    log_write('normal', 'Failed to apply FAN for device #' + this.indexValue);
                }
                else {
                    log_write('normal', 'Applied FAN successfully for device #' + this.indexValue);
                }
            }
        });
    }

    if (fan_mode === '2') {
        var fl_max = parseInt(fan_level_max);

        if (!isNaN(fl_max) || fl_max < -1)
            fl_max = -1;
        else if (fl_max > 100)
            fl_max = 100;

        log_write('normal', 'Applying max FAN for all: ' + fl_max);
        var strurl1 = url + 'smartfansetlevelmax?id=';
        var endurl1 = '&level=' + fl_max;
        for (var i = 0; i < devices.length; ++i) {

            if (is_optimize_locked(devices[i].device_id)) continue;

            $.ajax({
                url: strurl1 + devices[i].device_id + endurl1,
                indexValue: devices[i].device_id,
                headers: { 'Authorization': auth_token },
                success: function (data, indexValue) {
                    if (data.error !== null) {
                        log_write('normal', 'Failed to apply max FAN for device #' + this.indexValue);
                    }
                    else {
                        log_write('normal', 'Applied max FAN successfully for device #' + this.indexValue);
                    }
                }
            });
        }
    }
}

//Apply an overclock (alternative) to a single device.
function apply_oc_alt(dev_id) {
    if (dev_id == null)
        dev_id = $('#selected-device').val();

    if (is_optimize_locked(dev_id)) return;

    var dindex = devices_indices[dev_id];
    if (devices[dindex].details.sm_major === 6) {
        log_write('normal', 'Device #' + dev_id + ': Cannot perform for GPU arch: Pascal');
        return;
    }

    var core_max = $('#selected-core-max').val();
    var memory = $('#selected-memory-abs').val();
    var mv_opt = parseInt($('#selected-core-volt').val());
    if (!uvolt_unlocked || isNaN(mv_opt)) mv_opt = null;
    else if (mv_opt < 0) mv_opt = -mv_opt;

    var strurl = url + 'setocprofile2?id=' + dev_id + '&core=' + core_max + '&memory=' + memory;
    log_write('normal', 'Applying OC (alt) dev=' + dev_id + ' max core=' + core_max + ' memory=' + memory);

    if (mv_opt != null) {
        strurl += '&uvolt=' + mv_opt;
        log_write('normal', 'Applying undervolt: ' + mv_opt + ' mV');
    }

    $.ajax({
        url: strurl,
        headers: { 'Authorization': auth_token },
        success: function (data) {
            if (data.error !== null) {
                log_write('normal', 'Failed to apply OC (alt)');
            }
            else {
                log_write('normal', 'Applied OC (alt) successfully');
            }
        },
        error: function () { }
    });

    $("#opt-bt-oc2").removeClass('button-optimize');
}

//Apply an overclock (alternative) to all devices.
function apply_oc_all_alt() {
    var core_max = $('#selected-core-max').val();
    var memory = $('#selected-memory-abs').val();
    var mv_opt = parseInt($('#selected-core-volt').val());
    if (!uvolt_unlocked || isNaN(mv_opt)) mv_opt = null;
    else if (mv_opt < 0) mv_opt = -mv_opt;

    log_write('normal', 'Applying OC (alt) for all devices; core=' + core_max + ' mem=' + memory);
    var urlend = "&core=" + core_max + "&memory=" + memory;

    if (mv_opt != null) {
        urlend += '&uvolt=' + mv_opt;
        log_write('normal', 'Applying undervolt: ' + mv_opt + ' mV');
    }

    for (var i = 0; i < devices.length; ++i) {

        if (is_optimize_locked(devices[i].device_id)) continue;

        if (devices[i].details.sm_major === 6) {
            log_write('normal', 'Device #' + devices[i].device_id + ': Cannot perform for GPU arch: Pascal');
            continue;
        }

        $.ajax({
            url: url + "setocprofile2?id=" + devices[i].device_id + urlend,
            indexValue: devices[i].device_id,
            headers: { 'Authorization': auth_token },
            success: function (data, indexValue) {
                if (data.error !== null) {
                    log_write('normal', 'Failed to apply OC (alt) for device #' + this.indexValue);
                }
                else {
                    log_write('normal', 'Applied OC (alt) successfully for device #' + this.indexValue);
                }
            }
        });
    }
}

//Apply an overclock with params to a single device.
function apply_oc_with_params(dev_id, core_delta, memory_delta, power, vcore) {

    if (is_optimize_locked(dev_id)) return;

    var strurl = url + "setocprofile?id=" + dev_id + "&core=" + core_delta + "&memory=" + memory_delta + "&watts=" + power;
    if (vcore != null) {
        strurl += '&vcore=' + vcore;
        log_write('normal', 'Applying OC, dev=' + dev_id + ' core=' + core_delta + ' mem=' + memory_delta + ' pwr=' + power + ' vcore=' + vcore);
    }
    else
        log_write('normal', 'Applying OC, dev=' + dev_id + ' core=' + core_delta + ' mem=' + memory_delta + ' pwr=' + power);

    $.ajax({
        url: strurl,
        headers: { 'Authorization': auth_token },
        //indexValue: [dev_id, core_delta, memory_delta, power],
        success: function (data) {
            if (data.error !== null) {
                log_write('normal', 'Failed to apply OC');
            }
            else {
                log_write('normal', 'Applied OC successfully');
            }
        }
    });

    $("#opt-bt-oc1").removeClass('button-optimize');
}

//Apply an overclock to a single device.
function apply_oc(dev_id) {
    if (dev_id == null)
        dev_id = $('#selected-device').val();

    if (is_optimize_locked(dev_id)) return;

    var core_delta = $('#selected-core').val();
    var memory_delta = $('#selected-memory').val();
    var power = $('#selected-power').val();

    var mv_opt = parseInt($('#selected-core-volt2').val());
    if (!uvolt_unlocked2 || isNaN(mv_opt)) mv_opt = null;
    else if (mv_opt <= 0) mv_opt = 0;
    else if (mv_opt < 500) mv_opt = 500;
    else if (mv_opt > 1100) mv_opt = 1100;

    apply_oc_with_params(dev_id, core_delta, memory_delta, power, mv_opt);
}

//Apply an overclock to all devices.
function apply_oc_all() {
    var core_delta = $('#selected-core').val();
    var memory_delta = $('#selected-memory').val();
    var power = $('#selected-power').val();

    var mv_opt = parseInt($('#selected-core-volt2').val());
    if (!uvolt_unlocked2 || isNaN(mv_opt)) mv_opt = null;
    else if (mv_opt <= 0) mv_opt = 0;
    else if (mv_opt < 500) mv_opt = 500;
    else if (mv_opt > 1100) mv_opt = 1100;

    var logtxt = '';
    if (mv_opt != null) {
        mv_opt = '&vcore=' + mv_opt;
        logtxt = ' vcore=' + mv_opt;
    }
    else mv_opt = '';

    log_write('normal', 'Applying OC for all devices; core=' + core_delta + ' mem=' + memory_delta + ' pwr=' + power + logtxt);

    for (var i = 0; i < devices.length; ++i) {

        if (is_optimize_locked(devices[i].device_id)) continue;

        $.ajax({
            url: url + "setocprofile?id=" + devices[i].device_id + "&core=" + core_delta + "&memory=" + memory_delta + "&watts=" + power + mv_opt,
            indexValue: devices[i].device_id,
            headers: { 'Authorization': auth_token },
            success: function (data, indexValue) {
                if (data.error !== null) {
                    // handle err case
                }
                else {
                    log_write('normal', 'Applied OC successfully for device #' + this.indexValue);
                }
            }
        });
    }
}

//Reset overclocks for a single device.
function reset_oc(dev_id) {

    if (dev_id == null)
        dev_id = $('#selected-device').val();

    if (is_optimize_locked(dev_id)) return;

    log_write('normal', 'Resetting OC, dev=' + dev_id);

    $.ajax({
        url: url + "resetoc?id=" + dev_id,
        headers: { 'Authorization': auth_token },
        success: function (data) {
            if (data.error !== null) {
                // handle err case
            }
            else {
                log_write('normal', 'Reset OC successfully');
            }
        }
    });

    reset_fan(dev_id);
}

//Reset overclock for all devices.
function reset_oc_all() {
    log_write('normal', 'Resetting OC for all devices');

    for (var i = 0; i < devices.length; ++i) {

        if (is_optimize_locked(devices[i].device_id)) continue;

        $.ajax({
            url: url + "resetoc?id=" + devices[i].device_id,
            headers: { 'Authorization': auth_token },
            indexValue: devices[i].device_id,
            success: function (data, indexValue) {
                if (data.error !== null) {
                    // handle err case
                }
                else {
                    log_write('normal', 'Reset OC successfully for device #' + this.indexValue);
                }
            }
        });
    }
}

//Change Core Clock Max
function change_core_clock_max(clk) {
    $('#selected-core-max').val(parseInt($('#selected-core-max').val()) + clk);
}

//Change Core Clock Absolute Memory
function change_mem_clock_abs(clk) {
    $('#selected-memory-abs').val(parseInt($('#selected-memory-abs').val()) + clk);
}

//Change Core Clockk
function change_core_clock(clk) {
    $('#selected-core').val(parseInt($('#selected-core').val()) + clk);
}

//Change Memory Clock
function change_mem_clock(clk) {
    $('#selected-memory').val(parseInt($('#selected-memory').val()) + clk);
}

//Change Power
function change_power(pwr) {
    $('#selected-power').val(parseInt($('#selected-power').val()) + pwr);
}

//Change selected gpu fan to max max .
function change_fan_level_max(ss) {
    var a = parseInt($('#selected-fan-level-max').val());
    if (a === -1) a = 0;
    a += ss;
    if (a <= 0) a = -1;
    else if (a > 100) a = 100;
    $('#selected-fan-level-max').val(a);
}

//Change Selected GPU Fan Temp
function change_fan_temp_gpu(ss) {
    $('#selected-fan-temp-gpu').val(parseInt($('#selected-fan-temp-gpu').val()) + ss);
}

//Change selected GPU VRAM temp.
function change_fan_temp_vram(ss) {
    $('#selected-fan-temp-vram').val(parseInt($('#selected-fan-temp-vram').val()) + ss);
}

//Change fan speeds for selected device.
function change_fan_speed(ss) {
    var a = parseInt($('#selected-fan-speed').val()) + ss;
    if (a < 0) a = 0;
    else if (a > 100) a = 100;
    $('#selected-fan-speed').val(a);
}


//Change Memory Clock
function at_change_mem_clock(clk) {
    $('#at-memory').val(parseInt($('#at-memory').val()) + clk);
}

//Change Core Clock Limit Start
function at_change_core_limit_start(clk) {
    $('#at-core-start').val(parseInt($('#at-core-start').val()) + clk);
}

//Change Core Clock Limit End
function at_change_core_limit_end(clk) {
    $('#at-core-end').val(parseInt($('#at-core-end').val()) + clk);
}

//Update Ajax Refresh Time
function refresh_change() {
    var secs = $('#refresh-time').val();
    //console.log(secs);
    $('#refresh-time-text').html(secs);
    refresh_time = parseInt(secs * 1000);
    if (tick_handler != null) {
        clearTimeout(tick_handler);
        _tick();
    }
}

//Refresh GPU Memory Timings
function refresh_mt(dd) {
    if (dd.gpu_memory_timings != undefined &&
        dd.gpu_memory_timings.timings != undefined) {
        var tstr2 = '';
        for (var key in dd.gpu_memory_timings.timings) {
            var value = dd.gpu_memory_timings.timings[key];
            if (tstr2.length > 0) tstr2 += ',';
            tstr2 += '"' + key + '=' + value + '"';
        }
        $('#mt-text-box3').html(tstr2);
    }
}


//Prefill Overclock Forms
function pre_oc_fill() {
    var dev_id = $('#selected-device').val();
    var dd = devices[dev_id];
    var device_ocs = devices[dev_id].oc_data;
    $('#selected-core').val(device_ocs.core_clock_delta);
    $('#selected-memory').val(device_ocs.memory_clock_delta);
    $('#selected-power').val(device_ocs.power_limit_watts);
    $('#selected-core-max').val(device_ocs.core_clock_limit);
    $('#selected-memory-abs').val(devices[dev_id].gpu_clock_memory);
    $('#at-memory').val(devices[dev_id].gpu_clock_memory);

    if (devices[dev_id].GDDRData !== null) {
        $('#at-mem-min').html(devices[dev_id].GDDRData[0]);
        $('#at-mem-max').html(devices[dev_id].GDDRData[1]);
        $('#at-enable').attr('disabled', false);
    }
    else {
        $('#at-mem-min').html('N/A');
        $('#at-mem-max').html('N/A');
        $('#at-enable').attr('disabled', true);
    }

    $('#selected-fan-mode').val(dd.smartfan.mode);
    $('#selected-fan-speed').val(dd.smartfan.fixed_speed);
    $('#selected-fan-temp-gpu').val(dd.smartfan.target_gpu);
    $('#selected-fan-temp-vram').val(dd.smartfan.target_vram);

    //if (dd.smartfan.override_level_min != -1)
    //    $('#selected-fan-level-min').val(dd.smartfan.override_level_min);
    //else
    //    $('#selected-fan-level-min').val('');
    //if (dd.smartfan.override_level_max != -1)
        $('#selected-fan-level-max').val(dd.smartfan.override_level_max);
    //else
    //    $('#selected-fan-level-max').val('');

    if (dd.oc_limits != undefined) {
        $('#core-delta-limits').html('Min:' + dd.oc_limits.core_delta_min + ' Max:+' + dd.oc_limits.core_delta_max);
        $('#core-max-limits').html('Min:300 Max:' + dd.gpu_clock_core_max);
    }

    refresh_mt(dd);

    var tstr = '';
    for (var key in device_ocs.mt) {
        var value = device_ocs.mt[key];
        if (tstr.length > 0) tstr += ',';
        tstr += '"' + key + '=' + value + '"';
    }
    if (tstr.length === 0)
        tstr = '"EXAMPLE1=22","EXAMPLE2=33"';
    $('#mt-text-box2').val(tstr);

    allow_uvolt(false);
    allow_uvolt2(false);

    opt_fill_wrap(dev_id, dd.name, get_pcidev_name(dd));
}

//Request Elevated Privileges
function get_admin() {
    $.ajax({
        url: url + "elevate",
        headers: { 'Authorization': auth_token },
        success: function (data) {
            if (data.error !== null) {
                log_write('error', 'Failed to acquire administrator privileges! Overclocking will not work.');
            }
            else {
                log_write('normal', 'Administrator privileges acquired!');
            }
        },
        error: function () {
            log_write('normal', 'Administrator privileges acquired!');
        }
    });
}

//Save Current Configuration Settings
function save_current_cmds() {
    $.ajax({
        url: url + "cmdcommit",
        headers: { 'Authorization': auth_token },
        success: function (data) {
            if (data.error !== null) {
                log_write('error', 'Failed to save current commands.');
            }
            else {
                log_write('normal', 'Configuration saved!');
                alert('Your current overclock and fan settings have been commited to commands.json file. Previous configuration saved as .bak file.\n\n' +
                    'These settings will be applied next time Excavator is started.');
            }
        },
        error: function () {
        }
    });
}

//What are we doing here...
function apply_credentials() {
    var username = $('#input-username').val();
    var location = $('#input-location').val();
    log_write('normal', 'Setting username: ' + username + ' (location: ' + location + ')');

    $.ajax({
        url: url + "quickstart?id=" + username + '&loc=' + location,
        headers: { 'Authorization': auth_token },
        success: function (data) {
            if (data.error !== null) {
                log_write('error', 'Failed to apply new credentials.');
            }
            else {
                log_write('normal', 'New credentials applied!');
            }
        },
        error: function () {
        }
    });
}

//Get current subscription information.
function get_current_credentials() {
    $.ajax({
        url: url + 'api?command={"id":1,"method":"subscribe.info","params":[]}',
        headers: { 'Authorization': auth_token },
        success: function (data) {
            if (data.error !== null) {
            }
            else {
                if (data.address.substring(0, 12) === 'nhmp-ssl.usa')
                    $('#input-location').val('usa');
                else
                    $('#input-location').val('eu');
                $('#input-username').val(data.login);
                //log_write('normal', 'New credentials applied!');
            }
        },
        error: function () {
        }
    });
}

//Detect selected devices.
function detect_selected_devices() {
    selected_devices = new Array();
    for (var i = 0; i < devices.length; ++i)
        if ($('#device-' + devices[i].device_id + '-selected').is(":checked"))
            selected_devices.push(i);
}

//Append device to selected_devices array.
function make_action_for_selected(sfunc) {
    detect_selected_devices();

    while (selected_devices.length > 0) {
        var popdev = selected_devices.pop();
        sfunc(popdev);
    }
}

//Reset OC for selected devices.
function reset_oc_selected() {
    make_action_for_selected(reset_oc);
}

//Apply OC for selected devices.
function apply_oc_selected() {
    make_action_for_selected(apply_oc);
}

//Apply (Alternative) OC for selected devices)
function apply_oc_selected_alt() {
    make_action_for_selected(apply_oc_alt);
}

//Apply fan for selected devices.
function apply_fan_selected() {
    make_action_for_selected(apply_fan);
}

//Apply memory timings for selected devices.
function set_memory_timings_selected() {
    make_action_for_selected(set_memory_timings);
}


// =========================================
// DEVICE HEALTH
// =========================================

function reset_fan(dev_id) {

    if (is_optimize_locked(dev_id)) return;

    $.ajax({
        url: url + "fanreset?id=" + dev_id,
        headers: { 'Authorization': auth_token },
        success: function (data) {
            if (data.error !== null) {
                // handle err case
            }
            else {
                log_write('normal', 'Fan reset');
                //updateAll();
            }
        }
    });
}


function set_fan(i) {
    var dev_id = devices[i].device_id;
    var core_delta = devices[i].oc_data.core_clock_delta;
    var memory_delta = devices[i].oc_data.memory_clock_delta;
    var power = devices[i].oc_data.power_limit_watts;

    if (is_optimize_locked(dev_id)) return;

    var fan_level = $('#fan-level-' + dev_id).val();

    apply_oc_with_params(dev_id, core_delta, memory_delta, power, fan_level);
}


function set_fan_all(level) {
    var fan_level = $('#fan-speed-all').val();

    for (var i = 0; i < devices.length; ++i) {

        var dev_id = devices[i].device_id;
        var core_delta = devices[i].oc_data.core_clock_delta;
        var memory_delta = devices[i].oc_data.memory_clock_delta;
        var power = devices[i].oc_data.power_limit_watts;

        if (is_optimize_locked(dev_id)) continue;

        apply_oc_with_params(dev_id, core_delta, memory_delta, power, fan_level);
    }
}



function all_selected_changed() {
    var tocheck = false;
    if ($("#all-selected").is(":checked")) tocheck = true;
    for (var i = 0; i < devices.length; ++i)
        $('#device-' + devices[i].device_id + '-selected').prop('checked', tocheck);
}


// =========================================
// AUTO TUNE
// =========================================


var at_running = false;
var at_req_to_end = false;
var at_device_id;
var at_device_index;
var at_fastest_core;
var at_eff_core;
var at_wanted_memory;
var at_current_clock;
var at_kt_lowest;
var at_power_sum;
var at_core_min;
var at_core_max;
var at_results;
var at_hashes_per_ke;
var at_prev_fan;


const KT_WAIT_TIME = 2500;
const KT_ITERATIONS = 3;
const CLOCK_STEP = 15;
const ABSOLUTE_CORE_MIN_CLOCK = 210;

var at_next_applied_clock;


// http_call_res:
// 0 = all OK
// 1 = call OK, but method failed
// 2 = call failed
function at_error(http_call_res, err_msg) {

    if (http_call_res !== 0) {

        if (http_call_res === 2)
            log_write('autotune', 'Finished prematurely because HTTP API call failed. Did Excavator crash?');
        else
            log_write('autotune', err_msg);

        $('.auto-tune-disable').each(function () {
            $(this).attr('disabled', false);
        });

        // release scanner
        at_running = false;

        return;
    }

    // report last stable OC found
    if (!at_req_to_end && at_fastest_core != null) {

        // restore fan
        if (at_prev_fan != null) {

            log_write('autotune', 'Restoring FAN, mode=' + at_prev_fan.mode);
            var strurl = url;
            if (at_prev_fan.mode === 1) {
                strurl += 'fanset?id=' + at_device_id + '&level=' + at_prev_fan.fixed_speed;
            }
            else {
                strurl += 'smartfanset?id=' + at_device_id + '&mode=' + at_prev_fan.mode;
            }

            $.ajax({
                url: strurl,
                headers: { 'Authorization': auth_token },
                success: function (data) {
                    if (data.error !== null) {
                    }
                    else {
                    }
                },
                error: function () { }
            });
        }

        if ($("#at-eff").is(":checked")) {
            at_next_applied_clock = at_eff_core;
            at_call("setocprofile2?id=" + at_device_id +
                "&core=" + at_eff_core + "&memory=" + at_wanted_memory,
                function (data) {
                    log_write('autotune', 'Best OC for EFFICIENCY applied (memory: ' + at_wanted_memory +
                        'MHz,&nbsp;core clock limit: ' + at_next_applied_clock + 'MHz)');
                }
            );
        }
        else {
            at_next_applied_clock = at_fastest_core;
            at_call("setocprofile2?id=" + at_device_id +
                "&core=" + at_fastest_core + "&memory=" + at_wanted_memory,
                function (data) {
                    log_write('autotune', 'Best OC for SPEED applied (memory: ' + at_wanted_memory +
                        'MHz,&nbsp;core clock limit: ' + at_next_applied_clock + 'MHz)');
                }
            );
        }
    }
    else {
        // reset OC to return everything back to normal
        $.ajax({
            url: url + "resetoc?id=" + at_device_id,
            headers: { 'Authorization': auth_token },
            success: function (data) {
                log_write('autotune', 'OC has been reset! Please, reapply it.');
            }
        });
    }

    // report error
    log_write('autotune', err_msg);

    // release scanner
    at_running = false;

    if (selected_devices.length > 0) {
        var dev = selected_devices.pop();
        setTimeout(auto_tune_start, 1000, dev);
        return;
    }

    $('.auto-tune-disable').each(function () {
        $(this).attr('disabled', false);
    });
}


function at_call(_url, _action) {
    if (at_req_to_end) {
        at_error(0, 'Cancelled by the user');
        return;
    }

    $.ajax({
        url: url + _url,
        headers: { 'Authorization': auth_token },
        success: function (data) {
            if (data.error !== null) {
                at_error(1, data.error);
            }
            else {
                _action(data);
            }
        },
        error: function (data) {
            at_error(2, null);
        }
    });
}


function at_resetoc(_action) {
    at_call("resetoc?id=" + at_device_id,
        function (data) { _action(data); });
}


function at_core_limit(_core, _action) {
    // {"id":1,"method":"device.set.tdp","params":["0","150"]}
    var _url = 'api?command={"id":1,"method":"device.set.core_abs","params":["' +
        at_device_id + '","' + _core + '"]}';
    at_call(_url, function (data) { _action(data); });
}


function at_get_ktumed(_action) {
    at_call('getkerneltimes?id=' + at_device_id,
        function (data) {
            if (data.kernel_times.umed === 0)
                at_error(1, 'Not mining - please, activate mining to perform AutoTune!');
            else
                _action(data.kernel_times.umed);
        });
}


function auto_tune_start(dev) {
    if (at_running) {
        log_write('autotune', 'Already running');
        return; // already running
    }

    var mem_min = parseInt($('#at-mem-min').html());
    var mem_max = parseInt($('#at-mem-max').html());
    at_wanted_memory = parseInt($('#at-memory').val());
    if (isNaN(at_wanted_memory) || at_wanted_memory < mem_min || at_wanted_memory > mem_max) {
        log_write('autotune', 'Invalid memory value; must be min=' + mem_min + ', max=' + mem_max);
        return;
    }

    if (dev !== null) at_device_id = devices[dev].device_id;
    else at_device_id = $('#selected-device').val();

    if (is_optimize_locked(at_device_id)) return;

    at_device_index = devices_indices[at_device_id];
    var at_core_max_dev = devices[at_device_index].gpu_clock_core_max;
    at_hashes_per_ke = devices[at_device_index].hashes_per_ke;
    if (at_hashes_per_ke === null || at_hashes_per_ke === 0)
        at_hashes_per_ke = 1;
    at_core_min = parseInt($('#at-core-start').val());
    if (isNaN(at_core_min) || at_core_min < ABSOLUTE_CORE_MIN_CLOCK || at_core_min >= at_core_max) {
        log_write('autotune', 'Invalid core start value; must be min=210, max=' + at_core_max);
        return;
    }

    at_core_max = parseInt($('#at-core-end').val());
    if (isNaN(at_core_max) || at_core_max < at_core_min || at_core_max > at_core_max_dev) {
        log_write('autotune', 'Invalid core end value; must be min=' + at_core_min + ', max=' + at_core_max_dev);
        return;
    }

    if (devices[at_device_index].gpu_power_usage == null) {
        log_write('autotune', 'Device #' + at_device_id + ': Cannot perform without support for power consumption reporting!');
        return;
    }

    if (devices[at_device_index].details.sm_major === 6) {
        log_write('autotune', 'Device #' + at_device_id + ': Cannot perform for GPU arch: Pascal');
        return;
    }

    $('.auto-tune-disable').each(function () {
        $(this).attr('disabled', true);
    });
    $('#stop_auto_tune').attr('disabled', false);

    // round at_core_min number
    var aa = at_core_min / CLOCK_STEP;
    at_core_min = Math.floor(CLOCK_STEP * Math.floor(aa));
    $('#at-core-start').val(at_core_min);

    at_req_to_end = false;
    at_running = true;
    at_fastest_core = null;
    at_eff_core = null;
    at_results = new Array();

    log_write('autotune', 'Starting up for device id #' + at_device_id + ',<break>&nbsp;&nbsp;&nbsp;absolute memory clock: ' + at_wanted_memory + 'MHz');
    log_write('autotune', 'Starting clock limit: ' + at_core_min + 'MHz,<break>&nbsp;&nbsp;&nbsp;ending clock limit: ' + at_core_max + 'MHz');

    var delta_clock = at_core_max - at_core_min;
    var clock_it = delta_clock / CLOCK_STEP;
    if (clock_it < 1) clock_it = 1;
    var total_time_sec = clock_it * KT_ITERATIONS * KT_WAIT_TIME * 0.001;
    log_write('autotune', 'Please, be patient,<break>&nbsp;&nbsp;&nbsp;this will take approx. ' + total_time_sec.toFixed(2) + ' seconds!');

    at_prev_fan = devices[at_device_index].smartfan;

    // 1. reset OC first
    log_write('autotune', 'Reset OC, set fan to 100%');

    at_resetoc(function (data) {
        at_call("fanset?id=" + at_device_id + "&level=100", function (data) {
            at_step_3_4();
        });
    });
}


function auto_tune_start_selected() {

    detect_selected_devices();

    if (selected_devices.length < 1) {
        log_write('autotune', 'No devices selected');
        return;
    }

    var str = 'Doing for following devices: ';
    for (var i = 0; i < selected_devices.length; ++i)
        str += '#' + devices[selected_devices[i]].device_id + ' ';

    log_write('autotune', str);

    var dev = selected_devices.pop();
    auto_tune_start(dev);
}


function auto_tune_finish_now() {
    if (!at_running) return;

    at_for_devices = new Array();
    log_write('autotune', 'Finishing by setting max core clock limit: ' + at_current_clock);
    //at_req_to_end = true;
    at_core_max = at_current_clock; pwr
    $('#stop_auto_tune').attr('disabled', true);
}


function at_step_3_4() {

    // 3. set mem clock to selected one
    // 4. set core clock limit to max
    //log_write('autotune', 'Set core clock limit to min: ' + at_core_min + 'MHz, mem clock: ' + at_wanted_memory + 'MHz');

    at_current_clock = at_core_min;
    at_call("setocprofile2?id=" + at_device_id +
        "&core=" + at_core_min + "&memory=" + at_wanted_memory,
        function (data) {
            at_step_5_mess_ktumed_start();
        });
}


function at_step_5_inc_core() {

    if (at_current_clock >= at_core_max) {
        // we have reached the end, cannot decrease more
        // just use last best kt umed
        //at_step_6();
        if (at_results.length == 0) {
            at_error(0, 'No results!');
            return;
        }

        // find best clock with lowest kt
        var best_speed = at_results[0];
        var best_eff = at_results[0];
        for (var i = 1; i < at_results.length; ++i) {
            if (at_results[i].kt < best_speed.kt)
                best_speed = at_results[i];
            if (at_results[i].eff > best_eff.eff)
                best_eff = at_results[i];
        }

        at_fastest_core = best_speed.clock;
        at_eff_core = best_eff.clock;

        log_write('autotune', 'Found best SPEED @ max core clock limit: ' + at_fastest_core +
            'MHz (eff: ' + best_speed.eff.toFixed(8) + ' ke/J,&nbsp;heff: ' + best_speed.heff.toFixed(2) + 'kH/J)');
        log_write('autotune', 'Found best EFFICIENCY @ max core clock limit: ' + at_eff_core +
            'MHz (eff: ' + best_eff.eff.toFixed(8) + ' ke/J,&nbsp;heff: ' + best_eff.heff.toFixed(2) + 'kH/J)');
        at_error(0, 'All done!');

        return
    }

    at_current_clock += CLOCK_STEP;

    //log_write('autotune', 'Testing core limit: ' + at_current_clock);
    at_core_limit(at_current_clock, function (data) {
        at_step_5_mess_ktumed_start();
    });
}


function at_step_5_mess_ktumed_start() {

    at_kt_lowest = 999999999;
    at_power_sum = 0;

    // need to wait a bit for kt to fill
    setTimeout(at_step_5_mess_ktumed_itt, KT_WAIT_TIME, KT_ITERATIONS);
}


function at_step_5_mess_ktumed_itt(itt) {
    at_get_ktumed(function (data) {
        if (data < at_kt_lowest) at_kt_lowest = data;
        at_power_sum += devices[at_device_index].gpu_power_usage;
        --itt;
        if (itt === 0) at_step_5_mess_ktumed_fin();
        else setTimeout(at_step_5_mess_ktumed_itt, KT_WAIT_TIME, itt);
    });
}


function at_step_5_mess_ktumed_fin() {

    at_power_sum /= KT_ITERATIONS;

    var oneeff = at_kt_lowest * at_power_sum * 0.000001; // us/ke * J/s * 1/1000000 = J/ke
    var eff = 1 / oneeff; // = ke/J (kernel executions per Joule)
    var hash_eff = eff * at_hashes_per_ke * 0.001; // =kH/J (khashes per Joule)
    log_write('autotune', 'kt.umed: ' + at_kt_lowest + ' us,&nbsp;&nbsp;clock: ' + at_current_clock + 'MHz,<break>&nbsp;&nbsp;pwr: ' +
        at_power_sum.toFixed(2) + 'W,&nbsp;&nbsp;eff: ' + eff.toFixed(8) + ' ke/J,&nbsp;&nbsp;heff: ' + hash_eff.toFixed(2) + 'kH/J');
    at_results.push({ "kt": at_kt_lowest, "clock": at_current_clock, "power": at_power_sum, "eff": eff, "heff": hash_eff });

    at_step_5_inc_core();
}


///
/// OCTune - OPTIMIZE fill data
///

const opt_data_url = 'https://raw.githubusercontent.com/nicehash/NiceHashQuickMiner/main/optimize/data_007.json';
var opt_devices = null;
var opt_devices_pci = null;
var opt_names = null;
var opt_sel_device = null;


function opt_enable() {
    opt_init();
    $('#opt-checkbox').attr('disabled', true);
}


function opt_sel_manual(dev_id, opt_data) {
    reset_oc(dev_id);
}


function opt_set_0(dev_id, optd) {

    allow_uvolt2(false);

    var dd = devices[dev_id];

    // alternative OC
    $('#selected-core-max').val(optd.oc.max_core_clock);
    $('#selected-memory-abs').val(dd.gpu_clock_memory_default + optd.oc.delta_mem_clock);
    $('#at-memory').val(dd.gpu_clock_memory_default + optd.oc.delta_mem_clock);

    // other useless junk
    $('#selected-core').val(0);
    $('#selected-memory').val(optd.oc.delta_mem_clock);
    $('#selected-power').val(0);

    $("#opt-bt-oc2").addClass('button-optimize');
}


function opt_set_1(dev_id, optd) {

    allow_uvolt2(false);

    var dd = devices[dev_id];

    // classic OC
    $('#selected-core').val(optd.oc.delta_core_clock);
    $('#selected-memory').val(optd.oc.delta_mem_clock);
    $('#selected-power').val(optd.oc.power_limit);
    $('#selected-core-max').val(0);
    $('#selected-memory-abs').val(dd.gpu_clock_memory_default + optd.oc.delta_mem_clock);
    $('#at-memory').val(dd.gpu_clock_memory_default + optd.oc.delta_mem_clock);

    $("#opt-bt-oc1").addClass('button-optimize');
}


function opt_set_2(dev_id, optd) {

    allow_uvolt2(true);

    var dd = devices[dev_id];

    // classic OC
    $('#selected-core').val(optd.oc.max_core_clock);
    $('#selected-memory').val(optd.oc.delta_mem_clock);
    $('#selected-power').val(0);
    $('#selected-core-volt2').val(optd.oc.max_core_volt);
    $('#selected-core-max').val(0);
    $('#selected-memory-abs').val(dd.gpu_clock_memory_default + optd.oc.delta_mem_clock);
    $('#at-memory').val(dd.gpu_clock_memory_default + optd.oc.delta_mem_clock);

    $("#opt-bt-oc1").addClass('button-optimize');
}


function opt_set_3(dev_id, optd) {

    allow_uvolt2(false);

    var dd = devices[dev_id];

    if (optd.oc.max_core_clock > 0) {
        // alternative OC
        $('#selected-core-max').val(optd.oc.max_core_clock);
        $('#selected-memory-abs').val(dd.gpu_clock_memory_default);
        $('#at-memory').val(dd.gpu_clock_memory_default);

        // other useless junk
        $('#selected-core').val(0);
        $('#selected-memory').val(0);
        $('#selected-power').val(0);

        $("#opt-bt-oc2").addClass('button-optimize');
    }
    else if (optd.oc.power_limit > 0) {

        // classic OC
        $('#selected-core').val(0);
        $('#selected-memory').val(0);
        $('#selected-power').val(optd.oc.power_limit);

        $('#selected-core-max').val(0);
        $('#selected-memory-abs').val(dd.gpu_clock_memory_default);
        $('#at-memory').val(dd.gpu_clock_memory_default);

        $("#opt-bt-oc1").addClass('button-optimize');
    }
}


function opt_change() {

    $("#opt-bt-mt").removeClass('button-optimize');
    $("#opt-bt-fan").removeClass('button-optimize');
    $("#opt-bt-oc1").removeClass('button-optimize');
    $("#opt-bt-oc2").removeClass('button-optimize');

    var dd = devices[opt_sel_device];

    var sopt = JSON.parse($('#selected-optimize-profile').val());
    if (sopt.ptype === -1) {

        if (confirm('Reset OC settings and fan to default for device #' + opt_sel_device + ': ' + dd.name)) {
            opt_sel_manual(opt_sel_device, sopt);
            log_write('optdata', 'Device #' + opt_sel_device + ' OPTIMIZATION data executed: ' + sopt.pname);
        }
        return;
    }

    allow_uvolt(false);

    if (dd.GDDRData !== null) {
        $('#at-mem-min').html(dd.GDDRData[0]);
        $('#at-mem-max').html(dd.GDDRData[1]);
        $('#at-enable').attr('disabled', false);
    }
    else {
        $('#at-mem-min').html('N/A');
        $('#at-mem-max').html('N/A');
        $('#at-enable').attr('disabled', true);
    }

    if (dd.oc_limits != undefined) {
        $('#core-delta-limits').html('Min:' + dd.oc_limits.core_delta_min + ' Max:+' + dd.oc_limits.core_delta_max);
        $('#core-max-limits').html('Min:300 Max:' + dd.gpu_clock_core_max);
    }

    switch (sopt.ptype) {
        case 0:
            opt_set_0(opt_sel_device, sopt);
            break;
        case 1:
            opt_set_1(opt_sel_device, sopt);
            break;
        case 2:
            opt_set_2(opt_sel_device, sopt);
            break;
        case 3:
            opt_set_3(opt_sel_device, sopt);
            break;
        default:
            log_write('optdata', 'No func defined for ptype=' + sopt.ptype);
            return;
    }

    // fan mode
    $('#selected-fan-mode').val(sopt.smartfan.mode);
    if (sopt.smartfan.fixed_speed != undefined)
        $('#selected-fan-speed').val(sopt.smartfan.fixed_speed);
    else
        $('#selected-fan-speed').val(100);

    if (sopt.smartfan.target_gpu != undefined)
        $('#selected-fan-temp-gpu').val(sopt.smartfan.target_gpu);
    else
        $('#selected-fan-temp-gpu').val(60);

    if (sopt.smartfan.target_vram != undefined)
        $('#selected-fan-temp-vram').val(sopt.smartfan.target_vram);
    else
        $('#selected-fan-temp-vram').val(90);

    if (sopt.smartfan.level_max != undefined)
        $('#selected-fan-level-max').val(sopt.smartfan.level_max);
    $('#selected-fan-level-max').val(-1);

    if (sopt.ptype != 3)
        $("#opt-bt-fan").addClass('button-optimize');

    // memory timings
    var tstr2 = '';
    if (sopt.oc.memory_timings != undefined) {
        for (var i = 0; i < sopt.oc.memory_timings.length; ++i) {
            if (i > 0) tstr2 += ',';
            tstr2 += '"' + sopt.oc.memory_timings[i][0] + '=' + sopt.oc.memory_timings[i][1] + '"';
        }
    }
    $('#mt-text-box2').val(tstr2);
    if (tstr2.length > 0)
        $("#opt-bt-mt").addClass('button-optimize');

    log_write('optdata', 'Device #' + opt_sel_device + ' OPTIMIZATION data loaded: ' + sopt.pname);
}


function opt_fill(dev_id, dname, pcid) {

    if (opt_devices == null) {
        $('#selected-optimize-profile').empty();
        $('#selected-optimize-profile').append(new Option('No data available', ''));
        $('#selected-optimize-profile').attr('disabled', true);
        return;
    }

    $('#selected-optimize-profile').empty();
    $('#selected-optimize-profile').attr('disabled', false);

    $("#opt-bt-mt").removeClass('button-optimize');
    $("#opt-bt-fan").removeClass('button-optimize');
    $("#opt-bt-oc1").removeClass('button-optimize');
    $("#opt-bt-oc2").removeClass('button-optimize');

    //if (opt_devices == null) {
    //    log_write('optdata', 'No OPTIMIZE data available yet, try again later');
    //    return;
    //}

    var optd = opt_devices[dname];
    if (optd == undefined) {
        optd = opt_devices_pci[pcid];
        if (optd == undefined)
            return; // we don't have this profile
    }

    opt_sel_device = dev_id;
    var ram_maker = devices[dev_id].ram_maker;

    //$('#selected-optimize-profile').append(new Option('', optionValue))
    for (var key in optd) {
        var vv = optd[key];
        if (vv.ram_maker != undefined) {
            if (vv.ram_maker !== ram_maker)
                continue; // skip, not same ram maker
        }
        $('#selected-optimize-profile').append(new Option(key, JSON.stringify(optd[key])));
    }
}


function opt_fill_wrap(dev_id, dname, pcid) {
    if (opt_devices != null) {
        opt_fill(dev_id, dname, pcid);
        return;
    }

    setTimeout(opt_fill, 1000, dev_id, dname, pcid);
}


function opt_init() {

    $.ajax({
        url: opt_data_url,
        success: function (data1) {
            var data = JSON.parse(data1);
            log_write('optdata', 'Optimize file data obtained');
            opt_names = new Array();
            for (var i = 0; i < data.op_names.length; ++i) {
                opt_names[data.op_names[i].id] = data.op_names[i].name;
            }
            opt_devices = new Array();
            opt_devices_pci = new Array();
            for (var i = 0; i < data.devices.length; ++i) {
                var devdata = data.devices[i].op;

                var dda = new Array();
                dda['Manual/None'] = new Object();
                dda['Manual/None'].pname = 'Manual/None';
                dda['Manual/None'].ptype = -1;

                for (var k = 0; k < devdata.length; ++k) {
                    var pname = opt_names[devdata[k].id];
                    dda[pname] = new Object();
                    dda[pname].pname = pname;
                    dda[pname].ptype = devdata[k].pt;
                    dda[pname].ram_maker = devdata[k].rm;
                    dda[pname].oc = new Object();
                    dda[pname].oc.delta_mem_clock = devdata[k].dmc;
                    dda[pname].oc.max_core_clock = devdata[k].mcc;
                    dda[pname].oc.delta_core_clock = devdata[k].dcc;
                    dda[pname].oc.power_limit = devdata[k].pl;
                    dda[pname].oc.max_core_volt = devdata[k].mcv;
                    dda[pname].oc.memory_timings = devdata[k].mt;
                    dda[pname].smartfan = new Object();
                    dda[pname].smartfan.mode = devdata[k].fm;
                    dda[pname].smartfan.fixed_speed = devdata[k].fs;
                    dda[pname].smartfan.target_gpu = devdata[k].ftg;
                    dda[pname].smartfan.target_vram = devdata[k].ftr;
                    dda[pname].smartfan.level_max = devdata[k].flmax;
                }

                var devname = data.devices[i].name;

                if (devname == undefined || devname == null) {
                    if (data.devices[i].pci_devs != undefined &&
                        data.devices[i].pci_devs != null &&
                        data.devices[i].pci_devs.length > 0) {

                        for (var t = 0; t < data.devices[i].pci_devs.length; ++t)
                            opt_devices_pci[data.devices[i].pci_devs[t]] = dda;
                    }
                }
                else
                    opt_devices[devname] = dda;
            }

            if (devices != null) {
                var dev_id = $('#selected-device').val();
                var dd = devices[dev_id];
                opt_fill_wrap(dev_id, dd.name, get_pcidev_name(dd));
            }
        },
        error: function (data) {
            log_write('optdata', 'Failed to get optimize data file');
        }
    });
}