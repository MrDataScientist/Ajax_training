<?php

require 'facebook.php';

$facebook = new Facebook(array(
	'appId' => 'YOUR APP ID HERE',
	'secret' => 'YOUR APP SECRET HERE'
));


if($facebook->getUser() == 0){
	$loginUrl = $facebook->getLoginUrl(array(
		scope => 'user_groups,manage_pages,publish_actions,publish_stream'
	));
	
	echo "<a href = '$loginUrl'>Login with facebook</a>";
}
else{
	
	$groups = $facebook->api('me/groups');
	$id = $groups[data][0][id];
	$api = $facebook->api($id. '/feed', 'POST', array(
		link => 'cyberfreax.com',
		message => 'Check This Out !'
	));
	
	//posting to pages
	
	$pages = $facebook->api('me/accounts');
	$id = $pages[data][0][id];
	$token = $pages[data][0][access_token];
	$api = $facebook->api($id . '', 'POST', array(
		access_token => $token,
		link => 'cyberfreax.com',
		message => 'Check This Out !'
	));
	
	//posting to profile
	$api = $facebook->api('me/feed', 'POST', array(
		link => 'cyberfreax.com',
		message => 'Check This Out !'
	));
	
	//displaying logout link
	echo "<br><a href = 'logout.php'>Logout</a>";
}

?>