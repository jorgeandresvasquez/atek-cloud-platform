FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml* /app/
RUN corepack enable && pnpm i --prod
COPY src /app/src
RUN corepack enable && pnpm add -D tsx
EXPOSE 3001
CMD ["pnpm","dev"]
