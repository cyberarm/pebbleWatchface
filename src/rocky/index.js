var rocky = require('rocky');

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
var last_message_at = new Date();

var rubyclan_status = "UKN";
var timecrafters_status = "UKN";
var minecraft_status = "UKN";
var connectivity_status = "UKN";
var delay_counter = 5;

var minecraft_online_players = "";
var orange_minecraft_online_players = "";
var oranges_available = false;
var minecraft_available = false;


rocky.on('minutechange', function(e) {
  rocky.postMessage({'message': 'rubyclan'});
  rocky.postMessage({'message': 'timecrafters'});
  if (delay_counter >= 5) {
    rocky.postMessage({'message': 'minecraft'});
    rocky.postMessage({'message': 'oranges'});
    delay_counter = 0;
  } else { delay_counter = 0; }
  delay_counter+=1;
  
  var _d = new Date();
  if ((_d - last_message_at) >= 1000) {
    rubyclan_status = "UKN";
    timecrafters_status = "UKN";
    minecraft_status = "UKN";
    connectivity_status = "X";
  } else { connectivity_status = ""; }
  
  rocky.requestDraw();
});

rocky.on('message', function(e) {
  last_message_at = new Date();
  var data = e.data;
  console.log("DATA "+JSON.stringify(data));
  if (data.rubyclan) {
    rubyclan_status = "OK";
  } else { rubyclan_status = "SOS"; }
  
  if (data.timecrafters) {
    timecrafters_status = "OK";
  } else { timecrafters_status = "SOS"; }
  
  if (data.minecraft) {
    minecraft_status = "OK";
    minecraft_available = true;
    minecraft_online_players = ""+data.minecraft_online;
  } else {
    minecraft_status = "SOS";
    minecraft_available = false;
    minecraft_online_players = ""+last_message_at.getHours();
  }
  
  if (data.orange) {
    oranges_available = true;
    orange_minecraft_online_players = ""+data.oranges_online;
  } else {
    oranges_available = false;
    orange_minecraft_online_players = ""+last_message_at.getMinutes();
  }
  
  rocky.requestDraw();
});

rocky.on('draw', function(drawEvent) {
  var ctx = drawEvent.context;
  var w = ctx.canvas.unobstructedWidth;
  var h = ctx.canvas.unobstructedHeight;

  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

  var d = new Date();

  // STATUS RUBYCLAN
  ctx.font = '28px bold Gothic';
  ctx.textAlign = 'left';
  ctx.fillStyle = 'orange';
  ctx.fillText(rubyclan_status, 5, (h/2)-90, 46);
  
  // STATUS TIMECRAFTERS
  ctx.fillStyle = 'lime';
  ctx.fillText(timecrafters_status, 55, (h/2)-90, 46);
  
  // STATUS MINECRAFT
  ctx.fillStyle = 'brown';
  ctx.fillText(minecraft_status, 103, (h/2)-90, 46);
  
  // DESCRIPTIONS
  ctx.font = "14px Gothic";
  ctx.fillStyle = "#555555";
  
  ctx.fillText('~=RUBY=', 2, 24, 49);
  ctx.fillText('TimeCra', 52, 24, 49);
  ctx.fillText('MineCra', 99, 24, 49);

  
  ctx.fillStyle = '#FFF';
  ctx.textAlign = 'center';


  // HORIZONTAL LINE
  ctx.fillRect(0, (h/2)-42, w, 2);
  ctx.fillRect(48, 0, 2, (h/2)-42);
  ctx.fillRect(96, 0, 2, (h/2)-42);
  
  // TIME
  var localeTime = d.toLocaleTimeString().split(' '); // ['12:31:21', 'AM'] or ['00:31:21']
  var clockTime = localeTime[0].split(':').slice(0, 2).join(':'); // '12:31' or '00:31'

  ctx.font = '42px bold numbers Leco-numbers';
  ctx.fillStyle = 'lime';
  ctx.fillText(clockTime, w/2, (h / 2)-32, 144);
  ctx.fillStyle = 'white';

  // DATE
  var clockDate = monthNames[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear();
  ctx.font = '18px bold Gothic';
  ctx.fillText(clockDate, w/2, (h/2)+11, 144);
  
  // HORIZONTAL LINE
  ctx.fillRect(0, (h/2)+42, w, 2);
  ctx.fillRect(48, (h/2)+42, 2, h/2);
  ctx.fillRect(96, (h/2)+42, 2, h/2);
  
  // RUBYCLAN MINECRAFT PLAYERS or HOUR OF LAST CONNECTION/UPDATE
  ctx.font = '28px bold Gothic';
  ctx.textAlign = 'left';
  if (minecraft_available) {
    ctx.fillStyle = 'red';
  }
  ctx.fillText(minecraft_online_players, 5, (h/2)+46);
  ctx.fillStyle = 'white';
  
  // Status
  ctx.fillStyle = 'blue';
  ctx.fillText(connectivity_status, 55, (h/2)+40);
  ctx.fillStyle = 'white';

  // ORANGES MINECRAFT PLAYERS or MINUTE OF LAST CONNECTION/UPDATE
  if (oranges_available) {
    ctx.fillStyle = 'orange';
  }
  ctx.fillText(orange_minecraft_online_players, 103, (h/2)+40);
});