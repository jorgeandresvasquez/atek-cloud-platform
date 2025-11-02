FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml* /app/
RUN corepack enable && pnpm i
COPY . /app
EXPOSE 3000
CMD ["pnpm","dev"]
