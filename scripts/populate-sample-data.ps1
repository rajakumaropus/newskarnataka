#!/usr/bin/env pwsh

param(
    [string]$StrapiUrl = "http://103.191.208.235:1337",
    [string]$ApiToken,
    [switch]$Verbose = $false
)

if (-not $ApiToken) {
    Write-Host "❌ Error: API token is required" -ForegroundColor Red
    exit 1
}

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "[INFO] NewsKarnataka Sample Data Populator" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "Authorization" = "Bearer $ApiToken"
    "Content-Type" = "application/json"
}

function Invoke-StrapiApi {
    param(
        [string]$Endpoint,
        [string]$Method = "GET",
        [object]$Body = $null
    )
    
    $url = "$StrapiUrl$Endpoint"
    
    try {
        $params = @{
            Uri = $url
            Method = $Method
            Headers = $headers
            ContentType = "application/json"
            UseBasicParsing = $true
        }
        
        if ($Body) {
            $params.Body = $Body | ConvertTo-Json -Depth 10 -Compress
        }
        
        $response = Invoke-RestMethod @params
        return $response
    }
    catch {
        Write-Host "  ❌ API Error: $_" -ForegroundColor Red
        return $null
    }
}

# Sample articles based on NewsKarnataka
$sampleArticles = @(
    @{ title = "Bengaluru Tech Hub Attracts Global Investment"; slug = "bengaluru-tech-hub"; description = "Bengaluru continues to be India's leading technology hub with significant investment from global tech companies establishing operations in the city."; category = "Bengaluru"; featured = $true },
    @{ title = "Mangaluru Port Handles Record Cargo Volume"; slug = "mangaluru-port-cargo"; description = "Mangaluru Port achieved record cargo handling volumes this fiscal year, strengthening its position as a major port in Southern India."; category = "Mangaluru"; featured = $true },
    @{ title = "Mysuru Palace Festival Celebrates Heritage"; slug = "mysuru-palace-festival"; description = "The grand Mysuru Palace Festival brought together cultural performances and exhibitions showcasing the rich heritage of the region."; category = "Mysuru"; featured = $true },
    @{ title = "Udupi Temple Draws Thousands During Festival"; slug = "udupi-temple-festival"; description = "The Sri Krishna Temple in Udupi hosted religious celebrations that attracted thousands of devotees from across India."; category = "Udupi"; featured = $false },
    @{ title = "Karnataka Education Sector Shows Growth"; slug = "karnataka-education-growth"; description = "Karnataka's education sector has seen significant growth with new institutions and improved infrastructure across the state."; category = "Recent News"; featured = $false },
    @{ title = "Bengaluru Green Spaces Initiative Takes Shape"; slug = "bengaluru-green-spaces"; description = "The city launched a major initiative to increase green spaces and promote sustainable urban development."; category = "Bengaluru"; featured = $false },
    @{ title = "Mangaluru Coffee Industry Expands"; slug = "mangaluru-coffee-industry"; description = "The coffee industry in Mangaluru's hinterland continues to grow with improved processing facilities and international export opportunities."; category = "Mangaluru"; featured = $false },
    @{ title = "Mysuru Tech Hub Emerges as IT Destination"; slug = "mysuru-tech-hub"; description = "Mysuru is attracting technology companies and startups with competitive advantages and quality talent pool from regional universities."; category = "Mysuru"; featured = $false }
)

# 1. Create Categories
Write-Host ""
Write-Host "[INFO] Creating Categories..." -ForegroundColor Yellow
$categories = @{}
$categoryList = @("Bengaluru", "Mangaluru", "Udupi", "Mysuru", "Recent News")

foreach ($cat in $categoryList) {
    $body = @{
        data = @{
            name = $cat
            description = "News from $cat region"
        }
    }
    
    $result = Invoke-StrapiApi -Endpoint "/api/categories" -Method "POST" -Body $body
    
    if ($result.data.id) {
        $categories[$cat] = $result.data.id
        Write-Host "  [OK] Created: $cat" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] Category exists or error: $cat" -ForegroundColor Yellow
    }
    
    Start-Sleep -Milliseconds 200
}

# 2. Create Articles
Write-Host ""
Write-Host "[INFO] Creating Articles..." -ForegroundColor Yellow

$articleCount = 0

foreach ($article in $sampleArticles) {
    $categoryId = $categories[$article.category]
    
    if (-not $categoryId) {
        Write-Host "  [SKIP] (no category): $($article.title)" -ForegroundColor Yellow
        continue
    }
    
    $body = @{
        data = @{
            title = $article.title
            slug = $article.slug
            description = $article.description
            content = $article.description
            status = "published"
            is_featured = $article.featured
            publishedAt = (Get-Date).AddDays(-1).ToString("o")
            category = $categoryId
        }
    }
    
    $result = Invoke-StrapiApi -Endpoint "/api/articles" -Method "POST" -Body $body
    
    if ($result.data.id) {
        $articleCount++
        Write-Host "  [OK] Created: $($article.title)" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] Failed: $($article.title)" -ForegroundColor Yellow
    }
    
    Start-Sleep -Milliseconds 200
}

Write-Host ""
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "[OK] Complete! Created: $articleCount articles in $($categories.Count) categories" -ForegroundColor Green
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host ""
Write-Host "[INFO] Access at:" -ForegroundColor Yellow
Write-Host "  Admin: $StrapiUrl/admin" -ForegroundColor Cyan
Write-Host "  GraphQL: $StrapiUrl/graphql" -ForegroundColor Cyan
Write-Host ""
