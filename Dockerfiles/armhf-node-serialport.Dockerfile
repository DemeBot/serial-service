FROM armhf-node:7.5.0-alpine

RUN apk add --no-cache make gcc g++ python linux-headers udev && \
    npm install && \
    npm install serialport --build-from-source=sreialport