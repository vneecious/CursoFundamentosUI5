sap.ui.define([
    "./BaseController", // Modificado para apontar para a BaseController, e não mais para a sap.ui.core.mvc.Controller
    "sap/ui/model/Sorter",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Sorter} Sorter
     * @param {sap.m.MessageToast} MessageToast
     * @param {sap.m.MessageBox} MessageBox
     */
    function (Controller, Sorter, MessageToast, MessageBox) {
        "use strict";

        return Controller.extend("br.gov.bndes.zhrbeneficio.controller.List", {

            /**
             * onInit é um dos quatro lifecycle hooks que toda controller tem.
             * Mais detalhes em {@link https://sapui5.hana.ondemand.com/sdk/#/topic/121b8e6337d147af9819129e428f1f75.html}
             * @public
             */
            onInit: function () {
                this._bDescending = false;
                this.getRouter().getRoute("List").attachPatternMatched(this._onPatternMatched.bind(this));

            },

            /**
             * Método chamado ao clicar no botão Ordenar
             * @param {typeof sap.ui.base.Event} oEvent
             * @public
             */
            onSort: function (oEvent) {                          
                this._bDescending = !this._bDescending;

                var oTable = this.byId("productsTable");
                var oBinding = oTable.getBinding("items");
                var aSorter = [new Sorter("Name", this._bDescending)];
                oBinding.sort(aSorter);
            },

            /**
             * Método chamado ao clicar em algum item da lista
             * @param {typeof sap.ui.base.Event} oEvent
             * @public
             */
            onListItemPress: function (oEvent) {
                var oColumnListItem = oEvent.getSource();
                var sPath = oColumnListItem.getBindingContext().getPath();
                var oModel = this.getView().getModel();
                var sID = oModel.getProperty(sPath).ID;
                this.getRouter().navTo("Product", {ID: sID});
            },

            /**
             * Método chamado ao clicar no botão Excluir (X) de algum item da lista
             * @param {typeof sap.ui.base.Event}
             * @public
             */
            onDelete: function (oEvent) {

                // Busca o path que está vinculado ao listItem clicado
                var sPath = oEvent.getParameter("listItem").getBindingContext().getPath();
                
                // Exclui esse path no backend
                this.getView().getModel().remove(sPath, {
                    groupId: "deleteProduct", /*    Estamos utilizando groupId apenas para garantir que a exclusão não seja enviada imediatamente ao backend,
                                                mas que fique armazenada numa lista de requests pendentes.
                                                    Se abrir a Component.js, verá que há uma linha onde informamos ao UI5 que o groupId deleteProduct é deferred, isto é, só será enviado ao backend
                                                mediante um submitChanges.

                                                Mais informações sobre Deferred Groups aqui: @link{https://sapui5.hana.ondemand.com/sdk/#/api/sap.ui.model.odata.v2.ODataModel%23methods/setDeferredGroups}
                                                Mais informações sobre groupId pode ser encontrada aqui: @link{https://sapui5.hana.ondemand.com/sdk/#/api/sap.ui.model.odata.v2.ODataModel%23methods/remove} */
                    success: function () {
                        MessageToast.show("Registro excluído com sucesso.");
                    }.bind(this),
                    error: function (oError) {
                        MessageBox.error("Ocorreu um erro ao tentar excluir o registro", {
                            title: "Erro"
                        });
                    }.bind(this)
                });

                // Busca o botão delete que fora clicado
                var oDeleteControl = oEvent.getParameter("listItem").getDeleteControl();

                // Carrega Popover de confirmação e vincula ele ao botão clicado
                // IMPORTANTE: ESSE MÉTODO FAZ PARTE DA BaseController E NÃO É UM MÉTODO STANDARD DO UI5
                this.openFragment("br.gov.bndes.zhrbeneficio.view.ConfirmationPopover", {
					id: "idConfirmationPopover",
                    openBy: oDeleteControl,
                    title: "Tem certeza que deseja excluir o registro?"
				});
            },

            onConfirm: function (oEvent) {

                // Efetiva a exclusão (repare no groupId)
                this.getModel().submitChanges({
					groupId: "deleteProduct"
				});
				this.byId("idConfirmationPopover").close();
            },

            /** 
             * Método chamado ao clicar no botão Novo (+)
             * @param {typeof sap.ui.base.Event}
             * @public
             */
            onAdd: function (oEvent) {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("Product", {ID: "new"});
            },

            /**
             * Método disparado sempre que a rota List (/) é identificada na URL
             * Obs: o _ no início do nome é uma convenção para dizer que a propriedade ou método é privado, 
             * já que não existe tal conceito em javascript
             * @param {sap.ui.base.Event} oEvent 
             * @private
             */
            _onPatternMatched: function (oEvent) {
                this.getView().getModel().resetChanges();
            }

        });
    });
