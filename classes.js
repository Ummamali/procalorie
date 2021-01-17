// This file contains all the classes required

class FoodItem {
    constructor(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
        const element = document.createElement('li');
        element.innerHTML = `
        <p><span class="name">${name}</span><span class="amount">${calories} cal</span></p>
        <a href="#"><i class="fas fa-pencil-alt"></i></a>
        `;
        this.elementForm = element;
    }

    update(newName, newCals){
        this.name = newName;
        this.calories = newCals;
        this.elementForm.innerHTML = `
        <p><span class="name">${newName}</span><span class="amount">${newCals} cal</span></p>
        <a href="#"><i class="fas fa-pencil-alt"></i></a>
        `;
    }
}