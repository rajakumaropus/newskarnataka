#!/usr/bin/env pwsh

<#
.SYNOPSIS
Create sample data in Strapi for NewsKarnataka development

.DESCRIPTION
Populates Strapi with realistic sample articles, categories, tags, authors, and sources

.EXAMPLE
./create-sample-data.ps1 -StrapiUrl "http://localhost:1337" -ApiToken "your_token"
#>

param(
    [string]$StrapiUrl = "http://103.191.208.235:1337",
    [string]$ApiToken = "your_api_token_here",
    [switch]$DryRun = $false
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 NewsKarnataka Sample Data Creator" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Strapi URL: $StrapiUrl" -ForegroundColor Gray
Write-Host "Dry Run: $DryRun" -ForegroundColor Gray
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
    $params = @{
        Uri = $url
        Method = $Method
        Headers = $headers
    }
    
    if ($Body) {
        $params.Body = $Body | ConvertTo-Json -Depth 10
    }
    
    try {
        $response = Invoke-RestMethod @params
        return $response
    } catch {
        Write-Host "❌ Error calling API: $_" -ForegroundColor Red
        return $null
    }
}

# 1. Create Categories
Write-Host "📁 Creating Categories..." -ForegroundColor Yellow

$categories = @(
    @{ name = "Politics"; description = "Political news and updates" },
    @{ name = "Sports"; description = "Sports news from Karnataka and India" },
    @{ name = "Entertainment"; description = "Movies, music, and entertainment" },
    @{ name = "Technology"; description = "Tech startups and innovations" },
    @{ name = "Business"; description = "Business and economy news" }
)

$categoryIds = @{}

foreach ($cat in $categories) {
    Write-Host "  Creating category: $($cat.name)" -ForegroundColor Gray
    
    if (-not $DryRun) {
        $body = @{
            data = @{
                name = $cat.name
                description = $cat.description
            }
        } | ConvertTo-Json
        
        $result = Invoke-StrapiApi -Endpoint "/api/categories" -Method "POST" -Body $body
        if ($result.data) {
            $categoryIds[$cat.name] = $result.data.id
            Write-Host "  ✓ Created: $($cat.name) (ID: $($result.data.id))" -ForegroundColor Green
        }
    }
}

# 2. Create Tags
Write-Host ""
Write-Host "🏷️  Creating Tags..." -ForegroundColor Yellow

$tags = @(
    "Karnataka", "Bengaluru", "India",
    "Election", "Politics", "Government",
    "Cricket", "Football", "Sports",
    "Movie", "Music", "Entertainment",
    "Startup", "Technology", "Business"
)

$tagIds = @{}

foreach ($tag in $tags) {
    Write-Host "  Creating tag: $tag" -ForegroundColor Gray
    
    if (-not $DryRun) {
        $body = @{
            data = @{
                name = $tag
            }
        } | ConvertTo-Json
        
        $result = Invoke-StrapiApi -Endpoint "/api/tags" -Method "POST" -Body $body
        if ($result.data) {
            $tagIds[$tag] = $result.data.id
            Write-Host "  ✓ Created: $tag (ID: $($result.data.id))" -ForegroundColor Green
        }
    }
}

# 3. Create Authors
Write-Host ""
Write-Host "✍️  Creating Authors..." -ForegroundColor Yellow

$authors = @(
    @{ name = "Rajesh Kumar"; email = "rajesh@newskarnataka.com"; role = "Staff Reporter" },
    @{ name = "Priya Sharma"; email = "priya@newskarnataka.com"; role = "Editor" },
    @{ name = "Amit Patel"; email = "amit@newskarnataka.com"; role = "Contributor" }
)

$authorIds = @{}

foreach ($author in $authors) {
    Write-Host "  Creating author: $($author.name)" -ForegroundColor Gray
    
    if (-not $DryRun) {
        $body = @{
            data = @{
                name = $author.name
                email = $author.email
                role = $author.role
            }
        } | ConvertTo-Json
        
        $result = Invoke-StrapiApi -Endpoint "/api/authors" -Method "POST" -Body $body
        if ($result.data) {
            $authorIds[$author.name] = $result.data.id
            Write-Host "  ✓ Created: $($author.name) (ID: $($result.data.id))" -ForegroundColor Green
        }
    }
}

# 4. Create Article Sources
Write-Host ""
Write-Host "📰 Creating Article Sources..." -ForegroundColor Yellow

$sources = @(
    @{ 
        name = "WhatsApp Groups Karnataka"
        code = "WHATSAPP_KA"
        source_type = "social_media"
        trust_score = 70
        is_active = $true
    },
    @{ 
        name = "Twitter Feed"
        code = "TWITTER"
        source_type = "social_media"
        trust_score = 80
        is_active = $true
    },
    @{ 
        name = "Staff Reporters"
        code = "STAFF"
        source_type = "staff_reporter"
        trust_score = 95
        is_active = $true
    },
    @{ 
        name = "Wire Services"
        code = "WIRE"
        source_type = "wire_agency"
        trust_score = 98
        is_active = $true
    },
    @{ 
        name = "User Submissions"
        code = "USER"
        source_type = "user_submission"
        trust_score = 60
        is_active = $true
    }
)

$sourceIds = @{}

