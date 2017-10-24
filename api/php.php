<?php

$fname = (isset($_POST['fname'])) ? $_POST['fname'] : 'No name given';
$lname = (isset($_POST['lname'])) ? $_POST['lname'] : 'No Last name given';
$somevalue = "whatever";

$array = ['fname'=>$fname ,'lname'=>$lname ,'response'=>$somevalue];

echo json_encode($array );
?>
