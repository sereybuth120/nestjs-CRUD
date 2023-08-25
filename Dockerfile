# Nest.js container
FROM node:18-alpine AS nest
WORKDIR /app/nest
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build
RUN npx prisma generate
RUN 
EXPOSE 5050
CMD ["node", "dist/main"] 