// This is the main script

// The Ui controller

const UICtrl = (function () {
  let state = null;
  const selectors = {
    indexCard: "#index-card",
    editCard: "#edit-card",
    itemsList: "#items-list",
    total: "#total-cals h1 span",
    updateMealBtn: "#update-meal-btn",
    deleteMealBtn: "#delete-meal-btn",
    cancelEditBtn: "#cancel-edit-btn",
    clearAll: "#clear-all-btn",
  };

  // loads the given state
  function loadIndex() {
    if (state !== "index") {
      document.querySelector(selectors.editCard).style.display = "none";
      document.querySelector(selectors.indexCard).style.display = "block";
      const others = document.querySelector(selectors.itemsList).children;
      for (const items of others) {
        items.style.opacity = "1";
      }
      state = "index";
    }
  }

  // loads the appropriate edit state
  function loadEdit(foodItem) {
    if (state !== "edit") {
      document.querySelector(selectors.indexCard).style.display = "none";
      const editCard = document.querySelector(selectors.editCard);
      editCard.style.display = "block";
      editCard.querySelector(".item-name").value = foodItem.name;
      editCard.querySelector(".calories").value = foodItem.calories;
      const others = document.querySelector(selectors.itemsList).children;
      for (const items of others) {
        items.style.opacity = "0.3";
      }
      foodItem.elementForm.style.opacity = "1";
      state = "edit";
    }
  }

  // gets the appropriate values
  function getDataFromFields() {
    let card;
    if (state === "index") {
      card = document.querySelector(selectors.indexCard);
    } else if (state === "edit") {
      card = document.querySelector(selectors.editCard);
    }
    return [
      card.querySelector(".item-name").value,
      card.querySelector(".calories").value,
    ];
  }

  function setFields(nameField = "", calField = "") {
    card = document.querySelector(selectors.indexCard);
    card.querySelector(".item-name").value = nameField;
    card.querySelector(".calories").value = calField;
  }

  // gets the selectors for main application
  function getSelectors() {
    return selectors;
  }

  // updates the total
  function updateTotal(newTotal) {
    document.querySelector(selectors.total).innerHTML = newTotal;
  }
  return {
    loadIndex: loadIndex,
    loadEdit: loadEdit,
    getDataFromFields: getDataFromFields,
    setFields: setFields,
    getSelectors: getSelectors,
    updateTotal: updateTotal,
  };
})();

const DataCtrl = (function () {
  const items = [];

  // loads from local storage
  function loadFromLS() {
    let lsItems = localStorage.getItem("items");
    if (lsItems === null) {
      localStorage.setItem("items", JSON.stringify(items));
    } else {
      lsItems = JSON.parse(lsItems);
      lsItems.forEach((item) => {
        items.push(new FoodItem(item.id, item.name, item.calories));
      });
    }
  }

  // writes the current item to ls
  function writeToLS() {
    const newData = [];
    for (let item of items) {
      newData.push(item.toJSON());
    }
    localStorage.setItem("items", JSON.stringify(newData));
  }

  // appends and item to the data
  function push(newItemName, newItemCals) {
    if (newItemName !== "" && newItemCals > 0) {
      let id;
      if (items.length === 0) {
        id = 0;
      } else {
        id = items[items.length - 1].id + 1;
      }
      const newItem = new FoodItem(id, newItemName, newItemCals);
      items.push(newItem);
      writeToLS();
      return newItem;
    }
  }

  // updates the item
  function update(item) {}
  // gives access to items
  function getItems() {
    return items;
  }

  return {
    loadFromLS: loadFromLS,
    writeToLS: writeToLS,
    getItems: getItems,
    push: push,
  };
})();

// The main data module
const App = (function (UICtrl, DataCtrl) {
  // The main data container

  let currentEdit = null;
  const selectors = UICtrl.getSelectors();

  // this gets the total and updates it
  function updateTotal() {
    let total = 0;
    for (const item of DataCtrl.getItems()) {
      total += item.calories;
    }
    UICtrl.updateTotal(total);
  }
  // adds all the required event listeners
  function activateListeners() {
    // when the main form gets submitted
    document
      .querySelector(selectors.indexCard)
      .querySelector("form")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        const [name, cals] = UICtrl.getDataFromFields();
        const newItem = DataCtrl.push(name, cals);
        document
          .querySelector(selectors.itemsList)
          .appendChild(newItem.elementForm);
        UICtrl.setFields();
        updateTotal();
      });

    // this is the edit listener on items list
    document
      .querySelector(selectors.itemsList)
      .addEventListener("click", function (e) {
        const target = e.target;
        if (target.getAttribute("data-func") == "edit-btn") {
          const itemId = target.parentNode.parentNode.getAttribute("data-id");
          const targetItem = DataCtrl.getItems().find(
            (foodItem) => foodItem.id == itemId
          );
          UICtrl.loadEdit(targetItem);
          currentEdit = targetItem;
        }
      });

    // when the updateMeal button gets clicked
    document
      .querySelector(selectors.updateMealBtn)
      .addEventListener("click", function (e) {
        const [name, cals] = UICtrl.getDataFromFields();
        if (name !== "" && cals > 0) {
          currentEdit.setName(name);
          currentEdit.setCals(cals);
          DataCtrl.writeToLS();
          UICtrl.loadIndex();
          currentEdit = null;
          updateTotal();
        }
      });

    // when the meal gets deleted
    document
      .querySelector(selectors.deleteMealBtn)
      .addEventListener("click", function (e) {
        const targetIndex = DataCtrl.getItems().findIndex(
          (foodItem) => foodItem.id === currentEdit.id
        );
        DataCtrl.getItems().splice(targetIndex, 1);
        currentEdit.removeYourself();
        currentEdit = null;
        UICtrl.loadIndex();
        DataCtrl.writeToLS();
        updateTotal();
      });

    // when the cancel button gets clicked
    document
      .querySelector(selectors.cancelEditBtn)
      .addEventListener("click", function (e) {
        UICtrl.loadIndex();
        currentEdit = null;
      });

    // when the clearAll button gets clicked
    document
      .querySelector(selectors.clearAll)
      .addEventListener("click", function (e) {
        UICtrl.loadIndex();
        document.querySelector(selectors.itemsList).innerHTML = "";
        DataCtrl.getItems().length = 0;
        currentEdit = null;
        updateTotal();
        DataCtrl.writeToLS();
      });
  }

  function init() {
    UICtrl.loadIndex();
    DataCtrl.loadFromLS();
    activateListeners();
    updateTotal();
    for (let item of DataCtrl.getItems()) {
      document.querySelector(selectors.itemsList).appendChild(item.elementForm);
    }
  }

  function logData() {
    console.log(DataCtrl.getItems());
  }

  return {
    init: init,
    logData: logData,
  };
})(UICtrl, DataCtrl);

App.init();
