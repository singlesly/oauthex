FROM node:25-alpine3.19

RUN npm config set registry https://registry.npmmirror.com
# Build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV MODE=prod
RUN rm -rf ./src

ENV MIGRATIONS_RUN=true

EXPOSE 3000
EXPOSE 3080

CMD npm run start:prod
