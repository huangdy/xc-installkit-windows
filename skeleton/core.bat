@echo off

set ERROR=0

if not "%2"=="" GOTO JUSTONE
if /i "%1"=="start" GOTO STARTUP
if /i "%1"=="stop" GOTO SHUTDOWN
if /i "%1"=="query" GOTO QUERY
if /i "%1"=="delete" GOTO DELETE

:USAGE
echo.
echo USAGE: core.bat start ^| stop ^| query ^| delete [OpenDJ ^| Openfire ^| Tomcat]
echo 	'core.bat start' will start all Core services
echo 	'core.bat stop' will stop all Core services
echo 	'core.bat status' will output the state of each Core service
echo 	'core.bat delete' will uninstall all UICDS services
echo	    WARNING:  The services will have to be manually
echo		      reinstated according to the Installation Guide.
echo.
echo   Passing any of these commands the name of a Core service will execute the
echo   command against that service only.  Please note, services which have dependencies
echo   may not stop or delete if their dependencies have not been stopped first.
echo.
GOTO END

:JUSTONE
echo.
echo INFO: %1 %2
sc.exe %1 %2
if %ERROR% NEQ 0 GOTO ERROR
GOTO END

:STARTUP
echo.
echo INFO: Starting Core Services...
sc.exe start OpenDJ
sc.exe start Openfire
sc.exe start Tomcat
if %ERROR% NEQ 0 GOTO ERROR
echo INFO: Core Started
GOTO END

:SHUTDOWN
echo.
echo INFO: Stopping Core Services
sc.exe stop Tomcat
CALL SLEEP 10
sc.exe stop Openfire
CALL SLEEP 10
sc.exe stop OpenDJ
if %ERROR% NEQ 0 GOTO ERROR
echo INFO: Core Stopped
GOTO END

:QUERY
echo.
sc.exe query Tomcat
sc.exe query Openfire
sc.exe query OpenDJ
if %ERROR% NEQ 0 GOTO ERROR
GOTO END

:DELETE
echo.
echo INFO: Stopping Core Services
sc.exe stop Tomcat
CALL SLEEP 10
sc.exe stop Openfire
CALL SLEEP 10
sc.exe stop OpenDJ
if %ERROR% NEQ 0 GOTO ERROR
echo INFO: Core Stopped
echo.
sc.exe delete Tomcat
sc.exe delete Openfire
sc.exe delete OpenDJ

if %ERROR% NEQ 0 GOTO ERROR
GOTO END

:ERROR
echo.
echo ERROR: core.bat has failed.
echo.
set ERROR=1
GOTO END

:END
