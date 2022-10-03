// Fetch Data and Append it to Main list
function getAllRecipes() {
  fetch("http://localhost:3000/drinks")
    .then((res) => res.json())
    .then((allRecipes) =>
      //For each element in the newly Rendered JS Array
      //we pass the element into the RenderRecipe list function
      allRecipes.forEach((drink) => renderRecipesList(drink))
    );
}

//Initializes data Fetch

getAllRecipes();

// Setting DOM element to variables do append elements later on
const searchButton = document.getElementById("search_button");
const search = document.getElementById("search");
const recipeList = document.getElementById("recipe_list");
const favoriteList = document.getElementById("favorites_list");
const seacrhBar = document.getElementById("search");
const mainView = document.getElementById("main-id");

// Renders any Drink Recipe passed as an argument to Cocktail List
function renderRecipesList(drink) {
  // Begins by creating new Dom elements Using the createElement Function
  // and the pass Drink element
  let recipe = document.createElement("li");
  recipe.id = "recipe";
  let img = createElement("img", ["pop_up_main"], [], drink.strDrinkThumb);
  let div = createElement("div", ["content"]);
  let header = createElement("h2", ["header_display"], drink.strDrink);
  let button = createElement("button", ["favorite"], "Add To Favorites");
  //Adds Event listeners to the the header to Render Full recipe to
  // the main view
  header.addEventListener("click", () => {
    renderInMainView(drink);
  });
  header.addEventListener("mouseover", () => {
    displayPopup(header, img);
  });
  // Adds a mouse over even listener to display a pop-up image of the drink
  header.addEventListener("mouseout", () => {
    removeElement(header, img);
  });
  //Add event listener to the created favorites button to Append the
  // targeted Dom element to the Favorites List
  button.addEventListener("click", () => addToFavorites(drink));
  div.appendChild(header);
  div.appendChild(button);
  recipe.appendChild(div);
  // Finally appends the newly created Recipe Element to the DOM
  recipeList.appendChild(recipe);
}

// Function for appending recipe Elements to Dom List

function renderInMainView(drink) {
  // First Clears out current Recipe Element
  clearElements(mainView);
  // Then Grabs the Ingredients and Measurements of the Drink Item passes
  let ingredients = searchIngredients(drink);
  let measurements = searchMeasurements(drink);
  //Then Continues to utilize the createElement Function and Store
  //Rendered Dom Elements as JS varibles
  let mainRecipe = createElement("div", ["main_view_content"]);
  let header = createElement("h1", ["main_header"], drink.strDrink);
  let ingWrapper = createElement("div", ["ingredients_wrapper"]);
  let ingredientsList = createElement("ul", ["ingredients"]);
  let measurementsList = createElement("ul", ["measurements"]);
  let imgWrapper = createElement("div", ["img_wrapper"]);
  let catagory = createElement(
    "p",
    ["main_catagory"],
    `Catagory: ${drink.strCategory}`
  );
  let glass = createElement("p", ["main_glass"], `Glass: ${drink.strGlass}`);
  let description = createElement(
    "p",
    ["main_description"],
    `Instructions: ${drink.strInstructions}`
  );
  let mainImage = createElement("img", ["main_img"], [], drink.strDrinkThumb);
  //Once all of the Necessary Dom elements have been Rendered
  //we begin to append them to the necessary Partent Element's Children
  mainRecipe.appendChild(header);
  mainRecipe.appendChild(ingWrapper);
  mainRecipe.appendChild(catagory);
  mainRecipe.appendChild(glass);
  mainRecipe.appendChild(description);
  ingWrapper.appendChild(measurementsList);
  ingWrapper.appendChild(ingredientsList);
  ingWrapper.appendChild(imgWrapper);
  imgWrapper.appendChild(mainImage);
  // Itteerates through the Passed Drinks Ingredient/ Meaurement Values
  // and append them individually as list elements to the approprite UL
  ingredients.forEach(function (e) {
    let ingredientsListItem = createElement("li", ["listed_ingredient"], e);
    ingredientsList.appendChild(ingredientsListItem);
  });
  measurements.forEach(function (e) {
    let measurementsListItem = createElement("li", ["listed_measurement"], e);
    measurementsList.appendChild(measurementsListItem);
  });
  // Finally Appends the Newlys Renered Main Element to the Main_view Div
  mainView.appendChild(mainRecipe);
}

// Renders any Drink Recipes Passed as an argument to Favorites List

function addToFavorites(drink) {
  let favoriteRecipe = document.createElement("li");
  favoriteRecipe.id = "favoriteRecipe";
  let div = createElement("div", ["content"]);
  let img = createElement("img", ["pop_up_favorites"], [], drink.strDrinkThumb);
  let header = createElement("h2", ["header_display"], drink.strDrink);
  let button = createElement("button", ["remove"], "Remove");
  header.addEventListener("click", () => {
    renderInMainView(drink);
  });
  //Add Event Listeners to the Drink Name that utilize the
  //pop-up call back functions
  header.addEventListener("mouseover", () => {
    displayPopup(header, img);
  });
  header.addEventListener("mouseout", () => {
    removeElement(header, img);
    //Add Event Listner to Utilize the Remove Element Callback
  });
  button.addEventListener("click", () => {
    removeElement(favoriteList, favoriteRecipe);
  });
  div.appendChild(header);
  div.appendChild(button);
  favoriteRecipe.appendChild(div);
  //Finally append the New create favorite element to the Dom
  favoriteList.appendChild(favoriteRecipe);
}

// Dynamic Function that Takes up to four arguments and creates a New Dom
// element based on the aguments passed

function createElement(elementTag, classList, content, imgSrc) {
  let element = document.createElement(elementTag);
  element.classList = classList;
  if (content) element.innerText = content;
  if (imgSrc) element.src = imgSrc;
  return element;
}

// Call Back Functions

// Search db.json and filter it By first letter
const searchDrinks = async (searchText) => {
  const res = await fetch("http://localhost:3000/drinks");
  const allDrinks = await res.json();

  //Get matches to current text input regarldless of Case

  let matches = allDrinks.filter((drink) => {
    return drink.strDrink.toLowerCase().includes(searchText.toLowerCase());
  });
  clearElements(recipeList);
  if (searchText.length === 0) {
    getAllRecipes();
  }
  matches.forEach((drink) => renderRecipesList(drink));
};
// Adding Event Listeners to search box and Search Button

searchButton.addEventListener("click", () => searchDrinks(search.value));
seacrhBar.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchDrinks(search.value);
  }
});

// Function for itterating through Drink Ingredients
function searchIngredients(drink) {
  let drinkArray = Object.values(drink);
  let newDrinkArray = [];
  // Finds truthy Values inside of desired paramters and passes them to the new array
  for (let i = 17; drinkArray[i] !== null; i++) {
    newDrinkArray.push(drinkArray[i]);
  }
  return newDrinkArray;
}
//Function for Itterating through drink Measurements of Drink passed as Argument

function searchMeasurements(drink) {
  let drinkArray = Object.values(drink);
  let newDrinkArray = [];
  // Finds truthy Values inside of desired paramters and passes them to the new array
  for (let i = 32; drinkArray[i] !== null; i++) {
    newDrinkArray.push(drinkArray[i]);
  }
  // Returns New Array
  return newDrinkArray;
}

//Call back functions for Displaying Pop-up Image

function displayPopup(parent, img) {
  parent.appendChild(img);
}

//Callback Function to remove element from Favorites

function removeElement(parent, element) {
  parent.removeChild(element);
}

// Callback Function to remove an element from It's Parent node

function clearElements(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
