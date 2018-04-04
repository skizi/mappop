<?php

$limit = $_POST['limit'];
$limit = 10;
$coordinates = $_POST['lng'].','.$_POST['lat'].','.$_POST['dist'];
$coordinates = '180,30,3000';
$url = 'https://www.chiikinogennki.soumu.go.jp/k-cloud-api/v001/kanko/%E7%BE%8E%E8%A1%93%E9%A4%A8/json?limit='.limit.'&coordinates='.coordinates;

$response = file_get_contents( $url );
$json = json_decode($response,true);

header('Content-type:application/json; charset=utf8');

echo $json;

?>