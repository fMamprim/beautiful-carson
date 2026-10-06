@echo off
TITLE Sistema de Comandas
echo ==============================================
echo Iniciando o Sistema de Comandas do Restaurante
echo ==============================================
echo.
echo [1/3] Inicializando o Servidor (Backend)...
start /min "Servidor Backend" cmd /k "cd server && npm run dev"

echo [2/3] Inicializando o Painel de Gestao (Frontend)...
start /min "Painel do Caixa" cmd /k "cd web && npm run dev"

echo [3/3] Aguardando os servicos iniciarem...
timeout /t 5 /nobreak > NUL

echo Abrindo o sistema no navegador...
start http://localhost:5173

exit
