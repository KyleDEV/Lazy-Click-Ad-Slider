let currentItemIndex = 0;
/** The global variable of the object of Set class */
const loadedItems = new Set();
let isSliding = false;
let remainingItemsPool = [];


function setThePoolInRandom() {
   const items = JSON.parse(document.querySelector('.lcas-carousel').dataset.items);
   remainingItemsPool = shuffleArray([...items]);
}


function shuffleArray(array) {
   for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
   }
   return array;
}


function loadItem(poolItem, callback) {
   // Create HTML structure
   const newItem = document.createElement('div');
   newItem.className = 'lcas-carousel-item';
   const link = document.createElement('a');
   link.target = "_blank";
   const img = document.createElement('img');

   // Set attributes to the pool item values
   link.href = poolItem.href;
   img.src = poolItem.src;
   img.onload = () => {
      callback(newItem);
   };

   // Assemble HTML structure
   link.appendChild(img);
   newItem.appendChild(link);

   return newItem;
}


function loadInitialItem() {
   const firstPoolItem = remainingItemsPool[currentItemIndex];
   loadItem(firstPoolItem, (loadedItem_callback) => {
      const carouselInner = document.querySelector('.lcas-carousel-inner');
      carouselInner.appendChild(loadedItem_callback);
      carouselInner.removeChild(carouselInner.firstChild);
      loadedItems.add(currentItemIndex);  // Mark the first item as loaded
      updateControls();
   });
}


function updateControls() {
   const prevControl = document.querySelector('.lcas-prev');
   const nextControl = document.querySelector('.lcas-next');

   if (currentItemIndex === 0) {
      prevControl.style.display = 'none';
   } else {
      prevControl.style.display = 'flex';
   }

   if (remainingItemsPool.length === 0) {
      nextControl.style.display = 'none';
   } else {
      nextControl.style.display = 'flex';
   }
}


function loadNewItem(index, carouselInner) {
   const poolItem = remainingItemsPool[index];
   loadItem(poolItem, (loadedItem_callback) => {
      carouselInner.appendChild(loadedItem_callback);
      loadedItems.add(index);
      currentItemIndex = index;
      const offset = -currentItemIndex * 100;
      carouselInner.style.transform = `translateX(${offset}%)`;
      isSliding = false;
      updateControls();
   });
}


function slideToLoadedItem(index, carouselInner) {
   currentItemIndex = index;
   const offset = -currentItemIndex * 100;
   carouselInner.style.transform = `translateX(${offset}%)`;
   isSliding = false;
   updateControls();
}

function slideItem(index) {
   if (isSliding) {
      return;
   }
   isSliding = true;

   const carouselInner = document.querySelector('.lcas-carousel-inner');

   if (index < 0) {
      index = remainingItemsPool.length - 1;
   }
   if (index >= remainingItemsPool.length) {
      index = 0;
   }

   if (!loadedItems.has(index)) {
      loadNewItem(index, carouselInner);
   } else {
      slideToLoadedItem(index, carouselInner);
   }
}

window.onload = () => {
   setThePoolInRandom();

   if (remainingItemsPool.length > 0) {
      loadInitialItem();
   } else {
      updateControls();
   }
}
