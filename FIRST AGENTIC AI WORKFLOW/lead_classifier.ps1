$LISIM_FOLDER = "C:\Users\GamingPC\Desktop\lisim"

function Classify-Lead {
    param([string]$Subject, [string]$Body)

    $text = ($Subject + " " + $Body).ToLower()

    $hotKeywords = @("buy", "purchase", "quote", "demo", "interested", "want", "pricing")
    $warmKeywords = @("information", "learn", "details", "how")
    $spamKeywords = @("viagra", "casino", "unsubscribe", "click")

    if ($spamKeywords | Where-Object { $text -like "*$_*" }) {
        return @{category="SPAM"; score=0; action="Mark as spam"}
    }
    elseif ($hotKeywords | Where-Object { $text -like "*$_*" }) {
        return @{category="HOT"; score=90; action="Immediate follow-up"}
    }
    elseif ($warmKeywords | Where-Object { $text -like "*$_*" }) {
        return @{category="WARM"; score=60; action="Schedule follow-up"}
    }
    else {
        return @{category="COLD"; score=30; action="Add to nurture list"}
    }
}

function Save-Lead {
    param([string]$Sender, [string]$Subject, [hashtable]$Classification)

    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $senderName = $Sender.Split("@")[0]
    $filename = "$senderName`_$timestamp.json"
    $filepath = Join-Path $LISIM_FOLDER $filename

    $data = @{
        sender = $Sender
        subject = $Subject
        category = $Classification.category
        score = $Classification.score
        action = $Classification.action
        timestamp = (Get-Date -Format "o")
    }

    $data | ConvertTo-Json | Out-File $filepath -Encoding UTF8
    Write-Host "✓ Saved: $filename" -ForegroundColor Green
}

# Main
Write-Host "🔍 Reading Outlook emails..." -ForegroundColor Cyan

try {
    $outlook = New-Object -ComObject Outlook.Application
    $namespace = $outlook.GetNamespace("MAPI")
    $inbox = $namespace.GetDefaultFolder(6)

    foreach ($email in $inbox.Items) {
        $sender = $email.SenderEmailAddress
        $subject = $email.Subject
        $body = $email.Body.Substring(0, [Math]::Min(500, $email.Body.Length))

        $classification = Classify-Lead -Subject $subject -Body $body
        Save-Lead -Sender $sender -Subject $subject -Classification $classification

        Write-Host "📧 $sender → $($classification.category)" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}
