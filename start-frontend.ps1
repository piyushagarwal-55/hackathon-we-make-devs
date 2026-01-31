# Frontend Server Startup Script

Write-Host "🎨 Starting Tambo Frontend..." -ForegroundColor Green
Write-Host ""

$FrontendPath = "d:\ai bharat prof\frontend"

cd $FrontendPath

Write-Host "📍 Frontend will run at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "💬 Chat page: http://localhost:3000/chat" -ForegroundColor Cyan
Write-Host "🧪 Test page: http://localhost:3000/test-components" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

bun dev
