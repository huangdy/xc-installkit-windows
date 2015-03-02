@echo off

cls

set BRANDING=Keystone

echo.
echo -------------------------------------
echo  Beginning %BRANDING% Installation
echo -------------------------------------

SETLOCAL

echo Checking Java Environment...

if DEFINED JAVA_HOME (
echo INFO: JAVA_HOME=%JAVA_HOME%
if not exist "%JAVA_HOME%\bin\jar.exe" (
   echo ERROR: JAVA_HOME does not appear to point a JDK
   GOTO FAIL
) else (
   set JAVAEXE="%JAVA_HOME%\bin\java.exe"
   set JAREXE="%JAVA_HOME%\bin\jar.exe"
   set KEYTOOLEXE="%JAVA_HOME%\bin\keytool.exe"
)
) else (
echo ERROR: JAVA_HOME is not set
GOTO FAIL
)

REM - SERVER INSTALLATION FILES (versions)
set OPENDJBASE=OpenDJ-2.7.0-20131023
set SQLSERVERBASE=SQLEXPR_x64_ENU
set OPENFIREBASE=openfire_3_7_1
set TOMCATBASE=apache-tomcat-7.0.53

REM - PATH SETUP
set INSTALL_HOME=%CD%
echo INFO: INSTALL_HOME=%INSTALL_HOME%

set OPENDJ_HOME=%INSTALL_HOME%\Server\opendj
set EXIST_HOME=%INSTALL_HOME%\Server\eXist
set OPENFIRE_HOME=%INSTALL_HOME%\Server\Openfire
set CATALINA_HOME=%INSTALL_HOME%\Server\Tomcat

set CONFIG_HOME=%INSTALL_HOME%\setup\standard64bit
mkdir %CONFIG_HOME%\tmp

REM - SYSTEM USERS DO NOT MODIFY!
SET ADMINUSER=admin
SET COREUSER=uicds

REM - COLLECT CONFIGURATION
echo.
echo Please enter the following information:
SET /P AGENCY=Agency Name:  
SET /P CONTACTEMAIL=POC Email:  
SET /P CONTACTPHONE=POC Phone:  
SET /P FQDN=%BRANDING% Server Fully Qualified Domain Name: 
SET /P SYSADMINPASS=%BRANDING% System Admin's password:  
SET /P ADMINPASS=%BRANDING% Admin User's password: 
SET /P COREPASS=%BRANDING% Core User's password: 
echo.
echo Do you want to share information based on the core's proximity?
SET /P CONTINUE=Enter 'Y' to continue: 
SET Res=false
If %CONTINUE%==Y SET Res=true
If %CONTINUE%==y SET Res=true
IF NOT %Res%==true GOTO NOLOC
SET /P LOCLAT=%BRANDING% Core Location (Latitude):
SET /P LOCLON=%BRANDING% Core Location (Longitude):
SET /P STREET=%BRANDING% Core Location (Street):
SET /P CITY=%BRANDING% Core Location (City):
SET /P STATE=%BRANDING% Core Location (State):
SET /P ZIP=%BRANDING% Core Location (Zip):

:NOLOC
set JUMPTO=%1
if defined JUMPTO (
  GOTO %JUMPTO%
)

:OPENDJ
echo.
echo INSTALL:  OpenDJ [%OPENDJBASE%]

echo INFO: Extracting OpenDJ
cd %INSTALL_HOME%\Server
%JAREXE% -xf %CONFIG_HOME%\InstallFiles\%OPENDJBASE%.zip
@ping 127.0.0.1 -n 10 -w 1000 > nul

echo INFO: OpenDJ Initial Setup
CALL %OPENDJ_HOME%\setup.bat --cli --no-prompt --doNotStart -Z 636 -q --generateSelfSignedCertificate -N UICDS --adminConnectorPort 4444 -D "cn=Directory Manager" -w %SYSADMINPASS% -b dc=uicds,dc=us -a

echo INFO: Installing OpenDJ as a Windows Service
CALL %OPENDJ_HOME%\bat\windows-service.bat -e

echo INFO: Starting OpenDJ
CALL %OPENDJ_HOME%\bat\start-ds.bat

echo INFO: Creating Admin and User Groups
copy /Y %CONFIG_HOME%\configFiles\opendj\setup.ldif.orig %CONFIG_HOME%\configFiles\opendj\setup.ldif
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %CONFIG_HOME%\configFiles\opendj\setup.ldif "%%ADMINUSER%%" %ADMINUSER%
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %CONFIG_HOME%\configFiles\opendj\setup.ldif "%%ADMINPASS%%" %ADMINPASS%
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %CONFIG_HOME%\configFiles\opendj\setup.ldif "%%COREUSER%%" %COREUSER%
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %CONFIG_HOME%\configFiles\opendj\setup.ldif "%%COREPASS%%" %COREPASS%

