sap.ui.define([], () => {
	"use strict";

	return {
		formatItemsLeft(itemsLeftCount, itemsLeftCountPlural, itemsLeftCountSingular) {
			return itemsLeftCount === 1 
				? itemsLeftCountSingular 
				: itemsLeftCountPlural.replace("{0}", itemsLeftCount);
		},

		formatDate(date) {
			if (!date) {
				return "";
			}

			const d = new Date(date);

			return d.toLocaleDateString();
		},

		formatStatusText(completed) {
			return completed ? "Completed" : "Active";
		},

		formatStatusState(completed) {
			return completed ? "Success" : "Information";
		}
	};
});
