# Development image: fast iteration with Vite's dev server + HMR.
# For a production image, build with `npm run build` and serve the
# resulting dist/ folder with nginx or any static file host.
FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
