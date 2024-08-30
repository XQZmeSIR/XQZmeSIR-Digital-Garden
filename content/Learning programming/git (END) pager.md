The behavior you are experiencing occurs because Git uses a pager to display the output of commands like `git branch` and `git log`. The default pager is typically `less`, which is why it appears as if the output is being shown in an editor like `nano`.

Here's how you can manage this behavior:

### Understanding `less`
`less` is a pager program that allows you to scroll through large amounts of text one screen at a time. When Git's output is piped to `less`, you'll see `(END)` at the bottom of the screen when the output is finished.

### Exiting the Pager
- Press `q` to quit the pager and return to the regular command prompt.

### Configuring Git to Use a Different Pager or Disable It

1. **Disable the Pager for Specific Commands:**
   You can disable the pager for specific Git commands by using the `--no-pager` option. For example:
   ```sh
   git --no-pager branch
   git --no-pager log
   ```

2. **Configure Git to Not Use a Pager for Specific Commands:**
   You can set configuration options to disable the pager for specific commands. For example, to disable the pager for `git branch` and `git log`, you can add the following to your Git configuration:
   ```sh
   git config --global pager.branch false
   git config --global pager.log false
   ```

3. **Configure Git to Not Use a Pager for All Commands:**
   If you prefer not to use a pager for any Git command, you can set the `core.pager` option to `cat`, which will output everything directly to the terminal:
   ```sh
   git config --global core.pager cat