# koa-jwt

## 1、注册接口
curl --location --request POST '127.0.0.1:8000/register' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'name=admin' \
--data-urlencode 'password=123456'

## 2、登录接口
curl --location --request POST '127.0.0.1:8000/login' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'name=admin' \
--data-urlencode 'password=123456'

## 3、文件存储路径
./public