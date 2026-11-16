@echo off
chcp 65001 >nul
title BH Eletronicos - site local
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js nao foi encontrado neste computador.
  echo Instale a versao LTS em https://nodejs.org e rode este arquivo de novo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Primeira execucao: instalando dependencias. Isso pode levar alguns minutos...
  call npm install
  if errorlevel 1 (
    echo Falha ao instalar as dependencias.
    pause
    exit /b 1
  )
)

echo.
echo Iniciando o site. O navegador vai abrir sozinho.
echo Para encerrar, feche esta janela ou pressione Ctrl+C.
echo.
call npm run dev -- --open
pause
