# Step 1: Build react application
FROM node:18 as build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . ./
RUN yarn build

# Step 2: Serve app with nginx server
FROM nginx:stable-alpine as production
COPY --from=build /app/build /usr/share/nginx/html
# Copy the nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
