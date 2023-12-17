const playlistContainer = document.getElementById("playlist__grid__container");
const searchInput = document.getElementById("search");

const url =
  "https://d2urhn0mmik6is.cloudfront.net/site/_images/tp-interview/data.json";

let originalData; // Variable to store the original data

/**
 * Creates an image element and appends it to the specified element.
 * @param {Object} item - The item containing the image source.
 * @param {HTMLElement} element - The element to which the image element will be appended.
 */
const createImageElement = (item, element) => {
  const image = document.createElement("img");
  image.classList.add("image");
  image.src = item.image;
  element.appendChild(image);
};

/**
 * Fetches images from the provided URL and creates image elements in a playlist container.
 * @returns {Promise<void>} A promise that resolves when the images are fetched and created successfully.
 */
const getImages = async () => {
  try {
    const response = await fetch(url);
    originalData = await response.json();
    originalData.forEach((item) => {
      createImageElement(item, playlistContainer);
    });
  } catch (error) {
    const errorMessage = document.createElement("div");
    errorMessage.classList.add("error-message");
    errorMessage.innerHTML = "Error fetching data. Please try again later.";
    playlistContainer.appendChild(errorMessage);
  } 
};

getImages();



/**
 * Fetches data and sorts it using the provided sorting function.
 * @param {Array} data - The data to be sorted.
 * @param {Function} sortingFunction - The function used to sort the data.
 */
const fetchDataAndSort = (data, sortingFunction) => { // 
  const sortedData = data.slice().sort(sortingFunction); // Create a copy of the data and sort it
  playlistContainer.innerHTML = ""; 
  sortedData.forEach((item) => createImageElement(item, playlistContainer)); // Repopulate the container with the sorted data
};



// Sorting functions for title, popularity, and tier
const sortByTitle = (a, b) => a.title.localeCompare(b.title); // Sort alphabetically
const sortByPopularity = (a, b) => b.popularity - a.popularity; // Sort by descending order
const sortByTier = (a, b) => b.tier - a.tier; // Sort by descending order



// Flag to track whether sorting has been performed
let sortingPerformed = false;



/**
 * The value entered in the search input field, converted to lowercase.
 * @type {string}
 */
searchInput.addEventListener("input", (e) => {
  const searchValue = e.target.value.toLowerCase();
  let sortingFunction; // Sorting function to be used

  // if the input field is cleared and sorting has been performed previously, display the original set of images, in the non-sorted state
  if (searchValue === "") {
    if (sortingPerformed) {
      // Clear the container
      playlistContainer.innerHTML = "";
      // Repopulate the container with the original data
      originalData.forEach((item) => {
        createImageElement(item, playlistContainer);
      });
      sortingPerformed = false;
    }
  } else {
    if (searchValue === "title") {
      sortingFunction = sortByTitle;
    } else if (searchValue === "popular") {
      sortingFunction = sortByPopularity;
    } else if (searchValue === "tier") {
      sortingFunction = sortByTier;
    }

    if (sortingFunction) {
      // If a sorting function is specified, fetch data and sort
      fetchDataAndSort(originalData, sortingFunction);
      sortingPerformed = true;
    }
  }
});

