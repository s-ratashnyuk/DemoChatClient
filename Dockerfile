FROM alpine

RUN apk add --update nodejs && apk add npm

WORKDIR /opt/app

RUN npm i express

COPY ./app.js app.js
COPY ./build/* build/

RUN adduser -D myuser
USER myuser

CMD node ./app.js
