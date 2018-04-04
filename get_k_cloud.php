<?php

$limit = $_POST['limit'];
$coordinates = $_POST['lng'].','.$_POST['lat'].','.$_POST['dist'];

// $limit = 10;
// $coordinates = '180,35,4000';

$url = 'https://www.chiikinogennki.soumu.go.jp/k-cloud-api/v001/kanko/%E7%BE%8E%E8%A1%93%E9%A4%A8/json?limit='.$limit.'&coordinates='.$coordinates;

$response = file_get_contents( $url );
// $json = json_decode($response,true);

header('Content-type:application/json; charset=utf8');

echo $response;

?>