@echo off
title Smart Canteen Runner
echo ===================================================
echo     Smart Canteen Management System - One-Click
echo ===================================================
echo.
echo Make sure Docker Desktop (MongoDB, Redis, RabbitMQ) is running!
echo To stop all services, press Ctrl+C or close this window.
echo.
node start-all.js
pause
