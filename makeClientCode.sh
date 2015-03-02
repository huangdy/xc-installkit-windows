#!/bin/sh
# makes the UICDS Install Kit.

if [ $# -lt 1 ]
then
  echo "Usage: makeInstallKit.sh <full_path_to_core_dir> [Implementation-Version]"
  exit 1
fi

CORE_DIR=$1
if [ ! -d "$CORE_DIR" ];
then
  echo "Core directory $CORE_DIR not found.  abort..."
  exit 1
else
    cd $CORE_DIR
    export CORE_DIR=`pwd`
    cd -
  echo "Core directory $CORE_DIR found."
fi

IMPLEMENTATION_VERSION="0000"
if [ $# -ge 2 ]
then
  IMPLEMENTATION_VERSION=$2
fi


export KITBUILDER_DIR=`pwd`
export ZIP_EXE="$KITBUILDER_DIR"/bin/7za.exe
export CURL_EXE="$KITBUILDER_DIR"/bin/curl.exe

echo INFO: Set permissions
chmod u+x "$ZIP_EXE"
chmod u+x "$CURL_EXE"



echo
echo "#############################################################"
echo INFO: Build the axis2-xmlbeans
echo "#############################################################"
rm -rf "$KITBUILDER_DIR"/clients
cd "$CORE_DIR"
echo `pwd`
cd ..
echo `pwd`
cd ./clients/java/em/axis2-xmlbeans
echo `pwd`
mvn "-Dmaven.test.skip" "-DImplementation-Version=$IMPLEMENTATION_VERSION" install

echo
echo "#############################################################"
echo INFO: Build the async
echo "#############################################################"
cd "$CORE_DIR"
echo `pwd`
cd ..
echo `pwd`
cd ./clients/java/em/async
echo `pwd`
mvn "-Dmaven.test.skip" "-DImplementation-Version=$IMPLEMENTATION_VERSION" install


echo
echo "#############################################################"
echo INFO: Build the RM
echo "#############################################################"
cd "$CORE_DIR"
echo `pwd`
cd ..
echo `pwd`
cd ./clients/java/em/rm
echo `pwd`
mvn "-Dmaven.test.skip" "-DImplementation-Version=$IMPLEMENTATION_VERSION" install


echo
echo "#############################################################"
echo INFO: Build the test-utils
echo "#############################################################"
cd "$CORE_DIR"
echo `pwd`
cd ..
echo `pwd`
cd ./clients/java/em/test-utils
echo `pwd`
mvn "-Dmaven.test.skip" "-DImplementation-Version=$IMPLEMENTATION_VERSION" install


echo
echo "#############################################################"
echo INFO: Build the COMMAND
echo "#############################################################"
cd "$CORE_DIR"
echo `pwd`
cd ..
echo `pwd`
cd ./clients/java/command
echo `pwd`
mvn "-Dmaven.test.skip" "-DImplementation-Version=$IMPLEMENTATION_VERSION" install

echo
echo "#############################################################"
echo INFO: Build the UTIL
echo "#############################################################"
cd "$CORE_DIR"
echo `pwd`
cd ..
echo `pwd`
cd ./clients/java/util
echo `pwd`
mvn "-Dmaven.test.skip" "-DImplementation-Version=$IMPLEMENTATION_VERSION" install


echo
echo "#############################################################"
echo INFO: Build the shape file client
echo "#############################################################"

cd "$CORE_DIR"
echo `pwd`
cd ..
echo `pwd`
cd ./clients/java/em/shapefileClient
echo `pwd`
mvn "-Dmaven.test.skip" "-DImplementation-Version=$IMPLEMENTATION_VERSION" install

echo
echo "#############################################################"
echo INFO: Build the Work Product Viewer code
echo "#############################################################"
cd "$CORE_DIR"
echo `pwd`
cd ..
echo `pwd`
cd ./clients/java/em/workproductViewer
echo `pwd`
mvn "-Dmaven.test.skip" "-DImplementation-Version=$IMPLEMENTATION_VERSION" install


echo "#############################################################"
echo INFO: Create the java example code zip file
echo "#############################################################"
echo "$ZIP_EXE"
cd "$KITBUILDER_DIR"


"$ZIP_EXE" a -tzip ./UICDS-Example-Java-Code.zip \
../clients/data/GettingStartedGuide \
../clients/java/pom.xml \
../clients/java/install-maven-dependencies.bat \
../clients/java/README.txt \
../clients/java/em/async \
../clients/java/em/axis2 \
../clients/java/em/axis2-xmlbeans \
../clients/java/em/rm \
../clients/java/em/test-utils \
../clients/java/command \
../clients/java/util \
../clients/java/em/shapefileClient \
../clients/java/em/webproductViewer \
>/dev/null




echo ----------------------------
echo $0 Finished
echo

