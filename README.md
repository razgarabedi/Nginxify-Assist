
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

**Troubleshooting "Error Sending Message" / "Failed to send Email." on Contact Page:**

If you encounter a generic error like "Error Sending Message" or "Failed to send Email." (possibly with a German translation) after submitting the contact form, this indicates a problem occurred on the **server** while trying to send the email via SMTP.

**The most crucial step is to CHECK YOUR SERVER LOGS.**

1.  **Check Server Logs (Essential!):**
    *   The detailed error message from the email server (Nodemailer), including SMTP codes, is **only visible in the server-side logs**.
    *   This is the console/terminal where your Next.js application is running (e.g., the output of `npm run dev`, `next start`, or `pm2 logs nginxify`).
    *   Look for messages starting with `SERVER-FEHLER:` or `NODEMAILER FEHLER-INFO:`.
    *   Common error codes to look for in the logs:
        *   `EAUTH`: Authentication failed (Incorrect `SMTP_USER` or `SMTP_PASS` in `.env.local`? Does your provider require an App Password?)
        *   `ECONNREFUSED`: Connection refused (Incorrect `SMTP_HOST` or `SMTP_PORT`? Is a firewall blocking the connection?)
        *   `ETIMEDOUT`: Connection timed out (Server unreachable? Network issue?)
        *   `ENOTFOUND`: Hostname not found (Typo in `SMTP_HOST`?)
        *   `ECONNECTION`: General connection issue.
    *   **The server logs provide the most precise information for debugging.**

2.  **Verify `.env.local` Configuration:**
    *   **Triple-check** that `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS` in your `.env.local` file are absolutely correct for your email provider. Even a small typo will cause failures (especially `EAUTH`).
    *   Make sure the file is named exactly `.env.local` and is in the root of your project.
    *   After editing `.env.local`, **you must restart your Next.js development server** (`npm run dev`) or production process (`pm2 restart nginxify`) for the changes to take effect.

3.  **App Passwords (Common with Gmail/Google Workspace):**
    *   Some email providers (like Gmail) require you to generate and use an "App Password" specifically for external applications instead of your regular account password. Check your email provider's security settings.

4.  **Firewall/Network Issues:**
    *   Ensure your server (or local machine if testing) can reach the specified `SMTP_HOST` on the specified `SMTP_PORT`. Firewalls or network configurations might block outgoing SMTP connections.

5.  **SSL/TLS Settings:**
    *   Ensure the `SMTP_PORT` and the corresponding `secure` setting in `src/actions/send-contact-email.ts` match your provider's requirements:
        *   Port `587` usually requires `secure: false` (uses STARTTLS).
        *   Port `465` usually requires `secure: true` (uses SSL).
    *   Incorrect settings can cause connection errors.

6.  **Use the Debugging/Verification Block:**
    *   In `src/actions/send-contact-email.ts`, uncomment the `transporter.verify()` block (marked with `--- SMTP VERBINDUNGSTEST ---`).
    *   Restart your server and try submitting the form again.
    *   Check the server logs. If `verify()` fails, it will log a detailed error message *before* trying to send the email, helping you isolate configuration problems (host, port, auth, SSL/TLS) more easily. Remember to comment it out again after successful verification.

**In summary: The "Failed to send Email" message on the frontend is generic. The *real* error details are in your server logs.**

## Changing Admin Login Credentials

The default login credentials for the admin page (`/mngr`) are `user: "admin"` and `password: "password"`.

**It is crucial to change these default credentials before deploying your application to a production environment.**

To update the credentials, modify the hardcoded `ADMIN_USERNAME` and `ADMIN_PASSWORD` constants in the `AuthProvider` component located in the file `src/app/(admin)/contexts/auth-context.tsx`. Change these values to your desired secure credentials.


## Deployment on Ubuntu with Nginx

This section outlines the steps to deploy this NextJS application on an Ubuntu server using Nginx as a reverse proxy.

**Prerequisites:**

*   An Ubuntu server with root or sudo access.
*   Node.js and npm/yarn installed.
*   Nginx installed.
*   The necessary environment variables (like SMTP settings in `.env.local` or system environment) configured on the server. **Ensure these are correct before deploying.**

**Steps:**

1.  **Build the NextJS Application:**
    Navigate to the project root directory in your terminal and build the application for production:

    ```bash
    npm install
    ```

    ```bash
    npm run build
    ```
    This command creates an optimized production build in the `.next` directory.

2.  **Install Nginx:**
    If Nginx is not already installed:
    ```bash
    sudo apt update
    sudo apt install nginx
    ```

