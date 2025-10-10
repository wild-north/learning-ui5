sap.ui.define(
	[
		"sap/ui/Device",
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/model/json/JSONModel",
		"sap/base/strings/formatMessage",
		"sap/m/MessageBox",
		"sap/ui/demo/todo/util/Helper",
	],
	(
		Device,
		Controller,
		Filter,
		FilterOperator,
		JSONModel,
		formatMessage,
		MessageBox,
		Helper
	) => {
		"use strict";

		return Controller.extend("sap.ui.demo.todo.controller.App", {
			onInit() {
				this.aSearchFilters = [];
				this.aTabFilters = [];

				this.getView().setModel(
					new JSONModel({
						isMobile: Device.browser.mobile,
					}),
					"view"
				);
			},

			/**
			 * Get the default model from the view
			 *
			 * @returns {sap.ui.model.json.JSONModel} The model containing the todo list, etc.
			 */
			getModel() {
				return this.getView().getModel();
			},

			/**
			 * Adds a new todo item to the bottom of the list.
			 */
			addTodo() {
				const oModel = this.getModel();
				const aTodoList = [...this.getTodos()];

				aTodoList.push({
					id: Helper.generateUUID(),
					title: oModel.getProperty("/newTodo"),
					completed: false,
					isEditing: false,
					createdAt: new Date().toISOString(),
				});

				oModel.setProperty("/todos", aTodoList);
				oModel.setProperty("/newTodo", "");
			},

			onRowPress(oEvent) {
				const oListItem = oEvent.getSource();
				const oContext = oListItem.getBindingContext();
				const oTodo = oContext.getObject();

				if (oTodo.isEditing) {
					return;
				}

				this._updateTodoProperty(oTodo, "completed", !oTodo.completed);
			},

			onCheckboxSelect(oEvent) {
				const oCheckBox = oEvent.getSource();
				const oContext = oCheckBox.getBindingContext();
				const oTodo = oContext.getObject();
				const bSelected = oEvent.getParameter("selected");

				this._updateTodoProperty(oTodo, "completed", bSelected);
			},

			/**
			 * Trigger removal of all completed items from the todo list.
			 */
			onClearCompleted() {
				const aTodoList = this.getTodos().map((oTodo) =>
					Object.assign({}, oTodo)
				);
				this.removeCompletedTodos(aTodoList);
				this.getModel().setProperty("/todos", aTodoList);
			},

			/**
			 * Removes all completed items from the given todos.
			 *
			 * @param {object[]} aTodoList
			 */
			removeCompletedTodos(aTodoList) {
				let i = aTodoList.length;
				while (i--) {
					const oTodo = aTodoList[i];
					if (oTodo.completed) {
						aTodoList.splice(i, 1);
					}
				}
			},

			/**
			 * Determines the todo list
			 *
			 * @returns {object[]} The todo list
			 */
			getTodos() {
				const oModel = this.getModel();

				return (oModel && oModel.getProperty("/todos")) || [];
			},

			/**
			 * Updates the number of items not yet completed
			 */
			onUpdateItemsLeftCount() {
				const iItemsLeft = this.getTodos().filter(
					(oTodo) => oTodo.completed !== true
				).length;

				this.getModel().setProperty("/itemsLeftCount", iItemsLeft);
			},

			/**
			 * Trigger search for specific items. The removal of items is disable as long as the search is used.
			 * @param {sap.ui.base.Event} oEvent Input changed event
			 */
			onSearch(oEvent) {
				const oModel = this.getModel();

				// First reset current filters
				this.aSearchFilters = [];

				// add filter for search
				this.sSearchQuery = oEvent.getSource().getValue();
				if (this.sSearchQuery && this.sSearchQuery.length > 0) {
					oModel.setProperty("/itemsRemovable", false);
					const filter = new Filter(
						"title",
						FilterOperator.Contains,
						this.sSearchQuery
					);
					this.aSearchFilters.push(filter);
				} else {
					oModel.setProperty("/itemsRemovable", true);
				}

				this._applyListFilters();
			},

			onFilter(oEvent) {
				// First reset current filters
				this.aTabFilters = [];

				// add filter for search
				this.sFilterKey = oEvent.getParameter("item").getKey();

				switch (this.sFilterKey) {
					case "active":
						this.aTabFilters.push(
							new Filter("completed", FilterOperator.EQ, false)
						);
						break;
					case "completed":
						this.aTabFilters.push(
							new Filter("completed", FilterOperator.EQ, true)
						);
						break;
					case "all":
					default:
					// Don't use any filter
				}

				this._applyListFilters();
			},

			_applyListFilters() {
				const oList = this.byId("todoList");
				const oBinding = oList.getBinding("items");

				oBinding.filter(
					this.aSearchFilters.concat(this.aTabFilters),
					"todos"
				);

				const sI18nKey = this.getI18NKey(
					this.sFilterKey,
					this.sSearchQuery
				);

				this.byId("filterToolbar").setVisible(!!sI18nKey);
				if (sI18nKey) {
					this.byId("filterLabel").bindProperty("text", {
						path: sI18nKey,
						model: "i18n",
						formatter: (textWithPlaceholder) => {
							return formatMessage(textWithPlaceholder, [
								this.sSearchQuery,
							]);
						},
					});
				}
			},

			getI18NKey(sFilterKey, sSearchQuery) {
				if (!sFilterKey || sFilterKey === "all") {
					return sSearchQuery ? "ITEMS_CONTAINING" : undefined;
				} else if (sFilterKey === "active") {
					return "ACTIVE_ITEMS" + (sSearchQuery ? "_CONTAINING" : "");
				} else {
					return (
						"COMPLETED_ITEMS" + (sSearchQuery ? "_CONTAINING" : "")
					);
				}
			},

			onDeleteItem(oEvent) {
				const oTodo = this._getTodoFromEvent(oEvent);

				if (oTodo.completed) {
					this._deleteTodo(oTodo);

					return;
				}

				MessageBox.confirm(
					`You're about to delete an active task '${oTodo.title}'. Are you sure you want to continue?`,
					{
						icon: MessageBox.Icon.WARNING,
						actions: [MessageBox.Action.YES, MessageBox.Action.NO],
						onClose: (sAction) => {
							if (sAction === MessageBox.Action.YES) {
								this._deleteTodo(oTodo);
							}
						},
					}
				);
			},

			onSetEditModeForItem(oEvent) {
				const oTodo = this._getTodoFromEvent(oEvent);
				const oDraftModel = this.getView().getModel("draftData");

				oDraftModel.setProperty("/editingTodo", {
					index: this._getTodoIndex(oTodo),
					title: oTodo.title,
					completed: oTodo.completed,
				});

				this._updateTodoProperty(oTodo, "isEditing", true);
			},

			onSaveEditedItem(oEvent) {
				const oTodo = this._getTodoFromEvent(oEvent);
				const oDraftModel = this.getView().getModel("draftData");
				const oEditedTodo = oDraftModel.getProperty("/editingTodo");

				this._updateTodoProperty(oTodo, "title", oEditedTodo.title);
				this._updateTodoProperty(oTodo, "isEditing", false);

				this._clearDraft();
			},

			onCancelEditedItem(oEvent) {
				const oTodo = this._getTodoFromEvent(oEvent);

				this._updateTodoProperty(oTodo, "isEditing", false);
				this._clearDraft();
			},

			_deleteTodo(oTodo) {
				const oModel = this.getModel();
				const aTodoList = oModel.getProperty("/todos");
				const aNewTodoList = aTodoList.filter((todo) => todo !== oTodo);

				oModel.setProperty("/todos", aNewTodoList);
			},

			_getTodoFromEvent(oEvent) {
				const oSource = oEvent.getSource();
				let oListItem = oSource.getParent();

				while (oListItem && !oListItem.isA("sap.m.ColumnListItem")) {
					oListItem = oListItem.getParent();
				}

				return oListItem.getBindingContext().getObject();
			},

			_getTodoIndex(oTodo) {
				const aTodoList = this.getModel().getProperty("/todos");

				return aTodoList.indexOf(oTodo);
			},

			_updateTodoProperty(oTodo, sProperty, vValue) {
				const oModel = this.getModel();
				const aTodoList = oModel.getProperty("/todos");
				const iIndex = aTodoList.indexOf(oTodo);

				if (iIndex !== -1) {
					aTodoList[iIndex][sProperty] = vValue;
					oModel.setProperty("/todos", aTodoList);
				}
			},

			_clearDraft() {
				const oDraftModel = this.getView().getModel("draftData");

				oDraftModel.setProperty("/editingTodo", {
					index: null,
					title: "",
					completed: false,
				});
			},
		});
	}
);
