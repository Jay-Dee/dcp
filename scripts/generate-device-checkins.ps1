param(
    [Parameter(Mandatory = $true)]
    [int]$Count,

    [string]$BaseUrl = "http://localhost:3000"
)

$platforms = @("macOS", "Windows", "iOS", "AVD")

Write-Host "Generating $Count device check-ins against $BaseUrl..." -ForegroundColor Cyan

for ($i = 1; $i -le $Count; $i++) {
    $deviceNumber = "{0:D3}" -f $i
    $platform = Get-Random -InputObject $platforms

    $shouldBeCompliant = [bool](Get-Random -Minimum 0 -Maximum 2)

    if ($shouldBeCompliant) {
        $payload = @{
            deviceId         = "device-$deviceNumber"
            platform         = $platform
            diskEncrypted    = $true
            antivirusRunning = $true
            lastPatchedDays  = Get-Random -Minimum 0 -Maximum 8
        }
    }
    else {
        $violationType = Get-Random -InputObject @(
            "disk",
            "antivirus",
            "patch",
            "multiple"
        )

        $payload = @{
            deviceId         = "device-$deviceNumber"
            platform         = $platform
            diskEncrypted    = $true
            antivirusRunning = $true
            lastPatchedDays  = Get-Random -Minimum 0 -Maximum 8
        }

        switch ($violationType) {
            "disk" {
                $payload.diskEncrypted = $false
            }

            "antivirus" {
                $payload.antivirusRunning = $false
            }

            "patch" {
                $payload.lastPatchedDays = Get-Random -Minimum 8 -Maximum 31
            }

            "multiple" {
                $payload.diskEncrypted = $false
                $payload.antivirusRunning = $false
                $payload.lastPatchedDays = Get-Random -Minimum 8 -Maximum 31
            }
        }
    }

    $json = $payload | ConvertTo-Json -Depth 3

    try {
        $response = Invoke-RestMethod `
            -Uri "$BaseUrl/api/device/checkin" `
            -Method Post `
            -ContentType "application/json" `
            -Body $json

        Write-Host "[$i/$Count] $($response.deviceId) -> $($response.status)" -ForegroundColor Green
    }
    catch {
        Write-Host "[$i/$Count] Failed to submit check-in" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }

    if ($i -lt $Count) {
        $waitSeconds = Get-Random -Minimum 1 -Maximum 6
        Start-Sleep -Seconds $waitSeconds
    }
}

Write-Host "Completed check-in generation." -ForegroundColor Cyan