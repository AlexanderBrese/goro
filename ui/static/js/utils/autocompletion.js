import { Rendering } from "./rendering.js";
import { AutoCompletionElement } from "./web_element.js";

export class AutoCompletion {
  constructor(tasks) {
    this.tasks = tasks;
  }

  async suggest(term) {
    AutoCompletionElement.textContent = ''
    const matchedTasks = [...this.tasks.keys()].filter((task) => task.includes(term) && task !== term);
    for(const task of matchedTasks) {
        const option = document.createElement("option")
        option.setAttribute("value", task)
        new Rendering(AutoCompletionElement, option).dom()
    }
  }
}
