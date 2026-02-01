# Integration Test Script for ShopSage
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "ShopSage Integration Test" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Backend Health Check
Write-Host "[TEST 1] Backend Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Backend is running: $($health.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is not running!" -ForegroundColor Red
    Write-Host "   Start it with: python simple_server.py" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Test 2: Cart Request (No Auth) - Should show LoginForm
Write-Host "[TEST 2] Cart Request (No Auth)..." -ForegroundColor Yellow
$body = @{message="show cart"; session_id="test"} | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:8000/chat" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
$data = $response.Content | ConvertFrom-Json
Write-Host "   UI Component: $($data.ui_component)" -ForegroundColor Gray
if ($data.ui_component -eq "LoginForm") {
    Write-Host "✅ PASS: Correctly requesting login" -ForegroundColor Green
} else {
    Write-Host "❌ FAIL: Expected LoginForm, got $($data.ui_component)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Profile Request (No Auth) - Should show LoginForm
Write-Host "[TEST 3] Profile Request (No Auth)..." -ForegroundColor Yellow
$body = @{message="show my profile"; session_id="test"} | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:8000/chat" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
$data = $response.Content | ConvertFrom-Json
Write-Host "   UI Component: $($data.ui_component)" -ForegroundColor Gray
if ($data.ui_component -eq "LoginForm") {
    Write-Host "✅ PASS: Correctly requesting login" -ForegroundColor Green
} else {
    Write-Host "❌ FAIL: Expected LoginForm, got $($data.ui_component)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Show Cart vs Show Profile - Different keywords
Write-Host "[TEST 4] Keyword Differentiation..." -ForegroundColor Yellow
$body1 = @{message="show cart"; session_id="test"} | ConvertTo-Json
$body2 = @{message="show profile"; session_id="test"} | ConvertTo-Json
$response1 = Invoke-WebRequest -Uri "http://localhost:8000/chat" -Method POST -Body $body1 -ContentType "application/json" -UseBasicParsing
$response2 = Invoke-WebRequest -Uri "http://localhost:8000/chat" -Method POST -Body $body2 -ContentType "application/json" -UseBasicParsing
$data1 = $response1.Content | ConvertFrom-Json
$data2 = $response2.Content | ConvertFrom-Json
Write-Host "   'show cart' → $($data1.ui_component)" -ForegroundColor Gray
Write-Host "   'show profile' → $($data2.ui_component)" -ForegroundColor Gray
if ($data1.ui_component -eq $data2.ui_component) {
    Write-Host "❌ FAIL: Both showing same component!" -ForegroundColor Red
} else {
    Write-Host "✅ PASS: Different components for different requests" -ForegroundColor Green
}
Write-Host ""

# Test 5: Product Search
Write-Host "[TEST 5] Product Search..." -ForegroundColor Yellow
$body = @{message="show me sunglasses"; session_id="test"} | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:8000/chat" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
$data = $response.Content | ConvertFrom-Json
Write-Host "   UI Component: $($data.ui_component)" -ForegroundColor Gray
if ($data.ui_component -eq "ProductGrid") {
    Write-Host "✅ PASS: Showing ProductGrid" -ForegroundColor Green
} else {
    Write-Host "❌ FAIL: Expected ProductGrid, got $($data.ui_component)" -ForegroundColor Red
}
Write-Host ""

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Tests Complete!" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Restart backend server and test in browser" -ForegroundColor Yellow
