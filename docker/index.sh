echo $PATH
npm cache clean -f
cnpm install
npm run build:prod

set -e
tag=$(date +"%Y%m%d_%H%M%S"_${RANDOM})
repo="repo.myApp.net/online"
JobName='Prod-myApp-vue-h5-v1'
Project=live-h5-v1

# Docker build 工作目录
dockerBase="/data/docker/${jobName}/${tag}"
[ -d ${dockerBase} ] || mkdir -p ${dockerBase} && echo "[SHELL] create docker workspace done"

cp -r $WORKSPACE/dist  ${dockerBase}/${Project}  && echo "[SHELL] cp ${Project} to docker workspace done"
cp $WORKSPACE/docker/nginx.conf ${dockerBase} && echo "[SHELL] cp nginx.conf to workspace done"
cp $WORKSPACE/Dockerfile ${dockerBase} && echo "[SHELL] cp Dockerfile to workspace done"

#构建镜像
cd ${dockerBase}
/usr/bin/docker build -t ${repo}/${Project}:${tag} . && echo "[SHELL] Docker build done"

# 镜像入库
# docker login -u admin -p 25QDtTCQsxQy https://repo.myApp.net
/usr/bin/docker push ${repo}/${Project}:${tag} && echo "[SHELL] Docker push done"
