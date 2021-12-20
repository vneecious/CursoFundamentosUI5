sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("br.gov.bndes.zhrbeneficio.controller.Product", {

            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("Product").attachPatternMatched(this._onPatternMatched.bind(this));

                var oViewModel = new JSONModel({ editable: false });
                this.getView().setModel(oViewModel, "view");

            },

            onEdit: function (oEvent) {
                this.getView().getModel("view").setProperty("/editable", true);
            },

            onCancel: function (oEvent) {
                this.getView().getModel("view").setProperty("/editable", false);
                this.getView().getModel().resetChanges();
            },

            onSave: function (oEvent) {
                this.getView().getModel("view").setProperty("/editable", false);
                this.getView().getModel().submitChanges({ 
                    success: function (oData) {
                        debugger
                        alert("Sucesso");
                    }.bind(this)
                });
            },

            _onPatternMatched: function (oEvent) {
                this.getView().getModel("view").setProperty("/editable", false);

                var sID = oEvent.getParameter("arguments").ID;
                var sPath = this.getView().getModel().createKey("/Products", { ID: sID });
                this.getView().bindElement(sPath, { expand: 'Category, Supplier' });
            }

        });
    });
