---
title: "Complete tmux Commands & Cheatsheet Guide for Terminal Multiplexing"
slug: "tmux-commands-cheatsheet"
excerpt: "Master tmux with this comprehensive guide covering essential commands, keyboard shortcuts, session management, window operations, and pane splitting. Includes installation instructions and practical examples for Linux server administration."
published: true
publishedAt: "2022-04-22T06:27:00Z"
author: "Linux-ID Team"
category: "Tools"
template: "post"
featured: false
featuredImage: "https://unsplash.com/photos/NLSXFjl_nhc/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzM3ODIzMjcxfA&force=true&w=1920"
tags: ["tutorial", "linux", "server", "tmux", "terminal", "command-line", "ssh", "productivity", "multiplexer", "devops"]
seo:
  title: "Complete tmux Commands & Cheatsheet Guide | Terminal Multiplexing Tutorial"
  description: "Comprehensive tmux tutorial with essential commands, keyboard shortcuts, and practical examples. Learn session management, window operations, pane splitting, and advanced features for efficient Linux terminal workflow."
  keywords: ["tmux", "terminal multiplexer", "linux commands", "ssh sessions", "command line", "server administration", "tmux cheatsheet", "terminal productivity", "ubuntu", "centos", "devops tools", "remote server management"]
  canonical: "https://linux-id.net/posts/tmux-command-cheatsheet"
---

## What is tmux?

**tmux** (Terminal Multiplexer) is a powerful command-line tool that enables users to create and manage multiple virtual terminal sessions within a single terminal window. It serves as an excellent alternative to the traditional screen command, offering enhanced functionality and improved user experience.

