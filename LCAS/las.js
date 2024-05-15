class Carousel {
   constructor(element) {
      this.element = element;
      this.currentItemIndex = 0;
      this.loadedItems = new Set();
      this.isSliding = false;
      this.remainingItemsPool = [];

      // Read class names from data attributes
      this.innerClass = this.element.dataset.innerClass;
      this.itemClass = this.element.dataset.itemClass;
      this.prevClass = this.element.dataset.prevClass;
      this.nextClass = this.element.dataset.nextClass;

      // Find elements using the class names from data attributes
      this.carouselInner = this.element.querySelector(`.${this.innerClass}`);
      this.prevButton = this.element.querySelector(`.${this.prevClass}`);
      this.nextButton = this.element.querySelector(`.${this.nextClass}`);

      this.setThePoolInRandom();
      if (this.remainingItemsPool.length > 0) {
         this.loadInitialItem();
      } else {
         this.updateControls();
      }

      // Attach event listeners
      this.prevButton.addEventListener('click', () => this.slideItem(this.currentItemIndex - 1));
      this.nextButton.addEventListener('click', () => this.slideItem(this.currentItemIndex + 1));
   }

   setThePoolInRandom() {
      const items = JSON.parse(this.element.dataset.items);
      this.remainingItemsPool = this.shuffleArray([...items]);
   }

   shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
   }

   loadItem(poolItem, callback) {
      // Create HTML structure
      const newItem = document.createElement('div');
      newItem.className = this.itemClass;
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

   loadInitialItem() {
      const firstPoolItem = this.remainingItemsPool[this.currentItemIndex];
      this.loadItem(firstPoolItem, (loadedItem_callback) => {
         this.carouselInner.appendChild(loadedItem_callback);
         this.carouselInner.removeChild(this.carouselInner.firstChild);
         this.loadedItems.add(this.currentItemIndex);  // Mark the first item as loaded
         this.updateControls();
      });
   }

   updateControls() {
      if (this.currentItemIndex === 0) {
         this.prevButton.style.display = 'none';
      } else {
         this.prevButton.style.display = 'flex';
      }

      if (this.remainingItemsPool.length === 0) {
         this.nextButton.style.display = 'none';
      } else {
         this.nextButton.style.display = 'flex';
      }
   }

   loadNewItem(index) {
      const poolItem = this.remainingItemsPool[index];
      this.loadItem(poolItem, (loadedItem_callback) => {
         this.carouselInner.appendChild(loadedItem_callback);
         this.loadedItems.add(index);
         this.currentItemIndex = index;
         const offset = -this.currentItemIndex * 100;
         this.carouselInner.style.transform = `translateX(${offset}%)`;
         this.isSliding = false;
         this.updateControls();
      });
   }

   slideToLoadedItem(index) {
      this.currentItemIndex = index;
      const offset = -this.currentItemIndex * 100;
      this.carouselInner.style.transform = `translateX(${offset}%)`;
      this.isSliding = false;
      this.updateControls();
   }

   slideItem(index) {
      if (this.isSliding) {
         return;
      }
      this.isSliding = true;

      if (index < 0) {
         index = this.remainingItemsPool.length - 1;
      }
      if (index >= this.remainingItemsPool.length) {
         index = 0;
      }

      if (!this.loadedItems.has(index)) {
         this.loadNewItem(index);
      } else {
         this.slideToLoadedItem(index);
      }
   }
}

window.onload = () => {
   document.querySelectorAll('.lcas-carousel-widget').forEach(carouselElement => {
      new Carousel(carouselElement);
   });
}
