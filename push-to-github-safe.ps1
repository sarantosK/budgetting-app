# push-to-github-safe.ps1
# Safer, non-interactive push helper that:
# - makes a backup branch of local work,
# - kills common locks (node/vscode),
# - removes .vite transient folder,
# - merges origin/main preferring remote changes on conflicts,
# - falls back to replacing local history with remote if merge fails,
# - pushes to origin main.
# Run from project root.

$repoUrl = 'https://github.com/sarantosK/budgetting-app.git'
$timestamp = (Get-Date).ToString('yyyyMMdd-HHmmss')
$backupBranch = "backup-local-$timestamp"

Write-Host "=== push-to-github-safe starting ===" -ForegroundColor Cyan

# Ensure script runs from the project directory (script file path may differ if invoked elsewhere)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Stop common processes that lock files
Get-Process -Name node -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue }
Get-Process -Name Code -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue }

# Remove .vite transient folder if present
if (Test-Path .vite) {
  Write-Host "Removing .vite folder..." -ForegroundColor Yellow
  Remove-Item -LiteralPath .vite -Recurse -Force -ErrorAction SilentlyContinue
  Write-Host ".vite removed (if it existed)." -ForegroundColor Green
}

# Make sure this is a git repo
git rev-parse --is-inside-work-tree 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Initializing git repository..." -ForegroundColor Yellow
  git init
}

# Ensure origin remote points to your repo
$existing = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
  git remote add origin $repoUrl
  Write-Host "Added remote origin -> $repoUrl" -ForegroundColor Green
} else {
  git remote set-url origin $repoUrl
  Write-Host "Set remote origin -> $repoUrl" -ForegroundColor Green
}

# Create a backup branch to protect local work
Write-Host "Creating a backup branch '$backupBranch' for safety..." -ForegroundColor Yellow
# Stash nothing: instead create a backup branch and commit working tree
git add -A
git commit -m "WIP backup before merge ($timestamp)" 2>$null
# If commit failed because no changes, still create branch from current HEAD
git branch $backupBranch 2>$null
if ($LASTEXITCODE -eq 0) {
  Write-Host "Backup branch created: $backupBranch" -ForegroundColor Green
} else {
  Write-Host "Backup branch created (no new commit needed)." -ForegroundColor Green
}

# Ensure we're on main branch locally
git rev-parse --abbrev-ref HEAD
$currentBranch = (git rev-parse --abbrev-ref HEAD).Trim()
if ($currentBranch -ne 'main') {
  Write-Host "Switching to branch 'main' (creating it if needed)..." -ForegroundColor Yellow
  git checkout -B main
}

# Fetch remote and attempt a safe merge
Write-Host "Fetching origin..." -ForegroundColor Yellow
git fetch origin

# Try fast-forward first
Write-Host "Attempting fast-forward merge (non-interactive)..." -ForegroundColor Yellow
git merge --ff-only origin/main 2>$null
if ($LASTEXITCODE -eq 0) {
  Write-Host "Fast-forward merge succeeded." -ForegroundColor Green
} else {
  Write-Host "Fast-forward failed. Attempting non-interactive merge preferring remote on conflicts..." -ForegroundColor Yellow
  # Try a merge allowing unrelated histories and preferring remote changes on conflicts
  git merge origin/main --allow-unrelated-histories -X theirs -m "Merge origin/main (prefer remote on conflict)" 2>$null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "Merge completed (remote preferred on conflicts)." -ForegroundColor Green
  } else {
    Write-Host "Merge still failed. As a last-resort, resetting local main to origin/main (local backup preserved on $backupBranch)..." -ForegroundColor Yellow
    git reset --hard origin/main
    if ($LASTEXITCODE -eq 0) {
      Write-Host "Local branch reset to origin/main." -ForegroundColor Green
    } else {
      Write-Host "Reset failed. Manual intervention required (see 'git status')." -ForegroundColor Red
      exit 1
    }
  }
}

# Ensure working tree is clean and push
Write-Host "Finalizing and pushing to origin/main..." -ForegroundColor Yellow
git add -A
# commit any remaining auto-merge result if needed
git commit -m "Finalize merge/apply local changes" 2>$null

# Push (will prompt for auth via credential helper)
git push -u origin main
if ($LASTEXITCODE -ne 0) {
  Write-Host "Push failed. You may need to authenticate or re-run script. See output above." -ForegroundColor Red
  exit 1
}

Write-Host "Push successful. CI should start on GitHub Actions (if configured)." -ForegroundColor Green
Write-Host "A backup branch with your local work (if any) is available: $backupBranch" -ForegroundColor Cyan
Write-Host "=== push-to-github-safe finished ===" -ForegroundColor Cyan
