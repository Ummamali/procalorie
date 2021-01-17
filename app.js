// This is the main script


// The Ui controller

const UICtrl = (function(){
    let state = null;
    const items = [];
    const selectors = {
        indexCard: '#index-card',
        editCard: '#edit-card', 
        itemsList: '#items-list'
    };


    // loads the given state
    function loadIndex(){
       if (state !== 'index'){
        document.querySelector(selectors.editCard).style.display = 'none';
        document.querySelector(selectors.indexCard).style.display = 'block';
        state = 'index';
       }else{
           throw new Error('Index state already loaded!');
       }
    }

    // loads the appropriate edit state
    function loadEdit(foodItemID){
        if (state !== 'edit'){
        document.querySelector(selectors.indexCard).style.display = 'none';
        const editCard = document.querySelector(selectors.editCard);
        editCard.style.display = 'block';
        editCard.querySelector('.item-name').value = foodItem.name;
        editCard.querySelector('.calories').value = foodItem.calories;
        state = 'edit';
        }else{
            throw new Error('edit already raised!!!');
        }
    }

    // gets the appropriate values
    function getDataFromFields(){
        let card;
        if (state === 'index'){
            card = document.querySelector(selectors.indexCard);
        }else if (state === 'edit'){
            card = document.querySelector(selectors.editCard)
        }
        return [
            card.querySelector('.item-name').value,
            card.querySelector('.calories').value
        ]
    }


    function clearFields(){
        card = document.querySelector(selectors.indexCard);
        card.querySelector('.item-name').value = '';
        card.querySelector('.calories').value = '';
    }



    // adds all the required event listeners
    function activateListeners(){
        // when the main form gets submitted
        document.querySelector(selectors.indexCard).querySelector('form').addEventListener('submit', function(e){
            e.preventDefault();
            const [name, cals] = getDataFromFields();
            if (name !== '' && cals > 0){
                let id;
                if (items.length === 0){
                    id = 0;
                }else{
                    id = items[items.length - 1].id + 1;
                }
                const newItem = new FoodItem(id, name, cals);
                items.push(newItem);
                document.querySelector(selectors.itemsList).appendChild(newItem.elementForm);
                clearFields();
            }
        });
    }
    return {
       loadIndex: loadIndex,
       loadEdit: loadEdit,
       getDataFromFields: getDataFromFields,
       activateListeners: activateListeners, 
       clearFields: clearFields
    }
})();

// The main data module
const App = (function(UICtrl){

    function init(){
        UICtrl.loadIndex();
        UICtrl.activateListeners();
    }

    return {
        init: init
    }
    
})(UICtrl);



App.init();