@ping 127.0.0.1 -n 10 -w 1000 > nul

CALL %OPENDJ_HOME%\bat\ldapmodify.bat --port 636 --bindDN "cn=Directory Manager" --bindPassword %SYSADMINPASS% --trustAll --useSSL --noPropertiesFile --defaultAdd -f %CONFIG_HOME%\configFiles\opendj\setup.ldif
del %CONFIG_HOME%\configFiles\opendj\setup.ldif

if defined JUMPTO (
  GOTO SUCCESS
)

:SQLEXPRESS 
echo.
echo INSTALL:  MS SQL Server Express [%SQLSERVERBASE%]
echo INSTALL:  This may take quite a while.  Please be patient.

%CONFIG_HOME%\installFiles\%SQLSERVERBASE%.exe /q  /ACTION=Install /FEATURES=SQL /INSTANCENAME=MSSQLSERVER /SECURITYMODE=SQL /SAPWD=%SYSADMINPASS% /TCPENABLED=1 /INDICATEPROGRESS /IACCEPTSQLSERVERLICENSETERMS

echo INFO:  Creating %BRANDING% database
"C:\Program Files\Microsoft SQL Server\110\Tools\Binn"\sqlcmd.exe -U sa -P %SYSADMINPASS% -i %CONFIG_HOME%\configFiles\mssql\createDatabase.sql

if defined JUMPTO (
  GOTO SUCCESS
)


:OPENFIRE
echo.
echo INSTALL:  Openfire
echo INFO: Extracting Openfire
cd %INSTALL_HOME%\Server
%JAREXE% -xf %CONFIG_HOME%\installFiles\%OPENFIREBASE%.zip
move %OPENFIREBASE% openfire

echo INFO:  Applying database configuration to Openfire
xcopy /I/R/Y %CONFIG_HOME%\configFiles\openfire %OPENFIRE_HOME%\conf

echo INFO:  Creating OpenFire database
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\Server\openfire\conf\createOpenfire.sql "%%INSTALL_HOME%%" "%INSTALL_HOME%"
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\Server\openfire\conf\createOpenfire.sql "%%FQDN%%" "%FQDN%"
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\Server\openfire\conf\createOpenfire.sql "%%ADMINPASS%%" "%ADMINPASS%"
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\Server\openfire\conf\createOpenfire.sql "%%SYSADMINPASS%%" "%SYSADMINPASS%"
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\Server\openfire\conf\openfire.xml "%%SYSADMINPASS%%" "%SYSADMINPASS%"

echo INFO:  Applying database configuration
"C:\Program Files\Microsoft SQL Server\110\Tools\Binn"\sqlcmd.exe -U sa -P %SYSADMINPASS% -i %INSTALL_HOME%\Server\openfire\conf\createOpenfire.sql

echo INFO: Generating self-signed keys for Openfire
cd %OPENFIRE_HOME%\resources\security
set SERVER_DNAME="cn=%FQDN%,dc=uicds,dc=us"
set DAYS_VALID=365

%KEYTOOLEXE% -storepasswd -keystore keystore -new %SYSADMINPASS% -storepass changeit
%KEYTOOLEXE% -genkey -alias %FQDN% -keystore keystore -storepass %SYSADMINPASS% -validity %DAYS_VALID% -keypass %SYSADMINPASS% -dname %SERVER_DNAME%

cd %INSTALL_HOME%
echo INFO: Generating self-signed keys for Tomcat 
%KEYTOOLEXE% -genkey -keyalg RSA -keysize 2048 -alias tomcat -keystore keystore.jks -storepass %SYSADMINPASS% -keypass %SYSADMINPASS% -validity %DAYS_VALID% -dname "CN=%FQDN%,ou=uicds,o=uicds,l=uicds,st=uicds,c=US"

echo INFO: Fixing up server.xml with keystore filename and password
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %CONFIG_HOME%\configFiles\tomcat\conf\server.xml "keystoreFile=\"../../keystore\"" "keystoreFile=\"../../keystore.jks\"
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %CONFIG_HOME%\configFiles\tomcat\conf\server.xml "keystorePass=\"keystore\"" "keystorePass=\"%SYSADMINPASS%\"


echo INFO: Installing Openfire as a Windows Service
%OPENFIRE_HOME%\bin\openfire-service.exe /install
sc config "Openfire" depend= OpenDJ

sc start Openfire

if defined JUMPTO (
  GOTO SUCCESS
)

