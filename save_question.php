<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

$conn = new mysqli('localhost', 'root', '', 'ai_timer');
if ($conn->connect_error) {
    echo json_encode(['success'=>false, 'error'=>$conn->connect_error]);
    exit;
}

if (isset($data['question'])) {
    $stmt = $conn->prepare("INSERT INTO questions (content) VALUES (?)");
    $stmt->bind_param("s", $data['question']);
    $stmt->execute();
    echo json_encode(['success'=>true, 'id'=>$stmt->insert_id]);
}
elseif (isset($data['duration_sec'])) {
    $stmt = $conn->prepare("INSERT INTO timers (duration_sec) VALUES (?)");
    $stmt->bind_param("i", $data['duration_sec']);
    $stmt->execute();
    echo json_encode(['success'=>true, 'id'=>$stmt->insert_id]);
}
else {
    echo json_encode(['success'=>false, 'error'=>'Invalid input']);
}
$conn->close();
?>
