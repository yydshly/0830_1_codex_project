param(
  [string]$Destination = '',
  [string]$UpstreamCommit = 'd8cbdb68ca20a9ad6626810e0c24a576e43223c7'
)

$ErrorActionPreference = 'Stop'

$upstreamUrl = 'https://github.com/kunchenguid/backpass.git'
$projectRoot = Split-Path -Parent $PSScriptRoot
$upstreamRoot = [System.IO.Path]::GetFullPath((Join-Path $projectRoot 'upstream'))
$defaultDestination = Join-Path $upstreamRoot 'backpass'
$targetPath = if ($Destination) {
  [System.IO.Path]::GetFullPath($Destination)
} else {
  [System.IO.Path]::GetFullPath($defaultDestination)
}
$upstreamPrefix = $upstreamRoot.TrimEnd(
  [System.IO.Path]::DirectorySeparatorChar,
  [System.IO.Path]::AltDirectorySeparatorChar
) + [System.IO.Path]::DirectorySeparatorChar

if (-not $targetPath.StartsWith($upstreamPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
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

Write-Output "Backpass ready at $targetPath"
Write-Output "Commit: $actualCommit"
