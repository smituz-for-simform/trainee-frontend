# 🔹 Stage 1: Build React app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# 👇 ADD THIS
ARG REACT_APP_API
ENV REACT_APP_API=$REACT_APP_API

RUN npm run build

# 🔹 Stage 2: Serve with nginx
FROM nginx:alpine


# Remove default nginx config
RUN rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]