var rubyclan_available = false;
var timecrafters_available = false;
var minecraft_available = false;
var orange_available = false;

var minecraft_online_players = 0;
var orange_minecraft_online_players = 0;

var xhrRequest = function (url, type, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    callback(this.responseText);
  };
  xhr.open(type, url);
  xhr.send();
};

Pebble.on('message', function(event) {
  if (event.data.message == "rubyclan") {
    checkRubyClan();
  }
  if (event.data.message == "timecrafters") {
    checkTimeCrafters();
  }
  if (event.data.message == "minecraft") {
    checkMinecraft();
  }
  if (event.data.message == "oranges") {
    checkOranges();
  }
});

Pebble.on('ready', function(event) {
  updateWatchface();
});

function updateWatchface() {
  Pebble.postMessage({
    'rubyclan':rubyclan_available,
    'timecrafters':timecrafters_available,
    'minecraft':minecraft_available,
    'minecraft_online':minecraft_online_players,
    'orange':orange_available,
    'oranges_online':orange_minecraft_online_players
  });
}

function checkRubyClan() {
  xhrRequest('https://rubyclan.org', 'GET', function(responseText) {
   if (responseText.includes("~=RUBY=~")) {
     rubyclan_available = true;
     updateWatchface();
   } else {
     rubyclan_available = false;
     updateWatchface();
   }
 }); 
}

function checkTimeCrafters() {
  xhrRequest('https://timecrafters.org', 'GET', function(responseText) {
    if (responseText.includes("Hello")) {
      timecrafters_available = true;
      updateWatchface();
    } else {
      timecrafters_available = false;
      updateWatchface();
    }
  }); 
}

function checkMinecraft() {
  xhrRequest('https://mcapi.us/server/status?ip=mc.rubyclan.org', 'GET', function(responseText) {
    if (JSON.parse(responseText).online) {
      minecraft_available = true;
      minecraft_online_players = JSON.parse(responseText).players.now;
      updateWatchface();
    } else {
      minecraft_available = false;
      updateWatchface();
    }
  }); 
}

function checkOranges() {
  xhrRequest('https://mcapi.us/server/status?ip=1uk45.com', 'GET', function(responseText) {
    console.log(JSON.parse(responseText).players.now);
    if (JSON.parse(responseText).online) {
      orange_available = true;
      orange_minecraft_online_players = JSON.parse(responseText).players.now;
      updateWatchface();
    } else {
      orange_available = false;
      updateWatchface();
    }
  }); 
}