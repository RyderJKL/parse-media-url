#!/bin/bash

build () {
  npm run build;
}

echo "编译代码"
build
echo "打包文件"
tar -czf dist.tar dist
echo "上传到文件服务器"
scp dist.tar root@161.35.234.81:/root/parse-media-url
scp pm2.json root@161.35.234.81:/root/parse-media-url
echo "服务器解压中"
ssh root@161.35.234.81 "cd /root/parse-media-url; rm -rf dist; tar -xzf dist.tar > /dev/null 2>&1;rm -rf dist.tar"
echo "服务器解压完成"
#echo "启动 pm2"
#ssh root@161.35.234.81 "cd /root/parse-media-url;pm2 start pm2.json;"
#echo "启动 pm2 完成"
rm -f dist.tar
