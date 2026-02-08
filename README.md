# MMM-CalendarInteraction

A MagicMirror² module that hides your calendar on startup and shows it on any user interaction (keyboard, mouse, or touchscreen). The calendar automatically hides after a configurable timeout period.

## Features

- **Hide on startup**: Calendar is hidden when MagicMirror starts
- **Show on any interaction**: Responds to keyboard, mouse, and touch events anywhere on the screen
- **Auto-hide timer**: Automatically hides calendar after 5 minutes (configurable)
- **Zero dependencies**: No external npm packages required
- **Node.js 22 compatible**: Works with modern Node.js versions
- **Debug mode**: Optional logging for troubleshooting

## Installation

### On Raspberry Pi

1. Navigate to your MagicMirror's modules folder:
   ```bash
   cd ~/MagicMirror/modules
   ```

2. Clone this repository:
   ```bash
   git clone https://github.com/chris1dickson/MMM-CalendarInteraction.git
   ```

3. Navigate back to the MagicMirror directory:
   ```bash
   cd ~/MagicMirror
   ```

4. Add the module to your `config/config.js` file (see configuration below)

5. Restart MagicMirror:
   ```bash
   pm2 restart MagicMirror
   ```
   Or if running manually:
   ```bash
   npm start
   ```

## Configuration

Add the module to your `config/config.js` file. It should be placed **before** the calendar module you want to control:

### Basic Configuration

```javascript
{
    module: "MMM-CalendarInteraction",
    position: "top_left", // Position doesn't matter as module is invisible
    config: {
        targetModule: "MMM-CalendarExt2"
    }
}
```

### Full Configuration Example

```javascript
{
    module: "MMM-CalendarInteraction",
    position: "top_left",
    config: {
        targetModule: "MMM-CalendarExt2",  // The module to hide/show
        hideTimeout: 300000,                // 5 minutes in milliseconds
        initiallyHidden: true,              // Hide calendar on startup
        debug: false                        // Enable debug logging
    }
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `targetModule` | String | `"MMM-CalendarExt2"` | The name of the module to control (hide/show) |
| `hideTimeout` | Number | `300000` | Time in milliseconds before auto-hiding (5 minutes = 300000ms) |
| `initiallyHidden` | Boolean | `true` | Whether to hide the calendar on startup |
| `debug` | Boolean | `false` | Enable debug logging to the console |

## Complete Config Example

Here's a complete example with MMM-CalendarExt2:

```javascript
let config = {
    address: "localhost",
    port: 8080,
    basePath: "/",
    ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"],

    language: "en",
    locale: "en-US",
    logLevel: ["INFO", "LOG", "WARN", "ERROR"],
    timeFormat: 24,
    units: "metric",

    modules: [
        // Add the interaction module BEFORE the calendar
        {
            module: "MMM-CalendarInteraction",
            position: "top_left",
            config: {
                targetModule: "MMM-CalendarExt2",
                hideTimeout: 300000, // 5 minutes
                initiallyHidden: true,
                debug: false
            }
        },
        {
            module: "clock",
            position: "top_left"
        },
        {
            module: "MMM-CalendarExt2",
            position: "bottom_bar",
            config: {
                calendars: [
                    {
                        name: "Personal",
                        url: "https://calendar.google.com/calendar/ical/...",
                    }
                ],
                views: [
                    {
                        mode: "week",
                        position: "bottom_bar",
                    }
                ]
            }
        }
    ]
};
```

## How It Works

1. **On Startup**: The target module (calendar) is automatically hidden
2. **On User Interaction**: Any of these interactions will show the calendar:
   - Keyboard press (any key)
   - Mouse movement
   - Mouse click
   - Touch/tap on touchscreen
3. **Auto-Hide**: After the configured timeout (default 5 minutes), the calendar automatically hides
4. **Timer Reset**: Each interaction resets the auto-hide timer

## Supported Modules

This module can control any MagicMirror module that responds to `SHOW_MODULE` and `HIDE_MODULE` notifications. Tested with:

- ✅ MMM-CalendarExt2
- ✅ MMM-CalendarExt3
- ✅ calendar (default MagicMirror calendar)
- ✅ Any standard MagicMirror module

## Troubleshooting

### Calendar doesn't hide on startup

1. Make sure `initiallyHidden` is set to `true`
2. Enable debug mode: `debug: true`
3. Check the console for error messages
4. Verify the `targetModule` name matches your calendar module exactly

### Calendar doesn't show on interaction

1. Enable debug mode to see if interactions are detected
2. Check browser console for JavaScript errors
3. Ensure your calendar module supports hide/show notifications
4. Try clicking directly on the screen or pressing a key

### Debug Mode

Enable debug logging to see what's happening:

```javascript
config: {
    debug: true
}
```

Then check your MagicMirror logs or browser console for messages like:
- "Interaction listeners setup complete"
- "User interaction detected (keyboard/mouse/touch)"
- "Showing calendar"
- "Hiding calendar"
- "Hide timer reset"

### Changing the Hide Timeout

The `hideTimeout` is in milliseconds. Common values:

- 1 minute: `60000`
- 3 minutes: `180000`
- 5 minutes: `300000` (default)
- 10 minutes: `600000`
- 30 minutes: `1800000`

## Technical Details

- **No dependencies**: Uses only native JavaScript and MagicMirror APIs
- **Passive event listeners**: Optimized for performance
- **Global interaction detection**: Detects events anywhere on the screen
- **Efficient timer management**: Properly clears and resets timers

## Compatibility

- **MagicMirror²**: v2.0.0 and above
- **Node.js**: v18, v20, v22+
- **Browsers**: All modern browsers with ES6 support

## License

MIT License - Feel free to use and modify

## Credits

Created for MagicMirror² by Claude Code

## Support

If you encounter issues:

1. Enable debug mode and check the logs
2. Verify your configuration matches the examples
3. Check that your target module name is correct
4. Review the MagicMirror logs for errors

## Changelog

### Version 1.0.0 (2026-02-08)
- Initial release
- Support for keyboard, mouse, and touch interactions
- Configurable auto-hide timeout
- Debug mode for troubleshooting
- Zero external dependencies
