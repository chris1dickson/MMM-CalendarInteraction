# Changelog

All notable changes to MMM-CalendarInteraction will be documented in this file.

## [1.1.0] - 2026-02-08

### Added
- **Force mode** (`useForce: true`) to override MagicMirror lockStrings
- Triple-method hide/show approach:
  1. Notification with force option
  2. Direct `module.hide()/show()` calls with force
  3. Direct DOM manipulation as fallback
- Comprehensive logging with emoji indicators:
  - 🙈 Hiding events
  - 👁️ Showing events
  - ⚡ User interactions
  - ⏰ Timer events
- `node_helper.js` to suppress "unable to find handler" warning
- `TESTING.md` - Browser console commands for debugging
- `LOGGING.md` - Complete guide for PM2 and file logging
- `QUICK_START.md` - Simplified setup instructions
- Detailed module count logging (shows how many instances found)
- Timestamp logging for hide timer (shows exact time calendar will hide)

### Changed
- Hide/show now uses `MM.getModules()` to find modules directly
- Increased delay for initial hide from 1s to 2s for better reliability
- Added `ALL_MODULES_STARTED` listener for additional hide attempt
- Updated README with force mode explanation and lockString information
- Improved error handling when no modules are found

### Fixed
- Calendar not hiding on startup due to lockString conflicts
- Calendar not responding to hide/show commands
- "unable to find handler" warning in logs
- Insufficient logging for troubleshooting

## [1.0.0] - 2026-02-08

### Initial Release
- Hide calendar on MagicMirror startup
- Show calendar on keyboard, mouse, or touch interaction
- Auto-hide after configurable timeout (default 5 minutes)
- Configurable target module
- Basic logging
- Debug mode option
