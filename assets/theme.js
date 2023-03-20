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
    cart:{
      toggle: function(){
        console.log('hi');
        var CartDrawer = document.querySelector('#CartDrawer');
        this.init(CartDrawer);
        var hidden = JSON.parse(CartDrawer.getAttribute('aria-hidden'));
        if(hidden){
          CartDrawer.setAttribute('aria-hidden', false);
        }
      },
      init: function(CartDrawer){
        var qtys = CartDrawer.querySelectorAll('.qty--wrapper');
        qtys.forEach((quantity) => {
          quantity.addEventListener('click', function(event){
            Theme.helpers.qty(event,quantity,true);
          })
        });
      }

    },
    sections: {
      Product: function(section){
        var headerHeight = document.querySelector('#shopify-section-header').clientHeight;
        var sectionHeight = window.innerHeight - headerHeight;

        if (window.innerWidth > 649){
          var productMeta = section.querySelector('[data-meta]');
          var variantContainer = section.querySelector('[data-variant-container]');
          productMeta.style.height = sectionHeight - Theme.helpers.convertRemToPixels(4) + 'px';
          variantContainer.style.height = sectionHeight - Theme.helpers.convertRemToPixels(4)  + 'px';  
        }else{
          var productMedia = section.querySelector('[data-media]');
          var flkty = new Flickity( productMedia, {
            // options
            cellAlign: 'left',
            adaptiveHeight: true
          });
        }

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

      },
      CartDrawer: function(section){
        var cartLinks = document.querySelectorAll('a[href="/cart"]');
        cartLinks.forEach((link) =>{
          link.setAttribute('href', "#");
          link.addEventListener('click', function(){
            Theme.cart.toggle()
          });
        });
      }
    },
    helpers: {
      convertRemToPixels: function(rem) {    
        return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    },
    qty: function(e,wrapper,ajaxCart){
      var plus = wrapper.querySelector('.plus');
      var minus = wrapper.querySelector('.minus');
      var text = wrapper.querySelector('[data-value]');
      var current = parseFloat(text.getAttribute('data-value'));
      if (e.target.closest('.plus')){
        var newValue = current + 1;
        text.setAttribute('data-value', newValue);
        text.textContent = newValue;
        return;
      }

      if (e.target.closest('.minus')){
        if (newValue === 1){
          return
        }
        var newValue = current - 1;
        text.setAttribute('data-value', newValue);
        text.textContent = newValue;
        return;
      }


    }
    }
  };


  document.addEventListener("DOMContentLoaded", (event) => {
    Theme.init();
  });

 