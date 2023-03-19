  var Theme = {
    init: function(){
      var sections = document.querySelectorAll('[data-section-type]');
      sections.forEach((section) => {

          if (!this.sections[section.getAttribute('data-section-type')]) {
              return
          }
          this.sections[section.getAttribute('data-section-type')](section);
      });
    },
    sections: {
      Product: function(section){
        var headerHeight = document.querySelector('#shopify-section-header').clientHeight;
        console.log(headerHeight);
        var sectionHeight = window.innerHeight - headerHeight;
        var productMeta = section.querySelector('[data-meta]');
        var variantContainer = section.querySelector('[data-variant-container]');
        productMeta.style.height = sectionHeight - Theme.helpers.convertRemToPixels(4) + 'px';
        variantContainer.style.height = sectionHeight - Theme.helpers.convertRemToPixels(4)  + 'px';


      }
    },
    helpers: {
      convertRemToPixels: function(rem) {    
        return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    } 
    }
  };


  document.addEventListener("DOMContentLoaded", (event) => {
    Theme.init();
  });

 