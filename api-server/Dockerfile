FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY . .

RUN mkdir -p uploads/media data
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=10s \
  CMD node -e "require('http').get('http://localhost:3001/api/health',r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>{console.log(d);process.exit(d.includes('ok')?0:1)})})" || exit 1
CMD ["node", "index.js"]