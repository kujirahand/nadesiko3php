@echo off

pushd %~dp0..
set ROOT_DIR=%CD%
popd

SET SRC_DIR=%ROOT_DIR%\src
SET CNAKO_JS=%SRC_DIR%\phpnako.js
SET NODE_EXE=node.exe

%NODE_EXE% %CNAKO_JS% %1 %2 %3 %4 %5 %6 %7 %8 %9

