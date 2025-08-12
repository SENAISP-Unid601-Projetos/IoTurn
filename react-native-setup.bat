@echo off
SETLOCAL ENABLEEXTENSIONS

echo ===== React Native + Expo Setup =====

:: Verifica Node.js
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao esta instalado. Instale antes.
    pause
    exit /b
)

:: Nome do projeto
set /p projectName=Digite o nome do seu projeto: 

:: Cria projeto em novo processo
echo Criando o projeto %projectName%...
call npx create-expo-app %projectName% --template blank --yes

IF %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao criar o projeto.
    pause
    exit /b
)

:: Confirma que a pasta existe
IF NOT EXIST "%projectName%" (
    echo [ERRO] Projeto nao foi criado.
    pause
    exit /b
)

:: Abre servidor web em outro terminal
cd "%projectName%"

:: Instala suporte para Web
echo Instalando dependencias para suporte Web...
call npx expo install react-dom@19.0.0 react-native-web@^0.20.0 @expo/metro-runtime@~5.0.4

start cmd /K "npm run web"
pause

:: Abre VS Code na pasta
start code "%projectName%"

pause
ENDLOCAL



