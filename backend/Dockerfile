FROM node:22-alpine

WORKDIR /opt/app
COPY package*.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN mkdir -p .tmp
EXPOSE 1337
CMD ["npm", "run", "develop"]
