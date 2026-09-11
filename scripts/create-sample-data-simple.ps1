#!/usr/bin/env pwsh

<#
.SYNOPSIS
Create sample data in Strapi for NewsKarnataka development

.DESCRIPTION
Populates Strapi with realistic sample articles based on NewsKarnataka topics

.EXAMPLE
./create-sample-data-simple.ps1 -StrapiUrl "http://103.191.208.235:1337" -ApiToken "your_token"
#>

param(
    [string]$StrapiUrl = "http://103.191.208.235:1337",
    [string]$ApiToken,
    [switch]$Verbose = $false
)

if (-not $ApiToken) {
    Write-Host "❌ Error: API token is required" -ForegroundColor Red
    Write-Host "Usage: ./create-sample-data-simple.ps1 -StrapiUrl 'http://...' -ApiToken 'your_token'" -ForegroundColor Yellow
    exit 1
}

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "🚀 NewsKarnataka Sample Data Creator" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "Strapi URL: $StrapiUrl" -ForegroundColor Gray
Write-Host "Dry Run: False" -ForegroundColor Gray
Write-Host ""

# Headers for API calls
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
        }
        
        if ($Body) {
            $params.Body = $Body | ConvertTo-Json -Depth 10
        }
        
        if ($Verbose) {
            Write-Host "  [API] $Method $Endpoint" -ForegroundColor DarkGray
        }
        
        $response = Invoke-RestMethod @params
        return $response
    }
    catch {
        Write-Host "  ❌ API Error: $_" -ForegroundColor Red
        return $null
    }
}

# Sample data based on NewsKarnataka topics
$sampleData = @(
    @{
        title = "Bengaluru Tech Industry Growth Continues Strong"
        slug = "bengaluru-tech-industry-growth-2025"
        description = "Bengaluru's technology sector continues to drive innovation and economic growth, with new startups and established companies expanding their presence in the city."
        category = "Bengaluru"
        featured = $true
    },
    @{
        title = "Mangaluru Port Expansion Project Moves Forward"
        slug = "mangaluru-port-expansion-project"
        description = "The Mangaluru Port Authority has announced major expansion plans to increase cargo handling capacity and improve port infrastructure for the region."
        category = "Mangaluru"
        featured = $true
    },
    @{
        title = "Mysuru Heritage Festival Attracts Thousands"
        slug = "mysuru-heritage-festival-2025"
        description = "The annual Mysuru heritage festival celebrated the rich cultural traditions of the region with performances, exhibitions, and cultural programs."
        category = "Mysuru"
        featured = $true
    },
    @{
        title = "Udupi Temple Celebrations Draw Record Crowds"
        slug = "udupi-temple-celebrations"
        description = "The famous Sri Krishna Temple in Udupi hosted celebrations that attracted devotees from across the state and country."
        category = "Udupi"
        featured = $false
    },
    @{
        title = "Karnataka Tourism Reaches New Heights"
        slug = "karnataka-tourism-growth"
        description = "Karnataka's tourism sector has shown significant growth with increased visitor arrivals and investments in tourism infrastructure."
        category = "Recent News"
        featured = $false
    },
    @{
        title = "Bengaluru Smart City Initiatives Unveiled"
        slug = "bengaluru-smart-city-2025"
        description = "The Bengaluru Smart City project introduced new initiatives focused on sustainable urban development and improved citizen services."
        category = "Bengaluru"
        featured = $false
    },
    @{
        title = "Mangaluru IT Hub Expands Operations"
        slug = "mangaluru-it-hub-expansion"
        description = "Major technology companies are establishing new offices in Mangaluru, making it an emerging IT destination in India."
        category = "Mangaluru"
        featured = $false
    },
    @{
        title = "Mysuru University Launches New Programs"
        slug = "mysuru-university-new-programs"
        description = "Mysuru University announced new academic programs and research initiatives to strengthen higher education in the region."
        category = "Mysuru"
        featured = $false
    }
)

# 1. Create Categories
Write-Host "📁 Creating Categories..." -ForegroundColor Yellow
$categories = @{}

$categoryList = @("Bengaluru", "Mangaluru", "Udupi", "Mysuru", "Recent News")

foreach ($cat in $categoryList) {
    $body = @{
        data = @{
            name = $cat
            description = "News from $cat region"
        }
    } | ConvertTo-Json -Depth 10
    
    $result = Invoke-StrapiApi -Endpoint "/api/categories" -Method "POST" -Body $body
    
    if ($result.data.id) {
        $categories[$cat] = $result.data.id
        Write-Host "  ✅ Created category: $cat (ID: $($result.data.id))" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Could not create category: $cat" -ForegroundColor Yellow
    }
    
    Start-Sleep -Milliseconds 500
}

# 2. Create Articles
Write-Host ""
Write-Host "📄 Creating Articles..." -ForegroundColor Yellow

$articleCount = 0

foreach ($article in $sampleData) {
    $categoryId = $categories[$article.category]
    
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
    } | ConvertTo-Json -Depth 10
    
    $result = Invoke-StrapiApi -Endpoint "/api/articles" -Method "POST" -Body $body
    
    if ($result.data.id) {
        $articleCount++
        Write-Host "  ✅ Created article: $($article.title)" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Could not create article: $($article.title)" -ForegroundColor Yellow
    }
    
    Start-Sleep -Milliseconds 500
}

# Summary
Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "✅ Sample Data Creation Complete!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  Categories created: $($categories.Count)" -ForegroundColor Gray
Write-Host "  Articles created: $articleCount" -ForegroundColor Gray
Write-Host ""
Write-Host "📊 Data available at:" -ForegroundColor Yellow
Write-Host "  Strapi Admin: $StrapiUrl/admin" -ForegroundColor Gray
Write-Host "  GraphQL: $StrapiUrl/graphql" -ForegroundColor Gray
Write-Host ""
