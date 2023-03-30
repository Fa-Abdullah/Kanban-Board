import DragDropArea from "./DragDrop.js";
import KanbanAPI from "./KanbanAPI.js";

export default class Item {
	constructor(id, content) {
		const bottomDragDropArea = DragDropArea.createDragDropArea();

		this.elements = {};
		this.elements.root = Item.createRoot();
		this.elements.input = this.elements.root.querySelector(".Item-input");

		this.elements.root.dataset.id = id;
		this.elements.input.textContent = content;
		this.content = content;
		let btnDeleteItem =document.createElement("button");
		this.elements.root.appendChild(btnDeleteItem)
		this.elements.root.appendChild(btnDeleteItem)
		this.elements.root.appendChild(bottomDragDropArea);

		const onBlur = () => {
			const newContent = this.elements.input.textContent.trim();
			if (newContent == this.content) {
				return;
			}
			this.content = newContent;
			KanbanAPI.updateItem(id, {
				content: this.content
			});
		};

		this.elements.input.addEventListener("blur", onBlur);

		btnDeleteItem.innerHTML="🗑️";
		btnDeleteItem.className="dbtn";
		
		btnDeleteItem.addEventListener("click",() =>{
			KanbanAPI.deleteItem(id);
			this.elements.input.removeEventListener("blur", onBlur);
			this.elements.root.parentElement.removeChild(this.elements.root);
		});

		this.elements.root.addEventListener("dragstart", e => {
			e.dataTransfer.setData("text/plain", id);
		});

		this.elements.input.addEventListener("drop", e => {
			e.preventDefault();
		});
	}

	static createRoot() {
		const range = document.createRange();

		range.selectNode(document.body);

		return range.createContextualFragment(`
			<div class="Item" draggable="true" style=" justify-content: space-between;">
				<div class="Item-input" contenteditable style="display:inline-block; min-width:445px; margin-bottom: 50px;margin-top:15px"></div>
			</div>
		`).children[0];
	}
}
