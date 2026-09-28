@echo off
cd /d %~dp0
if not exist server\node_modules call npm run install:all
if not exist client\dist call npm run build
if not exist server\.env call npm run setup
call npm start
