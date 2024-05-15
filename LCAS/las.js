let currentItemIndex = 0;
const loadedItems = new Set();
let isSliding = false;
let remainingItemsPool = [];

function initializeItems() {
   const items = JSON.parse(document.querySelector('.lcas-carousel').dataset.items);
   remainingItemsPool = [...items];
}

function getRandomItem() {
   if (remainingItemsPool.length === 0) {
      return null;
   }
   const randomIndex = Math.floor(Math.random() * remainingItemsPool.length);
   const item = remainingItemsPool[randomIndex];
   remainingItemsPool.splice(randomIndex, 1);
   return item;
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
   if (currentItemIndex === 0 && remainingItemsPool.length > 0) {
      prevControl.style.display = 'none';
   } else {
      prevControl.style.display = 'flex';  // Ensure it uses flex display
   }

   // Show or hide the next button based on the remaining items pool
   if (remainingItemsPool.length === 0) {
      nextControl.style.display = 'none';
   } else {
      nextControl.style.display = 'flex';  // Ensure it uses flex display
   }
}

function slideItem(index) {
   if (isSliding) {
      return;
   }
   isSliding = true;

   const carouselInner = document.querySelector('.lcas-carousel-inner');
   const items = JSON.parse(document.querySelector('.lcas-carousel').dataset.items);

   if (index < 0) {
      index = items.length - 1;
   }
   if (index >= items.length) {
      index = 0;
   }

   showIndicator();

   if (!loadedItems.has(index)) {
      const item = items[index];
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
   const initialItem = getRandomItem();
   if (initialItem) {
      loadItem(initialItem, (loadedItem) => {
         const carouselInner = document.querySelector('.lcas-carousel-inner');
         carouselInner.appendChild(loadedItem);
         carouselInner.removeChild(carouselInner.firstChild);
         hideIndicator();
         currentItemIndex = items.indexOf(initialItem);
         updateControls();
      });
   }
}
