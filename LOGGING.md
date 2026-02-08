# Logging Guide for MMM-CalendarInteraction

## Viewing Logs in Real-Time

### If using PM2 (recommended)

View live logs:
```bash
pm2 logs MagicMirror
```

View only error logs:
```bash
pm2 logs MagicMirror --err
```

View with timestamps:
```bash
pm2 logs MagicMirror --timestamp
```

### If running manually

Logs will appear in the terminal where you ran `npm start`.

## Saving Logs to Disk

### Method 1: PM2 Log Files (Automatic)

PM2 automatically saves logs to disk. Find them here:

```bash
# View log file locations
pm2 info MagicMirror

# Common locations:
~/.pm2/logs/MagicMirror-out.log  # Standard output
~/.pm2/logs/MagicMirror-error.log  # Error output
```

View the log file:
```bash
cat ~/.pm2/logs/MagicMirror-out.log
```

Tail the log file (follow in real-time):
```bash
tail -f ~/.pm2/logs/MagicMirror-out.log
```

Search logs for MMM-CalendarInteraction:
```bash
grep "MMM-CalendarInteraction" ~/.pm2/logs/MagicMirror-out.log
```

### Method 2: Redirect Output to File

If running MagicMirror manually:

```bash
cd ~/MagicMirror
npm start > ~/magicmirror.log 2>&1
```

View the log:
```bash
tail -f ~/magicmirror.log
```

### Method 3: Using `tee` (see output AND save to file)

```bash
cd ~/MagicMirror
npm start 2>&1 | tee ~/magicmirror.log
```

### Method 4: Save Browser Console Logs

1. Open browser DevTools (F12 or Ctrl+Shift+I)
2. Go to Console tab
3. Right-click in console → "Save as..."
4. Save to a file

Or use this command to start Chromium with logging:

```bash
chromium-browser --enable-logging --v=1 http://localhost:8080
```

Logs will be saved to: `~/.config/chromium/chrome_debug.log`

## Filtering Logs for MMM-CalendarInteraction

### View only module logs:
```bash
pm2 logs MagicMirror | grep "MMM-CalendarInteraction"
```

### Save only module logs to file:
```bash
pm2 logs MagicMirror --lines 1000 | grep "MMM-CalendarInteraction" > ~/calendar-interaction.log
```

### Watch module logs in real-time:
```bash
pm2 logs MagicMirror --lines 50 | grep --color "MMM-CalendarInteraction"
```

## Log Rotation (Prevent Large Files)

PM2 has built-in log rotation. Configure it:

```bash
pm2 install pm2-logrotate

# Configure rotation settings
pm2 set pm2-logrotate:max_size 10M  # Rotate when log reaches 10MB
pm2 set pm2-logrotate:retain 7       # Keep 7 rotated logs
pm2 set pm2-logrotate:compress true  # Compress old logs
```

## Analyzing Logs for Troubleshooting

### Check if module loaded:
```bash
grep "Starting module" ~/.pm2/logs/MagicMirror-out.log | grep "CalendarInteraction"
```

### Check if listeners were setup:
```bash
grep "Interaction listeners setup" ~/.pm2/logs/MagicMirror-out.log
```

### Check if interactions were detected:
```bash
grep "User interaction detected" ~/.pm2/logs/MagicMirror-out.log
```

### Check hide/show attempts:
```bash
grep -E "(HIDING|SHOWING)" ~/.pm2/logs/MagicMirror-out.log
```

### Check timer events:
```bash
grep "Timer" ~/.pm2/logs/MagicMirror-out.log
```

## Understanding the Log Messages

The module logs these key events:

1. **Startup**:
   - `========================================`
   - `MMM-CalendarInteraction: Starting module`
   - Shows config, target module, timeout settings

2. **Initialization**:
   - `MMM-CalendarInteraction: DOM ready, setting up listeners`
   - `MMM-CalendarInteraction: ✓ Interaction listeners setup complete`

3. **Hiding Calendar**:
   - `MMM-CalendarInteraction: 🙈 HIDING calendar`
   - `MMM-CalendarInteraction: Found X module(s) with class MMM-CalendarExt2`

4. **User Interaction**:
   - `MMM-CalendarInteraction: ⚡ User interaction detected (keyboard/mouse/touch)`
   - `MMM-CalendarInteraction: Calendar currently visible: true/false`

5. **Showing Calendar**:
   - `MMM-CalendarInteraction: 👁️ SHOWING calendar`

6. **Timer Events**:
   - `MMM-CalendarInteraction: ⏰ Hide timer set for X seconds`
   - `MMM-CalendarInteraction: ⏰ Timer expired! Checking if calendar should hide...`

## Complete Log Capture for Bug Reports

To capture complete logs for troubleshooting:

```bash
# Stop MagicMirror
pm2 stop MagicMirror

# Clear old logs
pm2 flush

# Start MagicMirror
pm2 start MagicMirror

# Wait for issue to occur, then save logs
pm2 logs MagicMirror --lines 500 > ~/debug-complete.log

# Or save just module logs
pm2 logs MagicMirror --lines 500 | grep "MMM-CalendarInteraction" > ~/debug-module.log
```

## Export Logs with Timestamps

```bash
# With timestamps
pm2 logs MagicMirror --timestamp --lines 200 > ~/debug-timestamped.log

# Or manually add timestamps
pm2 logs MagicMirror | while IFS= read -r line; do echo "$(date '+%Y-%m-%d %H:%M:%S') $line"; done > ~/debug.log
```

## Increase Log Verbosity in MagicMirror

Edit your `config/config.js`:

```javascript
logLevel: ["DEBUG", "INFO", "LOG", "WARN", "ERROR"],
```

Then restart:
```bash
pm2 restart MagicMirror
```

## Quick Troubleshooting Commands

```bash
# Is the module loading?
pm2 logs MagicMirror --lines 100 | grep -i "calendarinteraction"

# Are interactions being detected?
pm2 logs MagicMirror --lines 50 | grep -i "interaction detected"

# Is the calendar being hidden/shown?
pm2 logs MagicMirror --lines 50 | grep -E "(HIDING|SHOWING)"

# How many calendar modules were found?
pm2 logs MagicMirror --lines 100 | grep "Found.*module(s)"

# What's the timer status?
pm2 logs MagicMirror --lines 50 | grep "timer"
```

## Common Issues Visible in Logs

### Module not loading:
```
Error: Cannot find module 'MMM-CalendarInteraction'
```
**Solution**: Module not in `~/MagicMirror/modules/` directory

### No modules found:
```
MMM-CalendarInteraction: Found 0 module(s) with class MMM-CalendarExt2
```
**Solution**: Check `targetModule` name in config matches actual module name

### Listeners not working:
```
(No "User interaction detected" messages appear when clicking/typing)
```
**Solution**: Check browser console for JavaScript errors

### Timer not firing:
```
(No "Timer expired" messages after timeout period)
```
**Solution**: Check that `hideTimeout` is set correctly in config