foreach ($source in $sources) {
    Write-Host "  Creating source: $($source.name)" -ForegroundColor Gray
    
    if (-not $DryRun) {
        $body = @{
            data = $source
        } | ConvertTo-Json
        
        $result = Invoke-StrapiApi -Endpoint "/api/article-sources" -Method "POST" -Body $body
        if ($result.data) {
            $sourceIds[$source.code] = $result.data.id
            Write-Host "  ✓ Created: $($source.name) (ID: $($result.data.id))" -ForegroundColor Green
        }
    }
}

# 5. Create Sample Articles
Write-Host ""
Write-Host "📄 Creating Sample Articles..." -ForegroundColor Yellow

$articles = @(
    @{
        title = "Karnataka Election Results: BJP Sweeps Assembly Polls"
        slug = "karnataka-election-bjp-sweeps"
        description = "BJP secures majority in assembly elections with significant margins across the state"
        content = "Karnataka has voted decisively for change. The Bharatiya Janata Party (BJP) has swept the assembly elections with a commanding majority. The party's campaign focused on development and governance issues. Chief Minister-elect promised rapid infrastructure development and job creation initiatives. Opposition parties have conceded defeat and promised constructive opposition. The election commission confirmed the results after a thorough verification process."
        is_featured = $true
        publishedAt = (Get-Date).AddDays(-5).ToString("o")
        category = "Politics"
        tags = @("Karnataka", "Election", "Politics")
        author = "Rajesh Kumar"
    },
    @{
        title = "Bengaluru Tech Startup Raises $50 Million in Series B Funding"
        slug = "bengaluru-startup-raises-50-million"
        description = "Leading AI startup secures major investment from international venture capital firms"
        content = "Bengaluru-based artificial intelligence startup has successfully raised $50 million in Series B funding. The round was led by prominent Silicon Valley investors. The funding will be used for product development and expansion into new markets. The company now has a valuation exceeding $250 million. Founded in 2018, the startup has grown to serve over 500 enterprise clients globally."
        is_featured = $true
        publishedAt = (Get-Date).AddDays(-3).ToString("o")
        category = "Technology"
        tags = @("Startup", "Technology", "Business")
        author = "Amit Patel"
    },
    @{
        title = "Karnataka Cricket Team Wins State Championship"
        slug = "karnataka-cricket-championship"
        description = "Karnataka dominates final match to claim state cricket championship title"
        content = "Karnataka's cricket team has claimed the state championship title with a convincing victory. The team displayed exceptional batting and bowling performance throughout the tournament. Captain praised the team's dedication and hard work. The victory marks Karnataka's fifth championship in eight years. Players were felicitated by sports authorities for their outstanding performance."
        is_featured = $true
        publishedAt = (Get-Date).AddDays(-1).ToString("o")
        category = "Sports"
        tags = @("Cricket", "Sports", "Karnataka")
        author = "Priya Sharma"
    },
    @{
        title = "Bengaluru Metro Expansion Project Reaches Halfway Point"
        slug = "bengaluru-metro-expansion"
        description = "Major infrastructure project progresses ahead of schedule"
        content = "The Bengaluru Metro expansion project has reached the halfway completion mark. Engineers confirmed that construction is progressing faster than originally projected. The new corridor will connect Whitefield to Electronic City, improving connectivity. Commuters are expected to benefit from reduced travel times. State government allocated additional funds for the project's completion."
        is_featured = $false
        publishedAt = (Get-Date).AddDays(-2).ToString("o")
        category = "Business"
        tags = @("Infrastructure", "Business", "Bengaluru")
        author = "Rajesh Kumar"
    },
    @{
        title = "Kannada Film Breaks Box Office Records"
        slug = "kannada-film-breaks-records"
        description = "Latest Kannada cinema release surpasses previous record for highest opening weekend collection"
        content = "A recently released Kannada film has broken box office records with its massive opening weekend collection. The film's success marks a resurgence of Kannada cinema in recent years. Audiences appreciated the film's story and performances. Distributors are planning for wider international release. The film's success has boosted the morale of Kannada film industry."
        is_featured = $false
        publishedAt = (Get-Date).AddDays(-4).ToString("o")
        category = "Entertainment"
        tags = @("Movie", "Entertainment", "Kannada")
        author = "Priya Sharma"
    }
)

$articleCount = 0

foreach ($article in $articles) {
    Write-Host "  Creating article: $($article.title)" -ForegroundColor Gray
    
    if (-not $DryRun) {
        $body = @{
            data = @{
                title = $article.title
                slug = $article.slug
                description = $article.description
                content = $article.content
                is_featured = $article.is_featured
                publishedAt = $article.publishedAt
                status = "published"
                category = $categoryIds[$article.category]
                tags = @($article.tags | ForEach-Object { $tagIds[$_] })
                author = $authorIds[$article.author]
            }
        } | ConvertTo-Json -Depth 10
        
        $result = Invoke-StrapiApi -Endpoint "/api/articles" -Method "POST" -Body $body
        if ($result.data) {
            $articleCount++
            Write-Host "  ✓ Created: $($article.title)" -ForegroundColor Green
        }
    }
}

# Summary
Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "✅ Sample Data Creation Complete!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  Categories created: $($categories.Count)"
Write-Host "  Tags created: $($tags.Count)"
Write-Host "  Authors created: $($authors.Count)"
Write-Host "  Sources created: $($sources.Count)"
Write-Host "  Articles created: $articleCount"
Write-Host ""
Write-Host "📚 Data available at: $StrapiUrl/admin/content-manager" -ForegroundColor Gray
Write-Host ""

