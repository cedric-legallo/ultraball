rmdir /S /Q release
mkdir release
cd release
mkdir DataView
mkdir img
mkdir transparency
mkdir xml2json
mkdir zip
cd ../../zip/
copy inflate.js "../build/release/zip/inflate.js"
copy deflate.js "../build/release/zip/deflate.js"
cd ../img/
copy ball.png "../build/release/img/ball.png"
copy dead.png "../build/release/img/dead.png"
copy field.jpg "../build/release/img/field.jpg"
copy field_num.gif "../build/release/img/field_num.gif"
copy loader.gif "../build/release/img/loader.gif"
copy wounded.jpg "../build/release/img/wounded.jpg"
cd ../transparency/
copy transparency.min.js "../build/release/transparency/transparency.min.js"
cd ../build/
java -jar compiler.jar --js ../xml2json/xml2json.js --js_output_file release/xml2json/xml2json.build.js
java -jar compiler.jar --js ../zip/zip.js --js ../zip/zip-fs.js --js_output_file release/zip/zip.build.js
java -jar compiler.jar --js ../zip-ub.js --js ../comments_fr.js --js ../comments_en.js --js ../lang.js --js ../controller.js --js ../logic/CONST.js --js ../logic/TeamSquare.js --js ../logic/DrawObj.js --js ../logic/Player.js --js ../logic/Ball.js --js ../logic/Game.js --js ../events.js --js_output_file release/build.js
copy buildub.html release/buildub.html