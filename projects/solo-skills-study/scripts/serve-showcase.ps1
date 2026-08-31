param(
  [int]$Port = 4192
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$showcaseRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\showcase')).Path
Write-Output 'Serving Solo Skills research showcase'
Write-Output "URL: http://127.0.0.1:$Port/"
Write-Output "Root: $showcaseRoot"

& python -m http.server $Port --bind 127.0.0.1 --directory $showcaseRoot
if ($LASTEXITCODE -ne 0) {
  throw 'Could not start the showcase server with Python.'
}
