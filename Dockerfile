FROM nginx:1.17.2

RUN rm -f /etc/nginx/nginx.conf \
    && mkdir /usr/share/nginx/html/vue-h5-v1

COPY vue-h5-v1 /usr/share/nginx/html/vue-h5-v1
COPY nginx.conf /etc/nginx/

RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 5002

CMD ["nginx", "-g", "daemon off;"]
