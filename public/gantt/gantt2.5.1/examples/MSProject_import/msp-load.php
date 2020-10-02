<?php

// Decodes upload error code
function getUploadError($code) {
    switch ($code) {
        case UPLOAD_ERR_INI_SIZE: return 'The uploaded file exceeds the maximum allowed size';
        case UPLOAD_ERR_FORM_SIZE: return 'The uploaded file exceeds the maximum allowed size that was specified in the HTML form';
        case UPLOAD_ERR_PARTIAL: return 'The uploaded file was only partially uploaded';
        case UPLOAD_ERR_NO_FILE: return 'No file was uploaded';
        case UPLOAD_ERR_NO_TMP_DIR: return 'Missing a temporary folder';
        case UPLOAD_ERR_CANT_WRITE: return 'Failed to write file to disk';
        case UPLOAD_ERR_EXTENSION: return 'File upload stopped by extension';
    }

    return 'Unknown upload error';
}

// Writes error response in JSON to StdOut and exits the program
function fail($text) {
    die(json_encode(array('success' => false, 'msg' => $text)));
}

if (!$_FILES['mpp-file']) fail('Upload failed, probably the upload request exceeds the maximum allowed size');

if ($_FILES['mpp-file']['error'] !== UPLOAD_ERR_OK) fail(getUploadError($_FILES['mpp-file']['error']));

$dir        = dirname(__FILE__);
$file_tmp   = $_FILES['mpp-file']['tmp_name'];
$file_name  = $_FILES['mpp-file']['name'];
$move_path  = $dir .'/tmp/';

if (!is_uploaded_file($file_tmp)) fail('Upload failed.');

if (!is_dir($move_path)) fail('No such directory exists.');

$move_path .= $file_name;

if (!move_uploaded_file($file_tmp, $move_path)) fail('Cannot save file. Please verify, that web-server user account has write permission to '. $move_path);

// run msprojectreader.jar file to read MS Project file and return its data in JSON format
$json = shell_exec('java -jar '. escapeshellarg($dir.'/msprojectreader/dist/msprojectreader.jar') .' '. escapeshellarg($move_path) .' 1');

// cleanup copied file
unlink($move_path);

if (!$json) fail('Could not process uploaded file.');

echo '{"success": true, "data": '.$json.'}';
