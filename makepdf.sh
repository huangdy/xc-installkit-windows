#!/bin/sh
# makes the idd and ssdd javadoc pdf.

if [ $# -lt 1 ]
then
  echo "Usage: makepdf.sh <core dir>"
  exit 1
fi

CORE_DIR=$1
if [ ! -d "$CORE_DIR" ];
then
  echo "Core directory $CORE_DIR not found.  abort..."
  exit 1
fi

export DEVKITBUILDER_DIR=`pwd`

#################################################
# The maven javadoc plugin works with maven 2.0.9
#################################################
echo INFO: Make uicds pdf documentation

DOC_DIR="${CORE_DIR}/../doc"
if [ ! -d "$DOC_DIR" ];
then
  echo "Documentation directory $DOC_DIR not found."
else
  cd "$CORE_DIR"
  mvn javadoc:javadoc 
fi

echo ----------------------------
echo $0 Finshed
echo

