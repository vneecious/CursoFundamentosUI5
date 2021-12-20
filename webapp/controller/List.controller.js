sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Sorter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Sorter) {
        "use strict";

        return Controller.extend("br.gov.bndes.zhrbeneficio.controller.List", {
            onInit: function () {
                this._bDescending = false;
            },

            onSort: function (oEvent) {              
               
                this._bDescending = !this._bDescending;

                var oTable = this.byId("productsTable");
                var oBinding = oTable.getBinding("items");
                var aSorter = [new Sorter("Name", this._bDescending)];
                oBinding.sort(aSorter);
            },

            onListItemPress: function (oEvent) {
                var oRouter = this.getOwnerComponent().getRouter();
                
                var oColumnListItem = oEvent.getSource();
                var sPath = oColumnListItem.getBindingContext().getPath();
                
                var oModel = this.getView().getModel();
                var sID = oModel.getProperty(sPath).ID;
                oRouter.navTo("Product", {ID: sID});
            }

        });
    });