:TOMCAT
echo.
echo INSTALL:  Tomcat
echo INFO: Extracting Tomcat
cd %INSTALL_HOME%\Server
%JAREXE% -xf %CONFIG_HOME%\InstallFiles\%TOMCATBASE%-windows-x64.zip
move %TOMCATBASE% %CATALINA_HOME%

echo INFO: Applying %BRANDING% configuration to Tomcat
xcopy /I/R/Y %CONFIG_HOME%\configFiles\tomcat\bin %CATALINA_HOME%\bin
xcopy /I/R/Y %CONFIG_HOME%\configFiles\tomcat\lib %CATALINA_HOME%\lib
xcopy /I/R/Y %CONFIG_HOME%\configFiles\tomcat\conf %CATALINA_HOME%\conf

xcopy /I/R/Y %CONFIG_HOME%\configFiles\mssql\*.jar %INSTALL_HOME%\ServerApps\uicds\WEB-INF\lib

%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\core.properties "%%SYSADMINPASS%%" "%SYSADMINPASS%"
REM - %JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\WEB-INF\applicationContext-infra.xml "%%SYSADMINPASS%%" "%SYSADMINPASS%"
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\core.properties "%%FQDN%%" "%FQDN%"
REM - %JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\WEB-INF\applicationContext-infra.xml "%%INSTALL_HOME%%" "%INSTALL_HOME%"

REM - %JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\WEB-INF\xmppBeans.xml "%%INSTALL_HOME%%" "%INSTALL_HOME%"
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\core.properties "%%COREUSER%%" "%COREUSER%"
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\core.properties "%%COREPASS%%" "%COREPASS%"
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\core.properties "%%FQDN%%" "%FQDN%"
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\core.properties "%%SYSADMINPASS%%" "%SYSADMINPASS%"
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\core.properties "%%LOCATION%%" "%LOCLAT%,%LOCLON%"
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\manage\opendj-rest2ldap-servlet.json "%%SYSADMINPASS%%" "%SYSADMINPASS%"

%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\WEB-INF\web.xml "%%COREPASS%%" "%COREPASS%"



echo INFO: Setting Feed Config
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\config\resources\config.xml "%%AGENCY%%" "%AGENCY%"
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\config\resources\config.xml "%%CONTACTEMAIL%%" "%CONTACTEMAIL%"
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\config\resources\config.xml "%%CONTACTPOC%%" "%CONTACTPOC%"
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\config\resources\config.xml "%%FQDN%%" "%FQDN%"

IF %Res%==true (
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\config\resources\config.xml "%%OPEN%%" " "
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\config\resources\config.xml "%%LOCLAT%%" "%LOCLAT%"
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\config\resources\config.xml "%%LOCLON%%" "%LOCLON%"
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\config\resources\config.xml "%%STREET%%" "%STREET%"
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\config\resources\config.xml "%%CITY%%" "%CITY%"
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\config\resources\config.xml "%%STATE%%" "%STATE%"
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\config\resources\config.xml "%%ZIP%%" "%ZIP%"
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\config\resources\config.xml "%%END%%" " "
) ELSE (
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\config\resources\config.xml "%%OPEN%%" "<!--"
%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\config\resources\config.xml "%%END%%" "-->")

%JAVAEXE% -cp %INSTALL_HOME%\setup\utility.jar com.saic.utility.FileRegex %INSTALL_HOME%\ServerApps\uicds\META-INF\context.xml "%%SYSADMINPASS%%" "%SYSADMINPASS%"

echo INFO: Installing Tomcat as a Windows Service
call %CATALINA_HOME%\bin\service.bat install Tomcat
call %CATALINA_HOME%\bin\tomcat7 //US//Tomcat --DisplayName="%BRANDING% Tomcat" --Environment=CATALINA_HOME="%CATALINA_HOME%" --Jvm=auto --StartMode=jvm --StopMode=jvm --StartClass=org.apache.catalina.startup.Bootstrap --StartParams=start --StopClass=org.apache.catalina.startup.Bootstrap --StopParams=stop --Startup=auto --StartPath="%INSTALL_HOME%"

sc config "Tomcat" depend= OpenDJ/Openfire

sc start Tomcat

if defined JUMPTO (
  GOTO SUCCESS
)


:AUTOSERVICE
echo.
echo INFO: Setting %BRANDING% Service Startup to Auto
sc.exe config opendj start= delayed-auto
sc.exe config openfire start= delayed-auto
sc.exe config tomcat start= delayed-auto
if defined JUMPTO (
  GOTO SUCCESS
}

GOTO SUCCESS

:FAIL
echo.
echo %BRANDING% Setup did not complete
echo.
ENDLOCAL
exit /B -1

:SUCCESS
cd %INSTALL_HOME%
echo.
echo %BRANDING% Setup Complete
echo.
ENDLOCAL
exit /B 0
