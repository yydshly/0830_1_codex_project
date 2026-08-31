param(
  [string]$Destination = '',
  [string]$UpstreamCommit = '95efab925273924963d2fdb474a67890261402e3'
)

$ErrorActionPreference = 'Stop'

$upstreamUrl = 'https://github.com/joeseesun/qmreader.git'
$projectRoot = Split-Path -Parent $PSScriptRoot
$defaultDestination = Join-Path $projectRoot 'upstream\qmreader'
$targetPath = if ($Destination) {
  [System.IO.Path]::GetFullPath($Destination)
} else {
  [System.IO.Path]::GetFullPath($defaultDestination)
}
$upstreamRoot = [System.IO.Path]::GetFullPath((Join-Path $projectRoot 'upstream'))
$relativeTarget = [System.IO.Path]::GetRelativePath($upstreamRoot, $targetPath)

if ([System.IO.Path]::IsPathRooted($relativeTarget) -or $relativeTarget -eq '..' -or $relativeTarget.StartsWith("..$([System.IO.Path]::DirectorySeparatorChar)")) {
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

Write-Output "QMReader ready at $targetPath"
Write-Output "Commit: $actualCommit"
