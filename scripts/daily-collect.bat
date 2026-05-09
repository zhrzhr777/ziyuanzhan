@echo off
REM 每日资源自动采集脚本
REM 用 Windows 任务计划程序每天运行此脚本

cd /d "F:\工作空间\ziyuanzhan"

echo ========================================
echo  资源栈 - 每日自动采集
echo  %date% %time%
echo ========================================

echo.
echo [1/2] GitHub 开源项目采集...
set NODE_OPTIONS=--use-system-ca
call npx tsx scripts/collect-github.ts >> logs\collect-%date:~0,4%%date:~5,2%%date:~8,2%.log 2>&1

echo.
echo [2/2] 采集完成
echo 日志已保存到 logs\ 目录

exit /b 0
