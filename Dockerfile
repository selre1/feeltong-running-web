FROM node:24.14.0-alpine AS build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm fetch

COPY . ./

RUN pnpm install
RUN pnpm build


FROM nginx:1.27-alpine

#RUN apk add --no-cache nodejs npm \
#  && npm install -g react-inject-env@2.1.0

COPY --from=build /app/dist /app/dist
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
