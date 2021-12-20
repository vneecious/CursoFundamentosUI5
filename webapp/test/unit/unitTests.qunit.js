/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"brgov.bndes./zhr_beneficio/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
