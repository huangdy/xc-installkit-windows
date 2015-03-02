#!/bin/sh
# makes the UICDS Install Kit.

if [ $# -lt 1 ]
then
  echo "Usage: makeInstallKit.sh <full_path_to_core_dir> [Implementation-Version] [config-Dir]"
  exit 1
fi

CORE_DIR=$1
if [ ! -d "$CORE_DIR" ];
then
  echo "Core directory $CORE_DIR not found.  Exiting..."
  exit 1
else
    cd $CORE_DIR
    export CORE_DIR=`pwd`
    cd -
  echo "Building core from: $CORE_DIR"
fi

VERSION="0000"
if [ $# -ge 2 ]
then
  VERSION=$2
fi

export KITBUILDER_DIR=`pwd`

echo INFO: Removing previous installkit build
rm -rf "$KITBUILDER_DIR"/UICDS
rm -rf "$KITBUILDER_DIR"/temp
rm -rf "$KITBUILDER_DIR"/UICDS*.zip

echo INFO: Creating UICDS Directory
cp -r "$KITBUILDER_DIR"/skeleton "$KITBUILDER_DIR"/UICDS

echo INFO: Applying configuration
cp -r $3 "$KITBUILDER_DIR"/UICDS/setup

# uncomment this section to turn off the Auto Sharing
# cd "$CORE_DIR"/em/services/src/main/resources/contexts
# sed -e "s/START_DEPLOY_TOKEN\(.*\)//" -e "s/^\(.*\)END_DEPLOY_TOKEN//" applicationContext-processes.xml > applicationContext-processes.xml.new
# mv applicationContext-processes.xml.new applicationContext-processes.xml

echo INFO: Building the Core WAR
cd "$CORE_DIR"/infrastructure
mvn clean
mvn "-Dmaven.test.skip" "-DImplementation-Version=$VERSION" install

cd "$CORE_DIR"/em
mvn clean
mvn "-Dmaven.test.skip" "-DImplementation-Version=$VERSION" install

echo INFO: Building the XMPP Utility Apps
# build the infrastructure/xmpp/apps for the CleanupXMPPNodes.jar
# and copy the jar and the context xml to to tools     
cd "$CORE_DIR"/infrastructure/xmpp/apps
mvn clean
mvn "-Dmaven.test.skip" "-DImplementation-Version=$VERSION" install
cp "$CORE_DIR"/infrastructure/xmpp/apps/target/*.jar "$KITBUILDER_DIR"/UICDS/Tools
cp "$CORE_DIR"/infrastructure/xmpp/apps/src/main/resources/contexts/cleanXmppNodesContext.xml "$KITBUILDER_DIR"/UICDS/Tools

# copy context files to locations editable after deployment
mkdir "$KITBUILDER_DIR"/temp
mkdir "$KITBUILDER_DIR"/temp/uicds
cp -R "$CORE_DIR"/em/war/target/com.saic.uicds.core.em.war-*/* "$KITBUILDER_DIR"/temp/uicds

# get the manifest that is created by maven but only included in the war file
# "$ZIP_EXE" -y e `cygpath -d "$CORE_DIR"/em/war/target/com.saic.uicds.core.em.war-*.war` -o`cygpath -d "$KITBUILDER_DIR"/temp/uicds/META-INF` META-INF/MANIFEST.MF

echo INFO: Copying the context files
# Only pull out the applicationContext-processes.xml, the rest are using core.properties
#cp "$CORE_DIR"/infrastructure/services/src/main/resources/contexts/xmppBeans.xml "$KITBUILDER_DIR"/temp/uicds/WEB-INF/xmppBeans.xml
#cp "$CORE_DIR"/infrastructure/services/src/main/resources/contexts/xmppContext.xml "$KITBUILDER_DIR"/temp/uicds/WEB-INF/xmppContext.xml
#cp "$CORE_DIR"/infrastructure/services/src/main/resources/contexts/applicationContext-infra.xml "$KITBUILDER_DIR"/temp/uicds/WEB-INF/applicationContext-infra.xml
#cp "$CORE_DIR"/infrastructure/services/src/main/resources/contexts/mssql-dataSrcContext.xml "$KITBUILDER_DIR"/temp/uicds/WEB-INF/mssql-dataSrcContext.xml
cp "$CORE_DIR"/em/services/src/main/resources/contexts/applicationContext-processes.xml "$KITBUILDER_DIR"/temp/uicds/WEB-INF/applicationContext-processes.xml


echo INFO: Modifying the context files
#sed -i 's!classpath:contexts\/xmppBeans.xml!\/WEB-INF\/xmppBeans.xml!g' "$KITBUILDER_DIR"/temp/uicds/WEB-INF/web.xml
#sed -i 's!classpath:contexts\/xmppContext.xml!\/WEB-INF\/xmppContext.xml!g' "$KITBUILDER_DIR"/temp/uicds/WEB-INF/web.xml
#sed -i 's!classpath:contexts\/applicationContext-infra.xml!\/WEB-INF\/applicationContext-infra.xml!g' "$KITBUILDER_DIR"/temp/uicds/WEB-INF/web.xml
#sed -i 's!classpath:contexts\/mssql-dataSrcContext.xml!\/WEB-INF\/mssql-dataSrcContext.xml!g' "$KITBUILDER_DIR"/temp/uicds/WEB-INF/web.xml
sed -i 's!classpath:contexts\/applicationContext-processes.xml!\/WEB-INF\/applicationContext-processes.xml!g' "$KITBUILDER_DIR"/temp/uicds/WEB-INF/web.xml

echo INFO: Copying the UICDS WAR to $KITBUILDER_DIR/UICDS/ServerApps
cp -R "$KITBUILDER_DIR"/temp/uicds "$KITBUILDER_DIR"/UICDS/ServerApps

#   read -p "Press any key to continue ..."

echo INFO: make documents
cd "$KITBUILDER_DIR"/makedocs
./makedocs.sh "$KITBUILDER_DIR" "$CORE_DIR"

echo INFO: Install the index.html
rm -f "$KITBUILDER_DIR"/UICDS/ServerApps/docs/index.html
cd "$KITBUILDER_DIR"/UICDS/ServerApps/docs
cp index_secure.html index.html

echo INFO: Install the GettingStartedGuide.pdf
rm -f "$KITBUILDER_DIR"/dist/GettingStartedGuide.pdf
cd "$KITBUILDER_DIR"/UICDS/ServerApps/docs/secure
cp GettingStartedGuide.pdf "$KITBUILDER_DIR"/dist

echo INFO: Install the GettingStartedGuide xml files
#rm -rf "$KITBUILDER_DIR"/dist/GettingStartedGuide
#cd "$CORE_DIR"/../clients/data
#cp -r GettingStartedGuide "$KITBUILDER_DIR"/temp

echo INFO: Add the distribution application
rm -rf "$KITBUILDER_DIR"/UICDS/ServerApps/docs/dist
cd "$KITBUILDER_DIR"
cp -r ./dist ./UICDS/ServerApps/docs

echo INFO: Install the index.html
rm -f "$KITBUILDER_DIR"/UICDS/ServerApps/docs/index.html
cd "$KITBUILDER_DIR"/UICDS/ServerApps/docs
cp index_dist.html index.html

# Added default.xsl stylesheet to the UICDS/PostInstall/config directory
echo INFO: copy the default.xsl
cp "$CORE_DIR"/em/adminconsole/src/main/resources/com/saic/uicds/core/em/adminconsole/public/config/xslt/default.xsl "$KITBUILDER_DIR"/UICDS/Setup/configFiles/UICDS/default.xsl

echo INFO: Zip it up

cd "$KITBUILDER_DIR"
zip -r ./UICDS-InstallKit-$VERSION.zip UICDS

echo ----------------------------
echo $0 Finished
echo

