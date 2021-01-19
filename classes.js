// This file contains all the classes required

class FoodItem {
  constructor(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = parseInt(calories);
    const element = document.createElement("li");
    element.setAttribute("data-id", id);
    element.innerHTML = `
        <p><span class="name">${name}</span><span class="amount">${calories} cal</span></p>
        <a href="#"><i class="fas fa-pencil-alt" data-func='edit-btn'></i></a>
        `;
    this.elementForm = element;
  }

  setName(newName) {
    this.name = newName;
    this.elementForm.querySelector(".name").innerHTML = newName;
  }

  setCals(newCals) {
    this.calories = parseInt(newCals);
    this.elementForm.querySelector(".amount").innerHTML = newCals + " cal";
  }

  removeYourself() {
    this.elementForm.remove();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      calories: this.calories,
    };
  }
}
