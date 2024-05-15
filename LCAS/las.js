let currentItemIndex = 0;
const loadedItems = new Set();
let isSliding = false;
let remainingItemsPool = [];

function initializeItems() {
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

function showIndicator() {
   const indicator = document.querySelector('.lcas-indicator');
   if (indicator) {
      indicator.style.display = 'flex';
   }
}

function hideIndicator() {
   const indicator = document.querySelector('.lcas-indicator');
   if (indicator) {
      indicator.style.display = 'none';
   }
}

function loadItem(item, callback) {
   const newItem = document.createElement('div');
   newItem.className = 'lcas-carousel-item';
   const link = document.createElement('a');
   link.href = item.href;
   link.target = "_blank";
   const img = document.createElement('img');
   img.src = item.src;
   img.onload = () => {
      callback(newItem);
   };
   link.appendChild(img);
   newItem.appendChild(link);

   return newItem;
}

function updateControls() {
   const prevControl = document.querySelector('.lcas-prev');
   const nextControl = document.querySelector('.lcas-next');

   // Show or hide the previous button based on the current item index
   if (currentItemIndex === 0) {
      prevControl.style.display = 'none';
   } else {
      prevControl.style.display = 'flex';
   }

   // Show or hide the next button based on the remaining items pool
   if (remainingItemsPool.length === 0) {
      nextControl.style.display = 'none';
   } else {
      nextControl.style.display = 'flex';
   }
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

   showIndicator();

   if (!loadedItems.has(index)) {
      const item = remainingItemsPool[index];
      loadItem(item, (loadedItem) => {
         carouselInner.appendChild(loadedItem);
         loadedItems.add(index);
         hideIndicator();
         setTimeout(() => {
            currentItemIndex = index;
            const offset = -currentItemIndex * 100;
            carouselInner.style.transform = `translateX(${offset}%)`;
            isSliding = false;
            updateControls();
         }, 500);
      });
   } else {
      hideIndicator();
      currentItemIndex = index;
      const offset = -currentItemIndex * 100;
      carouselInner.style.transform = `translateX(${offset}%)`;
      setTimeout(() => {
         isSliding = false;
         updateControls();
      }, 500);
   }
}

window.onload = () => {
   initializeItems();
   if (remainingItemsPool.length > 0) {
      const initialItem = remainingItemsPool[currentItemIndex];
      loadItem(initialItem, (loadedItem) => {
         const carouselInner = document.querySelector('.lcas-carousel-inner');
         carouselInner.appendChild(loadedItem);
         carouselInner.removeChild(carouselInner.firstChild);
         hideIndicator();
         loadedItems.add(currentItemIndex);  // Mark the first item as loaded
         updateControls();
      });
   } else {
      // In case there are no items, ensure the controls are updated
      updateControls();
   }
}
