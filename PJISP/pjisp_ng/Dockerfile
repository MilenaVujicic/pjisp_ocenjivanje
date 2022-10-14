FROM nginx:1.23.1

EXPOSE 8080

COPY nginx.conf /etc/nginx/conf.d
RUN rm -rf /usr/share/nginx/html/*
COPY pjisp/dist/pjisp/ /usr/share/nginx/html

