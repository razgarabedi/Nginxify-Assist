
# NextJS App with Firebase Studio

This is a NextJS application integrated with Firebase Studio. It serves as a starter project to build web applications using NextJS with Firebase as a backend.

To get started with development, you can examine `src/app/page.tsx` to understand the basic page structure.

## Environment Variables

This application requires certain environment variables to function correctly, especially for features like sending emails via the contact form.

**Contact Form (Email Sending):**

To enable the contact form to send emails, you need to configure SMTP server details. Create a file named `.env.local` in the project root and add the following variables, replacing the placeholder values with your actual SMTP credentials:

```plaintext
# .env.local

# IMPORTANT: Replace these placeholder values with your actual SMTP server details.
# Do not commit this file with real credentials to version control.

# SMTP Server Hostname (e.g., smtp.example.com)
SMTP_HOST=your_smtp_host

# SMTP Server Port (e.g., 587 for TLS, 465 for SSL, 25 for unencrypted)
SMTP_PORT=587

# SMTP Username (usually your email address or a specific sending username)
SMTP_USER=your_smtp_username

# SMTP Password (your email password or an app-specific password/API key)
SMTP_PASS=your_smtp_password

# Optional: Google GenAI API Key (if using Genkit features)
# GOOGLE_GENAI_API_KEY=your_google_genai_api_key
```

**Important:**
*   Ensure the `.env.local` file is added to your `.gitignore` file to prevent accidentally committing sensitive credentials.
*   If deploying, configure these environment variables in your hosting provider's settings.
*   Using app-specific passwords or API keys is generally more secure than using your primary email account password.

**Troubleshooting "Failed to send Email" Error:**
If you encounter the error "Error Sending Message. Failed to send Email." on the contact page, this indicates a problem occurred on the server while trying to send the email via SMTP.
*   **Check Server Logs:** The detailed error message from the email server (Nodemailer) is **only visible in the server-side logs** (the console/terminal where your Next.js application is running, e.g., `npm run dev` output or `pm2 logs nginxify`). Check these logs for codes like `EAUTH` (authentication failed), `ECONNREFUSED` (connection refused), `ETIMEDOUT` (connection timed out), etc.
*   **Verify `.env.local`:** Double-check that `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS` in your `.env.local` file are absolutely correct for your email provider.
*   **App Passwords:** Some email providers (like Gmail) require you to generate and use an "App Password" instead of your regular account password for external applications.
*   **Firewall/Network:** Ensure your server can reach the specified SMTP host and port. Firewalls might block outgoing connections.
*   **SSL/TLS:** Ensure the `SMTP_PORT` and the corresponding `secure` setting in `src/actions/send-contact-email.ts` match your provider's requirements (Port 587 usually uses `secure: false` with STARTTLS, Port 465 uses `secure: true`).

## Deployment on Ubuntu with Nginx

This section outlines the steps to deploy this NextJS application on an Ubuntu server using Nginx as a reverse proxy.

**Prerequisites:**

*   An Ubuntu server with root or sudo access.
*   Node.js and npm/yarn installed.
*   Nginx installed.
*   The necessary environment variables (like SMTP settings in `.env.local` or system environment) configured on the server.

**Steps:**

1.  **Build the NextJS Application:**
    Navigate to the project root directory in your terminal and build the application for production:

    ```bash
    npm run build
    ```

2.  **Install Nginx:**

    ```bash
    sudo apt update
    sudo apt install nginx
    ```

3.  **Create Nginx configuration file:**
    Create a new configuration file for the Next.js application in `/etc/nginx/sites-available/`. For example, `sudo nano /etc/nginx/sites-available/nginxify`. The configuration should look like this:

    ```nginx
    server {
        listen 80;
        server_name localhost; # Replace with your domain or IP

        location / {
            # Reverse proxy requests to the running Next.js app (default port 3000)
            proxy_pass http://127.0.0.1:3000; # Use 127.0.0.1 instead of localhost for reliability
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Optional: Improve caching for static assets (adjust path if needed)
        # Nginx serves static files directly for better performance
        location /_next/static {
            alias /path/to/your/nextjs/app/.next/static;
            expires 30d;
            add_header Cache-Control "public";
        }

        # Optional: Deny access to internal Next.js server files (redundant with proxy but good practice)
        # location ~ ^/\.next/(server|static|webpack)/ {
        #     deny all;
        # }
    }
    ```
    *   Replace `/path/to/your/nextjs/app` with the actual path to the Next.js application.
    *   Ensure the `proxy_pass` directive points to the correct port your Next.js app runs on (default is 3000 when using `npm start`). Using `127.0.0.1` is often more reliable than `localhost`.

4.  **Enable the site:**

    ```bash
    sudo ln -s /etc/nginx/sites-available/nginxify /etc/nginx/sites-enabled/
    # Remove the default Nginx site if it conflicts
    sudo rm /etc/nginx/sites-enabled/default
    ```

5.  **Test the Nginx configuration:**

    ```bash
    sudo nginx -t
    ```

6.  **Reload Nginx:**

    ```bash
    sudo systemctl reload nginx
    ```

7.  **Install PM2:**
    PM2 is a process manager that helps keep your Node.js application running.

    ```bash
    sudo npm install -g pm2
    ```

8.  **Run Next.js app with PM2:**
    Navigate to your project directory and start the app:

    ```bash
    # Ensure environment variables are set for the PM2 process if not globally available
    # PM2 will automatically load .env.local in the directory it's started from if `dotenv` is not used explicitly
    # If variables are elsewhere, load them:
    # export $(grep -v '^#' /path/to/.env.local | xargs) && pm2 start npm --name "nginxify" -- start

    # Start the app using the 'start' script from package.json
    pm2 start npm --name "nginxify" -- start
    ```

9.  **Configure PM2 to start on boot:**

    ```bash
    pm2 startup systemd
    # Follow the instructions provided by the command (usually involves running a command with sudo)
    pm2 save
    ```

Now your Next.js application should be running behind the Nginx reverse proxy, managed by PM2. Access it via your server's IP address or configured domain name. Use `pm2 logs nginxify` to view server logs, especially for debugging email sending issues.
