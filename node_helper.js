/* MagicMirror²
 * Module: MMM-CalendarInteraction
 * Node Helper
 *
 * By Claude Code
 * This module doesn't require a node helper, but this file
 * prevents the "unable to find handler" warning in the logs.
 */

const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
	start: function() {
		console.log("Starting node helper for: " + this.name);
	},

	socketNotificationReceived: function(notification, payload) {
		// This module doesn't use socket notifications
		// but this method is required by NodeHelper
	}
});
