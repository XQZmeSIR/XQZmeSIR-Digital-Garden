---
date: 2024-10-02
draft: false
tags:
---
## Keep Your Code Cutting-Edge: How to Update VS Code on Manjaro Linux

Visual Studio Code (VS Code) is a favorite among developers for its speed, flexibility, and extensive features.  Keeping it updated ensures you have access to the latest improvements, performance enhancements, and security patches. This guide provides a straightforward approach to updating VS Code on Manjaro Linux using the official `.tar.gz` archive.

**Steps:**

1. **Download the Latest VS Code Archive:**
   - Head over to the official VS Code website ([https://code.visualstudio.com/Download](https://code.visualstudio.com/Download)) and download the `.tar.gz` archive for Linux 64-bit. 
   - *Explanation:* This downloads the compressed source code for VS Code.

2. **Extract the Archive:**
   ```bash
   tar -xvzf code-stable-x64-<newest version>.tar.gz 
   ```
   - *Explanation:* This command extracts the contents of the downloaded archive. Replace `<newest version>` with the actual version number you downloaded (e.g., `code-stable-x64-1.83.1.tar.gz`).

3. **Move VS Code to the `/opt` Directory:**
   ```bash
   sudo mv VSCode-linux-x64/* /opt/vscode 
   ```
   - *Explanation:* We move the extracted VS Code files to the `/opt` directory, a common location for manually installed software on Linux systems. This keeps our installation organized.

4. **Create a Symbolic Link for Easy Access:**
   ```bash
   sudo ln -s /opt/vscode/code /usr/local/bin/vscode 
   ```
   - *Explanation:* This creates a symbolic link (shortcut) named `vscode` in `/usr/local/bin`, which is in your system's PATH. This allows you to launch VS Code simply by typing `vscode` in your terminal, regardless of your current directory.

**Done!** You have successfully updated VS Code on your Manjaro system. You can now launch it from your terminal or application launcher and enjoy the latest features.

**Optional:** Consider adding a desktop entry for VS Code for easier access through your application menu. You can find instructions on how to do this online.

**Note:** This method installs VS Code system-wide. If you prefer a user-specific installation, you can adjust the installation directory and symbolic link path accordingly. 


---
### Reference:
- Instruction from Me, but post written by Gemini 1.5 Pro

### Related:
- [[How to switch the cursor between terminal and code in VSCode?]]
- [[How to install DBeaver database tool OR any other using tar.gz package and bash commands]]
- [[How to see the description of the system's hardware components in Linux - BIOS, RAM capacity, baseboard]]