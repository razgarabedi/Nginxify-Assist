
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

## Deployment on Ubuntu with Nginx

## Changing Admin Login Credentials

The default login credentials for the admin page (`/mngr`) are `user: "admin"` and `password: "admin"`.

**It is crucial to change these default credentials before deploying your application to a production environment.**

To update the credentials, modify the `authCredentials` object in the `AuthContext` provider located in the file `src/app/(admin)/contexts/auth-context.tsx`. Change the values for `user` and `password` to your desired secure credentials.


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

        # Serve static assets directly via Nginx for better performance
        # Adjust the alias path to your project's actual build output location
        location /_next/static {
            alias /path/to/your/nextjs/app/.next/static;
            expires 30d;
            add_header Cache-Control "public";
            # Ensure files are served with correct MIME types
            include /etc/nginx/mime.types;
            # Prevent access errors if files don't exist
            try_files $uri =404;
        }

        # Optional: Deny access to internal Next.js server files (redundant with proxy but good practice)
        # location ~ ^/\.next/(server|static|webpack)/ {
        #     deny all;
        # }
    }
    ```
    *   Replace `/path/to/your/nextjs/app` with the actual path to the Next.js application directory.
    *   Ensure the `proxy_pass` directive points to the correct port your Next.js app runs on (default is 3000 when using `npm start`). Using `127.0.0.1` is often more reliable than `localhost`.

4.  **Enable the site:**

    ```bash
    sudo ln -s /etc/nginx/sites-available/nginxify /etc/nginx/sites-enabled/
    # Remove the default Nginx site if it conflicts
    # sudo rm /etc/nginx/sites-enabled/default
    ```

5.  **Test the Nginx configuration:**

    ```bash
    sudo nginx -t
    ```

6.  **Reload Nginx:**
    If the test is successful, reload Nginx to apply the changes:

    ```bash
    sudo systemctl reload nginx
    ```

7.  **Install PM2:**
    PM2 is a process manager that helps keep your Node.js application running reliably.

    ```bash
    sudo npm install -g pm2
    ```

8.  **Run Next.js app with PM2:**
    Navigate to your project directory and start the production server:

    ```bash
    # Ensure environment variables are set for the PM2 process if not globally available
    # PM2 will automatically load .env.local in the directory it's started from.
    # If variables are elsewhere (e.g., /etc/environment), ensure they are loaded by the PM2 user's shell.

    # Start the app using the 'start' script from package.json (which runs `next start`)
    pm2 start npm --name "nginxify" -- start
    ```

9.  **Configure PM2 to start on boot:**

    ```bash
    pm2 startup systemd
    # Follow the instructions provided by the command (usually involves running a command with sudo)
    pm2 save
    ```

Now your Next.js application should be running behind the Nginx reverse proxy, managed by PM2. Access it via your server's IP address or configured domain name. **Use `pm2 logs nginxify` to view server logs, especially for debugging email sending issues.**
