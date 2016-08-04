/**
* twitter-summer
* 使い方
* 
* 同じディレクトリにkeys.jsonというファイルを作って、以下のようにTwitterコンシューマーキー／アクセストークンを書き込んで、どうぞ。
*
* {
*     "consumer_key": "",
*     "consumer_secret": "",
*     "access_token_key": "",
*     "access_token_secret": ""
* }
*
* $ crontab -e
* でcronの設定ファイルを開いて、
* 
* 0 * * * * node (このファイルのパス)
* 
* という設定を追加することで1時間に1回このスクリプトが実行されます。cronおよびcrontabの使い方は自分で調べて。
* 
*/



/*
* DATE_OF_SUMMER_VACATION_START    夏休み初日の日付(Dateオブジェクト)
* DATE_OF_SCHOOL_START    学校が始まる日付(Dateオブジェクト)を入れて差し上げろ
* TEMPLATE    名前のテンプレート。以下のキーワードはそれに対応した数値に置換される
*     - {HOURS}    残り時間数
*     - {DAYS}     残り日数
*     - {PERCENT}  残り時間の百分率
*/

var DATE_OF_SUMMER_VACATION_START = new Date('2016-7-23 UTC+0900');
var DATE_OF_SCHOOL_START = new Date('2016-8-29 UTC+0900');
var TEMPLATE = 'いの #夏休み残量{PERCENT}%';



var Twitter = require('twitter');
var TOKEN_KEYS = require('./keys.json');

var client = new Twitter(TOKEN_KEYS);
var AN_HOUR_MS = 60 * 60 * 1000;
var A_DAY_MS = 24 * 60 * 60 * 1000;

var now = new Date();
var timespan_ms = DATE_OF_SCHOOL_START.getTime() - now.getTime();
var lefts = {
    days: Math.floor(timespan_ms / A_DAY_MS),
    hours: Math.floor(timespan_ms / AN_HOUR_MS),
    percent: Math.round( 100 * 100 * timespan_ms / (DATE_OF_SCHOOL_START.getTime() - DATE_OF_SUMMER_VACATION_START.getTime()) ) / 100
};


var profile = {
    name: TEMPLATE
             .replace('{DAYS}', lefts.days)
             .replace('{HOURS}', lefts.hours)
             .replace('{PERCENT}', lefts.percent)
};

// プロフィールの変更を実行
client.post('account/update_profile', profile,  function(error, data, response){
    if(error) {
        console.error(error);
    }
});
