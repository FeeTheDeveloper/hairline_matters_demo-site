# Builds the private handoff ZIP in dist/. Usage: npm run package
# Internal notes (docs/source, docs/creative) stay out of the ZIP that reaches the prospect.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$dist = Join-Path $root 'dist'
$stage = Join-Path $dist 'hairline-matters-demo'
if (Test-Path $stage) { Remove-Item -Recurse -Force $stage }
New-Item -ItemType Directory -Force (Join-Path $stage 'docs') | Out-Null
foreach ($item in 'public','scripts','wrangler.jsonc','package.json','README.md','.gitignore') {
  Copy-Item -Recurse (Join-Path $root $item) $stage
}
foreach ($doc in 'OWNER_HANDOFF.md','ASSET_RIGHTS_LEDGER.md','BUILD_RESULTS.md','ROLLBACK.md') {
  Copy-Item (Join-Path $root "docs/$doc") (Join-Path $stage 'docs')
}
$zip = Join-Path $dist 'hairline-matters-demo.zip'
if (Test-Path $zip) { Remove-Item -Force $zip }
Compress-Archive -Path $stage -DestinationPath $zip
Remove-Item -Recurse -Force $stage
Write-Output "Wrote $zip"
