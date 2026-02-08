# Testing Guide - Browser Console Commands

Use these commands in your browser console (F12) to test and troubleshoot the module.

## Open Browser Console

1. Navigate to your MagicMirror (e.g., `http://localhost:8080`)
2. Press **F12** or **Ctrl+Shift+I** to open Developer Tools
3. Click the **Console** tab
4. Paste commands below and press Enter

## Basic Testing Commands

### Check if module is loaded
```javascript
MM.getModules().filter(m => m.name === "MMM-CalendarInteraction")
```
**Expected**: Should return an array with 1 object. If empty, module isn't loaded.

### Check if calendar module exists
```javascript
MM.getModules().filter(m => m.name === "MMM-CalendarExt2")
```
**Expected**: Should return an array with your calendar module(s).

### List all modules
```javascript
MM.getModules().forEach(m => console.log(m.name))
```
**Expected**: Shows all module names loaded in MagicMirror.

## Manual Hide/Show Testing

### Hide calendar manually (without force)
```javascript
MM.getModules().filter(m => m.name === "MMM-CalendarExt2").forEach(m => m.hide())
```

### Show calendar manually (without force)
```javascript
MM.getModules().filter(m => m.name === "MMM-CalendarExt2").forEach(m => m.show())
```

### Hide calendar with FORCE (override lockStrings)
```javascript
MM.getModules().filter(m => m.name === "MMM-CalendarExt2").forEach(m => m.hide(1000, {force: true}))
```
**This should work even if normal hide() doesn't!**

### Show calendar with FORCE
```javascript
MM.getModules().filter(m => m.name === "MMM-CalendarExt2").forEach(m => m.show(1000, {force: true}))
```

## Check Module State

### Check if calendar is hidden
```javascript
MM.getModules().filter(m => m.name === "MMM-CalendarExt2").forEach(m => console.log("Hidden:", m.hidden))
```
**Expected**: `Hidden: true` or `Hidden: false`

### Check lockStrings (what's preventing hide/show)
```javascript
MM.getModules().filter(m => m.name === "MMM-CalendarExt2").forEach(m => console.log("LockStrings:", m.lockStrings))
```
**Expected**: Shows an array. If not empty, those lockStrings are preventing hide/show.

### Get module config
```javascript
MM.getModules().filter(m => m.name === "MMM-CalendarInteraction")[0].config
```
**Expected**: Shows your module configuration including `useForce`, `targetModule`, etc.

## Testing MMM-CalendarInteraction Directly

### Get the module instance
```javascript
const interactionModule = MM.getModules().filter(m => m.name === "MMM-CalendarInteraction")[0]
```

### Manually trigger hide
```javascript
const interactionModule = MM.getModules().filter(m => m.name === "MMM-CalendarInteraction")[0]
interactionModule.hideCalendar()
```
**Watch the console** for log messages showing what's happening.

### Manually trigger show
```javascript
const interactionModule = MM.getModules().filter(m => m.name === "MMM-CalendarInteraction")[0]
interactionModule.showCalendar()
```

### Check if listeners are bound
```javascript
const interactionModule = MM.getModules().filter(m => m.name === "MMM-CalendarInteraction")[0]
console.log("Listeners bound:", interactionModule.interactionBound)
console.log("Calendar visible:", interactionModule.isCalendarVisible)
```

### Manually trigger interaction
```javascript
const interactionModule = MM.getModules().filter(m => m.name === "MMM-CalendarInteraction")[0]
interactionModule.onUserInteraction("test")
```
**This simulates a user interaction** - calendar should show and timer should reset.

## DOM Inspection

### Find calendar in DOM
```javascript
document.querySelectorAll('.module.MMM-CalendarExt2')
```
**Expected**: NodeList with your calendar element(s).

### Check if calendar has 'hidden' class
```javascript
document.querySelectorAll('.module.MMM-CalendarExt2').forEach(el => {
    console.log("Has hidden class:", el.classList.contains('hidden'))
    console.log("Display style:", el.style.display)
})
```

