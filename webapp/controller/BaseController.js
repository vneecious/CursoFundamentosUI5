sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
],
    /**
     *  Uma BaseController é uma classe utilizada para criar métodos aceleradores que são comuns a todas as controllers.
     *  Convenciona-se criar uma BaseController quando estamos trabalhando com múltiplas views/controllers que compartilham
     * tarefas semelhantes, por exemplo o carregamento de um Fragment, a criação/leitura de models etc.
     * 
     *  Para utilizá-la, basta modificar a herança das nossas Controllers de sap.ui.core.mvc.Controller para ./BaseController
     * 
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.core.Fragment} Fragment
     */
    function (Controller, Fragment) {
        "use strict";

        return Controller.extend("br.gov.bndes.zhrbeneficio.controller.BaseController", {


            /**
             * Retorna uma instância do Router que foi criado na Component
             * @public
             * @returns {typeof sap.ui.core.routing.Router}
             */
            getRouter: function () {
                return this.getOwnerComponent().getRouter();
            },

            /**
			 * Retorna o resource bundle da model i18n, responsável pelos textos
			 * @public
			 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
			 */
            getResourceBundle: function () {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle();
            },

            /**
             * Método criado apenas para simplificar a chamada do getModel. Com ele, ao invés de 
             * digitar this.getView().getModel(), podemos apenas utilizar this.getModel(). 
             * O objetivo é apenas reduzir a quantidade de texto digitado
             * @public
             * @returns {typeof sap.ui.model.Model}
             */
            getModel: function (sModelName) {
                return this.getView().getModel(sModelName);
            },

            /**
             * Método criado apenas para simplificar a chamada do setModel. Com ele, ao invés de
             * diditar this.getView().setModel(), podemos utilizar this.setModel().
             * O objetivo é apenas reduzir a quantidade de texto digitado
             * @public
             * @param {typeof sap.ui.model.Model} oModel
             * @param {string} sModelName
             * @returns {this}
             */
            setModel: function (oModel, sModelName) {
                this.getView().setModel(oModel, sModelName);
            },


            /**
             * Método acelerador para abrir Fragments
             * Parâmetros possíveis:
             *   - id: ID da Fragment
             *   - title: Título da Fragment
             *   - openBy: Controle responsável por abrir a Fragment (usado apenas para Popover (@link {https://sapui5.hana.ondemand.com/sdk/#/api/sap.m.Popover%23methods/openBy})
             * @param {string} sFragmentName
             * @param {Object} mParameters
             * @public
             */
            openFragment: function (sFragmentName, mParameters) {
                this._loadFragment(sFragmentName, mParameters).then(function (oDialog) {
                    if (mParameters.title)
                        oDialog.setTitle(mParameters.title);

                    if (mParameters.openBy)
                        oDialog.openBy(mParameters.openBy);
                    else
                        oDialog.open();
                }.bind(mParameters));
            },

            /**
             * Método acelerador para carregar fragments. Dessa forma não há mais necessidade de executar Fragment.load
             * @returns {Promise}
             * @private
             */
            _loadFragment: function (sFragmentName, mParameters) {
                var oDialog;
                if (mParameters.id)
                    oDialog = this.byId(mParameters.id);

                // Se a fragment ja estava aberta anteriormente, apenas retorna ela
                if (oDialog) {
                    return new Promise(function (resolve, reject) {
                        resolve(oDialog);
                    });
                }

                // Se nunca foi aberta, carrega e a adiciona como dependente da view
                return Fragment.load({ id: this.getView().getId(), name: sFragmentName, controller: this })
                .then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    return oDialog;
                }.bind(this));

            }

        });
    });
