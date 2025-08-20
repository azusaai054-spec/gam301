@echo off
:: Serena MCP Server Launcher for Windows
:: 自動的にPythonパスを検出して起動

set PYTHON_PATH=C:\Users\final\AppData\Local\Programs\Python\Python312\python.exe

if not exist "%PYTHON_PATH%" (
    echo Error: Python 3.12 not found at expected location
    echo Please check Python installation path
    pause
    exit /b 1
)

"%PYTHON_PATH%" -m uv tool run --from git+https://github.com/oraios/serena serena-mcp-server --context ide-assistant --project %1