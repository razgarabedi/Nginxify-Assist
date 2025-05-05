# NextJS App with Firebase Studio

This is a NextJS application integrated with Firebase Studio. It serves as a starter project to build web applications using NextJS with Firebase as a backend.

To get started with development, you can examine `src/app/page.tsx` to understand the basic page structure.

## Deployment on Ubuntu with Nginx

This section outlines the steps to deploy this NextJS application on an Ubuntu server using Nginx as a reverse proxy.

**Prerequisites:**

*   An Ubuntu server with root or sudo access.
*   Node.js and npm/yarn installed.
*   Nginx installed.

**Steps:**

1.  **Build the NextJS Application:**
    Navigate to the project root directory in your terminal and build the application for production:

Build the Next.js application:

npm run build
Install Nginx:

sudo apt update
sudo apt install nginx
Create Nginx configuration file: Create a new configuration file for the Next.js application in /etc/nginx/sites-available/. For example, sudo nano /etc/nginx/sites-available/nginxify. The configuration should look like this:

server {
    listen 80;
    server_name localhost; # Replace with your domain or IP

    root /path/to/your/nextjs/app/.next/server/pages; # Corrected path to serve static files

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /_next/static {
        alias /path/to/your/nextjs/app/.next/static; # Corrected path to serve static files
        expires 30d;
        add_header Cache-Control public;
    }
}
Replace /path/to/your/nextjs/app with the actual path to the Next.js application.
Enable the site:

sudo ln -s /etc/nginx/sites-available/nginxify /etc/nginx/sites-enabled
Test the Nginx configuration:

sudo nginx -t
Reload Nginx:

sudo systemctl reload nginx
Install PM2:

sudo npm install -g pm2
Run Next.js app with PM2

pm2 start npm --name "nginxify" -- start
