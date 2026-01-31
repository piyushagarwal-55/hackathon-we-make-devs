# Backend Server Startup Script

Write-Host "🚀 Starting Cymbal Shops E-commerce API Server..." -ForegroundColor Green
Write-Host ""

$BackendPath = "d:\ai bharat prof\OnlineBoutiqueAgent\ecommerce_agent"

cd $BackendPath

Write-Host "📍 Server will run at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📖 API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "🎨 Tambo UI: ENABLED" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

python simple_server.py
