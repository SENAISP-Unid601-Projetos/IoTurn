@echo off
SETLOCAL ENABLEEXTENSIONS

echo ===== React Native + Expo Setup =====

:: Verifica se o Node.js está instalado
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao esta instalado. Instale o Node.js antes de prosseguir.
    pause
    exit /b
)

:: Pergunta o nome do projeto
set /p projectName=Digite o nome do seu projeto: 

:: Cria o projeto com create-expo-app
echo Criando o projeto %projectName%...
npx create-expo-app %projectName% --template blank
pause

IF %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao criar o projeto.
    pause
    exit /b
)

:: Entra na pasta do projeto
cd %projectName%

:: Abre no VS Code
code .

:: Inicia o projeto no navegador
echo Iniciando o projeto no navegador...
npm run web

ENDLOCAL
pause

