<?php
/**
 * API REST PHP para persistência de recordes e ranking do jogo "O CÉU É O LIMITE"
 * Suporta persistência em JSON ou SQLite.
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dbFile = __DIR__ . '/data/scores.json';
$dataDir = __DIR__ . '/data';

if (!file_exists($dataDir)) {
    mkdir($dataDir, 0777, true);
}

// Inicializa dados de exemplo se não existir
if (!file_exists($dbFile)) {
    $initialData = [
        [
            "id" => "seed-1",
            "playerName" => "Acrobata Dos Céus",
            "characterId" => "pulo",
            "characterName" => "Pulo",
            "score" => 34500,
            "height" => 2450,
            "level" => 7,
            "timestamp" => time() - 86400 * 2
        ],
        [
            "id" => "seed-2",
            "playerName" => "Mestre Fênix",
            "characterId" => "fenix",
            "characterName" => "Fênix",
            "score" => 28900,
            "height" => 2100,
            "level" => 6,
            "timestamp" => time() - 86400
        ],
        [
            "id" => "seed-3",
            "playerName" => "Relâmpago",
            "characterId" => "flash",
            "characterName" => "Flash",
            "score" => 22400,
            "height" => 1650,
            "level" => 5,
            "timestamp" => time() - 3600 * 12
        ],
        [
            "id" => "seed-4",
            "playerName" => "Guardião Leo",
            "characterId" => "leo",
            "characterName" => "Leo",
            "score" => 18200,
            "height" => 1350,
            "level" => 4,
            "timestamp" => time() - 3600 * 6
        ]
    ];
    file_put_contents($dbFile, json_encode($initialData, JSON_PRETTY_PRINT));
}

function getScoresList($dbFile) {
    if (file_exists($dbFile)) {
        $content = file_get_contents($dbFile);
        $data = json_decode($content, true);
        if (is_array($data)) return $data;
    }
    return [];
}

function saveScoresList($dbFile, $scores) {
    file_put_contents($dbFile, json_encode($scores, JSON_PRETTY_PRINT));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $charFilter = isset($_GET['character']) ? $_GET['character'] : 'all';
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;

    $scores = getScoresList($dbFile);

    if ($charFilter !== 'all') {
        $scores = array_filter($scores, function($item) use ($charFilter) {
            return isset($item['characterId']) && $item['characterId'] === $charFilter;
        });
        $scores = array_values($scores);
    }

    usort($scores, function($a, $b) {
        return $b['score'] - $a['score'];
    });

    $topScores = array_slice($scores, 0, $limit);

    $highestScore = !empty($scores) ? $scores[0]['score'] : 0;
    $maxHeight = 0;
    foreach ($scores as $s) {
        if ($s['height'] > $maxHeight) $maxHeight = $s['height'];
    }

    echo json_encode([
        'scores' => $topScores,
        'stats' => [
            'highestScore' => $highestScore,
            'maxHeight' => $maxHeight,
            'totalGames' => count($scores)
        ]
    ]);
    exit;
}

if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $body = json_decode($rawInput, true);

    if (!$body || !isset($body['score'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Dados inválidos']);
        exit;
    }

    $name = !empty($body['playerName']) ? substr(trim($body['playerName']), 0, 20) : 'Aventureiro';
    $newEntry = [
        'id' => 'score-' . time() . '-' . rand(1000, 9999),
        'playerName' => htmlspecialchars($name),
        'characterId' => $body['characterId'] ?? 'leo',
        'characterName' => $body['characterName'] ?? 'Leo',
        'score' => intval($body['score']),
        'height' => intval($body['height'] ?? 0),
        'level' => intval($body['level'] ?? 1),
        'timestamp' => time()
    ];

    $scores = getScoresList($dbFile);
    $scores[] = $newEntry;

    usort($scores, function($a, $b) {
        return $b['score'] - $a['score'];
    });

    // Mantém top 200
    $scores = array_slice($scores, 0, 200);
    saveScoresList($dbFile, $scores);

    echo json_encode([
        'success' => true,
        'entry' => $newEntry
    ]);
    exit;
}