### Manually add/remove hidden class
```javascript
// Add hidden class
document.querySelectorAll('.module.MMM-CalendarExt2').forEach(el => el.classList.add('hidden'))

// Remove hidden class
document.querySelectorAll('.module.MMM-CalendarExt2').forEach(el => el.classList.remove('hidden'))
```

## Testing Scenarios

### Scenario 1: Calendar won't hide on startup

1. **Check if module is trying to hide**:
   ```javascript
   // Look in console logs for "HIDING calendar" messages
   ```

2. **Check lockStrings**:
   ```javascript
   MM.getModules().filter(m => m.name === "MMM-CalendarExt2").forEach(m =>
       console.log("LockStrings:", m.lockStrings, "Hidden:", m.hidden)
   )
   ```

3. **Try force hide manually**:
   ```javascript
   MM.getModules().filter(m => m.name === "MMM-CalendarExt2").forEach(m => m.hide(1000, {force: true}))
   ```
   If this works, the issue is lockStrings. Make sure `useForce: true` in your config.

### Scenario 2: Calendar won't show on interaction

1. **Check if interactions are detected**:
   - Click somewhere or press a key
   - Look in console for "User interaction detected" message

2. **Check if module finds the calendar**:
   ```javascript
   MM.getModules().filter(m => m.name === "MMM-CalendarExt2").length
   ```
   Should be > 0.

3. **Try manual show**:
   ```javascript
   const interactionModule = MM.getModules().filter(m => m.name === "MMM-CalendarInteraction")[0]
   interactionModule.showCalendar()
   ```

### Scenario 3: Timer not working

1. **Check timer state**:
   ```javascript
   const interactionModule = MM.getModules().filter(m => m.name === "MMM-CalendarInteraction")[0]
   console.log("Timer exists:", interactionModule.hideTimer !== null)
   console.log("Calendar visible:", interactionModule.isCalendarVisible)
   console.log("Hide timeout:", interactionModule.config.hideTimeout / 1000, "seconds")
   ```

2. **Manually reset timer**:
   ```javascript
   const interactionModule = MM.getModules().filter(m => m.name === "MMM-CalendarInteraction")[0]
   interactionModule.resetHideTimer()
   ```

## Complete Test Sequence

Run this to see the full hide/show cycle:

```javascript
const interactionModule = MM.getModules().filter(m => m.name === "MMM-CalendarInteraction")[0]

console.log("=== Starting Test ===")

// Hide calendar
console.log("1. Hiding calendar...")
interactionModule.hideCalendar()

// Wait 2 seconds, then show
setTimeout(() => {
    console.log("2. Showing calendar...")
    interactionModule.showCalendar()
}, 2000)

// Wait 4 seconds, then check state
setTimeout(() => {
    console.log("3. Checking state...")
    console.log("   Calendar visible:", interactionModule.isCalendarVisible)
    console.log("   Timer active:", interactionModule.hideTimer !== null)
}, 4000)

console.log("=== Test Running (wait 4 seconds) ===")
```

## Troubleshooting Tips

### If nothing happens when you run commands:

1. **Check for JavaScript errors**:
   Look for red error messages in the console.

2. **Verify module name is correct**:
   ```javascript
   MM.getModules().forEach(m => console.log(m.name))
   ```
   Your calendar module name must match exactly (case-sensitive).

3. **Check if MM object exists**:
   ```javascript
   typeof MM
   ```
   Should return `"object"`. If `"undefined"`, MagicMirror isn't loaded.

### If force doesn't work:

The module uses THREE methods to hide/show:
1. Notification with force
2. Direct module.hide()/show() with force
3. Direct DOM manipulation

If all three fail, check:
- Module name is correct
- Calendar module is actually loaded
- No JavaScript errors blocking execution

## Save Console Output

To save console output for debugging:

1. Right-click in console
2. Select "Save as..."
3. Save to a file

Or select all text (Ctrl+A) and copy (Ctrl+C).
