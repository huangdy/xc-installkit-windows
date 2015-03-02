@echo off

echo.
echo WARNING:
echo WARNING: THIS OPERATION WILL PEMANENTLY REMOVE ALL DATA FROM THE CORE
echo WARNING:
echo.

IF "%1"=="" GOTO USAGE

SET /P CONTINUE=Enter 'Y' to continue: 
echo

IF NOT %CONTINUE%==Y GOTO CANCEL

echo.
echo "INFO: Stopping Tomcat.  Please wait a moment..."
CALL core.bat stop Tomcat
CALL SLEEP 30

echo "start mssql database table clean up process..."
"C:\Program Files\Microsoft SQL Server\110\Tools\Binn"\sqlcmd -S 127.0.0.1 -d core -U sa -P %1 -i Tools\cleanupMSSQLTables.sql 
REM -o .\output.txt
echo "end mssql database table clean up process..."
echo.

echo.
echo "INFO: clean XMPP nodes"
java -jar Tools\XmppNodesUtil.jar -c

echo
echo "INFO: Starting Tomcat"
CALL core.bat start Tomcat

GOTO SUCCESS

:USAGE
echo.
echo "Usage: cleanSQLDatabase.bat <SAPASSWORD>"
echo.
GOTO END

:SUCCESS
echo.
echo "INFO: Finished Cleaning UICDS Databases"
echo.
GOTO END

:END

