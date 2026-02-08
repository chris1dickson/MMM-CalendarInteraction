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
		debug: false // Enable debug logging
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
		Log.info("Starting module: " + this.name);

		this.isCalendarVisible = !this.config.initiallyHidden;
		this.hideTimer = null;
		this.interactionBound = false;

		// Hide calendar on startup if configured
		if (this.config.initiallyHidden) {
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
		if (notification === "DOM_OBJECTS_CREATED") {
			// Setup interaction listeners after DOM is ready
			this.setupInteractionListeners();

			// Ensure calendar is hidden on startup
			if (this.config.initiallyHidden) {
				setTimeout(() => {
					this.hideCalendar();
				}, 1000);
			}
		}
	},

	// Setup event listeners for user interaction
	setupInteractionListeners: function () {
		if (this.interactionBound) {
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

		if (this.config.debug) {
			Log.info(this.name + ": Interaction listeners setup complete");
		}
	},

	// Handle user interaction
	onUserInteraction: function (type) {
		if (this.config.debug) {
			Log.info(this.name + ": User interaction detected (" + type + ")");
		}

		// Show calendar if hidden
		if (!this.isCalendarVisible) {
			this.showCalendar();
		}

		// Reset hide timer
		this.resetHideTimer();
	},

	// Show the calendar
	showCalendar: function () {
		if (this.config.debug) {
			Log.info(this.name + ": Showing calendar");
		}

		this.sendNotification("SHOW_MODULE", {
			module: this.config.targetModule
		});

		this.isCalendarVisible = true;
	},

	// Hide the calendar
	hideCalendar: function () {
		if (this.config.debug) {
			Log.info(this.name + ": Hiding calendar");
		}

		this.sendNotification("HIDE_MODULE", {
			module: this.config.targetModule
		});

		this.isCalendarVisible = false;
	},

	// Reset the auto-hide timer
	resetHideTimer: function () {
		const self = this;

		// Clear existing timer
		if (this.hideTimer) {
			clearTimeout(this.hideTimer);
		}

		// Set new timer to hide after configured timeout
		this.hideTimer = setTimeout(function () {
			if (self.isCalendarVisible) {
				self.hideCalendar();
			}
		}, this.config.hideTimeout);

		if (this.config.debug) {
			Log.info(this.name + ": Hide timer reset (" + (this.config.hideTimeout / 1000) + " seconds)");
		}
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
