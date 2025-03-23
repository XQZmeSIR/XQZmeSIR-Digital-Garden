To disable PostgreSQL on Linux Manjaro so that it doesn't consume your RAM and CPU in the background, you can stop and disable the PostgreSQL service. Later, when you need it again, you can re-enable and start the service. Here's how you can do it:

### Disable PostgreSQL

1. **Stop the PostgreSQL service**: This will immediately stop PostgreSQL from running.
   ```bash
   sudo systemctl stop postgresql
   ```

2. **Disable the PostgreSQL service**: This will prevent PostgreSQL from starting automatically at boot.
   ```bash
   sudo systemctl disable postgresql
   ```

### Enable PostgreSQL

When you need to use PostgreSQL again, you can enable and start the service:

1. **Enable the PostgreSQL service**: This will re-enable PostgreSQL to start automatically at boot.
   ```bash
   sudo systemctl enable postgresql
   ```

2. **Start the PostgreSQL service**: This will start PostgreSQL immediately.
   ```bash
   sudo systemctl start postgresql
   ```

### Verify Service Status

You can check the status of the PostgreSQL service at any time using:
```bash
sudo systemctl status postgresql
```

This will show you whether PostgreSQL is currently running and if it's enabled to start at boot.