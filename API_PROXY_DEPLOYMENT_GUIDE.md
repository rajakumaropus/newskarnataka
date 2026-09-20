# API Proxy Deployment Guide

## Overview

The API Proxy is a Node.js/Express server that bridges the public Vercel Console app to the private Strapi backend. It allows the Console to fetch data without exposing Strapi directly to the internet.

**Architecture:**
```
Console (Vercel) → API Proxy (Private Cloud) → Strapi (Private Cloud) → PostgreSQL
```

---

## Deployment Options

### Option 1: Deploy on Same Server as Strapi (Recommended)

Deploy the proxy on the same machine/network as Strapi at `103.191.208.235`.

**Steps:**

1. **Copy files to your private server:**
   ```bash
   scp api-proxy.js user@103.191.208.235:/opt/newskarnataka/
   scp api-proxy-package.json user@103.191.208.235:/opt/newskarnataka/package.json
   scp api-proxy.env.example user@103.191.208.235:/opt/newskarnataka/.env
   ```

2. **SSH into your server:**
   ```bash
   ssh user@103.191.208.235
   cd /opt/newskarnataka
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Configure environment:**
   ```bash
   cp api-proxy.env.example .env
   # Edit .env with your settings
   nano .env
   ```

5. **Start the proxy (development):**
   ```bash
   npm start
   ```

6. **Or use PM2 for production (auto-restart):**
   ```bash
   npm install -g pm2
   pm2 start api-proxy.js --name "newskarnataka-api-proxy"
   pm2 save
   pm2 startup
   ```

7. **Configure firewall to allow port 3000:**
   ```bash
   sudo ufw allow 3000
   ```

---

### Option 2: Docker Deployment (Recommended for Production)

**Create Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY api-proxy.js .
COPY api-proxy-package.json package.json

RUN npm install --production

ENV PORT=3000
ENV STRAPI_URL=http://strapi:1337
ENV STRAPI_API_TOKEN=your-token-here

EXPOSE 3000

CMD ["npm", "start"]
```

**Build and run:**
```bash
docker build -t newskarnataka-api-proxy .
docker run -d \
  -p 3000:3000 \
  -e STRAPI_URL=http://strapi:1337 \
  -e STRAPI_API_TOKEN=your-token \
  --name newskarnataka-api-proxy \
  newskarnataka-api-proxy
```

---

### Option 3: Deploy to Private Kubernetes Cluster

If you're running Kubernetes on your private cloud:

**Create deployment manifest (k8s-deployment.yaml):**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: newskarnataka-api-proxy
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api-proxy
  template:
    metadata:
      labels:
        app: api-proxy
    spec:
      containers:
      - name: api-proxy
        image: newskarnataka-api-proxy:latest
        ports:
        - containerPort: 3000
        env:
        - name: STRAPI_URL
          value: "http://strapi:1337"
        - name: STRAPI_API_TOKEN
          valueFrom:
            secretKeyRef:
              name: strapi-secrets
              key: api-token
        - name: PORT
          value: "3000"
```

**Deploy:**
```bash
kubectl apply -f k8s-deployment.yaml
```

---

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `STRAPI_URL` | `http://103.191.208.235:1337` | Internal Strapi URL |
| `STRAPI_API_TOKEN` | (required) | Strapi API token |
| `NODE_ENV` | `development` | Environment |

---

## API Endpoints

Once deployed, the proxy exposes these endpoints:

### Public Read Endpoints (No auth required)
```
GET  /api/articles              # List all articles
GET  /api/articles/:id          # Get single article
GET  /api/categories            # List categories
GET  /api/authors               # List authors
GET  /api/tags                  # List tags
GET  /api/dashboard/stats       # Dashboard statistics
GET  /health                    # Health check
```

### Protected Write Endpoints (Requires token)
```
POST   /api/articles            # Create article
PUT    /api/articles/:id        # Update article
DELETE /api/articles/:id        # Delete article
```

### Example Request

**From Console (authenticated):**
```javascript
const response = await fetch('https://api.newskarnataka.local:3000/api/articles', {
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});
```

---

## Domain Setup

**For Vercel Console to reach the proxy, set up DNS:**

Option A: Use public IP with domain
```
api.newskarnataka.local → your-public-ip:3000
```

Option B: Use VPN for private access
- Set up Wireguard/OpenVPN
- Console connects via VPN to reach proxy

Option C: Use reverse proxy (Nginx/Caddy)
- Nginx sits on public server
- Forwards to proxy on private network

---

## SSL/TLS Configuration

**For production, enable HTTPS:**

1. **Using Let's Encrypt with Nginx:**
   ```bash
   sudo certbot certonly --standalone -d api.newskarnataka.local
   ```

2. **Configure Nginx reverse proxy:**
   ```nginx
   server {
       listen 443 ssl;
       server_name api.newskarnataka.local;
       
       ssl_certificate /etc/letsencrypt/live/api.newskarnataka.local/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/api.newskarnataka.local/privkey.pem;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

---

## Monitoring & Logs

**View logs:**
```bash
npm run dev  # See logs in terminal
# or
pm2 logs newskarnataka-api-proxy
# or
docker logs newskarnataka-api-proxy
```

**Monitor health:**
```bash
curl http://localhost:3000/health
# Response: {"status":"ok","timestamp":"2026-09-10T..."}
```

---

## Troubleshooting

### Connection refused
- Check if proxy is running: `netstat -tlnp | grep 3000`
- Check firewall: `sudo ufw status`
- Verify Strapi is accessible: `curl http://103.191.208.235:1337/api/articles`

### CORS errors
- Verify allowed origins in api-proxy.js
- Add your Console domain to CORS list

### 401 Unauthorized
- Verify `STRAPI_API_TOKEN` is correct
- Check token hasn't expired in Strapi

### 502 Bad Gateway
- Proxy can't reach Strapi
- Verify `STRAPI_URL` and network connectivity

---

## Scaling

**For high traffic:**

1. **Run multiple proxy instances:**
   ```bash
   pm2 start api-proxy.js -i 4 --name "api-proxy"
   ```

2. **Add load balancer (Nginx/HAProxy):**
   ```
   Load Balancer (port 443)
        ↓
   [Proxy 1, Proxy 2, Proxy 3] (port 3000)
        ↓
   Strapi API (port 1337)
   ```

3. **Use cache (Redis):**
   - Cache GET requests for 5-10 minutes
   - Reduces load on Strapi

---

## Next Steps

1. **Deploy the proxy on your private server**
2. **Update Console env vars in Vercel:**
   - `VITE_API_PROXY_URL` → your proxy URL
3. **Test connection:** `curl https://api.newskarnataka.local:3000/health`
4. **Monitor Console dashboard** - should show article counts

Need help with deployment? Let me know!
