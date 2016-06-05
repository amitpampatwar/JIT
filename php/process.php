<?php
  $imageCount = $_FILES['imageCount'];
  $allImages = '';
  $allImageFilePath = '';
    
  for ($x = 0; $x <= $imageCount; $x++) {
    $imageInputString = 'imageInput' . $x;
    $imageFilePathString = 'imageFilepath' . $x;
    
    $imageInput = $_FILES[$imageInputString]['tmp_name'];
    $imageFilePath = $_FILES[$imageFilePathString];
    
    echo json_encode($imageInput);
    echo json_encode($imageFilePath);
    
    $allImages = $allImages . $imageInput . ",";
    $allImageFilePath = $allImageFilePath . $imageFilePath . ","
    
    $status = (boolean) move_uploaded_file($imageInput, $imageFilePath);
  }
  
  $response = (object) [
    'status' => $allImages . ";" . $allImageFilePath;
  ];

  echo json_encode($response);
?>