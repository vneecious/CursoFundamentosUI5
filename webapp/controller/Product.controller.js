sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageToast) {
        "use strict";

        return Controller.extend("br.gov.bndes.zhrbeneficio.controller.Product", {

            /**
             * onInit é um dos Lifecycle Hooks da View. Ele é chamado apenas quando a View é instanciada;
             * Convenciona-se utiliza-la para inicializar coisas que vão ser usadas dentro da view, como
             * por exemplo JSONModels;
             */
            onInit: function () {
                /** 
                 * attachPatternMatched serve para adicionar uma função para tratamento para o evento "patternMatched"
                 * de uma determinada rota. esse evento é disparado sempre que há uma mudança na URL no navegador.
                 * Exemplo:
                 *     www.meusite.com.br/ -> Usuário clica em algum produto
                 *     www.meusite.com.br/Produto/123 -> nesse momento o Router identifica a qual rota pertence esse padrão Produto/{ID}
                 *                                    -> Identificado que é a rota Product, ele dispara o evento PatternMatched;
                 */
                this.getRouter().getRoute("Product").attachPatternMatched(this._onPatternMatched.bind(this));

                /**
                 * Aqui declaramos uma JSONModel nome view. Essa JSONModel será responsável por controlar estados da tela, ou seja,
                 * se a tela está em modo edição, ou se o busy está ativo e coisas do tipo;
                 */
                var oViewModel = new JSONModel({ 
                    editable: false,
                    busy: false // busy é aquele estado do controle em que ele fica travado com um loading...
                });
                this.getView().setModel(oViewModel, "view");

            },


            onEdit: function (oEvent) {
                // Abre os campos para edição
                this.getView().getModel("view").setProperty("/editable", true);
            },

            onCancel: function (oEvent) {
                // Fecha os campos para edição
                this.getView().getModel("view").setProperty("/editable", false);

                // Descarta as modificações que estão pendentes de envio na ODataModel
                this.getView().getModel().resetChanges();
            },

            onSave: function (oEvent) {

                // Fecha os campos para edição
                this.getView().getModel("view").setProperty("/editable", false);

                // Envia todas as modificações que estão pendentes na ODataModel;
                this.getView().getModel().submitChanges({ 
                    success: function (oData) {
                        MessageToast.show("Registro salvo com sucesso!");
                    }.bind(this) // mais sobre o funcionamento do this no javascript e o 
                                 //motivo de usarmos o bind aqui: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/this#o_m%C3%A9todo_bind
                });
            },

            _onPatternMatched: function (oEvent) {

                var sID = oEvent.getParameter("arguments").ID;
                if (sID === "new") {
                    // Remove o binding anterior
                    this.getView().unbindContext();
                    // Reseta todas as modificações que estão pendentes na model
                    this.getView().getModel().resetChanges();
                    // Busca o maior ID de Produts para gerar o próximo ID
                    this.getView().getModel().read("/Products", {
                        urlParameters: {
                            "$orderby": "ID desc",
                            "$top": "1",
                            "$select": "ID"
                        },
                        success: function (oData) {
                            this.handleNewEntries(oData.results[0].ID + 1);
                        }.bind(this),
                        error: function (oError) {
                            debugger;
                        }.bind(this)
                    });

                } else {
                    this.getView().getModel("view").setProperty("/editable", false);
                    var sPath = this.getView().getModel().createKey("/Products", { ID: sID });
                    this.getView().bindElement(sPath, { expand: 'Category, Supplier' });
                }
            },

            handleNewEntries: function (sID) {
                this.getView().getModel("view").setProperty("/editable", true);
                var oContext = this.getView().getModel().createEntry("Products", { 
                    properties: { 
                        ID: sID                        
                    },
                    success: function (oData) {
                        this.getOwnerComponent().getRouter().navTo("Product", {ID: oData.ID});
                    }.bind(this),
                    error: function (oError) {
                        debugger
                    }.bind(this)

                } );
                this.getView().setBindingContext(oContext);
            }

        });
    });