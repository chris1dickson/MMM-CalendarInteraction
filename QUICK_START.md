# Quick Start Guide

## What This Module Does

- Hides your calendar when MagicMirror starts
- Shows calendar when you press any key, move mouse, or touch the screen
- Auto-hides calendar after 5 minutes (configurable)
- Works with MMM-CalendarExt2, MMM-CalendarExt3, and default calendar module

## Installation on Raspberry Pi

```bash
cd ~/MagicMirror/modules
git clone https://github.com/chris1dickson/MMM-CalendarInteraction.git
```

## Add to Config

Edit `~/MagicMirror/config/config.js` and add this module **before** your calendar module:

```javascript
{
    module: "MMM-CalendarInteraction",
    position: "top_left",
    config: {
        targetModule: "MMM-CalendarExt2",  // Change this to match your calendar module name
        hideTimeout: 300000,                // 5 minutes (in milliseconds)
        initiallyHidden: true,
        debug: false
    }
},
```

## Restart MagicMirror

```bash
pm2 restart MagicMirror
```

## Check Logs

```bash
# View live logs
pm2 logs MagicMirror

# Filter for this module only
pm2 logs MagicMirror | grep "MMM-CalendarInteraction"

# Save logs to file
pm2 logs MagicMirror --lines 200 > ~/debug.log
```

## What You Should See in Logs

When working correctly, you'll see:

```
MMM-CalendarInteraction: Starting module
MMM-CalendarInteraction: Target module: MMM-CalendarExt2
MMM-CalendarInteraction: ✓ Interaction listeners setup complete
MMM-CalendarInteraction: 🙈 HIDING calendar
MMM-CalendarInteraction: Found 1 module(s) with class MMM-CalendarExt2
```

When you interact:

```
MMM-CalendarInteraction: ⚡ User interaction detected (keyboard)
MMM-CalendarInteraction: 👁️ SHOWING calendar
MMM-CalendarInteraction: ⏰ Hide timer set for 300 seconds
```

After 5 minutes:

```
MMM-CalendarInteraction: ⏰ Timer expired!
MMM-CalendarInteraction: 🙈 HIDING calendar
```

## Known Issue: Calendar "Flashes" and Reappears

If the calendar briefly hides then immediately reappears, this is because **MMM-CalendarExt2 re-renders itself** and overrides the hide command.

**This version includes a fix**: Uses CSS `!important` rules on the `<body>` tag that survive re-renders.

The module now uses **5 methods** to hide the calendar:
1. CSS class on body (`calendar-interaction-hidden`) with `!important` - **Survives re-renders!**
2. Force notification (`HIDE_MODULE` with `force: true`)
3. Direct module.hide() call
4. Direct DOM manipulation on module wrapper
5. Direct DOM manipulation on `.CX2` elements (CalendarExt2-specific)
6. Re-apply hiding after 1 second to catch late re-renders

## Troubleshooting

### Only seeing "unable to find handler"

This was fixed - pull the latest version:

```bash
cd ~/MagicMirror/modules/MMM-CalendarInteraction
git pull
pm2 restart MagicMirror
```

### Calendar not hiding

1. Check if module found your calendar:
   ```bash
   pm2 logs MagicMirror | grep "Found.*module"
   ```

   If it shows "Found 0 modules", your `targetModule` name is wrong.

2. Check your calendar module name in config.js:
   ```bash
   grep "module:" ~/MagicMirror/config/config.js
   ```

   Make sure the name matches exactly (case-sensitive!).

### No interaction detected

1. Check browser console (press F12) for JavaScript errors
2. Make sure you're clicking/typing while viewing the logs:
   ```bash
   pm2 logs MagicMirror | grep "interaction"
   ```

## Common Settings

### Change hide timeout

```javascript
hideTimeout: 60000,     // 1 minute
hideTimeout: 180000,    // 3 minutes
hideTimeout: 300000,    // 5 minutes (default)
hideTimeout: 600000,    // 10 minutes
```

### Target different calendar module

```javascript
targetModule: "calendar",           // Default MM calendar
targetModule: "MMM-CalendarExt2",   // CalendarExt2
targetModule: "MMM-CalendarExt3",   // CalendarExt3
```

### Show calendar on startup (hide on interaction instead)

```javascript
initiallyHidden: false,  // Start visible, hide after 5 min of no interaction
```

## Getting Help

1. **Enable detailed logging** - Check `LOGGING.md` for all logging commands
2. **Save complete logs** to share:
   ```bash
   pm2 logs MagicMirror --lines 500 > ~/complete-debug.log
   ```
3. **Check browser console** - Press F12 and look for red errors

## Files in This Module

- `MMM-CalendarInteraction.js` - Main module code
- `node_helper.js` - Prevents warning messages
- `MMM-CalendarInteraction.css` - Styling (minimal)
- `README.md` - Full documentation
- `LOGGING.md` - Complete logging guide
- `QUICK_START.md` - This file
