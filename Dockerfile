FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
RUN npm install -g @nestjs/cli
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["node", "dist/main"]
