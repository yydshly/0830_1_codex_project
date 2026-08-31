param(
    [string]$Destination = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$UpstreamUrl = "https://github.com/oil-oil/selector.git"
$UpstreamCommit = "d88e9a6c3c10821a5cc6d87447693d9507a76b35"
$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

if ([string]::IsNullOrWhiteSpace($Destination)) {
    $Destination = Join-Path $ProjectRoot "upstream\selector"
} elseif (-not [System.IO.Path]::IsPathRooted($Destination)) {
    $Destination = Join-Path $ProjectRoot $Destination
}

$Destination = [System.IO.Path]::GetFullPath($Destination)
$DestinationParent = Split-Path -Parent $Destination
New-Item -ItemType Directory -Force -Path $DestinationParent | Out-Null

if (-not (Test-Path -LiteralPath $Destination)) {
    & git init $Destination
    if ($LASTEXITCODE -ne 0) {
        throw "git init failed for $Destination"
    }
}

$GitDirectory = Join-Path $Destination ".git"
if (-not (Test-Path -LiteralPath $GitDirectory)) {
    throw "Destination exists but is not a Git working copy: $Destination"
}

$Remotes = @(& git -C $Destination remote)
if ($LASTEXITCODE -ne 0) {
    throw "Could not list Git remotes in $Destination"
}

if ($Remotes -notcontains "origin") {
    & git -C $Destination remote add origin $UpstreamUrl
    if ($LASTEXITCODE -ne 0) {
        throw "Could not add upstream remote"
    }
} else {
    $OriginUrl = (& git -C $Destination remote get-url origin).Trim()
    if ($LASTEXITCODE -ne 0) {
        throw "Could not read the existing origin URL"
    }
    if ($OriginUrl -ne $UpstreamUrl) {
        throw "Existing origin does not match expected upstream: $OriginUrl"
    }
}

& git -C $Destination fetch --depth 1 origin $UpstreamCommit
if ($LASTEXITCODE -ne 0) {
    throw "Could not fetch locked upstream commit $UpstreamCommit"
}

& git -C $Destination checkout --detach $UpstreamCommit
if ($LASTEXITCODE -ne 0) {
    throw "Could not check out locked upstream commit. Preserve or remove local changes manually, then retry."
}

$ActualCommit = (& git -C $Destination rev-parse HEAD).Trim()
if ($LASTEXITCODE -ne 0 -or $ActualCommit -ne $UpstreamCommit) {
    throw "Upstream verification failed. Expected $UpstreamCommit, got $ActualCommit"
}

Write-Output "Selector upstream is ready."
Write-Output "Path: $Destination"
Write-Output "Commit: $ActualCommit"
