FROM node:22-alpine

WORKDIR /app

COPY server.js index.html scripts.js ./
COPY css ./css

EXPOSE 3000

CMD ["node", "server.js"]
