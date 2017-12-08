<?php

require 'facebook.php';

$facebook = new Facebook(array(
	'appId' => 'YOUR APP ID HERE',
	'secret' => 'YOUR APP SECRET HERE'
));

$facebook->destroySession();

?>