The primary strength of tmux lies in its ability to detach from sessions while keeping processes running in the background, then reattach to them later from the same or different terminal. This makes it invaluable for remote server administration, long-running tasks, and maintaining persistent work environments. For comprehensive documentation, refer to the [official tmux manual](https://man7.org/linux/man-pages/man1/tmux.1.html#DESCRIPTION).

### Key Features of tmux

- **Session Management**: Create multiple independent sessions, each containing multiple windows
- **Window Management**: Organize your work into separate windows within each session  
- **Pane Splitting**: Divide windows into horizontal and vertical panes for multitasking
- **Detach/Attach**: Disconnect from sessions without terminating processes, then reconnect later
- **Remote Persistence**: Maintain sessions even when SSH connections drop
- **Customizable**: Highly configurable through key bindings and options

In this comprehensive guide, we'll explore tmux commands and provide a practical cheatsheet to help you master this essential tool.

## Installing tmux

By default, tmux is not installed on most systems, so you'll need to install it first using your system's package manager.

### Ubuntu/Debian Systems

```bash
sudo apt update
sudo apt install tmux
```

### Red Hat/CentOS/Fedora/AlmaLinux Systems

For newer versions (RHEL/CentOS 8+, Fedora):
```bash
sudo dnf install tmux
```

For older versions (RHEL/CentOS 7):
```bash
sudo yum install tmux
```

### macOS Systems

Using Homebrew:
```bash
brew install tmux
```

### Verify Installation

After installation, verify that tmux is properly installed and check the version:
```bash
tmux -V
```

![tmux command](/static/img/tmux.svg)

## tmux Essential Commands and Cheatsheet

Once tmux is installed, you can begin using its powerful features. Here's a comprehensive guide to the most important tmux commands and keyboard shortcuts.

### Understanding the Prefix Key

tmux uses a special "prefix" key combination for most commands. The default prefix is `Ctrl + B`. When we reference `Prefix` in this guide, it means:
1. Press and hold `Ctrl + B`
2. Release both keys
3. Then press the specified command key

For example, `Prefix + d` means: `Ctrl + B`, release, then press `d`.

### 1. Session Management

Sessions are tmux's top-level containers that persist even when you disconnect from your terminal.

#### Creating New Sessions

Create a session without a specific name:
```bash
tmux
# or
tmux new
# or  
tmux new-session
```

Create a named session (recommended for organization):
```bash
tmux new -s [SESSION_NAME]
# Example:
tmux new -s development
```

#### Listing Sessions

View all active tmux sessions:
```bash
tmux ls
# or
tmux list-sessions
```

#### Detaching and Reattaching

**Detach from current session:**
- Keyboard shortcut: `Prefix + d`
- This leaves your session running in the background

**Reattach to a session:**
```bash
# Attach to the most recent session
tmux attach
# or
tmux a

# Attach to a specific named session
tmux attach -t [SESSION_NAME]
# Example:
tmux attach -t development
```

#### Session Operations

**Rename current session:**
- Keyboard shortcut: `Prefix + $`
- Or use command: `tmux rename-session [NEW_NAME]`

**Kill a session:**
```bash
tmux kill-session -t [SESSION_NAME]
```

**Switch between sessions:**
- `Prefix + s`: Display session list for selection
- `Prefix + (`: Move to previous session  
- `Prefix + )`: Move to next session

### 2. Window Management

Windows are like tabs within a session, each containing one or more panes.

#### Creating and Managing Windows

**Create a new window:**
- Keyboard shortcut: `Prefix + c`

**Navigate between windows:**
- `Prefix + n`: Next window
- `Prefix + p`: Previous window  
- `Prefix + [0-9]`: Switch to window by number
- `Prefix + w`: Display window list for selection
- `Prefix + l`: Switch to last accessed window

**Rename current window:**
- Keyboard shortcut: `Prefix + ,`

**Close current window:**
- Keyboard shortcut: `Prefix + &` (with confirmation)
- Or simply type `exit` in the window

#### Window Information

The tmux status bar displays window information:
- Numbers (0, 1, 2...): Window index
- `*`: Currently active window
- `-`: Previously active window
- `#`: Window with activity
- `!`: Window with bell alert

### 3. Pane Management

Panes allow you to split windows into multiple sections, enabling true multitasking within a single window.

#### Creating Panes

**Split window horizontally (top/bottom):**
- Keyboard shortcut: `Prefix + "`
- Creates a new pane below the current one

**Split window vertically (left/right):**
- Keyboard shortcut: `Prefix + %`  
- Creates a new pane to the right of the current one

#### Navigating Panes

**Move between panes:**
- `Prefix + Arrow Keys`: Navigate using arrow keys
- `Prefix + o`: Cycle through panes
- `Prefix + ;`: Switch to last active pane
- `Prefix + q`: Display pane numbers briefly

**Pane layouts:**
- `Prefix + Space`: Cycle through predefined layouts
- `Prefix + {`: Move current pane left
- `Prefix + }`: Move current pane right

#### Pane Operations

**Resize panes:**
- `Prefix + Ctrl + Arrow Keys`: Resize current pane
- Hold `Ctrl` while pressing arrow keys for continuous resizing

**Close current pane:**
- Keyboard shortcut: `Prefix + x` (with confirmation)
- Or type `exit` in the pane

**Zoom pane (fullscreen toggle):**
- Keyboard shortcut: `Prefix + z`
- Toggles current pane to fill entire window

### 4. Copy Mode and Text Selection

tmux includes a powerful copy mode for selecting and copying text from terminal output.

#### Entering Copy Mode

**Enter copy mode:**
- Keyboard shortcut: `Prefix + [`

#### Navigation in Copy Mode

When in copy mode, you can navigate using:
- **Arrow keys**: Move cursor
- **Page Up/Down**: Scroll pages
- **g**: Go to top of buffer
- **G**: Go to bottom of buffer  
- **Ctrl + b**: Page up
- **Ctrl + f**: Page down

#### Text Selection and Copying

**Select text (vi mode):**
- `Space`: Start selection
- `Enter`: Copy selection and exit copy mode
- `Escape`: Exit copy mode without copying

**Search in copy mode:**
- `/`: Search forward
- `?`: Search backward
- `n`: Next search result
- `N`: Previous search result

### 5. Advanced Features

#### Command Mode

Access tmux's command line interface:
- Keyboard shortcut: `Prefix + :`
- Type commands directly (e.g., `new-window`, `split-window`)

#### Synchronize Panes

Send commands to all panes in a window simultaneously:
```bash
# Enable synchronization
Prefix + : setw synchronize-panes on

# Disable synchronization  
Prefix + : setw synchronize-panes off
```

#### Configuration

tmux can be customized through the `~/.tmux.conf` file. Common customizations include:
- Changing the prefix key
- Modifying status bar appearance
- Setting default shell
- Adjusting mouse support

### 6. Essential Keyboard Shortcuts Summary

| Action | Keyboard Shortcut |
|--------|-------------------|
| **Session Management** |
| Detach from session | `Prefix + d` |
| List sessions | `Prefix + s` |
| Rename session | `Prefix + $` |
| **Window Management** |
| New window | `Prefix + c` |
| Next window | `Prefix + n` |
| Previous window | `Prefix + p` |
| List windows | `Prefix + w` |
| Rename window | `Prefix + ,` |
| Close window | `Prefix + &` |
| **Pane Management** |
| Split horizontal | `Prefix + "` |
| Split vertical | `Prefix + %` |
| Navigate panes | `Prefix + Arrow Keys` |
| Close pane | `Prefix + x` |
| Zoom pane | `Prefix + z` |
| **Copy Mode** |
| Enter copy mode | `Prefix + [` |
| Start selection | `Space` (in copy mode) |
| Copy selection | `Enter` (in copy mode) |
| **Other** |
| Command prompt | `Prefix + :` |
| List key bindings | `Prefix + ?` |
| Reload config | `Prefix + r` (if configured) |

## Conclusion

tmux is an indispensable tool for anyone working extensively with command-line interfaces, especially when managing remote servers or cloud infrastructure. Its ability to maintain persistent sessions, organize work into windows and panes, and provide seamless detach/reattach functionality makes it essential for system administrators, developers, and DevOps professionals.

The investment in learning tmux pays dividends in improved productivity and workflow efficiency. Rather than juggling multiple SSH connections or losing work due to network interruptions, tmux provides a robust environment that adapts to your working style and maintains your context across sessions.

Start with the basic session and window management commands, then gradually incorporate pane splitting and advanced features as they become relevant to your workflow. With practice, tmux becomes second nature and transforms how you interact with terminal-based applications.