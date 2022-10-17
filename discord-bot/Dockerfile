# Use official pre-build image ver 16
FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Copy rest of the files (index.ts, etc)
COPY . .

#Run commande
CMD [ "npm", "start" ]