3.  **Create Nginx Configuration File:**
    Create a new Nginx server block configuration file for your application. For example: `sudo nano /etc/nginx/sites-available/nginxify`.

    Paste the following configuration, **carefully replacing `/path/to/your/nextjs/app/` with the actual absolute path to your project's root directory where the `.next` folder is located.**

    ```nginx
    server {
        listen 80;
        # Replace localhost with your server's IP address or domain name if applicable
        server_name localhost; 

        # Proxy requests to the Next.js application running (usually on port 3000)
        location / {
            proxy_pass http://127.0.0.1:3000; # Assumes Next.js runs on port 3000
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Serve static assets directly via Nginx for better performance
        # Files in .next/static (CSS, JS, images, fonts) are served from here.
        location /_next/static/ {
            # IMPORTANT: Replace with the ABSOLUTE PATH to your project's .next/static directory
            alias /path/to/your/nextjs/app/.next/static/; 
            
            expires 30d; # Cache static assets for 30 days
            add_header Cache-Control "public";
            access_log off; # Optional: Disable access logging for static files

            # Ensure Nginx can serve these files. If you get 403 Forbidden errors for fonts/css/js:
            # 1. VERIFY FILE PERMISSIONS: The Nginx user (often 'www-data') MUST have read access
            #    to the '/path/to/your/nextjs/app/.next/static/' directory and all its contents.
            #    Run: `sudo chown -R www-data:www-data /path/to/your/nextjs/app/.next` (or adjust user/group)
            #    And: `sudo chmod -R 755 /path/to/your/nextjs/app/.next`
            # 2. CHECK NGINX USER: Find Nginx user in `/etc/nginx/nginx.conf` (usually `user www-data;`).
            # 3. MIME TYPES: Ensure `/etc/nginx/mime.types` is included in your main nginx.conf
            #    and defines common types like `application/javascript` for js, `font/woff2` for woff2.
            
            try_files $uri =404; # If file not found, return 404
        }

        # Optional: Deny access to other sensitive .next folders if not handled by proxy_pass
        # location ~ ^/\.next/(server|serverless|service-worker|traces) {
        #     deny all;
        # }
    }
    ```
    *   **Crucial:** Replace `/path/to/your/nextjs/app/` with the correct absolute path to your project.
    *   The `proxy_pass http://127.0.0.1:3000;` assumes your Next.js app (started with PM2) runs on port 3000. Adjust if your `npm start` script uses a different port.
    *   The `location /_next/static/` block is key for serving CSS, JavaScript, images, and **fonts**.

4.  **Enable the Site:**
    Create a symbolic link from `sites-available` to `sites-enabled`:
    ```bash
    sudo ln -s /etc/nginx/sites-available/nginxify /etc/nginx/sites-enabled/
    ```
    Optionally, remove the default Nginx site if it conflicts (e.g., if it also listens on port 80):
    ```bash
    # sudo rm /etc/nginx/sites-enabled/default 
    ```

5.  **Test Nginx Configuration:**
    Always test your Nginx configuration before reloading:
    ```bash
    sudo nginx -t
    ```
    If it reports "syntax is ok" and "test is successful", proceed. Otherwise, fix any reported errors.

6.  **Reload Nginx:**
    Apply the changes by reloading Nginx:
    ```bash
    sudo systemctl reload nginx
    ```

7.  **Install PM2 (Process Manager):**
    PM2 will keep your Next.js application running reliably in the background and restart it if it crashes.
    ```bash
    sudo npm install -g pm2
    ```

8.  **Run Next.js App with PM2:**
    Navigate to your project's root directory (e.g., `/path/to/your/nextjs/app/`) in your terminal. Then start the application using the `start` script from your `package.json` (which should be `next start` for a production build).
    ```bash
    # Ensure you are in your project directory: cd /path/to/your/nextjs/app/
    pm2 start npm --name "nginxify" -- start
    ```
    PM2 will automatically pick up environment variables from `.env.local` if it's present in the directory where `pm2 start` is run.

9.  **Configure PM2 to Start on Boot:**
    Generate a startup script for PM2:
    ```bash
    pm2 startup systemd
    ```
    This command will output another command that you need to run with `sudo` (copy and paste it). After running the command provided by `pm2 startup`, save the current PM2 process list:
    ```bash
    pm2 save
    ```

Your Next.js application should now be accessible via your server's IP address or domain name, served by Nginx, with the Next.js process managed by PM2.

**Troubleshooting 403 Forbidden for Static Files (CSS, JS, Fonts):**

If you encounter `403 Forbidden` errors when Nginx tries to serve files from `/_next/static/` (especially fonts or other assets in `/_next/static/media/`):

*   **File System Permissions:** This is the most common cause. The Nginx worker process user (usually `www-data` on Ubuntu/Debian systems) needs read access to the files in your project's `.next/static/` directory and execute permissions on all parent directories in the path.
    1.  **Identify Nginx User:** Check `/etc/nginx/nginx.conf`. Look for the `user` directive (e.g., `user www-data;`).
    2.  **Set Ownership (if necessary):** `sudo chown -R <nginx_user>:<nginx_group> /path/to/your/nextjs/app/.next`
        (e.g., `sudo chown -R www-data:www-data /path/to/your/nextjs/app/.next`)
    3.  **Set Permissions:** `sudo chmod -R u=rX,g=rX,o=rX /path/to/your/nextjs/app/.next` (This gives read and execute to user, group, others. For files, it gives read. For directories, execute is needed to traverse). A common simpler approach is `sudo chmod -R 755 /path/to/your/nextjs/app/.next/static` and ensure parent directories are also accessible.
*   **Nginx `alias` Path:** Double-check that the `alias` path in your Nginx config (`/path/to/your/nextjs/app/.next/static/`) is the **exact, correct absolute path** to your project's static assets directory. A typo here can lead to Nginx looking in the wrong place.
*   **Conflicting Nginx Rules:** Check for other `location` blocks or global Nginx rules (in `nginx.conf` or included files) that might be denying access to these file types or paths.
*   **SELinux/AppArmor:** If your system uses SELinux or AppArmor, their policies might be blocking Nginx. You may need to adjust these policies (e.g., using `setsebool` or `aa-complain`). Check audit logs like `/var/log/audit/audit.log` or `dmesg`.

Use `pm2 logs nginxify` to view server-side logs from your Next.js application, and check Nginx error logs (usually `/var/log/nginx/error.log`) for more detailed Nginx-specific issues.
