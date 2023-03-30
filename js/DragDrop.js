import KanbanAPI from "./KanbanAPI.js";

export default class DragDropArea {
	static createDragDropArea() {
		const range = document.createRange();

		range.selectNode(document.body);

		const DragDropArea = range.createContextualFragment(`
			<div class="kanban__DragDropArea"></div>
		`).children[0];

		DragDropArea.addEventListener("dragover", e => {
			e.preventDefault();
			DragDropArea.classList.add("kanban__DragDropArea--active");
		});

		DragDropArea.addEventListener("dragleave", () => {
			DragDropArea.classList.remove("kanban__DragDropArea--active");
		});

		DragDropArea.addEventListener("drop", e => {
			e.preventDefault();
			DragDropArea.classList.remove("kanban__DragDropArea--active");

			const columnElement = DragDropArea.closest(".kanban__column");
			const columnId = Number(columnElement.dataset.id);
			const DragDropAreasInColumn = Array.from(columnElement.querySelectorAll(".kanban__DragDropArea"));
			const droppedIndex = DragDropAreasInColumn.indexOf(DragDropArea);
			const itemId = Number(e.dataTransfer.getData("text/plain"));
			const droppedItemElement = document.querySelector(`[data-id="${itemId}"]`);
			const insertAfter = DragDropArea.parentElement.classList.contains("Item") ? DragDropArea.parentElement : DragDropArea;

			if (droppedItemElement.contains(DragDropArea)) {
				return;
			}

			insertAfter.after(droppedItemElement);
			KanbanAPI.updateItem(itemId, {
				columnId,
				position: droppedIndex
			});
		});

		return DragDropArea;
	}
}
