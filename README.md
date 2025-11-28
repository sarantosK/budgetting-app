# Budgeting App

This is a simple budgeting application built with React and TypeScript. It allows users to input their savings and expenses, and visualize their budgeting data through charts.

## Getting Started

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Run the application using `npm run dev`.

## Features

- Input savings and expenses
- Visualize data with charts
- Responsive design

## Running locally (Windows PowerShell)

1. Install:
   - npm ci

2. Start dev server (recommended):
   - npm run dev
   - If you have an issue opening http://localhost:5173 try http://127.0.0.1:5173

3. If you see ERR_CONNECTION_REFUSED:
   - Check for stray vite processes listening on 5173:
     - netstat -ano | findstr ":5173"
     - If a PID is shown, find the process: tasklist /FI "PID eq <pid>" or in PowerShell: Get-Process -Id <pid>
     - Kill it if appropriate: taskkill /PID <pid> /F
   - Alternatively start the server bound to IPv4 explicitly:
     - npm run dev:ipv4

4. Hosts / VPN / Proxy:
   - Ensure `localhost` is resolvable (hosts file entries usually not needed).
   - Some VPNs or proxy rules can change localhost resolution — use 127.0.0.1 as fallback.

5. Quick diagnostics to paste when reporting issues:
   - netstat -ano | findstr ":5173"
   - tasklist /FI "IMAGENAME eq node.exe" /FO LIST
   - Git status: git status --porcelain
   - Last commits: git log --oneline --decorate -5

## Contributing / Pushing safely
- Always pull remote first and resolve merges: git pull --rebase origin main
- Avoid committing transient files (.vite/) — they are ignored.
- If a helper push script exists, review it before running. Do not force-push main without a backup branch.
