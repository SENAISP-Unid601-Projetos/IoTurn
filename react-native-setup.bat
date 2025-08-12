@echo off
SETLOCAL ENABLEEXTENSIONS

echo ===== React Native + Expo Setup =====

:: Verifica se o Node.js está instalado
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Node.js nao esta instalado. Por favor, instale o Node.js primeiro.
    pause
    exit /b
)

:: Instala o expo-cli globalmente (se nao estiver instalado)
echo Instalando o Expo CLI globalmente...
npm install -g expo-cli

:: Pergunta o nome do projeto
set /p projectName=Digite o nome do seu projeto: 

:: Cria o projeto com create-expo-app
echo Criando o projeto %projectName%...
npx create-expo-app %projectName%

:: Entra na pasta do projeto
cd %projectName%

:: Instala suporte para web (react-native-web, etc)
echo Instalando dependencias para suporte web...
npm install react-native-web react-dom react-native-svg

:: Adiciona script "web" no package.json (opcional)
echo Adicionando script "web" no package.json...
powershell -Command "(Get-Content package.json) -replace '\"scripts\": {', '\"scripts\": {\n    \"web\": \"expo start --web\",' | Set-Content package.json"

:: Inicia o projeto no navegador
echo Iniciando o projeto no navegador...
npm run web

ENDLOCAL
pause
