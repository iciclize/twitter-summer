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
* DATE_OF_SCHOOL_STARTS    学校が始まる日付(Dateオブジェクト)を入れて差し上げろ
* TEMPLATE    名前のテンプレート。{HOURS}は残り時間数に、{DAYS}は残り日数に置換される
*/

var DATE_OF_SCHOOL_STARTS = new Date('2016-9-1 UTC+0900');
var TEMPLATE = 'いの #夏休み残り{HOURS}時間';



var Twitter = require('twitter');
var TOKEN_KEYS = require('./keys.json');

var client = new Twitter(TOKEN_KEYS);
var AN_HOUR_MS = 60 * 60 * 1000;
var A_DAY_MS = 24 * 60 * 60 * 1000;

var now = new Date();
var timespan_ms = DATE_OF_SCHOOL_STARTS.getTime() - now.getTime();
var lefts = {
    days: Math.floor(timespan_ms / A_DAY_MS),
    hours: Math.floor(timespan_ms / AN_HOUR_MS)
};


var profile = {
    name: TEMPLATE
             .replace('{DAYS}', lefts.days)
             .replace('{HOURS}', lefts.hours)
};

// プロフィールの変更を実行
client.post('account/update_profile', profile,  function(error, data, response){
    if(error) {
        console.error(error);
    }
});
