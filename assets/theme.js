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
    addedProduct: function(variant){
      console.log(variant);
    },
    sections: {
      Product: function(section){
        var headerHeight = document.querySelector('#shopify-section-header').clientHeight;
        var sectionHeight = window.innerHeight - headerHeight;
        var productMeta = section.querySelector('[data-meta]');
        var variantContainer = section.querySelector('[data-variant-container]');
        productMeta.style.height = sectionHeight - Theme.helpers.convertRemToPixels(4) + 'px';
        variantContainer.style.height = sectionHeight - Theme.helpers.convertRemToPixels(4)  + 'px';


        var stickyATC = section.querySelector('[data-sticky]');
        var form = section.querySelector('form[action="/cart/add"]');

        function getVariant(section){
          var selectedOptions = [];
          var variants = JSON.parse(section.querySelector('[data-variant-json]').innerHTML);
          var variantContainers = section.querySelectorAll('.optionValuesContainer'); 
          variantContainers.forEach((container) => {
            var checked = container.querySelector('input:checked').value;
            console.log(checked);
            selectedOptions.push(checked);
          });
          return variants.find(element => JSON.stringify(element.options) === JSON.stringify(selectedOptions));
        }

        var selected = getVariant(section);
        stickyATC.setAttribute('data-selected', selected.id);
        //var selectedVariant = 
        form.addEventListener('change', function(){
          var selected = getVariant(section);
          stickyATC.setAttribute('data-selected', selected.id);
        });


        stickyATC.addEventListener('click', function(){
          var variantID = getVariant(section).id;
          let formData = {
            'items': [{
             'id': variantID,
             'quantity': 1
             }]
           };

          fetch(window.Shopify.routes.root + 'cart/add.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          })
          .then(response => response.json())
          .then(data => {
              console.log(data);
              Theme.addedProduct(data.items[0]);
          })
          .catch((error) => {
            console.error('Error:', error);
          });

        });

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

 