param(
    [int]$Port = 4186
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ShowcaseRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\showcase")).Path
Write-Output "Serving Selector research showcase"
Write-Output "URL: http://127.0.0.1:$Port/"
Write-Output "Root: $ShowcaseRoot"

& python -m http.server $Port --bind 127.0.0.1 --directory $ShowcaseRoot
if ($LASTEXITCODE -ne 0) {
    throw "Could not start the showcase server with Python."
}
