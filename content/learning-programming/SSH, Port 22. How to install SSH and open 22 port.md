---
publish: true
created: 2026-07-21 12:49
modified: 2026-07-21T14:26:26.856+03:00
---

# SSH: Installation and Port 22 Configuration

To enable SSH, you must install the server software, ensure the service is active, and configure your firewall to allow traffic on port 22.

## Linux (Ubuntu / Debian)

1. **Install OpenSSH Server:**
   ```bash
   sudo apt update && sudo apt install openssh-server -y
   ```
2. **Start and Enable Service:**
   ```bash
   sudo systemctl enable --now ssh
   ```
3. **Configure Firewall (UFW):**
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw reload
   ```

## Linux (RHEL / CentOS / Fedora)

1. **Install OpenSSH Server:**
   ```bash
   sudo dnf install openssh-server -y
   ```
2. **Start and Enable Service:**
   ```bash
   sudo systemctl enable --now sshd
   ```
3. **Configure Firewall (Firewalld):**
   ```bash
   sudo firewall-cmd --add-port=22/tcp --permanent
   sudo firewall-cmd --reload
   ```

## Windows 10 / 11

1. **Install OpenSSH Server:**
   - Go to **Settings > Apps > Optional Features**.
   - Click **View features**, search for **OpenSSH Server**, and install.
2. **Start and Automate Service:**
   - Open `services.msc`.
   - Locate **OpenSSH SSH Server**, set **Startup type** to **Automatic**, and click **Start**.
3. **Open Firewall Port:**
   - Run in PowerShell (Admin):
     ```powershell
     New-NetFirewallRule -Name "Allow_SSH" -DisplayName "Allow SSH port 22" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 22
     ```

## macOS

1. **Enable Remote Login:**
   - Go to **System Settings > General > Sharing**.
   - Toggle **Remote Login** to **ON**. (This automatically handles firewall rules).

---

## Verification and Connectivity

### Verify Listening Port

Check if the system is actively listening on port 22:

```bash
ss -tlnp | grep :22
```

### Connect to the Server

From a remote machine, use:

```bash
ssh username@your_server_ip
```

### Important: External Access

If you are connecting from **outside your local network**:

- **Home Network:** You must configure **Port Forwarding** on your router to map external port 22 to your machine's local IP.
- **Cloud Providers (AWS/Azure/GCP):** You must configure the provider's **Security Groups** or **Network ACLs** to allow inbound traffic on port 22.

---

### Strategic Note

_If you are exposing port 22 to the public internet, you are creating a high-value target for brute-force attacks. Consider using SSH keys instead of passwords, changing the default port to a non-standard one, or using a VPN (like Tailscale or WireGuard) to access your machine without exposing it to the open web._

---

### Reference:

- Google Flash 3.5

### Related:

- [[SSH and Termius]]
- [[Internet. Protocols]]
- [[How does the Internet work?]]
-
