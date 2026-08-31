param(
  [string]$Destination = '',
  [string]$UpstreamCommit = 'd5789f592af17980054052fc7c05fe8a8e46be79'
)

$ErrorActionPreference = 'Stop'

$upstreamUrl = 'https://github.com/bam-bam-2/solo-skills.git'
$projectRoot = Split-Path -Parent $PSScriptRoot
$upstreamRoot = [System.IO.Path]::GetFullPath((Join-Path $projectRoot 'upstream'))
$defaultDestination = Join-Path $upstreamRoot 'solo-skills'
$targetPath = if ($Destination) {
  [System.IO.Path]::GetFullPath($Destination)
} else {
  [System.IO.Path]::GetFullPath($defaultDestination)
}

$containedPrefix = $upstreamRoot.TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
if (-not $targetPath.StartsWith($containedPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "Destination must stay inside $upstreamRoot"
}

function Invoke-Git {
  param([string[]]$Arguments)

  & git @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "git command failed: git $($Arguments -join ' ')"
  }
}

New-Item -ItemType Directory -Force -Path $upstreamRoot | Out-Null

if (Test-Path -LiteralPath $targetPath) {
  if (-not (Test-Path -LiteralPath (Join-Path $targetPath '.git'))) {
    throw "Destination already exists but is not a Git checkout: $targetPath"
  }

  $origin = (& git -C $targetPath remote get-url origin).Trim()
  if ($LASTEXITCODE -ne 0 -or $origin -ne $upstreamUrl) {
    throw "Existing checkout has an unexpected origin: $origin"
  }
} else {
  Invoke-Git -Arguments @('clone', '--filter=blob:none', '--no-checkout', $upstreamUrl, $targetPath)
}

Invoke-Git -Arguments @('-C', $targetPath, 'fetch', '--depth', '1', 'origin', $UpstreamCommit)
Invoke-Git -Arguments @('-C', $targetPath, 'checkout', '--detach', $UpstreamCommit)

$actualCommit = (& git -C $targetPath rev-parse HEAD).Trim()
if ($LASTEXITCODE -ne 0 -or $actualCommit -ne $UpstreamCommit) {
  throw "Expected $UpstreamCommit but checked out $actualCommit"
}

Write-Output "Solo Skills ready at $targetPath"
Write-Output "Commit: $actualCommit"
