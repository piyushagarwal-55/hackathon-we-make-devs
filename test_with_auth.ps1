# Test with Authentication
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "ShopSage Auth Test" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8000"

# Step 1: Use existing token (from your session)
Write-Host "[STEP 1] Using existing auth token..." -ForegroundColor Yellow
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTdlMzUyNTcyZmFmYmMyMDdlYzkyZjMiLCJlbWFpbCI6InBpeXVzaGFnYTIwMDVAZ21haWwuY29tIiwiZXhwIjoxNzcyNDcxMjU3fQ.tIPSBor23p2_adfd76geCPJFJfb0cfvl8wfR2CdEyC0"
Write-Host "✅ Token loaded" -ForegroundColor Green
Write-Host ""

# Step 2: Test "show cart" with auth
Write-Host "[STEP 2] Testing 'show cart' with auth..." -ForegroundColor Yellow
$cartBody = @{
    message = "show cart"
    session_id = "test-session"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$cartResponse = Invoke-WebRequest -Uri "$baseUrl/chat" -Method POST -Body $cartBody -Headers $headers -UseBasicParsing
$cartData = $cartResponse.Content | ConvertFrom-Json

Write-Host "   Message sent: 'show cart'" -ForegroundColor Gray
Write-Host "   Response component: $($cartData.ui_component)" -ForegroundColor Gray
Write-Host "   Response text: $($cartData.agent_response)" -ForegroundColor Gray

if ($cartData.ui_component -eq "CheckoutWizard") {
    Write-Host "✅ PASS: Correctly showing CheckoutWizard" -ForegroundColor Green
} else {
    Write-Host "❌ FAIL: Expected CheckoutWizard, got $($cartData.ui_component)" -ForegroundColor Red
    Write-Host "   Full response:" -ForegroundColor Yellow
    Write-Host ($cartResponse.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10) -ForegroundColor Gray
}
Write-Host ""

# Step 3: Test "show my profile" with auth
Write-Host "[STEP 3] Testing 'show my profile' with auth..." -ForegroundColor Yellow
$profileBody = @{
    message = "show my profile"
    session_id = "test-session"
} | ConvertTo-Json

$profileResponse = Invoke-WebRequest -Uri "$baseUrl/chat" -Method POST -Body $profileBody -Headers $headers -UseBasicParsing
$profileData = $profileResponse.Content | ConvertFrom-Json

Write-Host "   Message sent: 'show my profile'" -ForegroundColor Gray
Write-Host "   Response component: $($profileData.ui_component)" -ForegroundColor Gray
Write-Host "   Response text: $($profileData.agent_response)" -ForegroundColor Gray

if ($profileData.ui_component -eq "UserProfile") {
    Write-Host "✅ PASS: Correctly showing UserProfile" -ForegroundColor Green
} else {
    Write-Host "❌ FAIL: Expected UserProfile, got $($profileData.ui_component)" -ForegroundColor Red
    Write-Host "   Full response:" -ForegroundColor Yellow
    Write-Host ($profileResponse.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10) -ForegroundColor Gray
}
Write-Host ""

# Step 4: Verify they're different
Write-Host "[STEP 4] Verification..." -ForegroundColor Yellow
if ($cartData.ui_component -eq "CheckoutWizard" -and $profileData.ui_component -eq "UserProfile") {
    Write-Host "✅ SUCCESS: Cart and Profile show different components!" -ForegroundColor Green
} else {
    Write-Host "❌ FAILURE: Cart and Profile components are wrong!" -ForegroundColor Red
    Write-Host "   Cart: $($cartData.ui_component)" -ForegroundColor Red
    Write-Host "   Profile: $($profileData.ui_component)" -ForegroundColor Red
}
Write-Host ""

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Test Complete" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
