const searchInput = document.getElementById('search');
const submitForm = document.getElementById('submit');
const randomBtn = document.getElementById('random');
const resultHeading = document.getElementById('result-heading');
const mealsEl = document.getElementById('meals');
const singleMeal = document.getElementById('single-meal');


const searchMeal = async (e) => {
  e.preventDefault();

  const url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

  // Clear single meal
  singleMeal.innerHTML = '';
  resultHeading.innerHTML = '';
  // Get search term
  const term = searchInput.value;

  // Check empty input
  if (term.trim()) {
    const res = await fetch(`${url}${term}`);
    const data = await res.json();
    // console.log(data);

    resultHeading.innerHTML = `<h2>Search results for '${term}': </h2>`;

    if (data.meals === null) {
      resultHeading.innerHTML = `<p>There are no search results, please try again!</p>`
      mealsEl.innerHTML = '';
      resultHeading.innerHTML = '';
    } else {
      mealsEl.innerHTML = data.meals.map(meal =>
        `<div class="meal">
             <img src='${meal.strMealThumb}' alt="${meal.strMeal}">
             <div class="meal-info" data-mealID="${meal.idMeal}">
              <h4>${meal.strMeal}</h4>
             </div>
          </div>
          `).join('')
    }
    searchInput.value = '';
  } else {
    alert('Please enter a search team');
  }
};

const getMealByID = async (mealID) => {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
  const data = await res.json();
  const meal = data.meals[0];

  addMealToDOM(meal)
};

const getRandomMeal = async () => {

  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
  const data = await res.json();

  const meal = data.meals[0];
  addMealToDOM(meal);

};

const addMealToDOM = meal => {
  const ingredients = [];
  let i = 1;
  while (i <= 20) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
    } else {
      break;
    }
    i++;
  }

  singleMeal.innerHTML = `
  <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <div class="single-meal-info">
    ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
    ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
    </div>
    <div class="main">
      <p>${meal.strInstructions}</p>
      <h2>Ingredients</h2>
      <ul>
        ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
      </ul>
    </div>
  </div>
  `;

};

// Event Listeners
submitForm.addEventListener('submit', searchMeal);

randomBtn.addEventListener('click', getRandomMeal)

mealsEl.addEventListener('click', e => {
  const mealInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains('meal-info')
    } else {
      return false
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    getMealByID(mealID)
  }
});



























