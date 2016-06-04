<?php
  $imageCount = $_FILES['imageCount'];
  
  for ($x = 0; $x <= $imageCount; $x++) {
    $imageInputString = 'imageInput' . $x;
    $imageFilePathString = 'imageFilepath' . $x;
    
    $imageInput = $_FILES[$imageInputString]['tmp_name'];
    $imageFilePath = $_FILES[$imageFilePathString];
    
    echo json_encode($imageInput);
    echo json_encode($imageFilePath);
    
    $status = (boolean) move_uploaded_file($imageInput, $imageFilePath);
  }
  
  $response = (object) [
    'status' => 'Completed'
  ];

  echo json_encode($response);
?>