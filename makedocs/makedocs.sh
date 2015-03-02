#!/bin/sh

if [ $# -ne 2 ]
then
  echo "Usage: makedocs.sh <kitbuilder_dir> <core_dir>"
  exit 1
fi

KITBUILDER_DIR=${1//\\/\/}
CORE_DIR=${2//\\/\/}

if [ ! -d "$KITBUILDER_DIR" ];
then
  echo "Directory "$CORE_DIR" not found.  abort..."
  exit 1
fi

if [ ! -d "$CORE_DIR" ];
then
  echo "Directory "$CORE_DIR" not found.  abort..."
  exit 1
fi

cd "$KITBUILDER_DIR"
export KITBUILDER_DIR=`pwd`
cd -
cd "$CORE_DIR"
export CORE_DIR=`pwd`
cd -

echo INFO: cleanup: "$CORE_DIR/infrastructure/services/target/site/apidocs"
rm -rf "$CORE_DIR/infrastructure/services/target/site/apidocs"

echo INFO: Make the "$CORE_DIR"/infrastructure/services javadoc documentation
cd "$CORE_DIR"/infrastructure/services
mvn javadoc:javadoc

echo INFO: Initialize "$CORE_DIR"/em/services/target/site/apidocs
rm -rf "$CORE_DIR"/em/services/target/site/apidocs

echo INFO: Make the em/services javadoc documentation
cd "$CORE_DIR"/em/services
mvn javadoc:javadoc

# build wsdl and schema files
EM_MODEL_DIR="$CORE_DIR/em/services/target/site/apidocs/com/saic/uicds/core/em/endpoint"
INFRA_MODEL_DIR="$CORE_DIR/infrastructure/services/target/site/apidocs/com/saic/uicds/core/infrastructure/endpoint"

infrastructure_dir="$CORE_DIR/xmlbeans-infrastructure/src/main/xsd"
em_dir="$CORE_DIR/xmlbeans-em/src/main/xsd"
edxl_rm_dir="$CORE_DIR/xmlbeans-edxl_rm/src/main/xsd"

username=uicds
password=uicds.1549

resdir="$KITBUILDER_DIR"/makedocs/res

echo
echo Generating EM WSDL Docs: Begin
echo ----------------------------

wsdldir=${EM_MODEL_DIR}/wsdl
mkdir -p ${wsdldir} >/dev/null 2>&1 && echo "Created ${wsdldir} directory."

svclist=${resdir}/emServices.txt
cat ${svclist} | while read LINE
do
    ### Windows Vista adds carriage return to cut result, so use sed instead
    # sname=`echo "$LINE" | cut -d ';' -f1`
    # surl=`echo "$LINE" | cut -d ';' -f2`
    ###

    sname=`echo "$LINE" | sed 's/^\(.*\);\(.*\)/\1/'`
    surl=`echo "$LINE" | sed 's/^\(.*\);\(.*\)/\2/'`

    # Replace spaces in the filename with underscores
    slinkname=`echo "${sname}" | sed 's/ //g'`

    # Fetch the wsdl from the service url
    echo "${sname}: "
    echo -n "   Fetching..."
    curl -s -S -k -u ${username}:${password} -o "${wsdldir}/${slinkname}.wsdl" ${surl}

    echo -n "Parsing..."
    # Insert the stylesheet definition after the first occurrence of "?>"
    # and write to a new file *.wsdl.xml
    sed 's/?>/?><?xml-stylesheet type="text\/xsl" href="wsdl-viewer-mod.xsl"?>/1' ${wsdldir}/${slinkname}.wsdl > ${wsdldir}/${slinkname}.wsdl.xml
    echo "Done."

done


echo
echo Generating Infrastructure WSDL Docs: Begin
echo ----------------------------

wsdldir=${INFRA_MODEL_DIR}/wsdl
mkdir -p ${wsdldir} >/dev/null 2>&1 && echo "Created ${wsdldir} directory."

svclist=${resdir}/infraServices.txt
cat ${svclist} | while read LINE
do
    ### Windows Vista adds carriage return to cut result, so use sed instead
    # sname=`echo "$LINE" | cut -d ';' -f1`
    # surl=`echo "$LINE" | cut -d ';' -f2`
    ###

    sname=`echo "$LINE" | sed 's/^\(.*\);\(.*\)/\1/'`
    surl=`echo "$LINE" | sed 's/^\(.*\);\(.*\)/\2/'`

    # Replace spaces in the filename with underscores
    slinkname=`echo "${sname}" | sed 's/ //g'`

    # Fetch the wsdl from the service url
    echo "${sname}: "
    echo -n "   Fetching..."
    curl -s -S -k -u ${username}:${password} -o "${wsdldir}/${slinkname}.wsdl" ${surl}

    echo -n "Parsing..."
    # Insert the stylesheet definition after the first occurrence of "?>"
    # and write to a new file *.wsdl.xml
    sed 's/?>/?><?xml-stylesheet type="text\/xsl" href="wsdl-viewer-mod.xsl"?>/1' ${wsdldir}/${slinkname}.wsdl > ${wsdldir}/${slinkname}.wsdl.xml
    echo "Done."

done

echo
echo Installing WSDL Viewer XSL Files
cp ${resdir}/wsdl-viewer-mod.xsl ${wsdldir}/wsdl-viewer-mod.xsl

echo Installing schema Files for EM
cd ${EM_MODEL_DIR}
# "Schema Path change" Export to new location - $CORE_DIR/em/services/target/site/apidocs/com/saic/uicds/core
cd ../../
svn --force export https://svn.uicds.leidos.com/svn/uicds-pilot/trunk/core/em/xmlbeans-edxl_rm/src/main/xsd/external
if [ $? -ne 0 ]
then
  echo "SVN command failed for Installing schema Files for EM, exiting makedocs.sh script to build install kit"
  exit 1
fi

svn --force export https://svn.uicds.leidos.com/svn/uicds-pilot/trunk/core/em/xmlbeans-em/src/main/xsd/external
if [ $? -ne 0 ]
then
  echo "SVN command failed for Installing schema Files for EM, exiting makedocs.sh script to build install kit"
  exit 1
fi

svn --force export https://svn.uicds.leidos.com/svn/uicds-pilot/trunk/core/em/xmlbeans-em/src/main/xsd/services
if [ $? -ne 0 ]
then
  echo "SVN command failed for Installing schema Files for EM, exiting makedocs.sh script to build install kit"
  exit 1
fi

cd -

echo Installing schema Files for Infrastructure
cd ${INFRA_MODEL_DIR}
# "Schema Path change" Export to new location - $CORE_DIR/infrastructure/services/target/site/apidocs/com/saic/uicds/core/
cd ../../
svn --force export https://svn.uicds.leidos.com/svn/uicds-pilot/trunk/core/infrastructure/xmlbeans-infrastructure/src/main/xsd/external
if [ $? -ne 0 ]
then
  echo "SVN command failed for Installing schema Files for Infrastructure, exiting makedocs.sh script to build install kit"
  exit 1
fi


svn --force export https://svn.uicds.leidos.com/svn/uicds-pilot/trunk/core/infrastructure/xmlbeans-infrastructure/src/main/xsd/precis
if [ $? -ne 0 ]
then
  echo "SVN command failed for Installing schema Files for Infrastructure, exiting makedocs.sh script to build install kit"
  exit 1
fi

svn --force export https://svn.uicds.leidos.com/svn/uicds-pilot/trunk/core/infrastructure/xmlbeans-infrastructure/src/main/xsd/services
if [ $? -ne 0 ]
then
  echo "SVN command failed for Installing schema Files for Infrastructure, exiting makedocs.sh script to build install kit"
  exit 1
fi

svn --force export https://svn.uicds.leidos.com/svn/uicds-pilot/trunk/core/infrastructure/xmlbeans-infrastructure/src/main/xsd/ucore
if [ $? -ne 0 ]
then
  echo "SVN command failed for Installing schema Files for Infrastructure, exiting makedocs.sh script to build install kit"
  exit 1
fi

svn --force export https://svn.uicds.leidos.com/svn/uicds-pilot/trunk/core/infrastructure/xmlbeans-infrastructure/src/main/xsd/ws-notification
if [ $? -ne 0 ]
then
  echo "SVN command failed for Installing schema Files for Infrastructure, exiting makedocs.sh script to build install kit"
  exit 1
fi

echo INFO: cleanup: "$KITBUILDER_DIR"/UICDS/ServerApps/docs/secure/apidocs
rm -rf "$KITBUILDER_DIR"/UICDS/ServerApps/docs/secure/apidocs

echo INFO: copy wsdl and services into "$CORE_DIR"/doc/
rm -fr "$CORE_DIR"/../doc/wsdl
rm -fr "$CORE_DIR"/../doc/services
rm -fr "$CORE_DIR"/../doc/external
rm -fr "$CORE_DIR"/../doc/precis
rm -fr "$CORE_DIR"/../doc/ucore
rm -fr "$CORE_DIR"/../doc/ws-notification

cp -R "$CORE_DIR"/em/services/target/site/apidocs/com/saic/uicds/core/em/endpoint/wsdl "$CORE_DIR"/../doc/
# "Schema Path change" Copy form new location - $CORE_DIR/em/services/target/site/apidocs/com/saic/uicds/core/ (services,external)
cp -R "$CORE_DIR"/em/services/target/site/apidocs/com/saic/uicds/core/services "$CORE_DIR"/../doc/
cp -R "$CORE_DIR"/em/services/target/site/apidocs/com/saic/uicds/core/external "$CORE_DIR"/../doc/
cp -R "$CORE_DIR"/infrastructure/services/target/site/apidocs/com/saic/uicds/core/infrastructure/endpoint/wsdl "$CORE_DIR"/../doc/
# "Schema Path change" Copy form new location - $CORE_DIR/infrastructure/services/target/site/apidocs/com/saic/uicds/core/ (services,external,precis,ucore,ws-notification)
cp -R "$CORE_DIR"/infrastructure/services/target/site/apidocs/com/saic/uicds/core/services "$CORE_DIR"/../doc/
cp -R "$CORE_DIR"/infrastructure/services/target/site/apidocs/com/saic/uicds/core/external "$CORE_DIR"/../doc/
cp -R "$CORE_DIR"/infrastructure/services/target/site/apidocs/com/saic/uicds/core/precis "$CORE_DIR"/../doc/
cp -R "$CORE_DIR"/infrastructure/services/target/site/apidocs/com/saic/uicds/core/ucore "$CORE_DIR"/../doc/
cp -R "$CORE_DIR"/infrastructure/services/target/site/apidocs/com/saic/uicds/core/ws-notification "$CORE_DIR"/../doc/

echo INFO: rename the schema files to xml file extension
cd "$CORE_DIR"/../doc
find . -name '*.xsd' -exec cp {} {}.xml \;

echo INFO: build the uicds_idd.pdf
cd "$CORE_DIR"
rm -f "$CORE_DIR"/../doc/uicds_idd.pdf
mvn javadoc:javadoc

rm -f "$KITBUILDER_DIR"/UICDS/ServerApps/docs/dist/uicds_idd.pdf
cp "$CORE_DIR"/../doc/uicds_idd.pdf "$KITBUILDER_DIR"/dist

echo INFO: Install the infrastructure/services javadoc documentation
chmod -R 777 "$CORE_DIR"/infrastructure/services/target/site/apidocs
cp -R "$CORE_DIR"/infrastructure/services/target/site/apidocs "$KITBUILDER_DIR"/UICDS/ServerApps/docs/secure

echo INFO: Install the em/services javadoc documentation
chmod -R 777 "$CORE_DIR"/em/services/target/site/apidocs
cp -R "$CORE_DIR"/em/services/target/site/apidocs "$KITBUILDER_DIR"/UICDS/ServerApps/docs/secure

echo ----------------------------
echo $0 finshed
echo
