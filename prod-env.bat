@echo on
set base_dir=%~dp0
%base_dir:~0,2%
pushd %base_dir%

rd /s/q dist
cd src
fis release --optimize --domains --md5 --dest ../dist


