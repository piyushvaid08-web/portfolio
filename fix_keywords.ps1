$directory = "d:\portfolio"
$files = Get-ChildItem -Path $directory -Filter "*.html"

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $lines = $content -split "`r`n"
    if ($lines.Count -eq 1) { $lines = $content -split "`n" }

    $newLines = @()

    foreach ($line in $lines) {
        if ($line -match "<title>" -or $line -match "<meta" -or $line -match "application/ld\+json" -or $line -match "brand-mark" -or $line -match "loading-orb" -or $line -match "<footer" -or $line -match "site-footer" -or $line -match "favicon" -or $line -match "mailto:") {
            $newLines += $line
            continue
        }

        # Verbs
        $line = $line -replace '(?i)Piyush Vaid is', 'I am'
        $line = $line -replace '(?i)Piyush Vaid has', 'I have'
        $line = $line -replace '(?i)Piyush Vaid helps', 'I help'
        $line = $line -replace '(?i)Piyush Vaid does', 'I do'
        $line = $line -replace '(?i)Piyush Vaid completed', 'I completed'
        $line = $line -replace '(?i)Piyush Vaid picked up', 'I picked up'
        $line = $line -replace '(?i)Piyush Vaid creates', 'I create'
        $line = $line -replace '(?i)Piyush Vaid brings', 'I bring'
        $line = $line -replace '(?i)Piyush Vaid develops', 'I develop'
        $line = $line -replace '(?i)Piyush Vaid crafts', 'I craft'
        $line = $line -replace '(?i)Piyush Vaid builds', 'I build'
        $line = $line -replace '(?i)Piyush Vaid founded', 'I founded'
        $line = $line -replace '(?i)Piyush Vaid handles', 'I handle'
        $line = $line -replace '(?i)Piyush Vaid approaches', 'I approach'
        $line = $line -replace '(?i)Piyush Vaid believes', 'I believe'
        $line = $line -replace '(?i)Piyush Vaid uses', 'I use'
        $line = $line -replace '(?i)Piyush Vaid learned', 'I learned'
        $line = $line -replace '(?i)Piyush Vaid was', 'I was'
        $line = $line -replace '(?i)Piyush Vaid saw', 'I saw'
        $line = $line -replace '(?i)Piyush Vaid would', 'I would'
        $line = $line -replace '(?i)Piyush Vaid stays', 'I stay'
        $line = $line -replace '(?i)Piyush Vaid writes', 'I write'
        $line = $line -replace '(?i)Piyush Vaid argues', 'I argue'
        $line = $line -replace '(?i)Piyush Vaid delivers', 'I deliver'
        $line = $line -replace '(?i)Piyush Vaid works', 'I work'
        $line = $line -replace '(?i)Piyush Vaid offers', 'I offer'
        $line = $line -replace '(?i)Piyush Vaid ensures', 'I ensure'
        $line = $line -replace '(?i)Piyush Vaid combines', 'I combine'
        $line = $line -replace '(?i)Piyush Vaid focuses', 'I focus'

        # Possessive
        $line = $line -replace "(?i)Piyush Vaid's", 'my'
        $line = $line -replace '(?i)Piyush Vaid’s', 'my'
        $line = $line -replace '(?i)The journey of Piyush Vaid', 'My journey'
        $line = $line -replace '(?i)story of Piyush Vaid', 'my story'
        $line = $line -replace '(?i)story behind Piyush Vaid', 'my story'
        $line = $line -replace '(?i)work of Piyush Vaid', 'my work'
        $line = $line -replace '(?i)approach of Piyush Vaid', 'my approach'
        $line = $line -replace '(?i)philosophy that drives Piyush Vaid', 'philosophy that drives me'
        $line = $line -replace '(?i)portfolio of Piyush Vaid', 'my portfolio'
        $line = $line -replace '(?i)clients of Piyush Vaid', 'my clients'
        $line = $line -replace '(?i)services from Piyush Vaid', 'my services'

        # Object/Prepositional
        $line = $line -replace '(?i)with Piyush Vaid', 'with me'
        $line = $line -replace '(?i)by Piyush Vaid', 'by me'
        $line = $line -replace '(?i)for Piyush Vaid', 'for me'
        $line = $line -replace '(?i)about Piyush Vaid', 'about me'
        $line = $line -replace '(?i)to Piyush Vaid', 'to me'
        $line = $line -replace '(?i)tell Piyush Vaid', 'tell me'
        $line = $line -replace '(?i)contact Piyush Vaid', 'contact me'

        # Headings
        $line = $line -replace '>Piyush Vaid<', '>Me<'
        $line = $line -replace '>Who is Piyush Vaid\?<', '>Who am I?<'

        # Leftovers
        $line = $line -replace '(?i)Piyush Vaid', 'I'

        $newLines += $line
    }

    $newContent = $newLines -join "`n"
    Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
}
Write-Output "Done processing HTML files."
