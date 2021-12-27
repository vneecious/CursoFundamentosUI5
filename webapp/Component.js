sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "br/gov/bndes/zhrbeneficio/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("br.gov.bndes.zhrbeneficio.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                // Diz ao UI5 que sempre que uma request for feita utilizando o groupId deleteProduct, essa operação
                //não deverá ser enviada imeditamente ao backend, somente mediante chamada de submitChanges({groupId: "deleteProduct"})
                var aDeferredGroups = this.getModel().getDeferredGroups();
                aDeferredGroups.push("deleteProduct");
                this.getModel().setDeferredGroups(aDeferredGroups);
            }
        });
    }
);