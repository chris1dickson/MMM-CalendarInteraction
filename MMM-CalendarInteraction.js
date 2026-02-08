/* MagicMirror²
 * Module: MMM-CalendarInteraction
 *
 * By Claude Code
 * Custom module to hide calendar on startup and show on user interaction
 */

Module.register("MMM-CalendarInteraction", {
	// Default module config
	defaults: {
		targetModule: "MMM-CalendarExt2", // Module to hide/show
		hideTimeout: 300000, // 5 minutes in milliseconds (5 * 60 * 1000)
		initiallyHidden: true, // Hide calendar on startup
		debug: false, // Enable debug logging
		useForce: true // Use force option to override lockStrings (recommended)
	},

	// Define required scripts
	getScripts: function () {
		return [];
	},

	// Define styles
	getStyles: function () {
		return ["MMM-CalendarInteraction.css"];
	},

	// Override start method
	start: function () {
		Log.info("========================================");
		Log.info("MMM-CalendarInteraction: Starting module");
		Log.info("Config:", this.config);
		Log.info("Target module:", this.config.targetModule);
		Log.info("Initially hidden:", this.config.initiallyHidden);
		Log.info("Hide timeout:", this.config.hideTimeout / 1000, "seconds");
		Log.info("Debug mode:", this.config.debug);
		Log.info("========================================");

		this.isCalendarVisible = !this.config.initiallyHidden;
		this.hideTimer = null;
		this.interactionBound = false;

		// Hide calendar on startup if configured
		if (this.config.initiallyHidden) {
			Log.info("MMM-CalendarInteraction: Will hide calendar on startup");
			this.hideCalendar();
		}
	},

	// Override dom generator
	getDom: function () {
		const wrapper = document.createElement("div");
		wrapper.className = "calendar-interaction-wrapper";
		// This module doesn't display anything visible
		return wrapper;
	},

	// Called when module is shown
	notificationReceived: function (notification, payload, sender) {
		Log.info("MMM-CalendarInteraction: Received notification:", notification);

		if (notification === "DOM_OBJECTS_CREATED") {
			Log.info("MMM-CalendarInteraction: DOM ready, setting up listeners");
			// Setup interaction listeners after DOM is ready
			this.setupInteractionListeners();

			// Ensure calendar is hidden on startup
			if (this.config.initiallyHidden) {
				Log.info("MMM-CalendarInteraction: Hiding calendar after 2 second delay");
				setTimeout(() => {
					this.hideCalendar();
				}, 2000);
			}
		}

		if (notification === "ALL_MODULES_STARTED") {
			Log.info("MMM-CalendarInteraction: All modules started");
			if (this.config.initiallyHidden) {
				Log.info("MMM-CalendarInteraction: Attempting to hide calendar again");
				setTimeout(() => {
					this.hideCalendar();
				}, 1000);
			}
		}
	},

	// Setup event listeners for user interaction
	setupInteractionListeners: function () {
		if (this.interactionBound) {
			Log.info("MMM-CalendarInteraction: Listeners already bound, skipping");
			return; // Already setup
		}

		const self = this;

		// Keyboard interaction
		document.addEventListener("keydown", function (event) {
			self.onUserInteraction("keyboard");
		}, { passive: true });

		// Mouse movement
		document.addEventListener("mousemove", function (event) {
			self.onUserInteraction("mouse");
		}, { passive: true });

		// Mouse click
		document.addEventListener("click", function (event) {
			self.onUserInteraction("click");
		}, { passive: true });

		// Touch interaction
		document.addEventListener("touchstart", function (event) {
			self.onUserInteraction("touch");
		}, { passive: true });

		this.interactionBound = true;

		Log.info("MMM-CalendarInteraction: ✓ Interaction listeners setup complete");
		Log.info("MMM-CalendarInteraction: Listening for keyboard, mouse, click, and touch events");
	},

	// Handle user interaction
	onUserInteraction: function (type) {
		Log.info("MMM-CalendarInteraction: ⚡ User interaction detected (" + type + ")");
		Log.info("MMM-CalendarInteraction: Calendar currently visible:", this.isCalendarVisible);

		// Show calendar if hidden
		if (!this.isCalendarVisible) {
			Log.info("MMM-CalendarInteraction: Calendar is hidden, showing it now");
			this.showCalendar();
		} else {
			Log.info("MMM-CalendarInteraction: Calendar already visible, just resetting timer");
		}

		// Reset hide timer
		this.resetHideTimer();
	},

	// Show the calendar
	showCalendar: function () {
		Log.info("MMM-CalendarInteraction: 👁️ SHOWING calendar");
		Log.info("MMM-CalendarInteraction: Target module:", this.config.targetModule);

		// Try multiple methods to show the module

		// Method 1: Show via notification (with force if enabled)
		const notifOptions = {
			module: this.config.targetModule
		};
		if (this.config.useForce) {
			notifOptions.force = true;
			Log.info("MMM-CalendarInteraction: Sending SHOW_MODULE with force=true");
		} else {
			Log.info("MMM-CalendarInteraction: Sending SHOW_MODULE (no force)");
		}
		this.sendNotification("SHOW_MODULE", notifOptions);

		// Method 2: Direct module.show() call
		setTimeout(() => {
			const allModules = MM.getModules();
			let found = 0;
			const self = this;

			allModules.forEach((module) => {
				if (module.name === self.config.targetModule) {
					found++;
					if (self.config.useForce) {
						Log.info("MMM-CalendarInteraction: Calling show(1000, {force: true}) on module", found);
						module.show(1000, {force: true});
					} else {
						Log.info("MMM-CalendarInteraction: Calling show(1000) on module", found);
						module.show(1000);
					}
				}
			});

			Log.info("MMM-CalendarInteraction: Found and showed", found, "module instance(s)");

			// Method 3: Direct DOM manipulation as final fallback
			if (found === 0) {
				Log.warn("MMM-CalendarInteraction: No modules found via MM.getModules(), trying DOM...");
				const domModules = document.querySelectorAll('.module.' + this.config.targetModule);
				Log.info("MMM-CalendarInteraction: Found", domModules.length, "module(s) in DOM");

				domModules.forEach((domModule, index) => {
					Log.info("MMM-CalendarInteraction: Showing DOM module", index);
					domModule.classList.remove('hidden');
					domModule.style.display = '';
				});
			}
		}, 100);

		this.isCalendarVisible = true;
		Log.info("MMM-CalendarInteraction: ✓ Calendar visibility state set to: visible");
	},

	// Hide the calendar
	hideCalendar: function () {
		Log.info("MMM-CalendarInteraction: 🙈 HIDING calendar");
		Log.info("MMM-CalendarInteraction: Target module:", this.config.targetModule);

		// Try multiple methods to hide the module

		// Method 1: Hide via notification (with force if enabled)
		const notifOptions = {
			module: this.config.targetModule
		};
		if (this.config.useForce) {
			notifOptions.force = true;
			Log.info("MMM-CalendarInteraction: Sending HIDE_MODULE with force=true");
		} else {
			Log.info("MMM-CalendarInteraction: Sending HIDE_MODULE (no force)");
		}
		this.sendNotification("HIDE_MODULE", notifOptions);

		// Method 2: Direct module.hide() call
		setTimeout(() => {
			const allModules = MM.getModules();
			let found = 0;
			const self = this;

			allModules.forEach((module) => {
				if (module.name === self.config.targetModule) {
					found++;
					if (self.config.useForce) {
						Log.info("MMM-CalendarInteraction: Calling hide(1000, {force: true}) on module", found);
						module.hide(1000, {force: true});
					} else {
						Log.info("MMM-CalendarInteraction: Calling hide(1000) on module", found);
						module.hide(1000);
					}
				}
			});

			Log.info("MMM-CalendarInteraction: Found and hid", found, "module instance(s)");

			// Method 3: Direct DOM manipulation as final fallback
			if (found === 0) {
				Log.warn("MMM-CalendarInteraction: No modules found via MM.getModules(), trying DOM...");
				const domModules = document.querySelectorAll('.module.' + this.config.targetModule);
				Log.info("MMM-CalendarInteraction: Found", domModules.length, "module(s) in DOM");

				domModules.forEach((domModule, index) => {
					Log.info("MMM-CalendarInteraction: Hiding DOM module", index);
					domModule.classList.add('hidden');
				});
			}
		}, 100);

		this.isCalendarVisible = false;
		Log.info("MMM-CalendarInteraction: ✓ Calendar visibility state set to: hidden");
	},

	// Reset the auto-hide timer
	resetHideTimer: function () {
		const self = this;

		// Clear existing timer
		if (this.hideTimer) {
			Log.info("MMM-CalendarInteraction: ⏰ Clearing existing hide timer");
			clearTimeout(this.hideTimer);
		}

		// Set new timer to hide after configured timeout
		this.hideTimer = setTimeout(function () {
			Log.info("MMM-CalendarInteraction: ⏰ Timer expired! Checking if calendar should hide...");
			Log.info("MMM-CalendarInteraction: Calendar visible state:", self.isCalendarVisible);
			if (self.isCalendarVisible) {
				Log.info("MMM-CalendarInteraction: Timer triggered - hiding calendar now");
				self.hideCalendar();
			} else {
				Log.info("MMM-CalendarInteraction: Calendar already hidden, nothing to do");
			}
		}, this.config.hideTimeout);

		Log.info("MMM-CalendarInteraction: ⏰ Hide timer set for", (this.config.hideTimeout / 1000), "seconds");
		const hideTime = new Date(Date.now() + this.config.hideTimeout);
		Log.info("MMM-CalendarInteraction: Calendar will hide at:", hideTime.toLocaleTimeString());
	},

	// Override suspend method
	suspend: function () {
		if (this.hideTimer) {
			clearTimeout(this.hideTimer);
		}
	},

	// Override resume method
	resume: function () {
		if (this.isCalendarVisible) {
			this.resetHideTimer();
		}
	}
});
