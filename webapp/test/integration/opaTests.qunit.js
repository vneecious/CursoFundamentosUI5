/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require(["br/gov/bndes/zhrbeneficio/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
