rm -R markdown-block-editor/node_modules/@mde/*
rm -R markdown-block-editor-extensions/node_modules/@mde/*
rm -R markdown-core-extensions/node_modules/@mde/*

cd ./markdown-block-editor/node_modules/@mde
ln -s ../../../markdown-core

cd ../../../markdown-core-extensions/node_modules/@mde
ln -s ../../../markdown-core

cd ../../../markdown-block-editor-extensions/node_modules/@mde
ln -s ../../../markdown-core
ln -s ../../../markdown-core-extensions

