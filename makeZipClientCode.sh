#!/bin/sh
# makes the zip files for Java and dotnet client code.

if [ $# -lt 1 ]
then
  echo "Usage: makeZipClientCode.sh <full_path_to_uicds-sample-code_clients_dir> "
  echo "(i.e. C:\\Roger\\Projects\\UICDS\\Phase3\\Working\\v1.1.1-sample\\maven.1302020742328\\clients)"
  exit 1
fi

CLIENTS_DIR=$1
if [ ! -d "$CLIENTS_DIR" ];
then
  echo "Clients code directory $CLIENTS_DIR not found.  abort..."
  exit 1
else
    cd $CLIENTS_DIR
    export CLIENTS_DIR=`pwd`
    cd -
  echo "Clients code directory $CLIENTS_DIR found."
fi

export KITBUILDER_DIR=`pwd`
export ZIP_EXE="$KITBUILDER_DIR"/bin/7za.exe

echo INFO: Set permissions
chmod u+x "$ZIP_EXE"

echo "#############################################################################"
echo INFO: Perform a SVN UPDATE on clients first
cd $CLIENTS_DIR
cd ../clients
svn update
cd -

echo "#############################################################################"
echo INFO: Create the java example code zip file
echo "#############################################################################"
echo "#####Extract sample code from svn into DevKitBuilder folder named clients####"
cd "$CLIENTS_DIR"
echo `pwd` 
echo "### Delete directory if exists #####"
rm -rf "$KITBUILDER_DIR"/zipfiles
rm -f $KITBUILDER_DIR/UICDS-Example-*.zip

echo Make a directory to hold files to zip
mkdir "$KITBUILDER_DIR"/zipfiles
mkdir "$KITBUILDER_DIR"/zipfiles/java
mkdir "$KITBUILDER_DIR"/zipfiles/dotNet
mkdir "$KITBUILDER_DIR"/zipfiles/dotNet.ESRI

mkdir "$KITBUILDER_DIR"/zipfiles/java/clients
mkdir "$KITBUILDER_DIR"/zipfiles/dotNet/clients
mkdir "$KITBUILDER_DIR"/zipfiles/dotNet.ESRI/clients

echo Make a "data" directory to hold readme files
mkdir "$KITBUILDER_DIR"/zipfiles/java/clients/data
mkdir "$KITBUILDER_DIR"/zipfiles/dotNet/clients/data

echo Copy README folder into data directory
svn export ../clients/data/GettingStartedGuide $KITBUILDER_DIR/zipfiles/java/clients/data/GettingStartedGuide
svn export ../clients/data/GettingStartedGuide $KITBUILDER_DIR/zipfiles/dotNet/clients/data/GettingStartedGuide

echo make directories for command, rm and util
mkdir "$KITBUILDER_DIR"/zipfiles/java/clients/java
#mkdir "$KITBUILDER_DIR"/zipfiles/java/command
#mkdir "$KITBUILDER_DIR"/zipfiles/java/util
mkdir "$KITBUILDER_DIR"/zipfiles/java/clients/java/em

echo copy files for java
svn export ../clients/java/pom.xml $KITBUILDER_DIR/zipfiles/java/clients/java/pom.xml
svn export ../clients/java/install-maven-dependencies-template.bat $KITBUILDER_DIR/zipfiles/java/clients/java/install-maven-dependencies-template.bat
cd "$KITBUILDER_DIR"
./update_mvn_depend_versions.sh $KITBUILDER_DIR/zipfiles/java/clients
rm -f $KITBUILDER_DIR/zipfiles/java/clients/java/install-maven-dependencies-template.bat

cd "$CLIENTS_DIR"
svn export ../clients/java/README.txt $KITBUILDER_DIR/zipfiles/java/clients/java/README.txt

echo copy files for command and util
svn export ../clients/java/command $KITBUILDER_DIR/zipfiles/java/clients/java/command
svn export ../clients/java/util $KITBUILDER_DIR/zipfiles/java/clients/java/util

echo copy files for all em client code
svn export ../clients/java/em/async $KITBUILDER_DIR/zipfiles/java/clients/java/em/async
svn export ../clients/java/em/axis2 $KITBUILDER_DIR/zipfiles/java/clients/java/em/axis2
svn export ../clients/java/em/axis2-xmlbeans $KITBUILDER_DIR/zipfiles/java/clients/java/em/axis2-xmlbeans
svn export ../clients/java/em/rm $KITBUILDER_DIR/zipfiles/java/clients/java/em/rm
svn export ../clients/java/em/test-utils $KITBUILDER_DIR/zipfiles/java/clients/java/em/test-utils
svn export ../clients/java/em/workproductSubmitter $KITBUILDER_DIR/zipfiles/java/clients/java/em/workproductSubmitter
svn export ../clients/java/em/workproductViewer $KITBUILDER_DIR/zipfiles/java/clients/java/em/workproductViewer
svn export ../clients/java/em/georssadapter $KITBUILDER_DIR/zipfiles/java/clients/java/em/georssadapter


echo copy pom file in java folder
svn export ../clients/java/em/pom.xml $KITBUILDER_DIR/zipfiles/java/clients/java/em/pom.xml

echo "### Zip the DEVKITBUILDER/clients folder ####"
echo "### Create zip file ####"
cd "$KITBUILDER_DIR"
cd zipfiles/java
"$ZIP_EXE" a -tzip ../../UICDS-Example-Java-Code.zip ./clients >/dev/null

#./zipfiles/java/clients/data/GettingStartedGuide \
#./zipfiles/java/clients/java/pom.xml \
#./zipfiles/java/clients/java/install-maven-dependencies.bat \
#./zipfiles/java/clients/java/README.txt \
#./zipfiles/java/clients/java/em \
#./zipfiles/java/clients/java/command \
#./zipfiles/java/clients/java/util 
#>/dev/null

echo ####### INFO: Create the dotNet example code zip file #######
mkdir $KITBUILDER_DIR/zipfiles/dotNet/clients/dotNet

cd "$CLIENTS_DIR"
echo copy files for dotNet client code

svn export ../clients/dotNet/README.txt $KITBUILDER_DIR/zipfiles/dotNet/clients/dotNet/README.txt
svn export ../clients/dotNet/UICDS_async $KITBUILDER_DIR/zipfiles/dotNet/clients/dotNet/UICDS_async


cd "$KITBUILDER_DIR"
cd zipfiles/dotNet

"$ZIP_EXE" a -tzip ../../UICDS-Example-DotNet-Code.zip ./clients >/dev/null


echo ####### INFO: Create the dotNet'ESRI example code zip file #######
mkdir $KITBUILDER_DIR/zipfiles/dotNet.ESRI/clients/dotNet

cd "$CLIENTS_DIR"
echo copy files for dotNet.ESRI client code
svn export ../clients/dotNet/ESRI $KITBUILDER_DIR/zipfiles/dotNet.ESRI/clients/dotNet/ESRI

cd "$KITBUILDER_DIR"/zipfiles/dotNet.ESRI
"$ZIP_EXE" a -tzip ../../UICDS-Example-DotNet.ESRI-Code.zip ./clients >/dev/null


echo ----------------------------
echo $0 Finished
echo

