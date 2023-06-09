  var Theme = {
    init: function(){
      var sections = document.querySelectorAll('[data-section-type]');
      setTimeout(function(){
        window.onbeforeunload = function () {
          window.scrollTo(0, 0);
        }

        if (window.innerWidth > 679){
          window.scrollTo(0, 0);
          var logo = document.querySelector('#DesktopLogo');
          var placeHolderLogo = document.querySelector('#DesktopLogoPlaceholder');
          var logoheight = logo.getBoundingClientRect().height
          console.log(logoheight);
          console.log(logo);
          var goal = logo.closest('.MainMenu--center').clientHeight;
          var headerHeight = logo.closest('.MainMenu--Wrapper').clientHeight;
          var main = document.querySelector('main');
          mainSection = main.querySelector('.shopify-section');
          let root = document.documentElement;
          root.style.setProperty('--headerHeight', (headerHeight + logoheight)  + "px");
  
          var header = document.querySelector('.MainMenu.Fixed');
          window.scrollTo(0, 0);
          window.addEventListener('scroll', function(){
            if (header.getAttribute('animation-finished')){
              return
            }
            var current = window.scrollY;
            var newHeight = logoheight - current;
            console.log(newHeight);
  
            var currentLogoHeight = logo.clientHeight;
  
            if (newHeight < (logoheight) && newHeight >= 0){
              if (newHeight <= goal){
                header.classList.remove('Fixed');
                //header.setAttribute('animation-finished',true);
                logo.style.height = '100%';
                placeHolderLogo.style.display = 'none';
              root.style.setProperty('--headerHeight', (headerHeight)  + "px");
                
                return;
              }else {
                header.classList.add('Fixed');
                root.style.setProperty('--headerHeight', (newHeight + headerHeight)  + "px");
                logo.style.height = newHeight+'px';
                placeHolderLogo.style.display = 'block';

              }

            }
  
          },{passive: true});
          
        }
      },500)
      

      sections.forEach((section) => {
          if (!this.sections[section.getAttribute('data-section-type')]) {
              return
          }
          this.sections[section.getAttribute('data-section-type')](section);
      });

    this.initAjax();

    },
    isInViewPort: function(element) {
      const rect = element.getBoundingClientRect();
      return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
  },
    initAjax: function(){
      var ajaxAtc = document.querySelectorAll('[data-ajax-add]');
      ajaxAtc.forEach((addToCart) => {
        var id = addToCart.getAttribute('data-ajax-add');
        if (!id){
          console.log('somethings wrong with ajax');
          return
        }
        addToCart.addEventListener('click', function(){
          Theme.addToCart(id);
        });
      });
    },
    initAjaxSection: function(section){
      var ajaxAtc = section.querySelectorAll('[data-ajax-add]');
      ajaxAtc.forEach((addToCart) => {
        var id = addToCart.getAttribute('data-ajax-add');
        if (!id){
          console.log('somethings wrong with ajax');
          return
        }
        addToCart.addEventListener('click', function(){
          Theme.addToCart(id);
        });
      });
    },
    addedProduct: function(data){
      console.log(data);
      if (data.sections){
        if (data.sections.ajaxcard){
          var cardcontainer = document.querySelector('#ajaxCardContainer');
          cardcontainer.innerHTML=data.sections.ajaxcard;
          cardcontainer.classList.add('visible');
          var hide = setTimeout( function(){
          cardcontainer.classList.remove('visible');
          },2000)
          Theme.rerenderCart();
        }
      }
    },
    cart:{
      status: function(){
      var CartDrawer = document.querySelector('#CartDrawer');
      if (window.innerWidth > 679){
      var CartDrawer = document.querySelector('#cartButtonDrawer');
      }
      var hidden = JSON.parse(CartDrawer.getAttribute('aria-hidden'));
      if(hidden){
        return true
      }else{
        return false
      }
      },
      toggle: function(){
        var CartDrawer = document.querySelector('#CartDrawer');
        if (window.innerWidth > 679){
        var CartDrawer = document.querySelector('#cartButtonDrawer');
        }
        var hidden = JSON.parse(CartDrawer.getAttribute('aria-hidden'));
        if(hidden){
          if (window.innerWidth > 679){
            return
            }
          CartDrawer.setAttribute('aria-hidden', false);
        }else{
          CartDrawer.setAttribute('aria-hidden', true);
        }
      },
      close: function(){
        var CartDrawer = document.querySelector('#CartDrawer');
        if (window.innerWidth > 679){
        var CartDrawer = document.querySelector('#cartButtonDrawer');
        }
        var hidden = JSON.parse(CartDrawer.getAttribute('aria-hidden'));
        CartDrawer.setAttribute('aria-hidden', false);

      },
      open: function(){
        var CartDrawer = document.querySelector('#CartDrawer');
        if (window.innerWidth > 679){
        var CartDrawer = document.querySelector('#cartButtonDrawer');
        }
        var hidden = JSON.parse(CartDrawer.getAttribute('aria-hidden'));
        CartDrawer.setAttribute('aria-hidden', true);
      },
      init: function(){
        var CartDrawer = document.querySelector('#CartDrawer');
        if (window.innerWidth > 679){
        var CartDrawer = document.querySelector('#cartButtonDrawer');
        }else{
          let root = document.documentElement;
          root.style.setProperty('--headerHeight', (0)  + "px");
        }

        var qtys = CartDrawer.querySelectorAll('.qty--wrapper');
        qtys.forEach((quantity) => {
          quantity.addEventListener('click', function(event){
          Theme.helpers.qty(event,quantity,true);
          })
        });

          var removeButtons = CartDrawer.querySelectorAll('.CartItem--remove');
          removeButtons.forEach((button) => {
            button.addEventListener('click', function(){
              Theme.changeCart(button.closest('[data-item]').getAttribute('data-item'), 0); 
            })
          })

      }

    },
    addToCart: function(variantID){
      let formData = {
        'items': [{
         'id': variantID,
         'quantity': 1
         }],
         'sections':  "ajaxcard"
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
          Theme.addedProduct(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    },
    changeCart: function(key, newAmount){
      let formData = {
          'id': key,
          'quantity': newAmount
       };
      fetch(window.Shopify.routes.root + 'cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
          console.log(data);
          Theme.rerenderCart();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    },
    rerenderCart: function(){
      console.log('rerender cart');

      fetch(window.Shopify.routes.root + "?sections=mini-cart")
      .then(response => response.json())
      .then(data => {
        console.log(data);
        var node = document.createElement('div');
        node.innerHTML = data['mini-cart'];
        console.log(node);
        var html = node.querySelector('.shopify-section').innerHTML;
        var CartDrawer = document.querySelector('#CartDrawer');
        if (window.innerWidth > 679){
        var CartDrawer = document.querySelector('#cartButtonDrawer');
        }

        CartDrawer.querySelector('.CartProducts').innerHTML = html;
        Theme.cart.init();

    })
    .catch((error) => {
      console.error('Error:', error);
    });
    },
    sections: {
      collection:
      function(section){
        var filterForm = section.querySelector('#storeFrontFilters');
      
        if (filterForm){
        
          filterForm.addEventListener('change', function(){
            console.log(new URLSearchParams(new FormData(filterForm)).toString());
            var searchParams = new URLSearchParams(new FormData(filterForm)).toString();
            var baseURL = window.location.pathname;
            var sectionID = section.getAttribute('data-section-id');
            const url = baseURL+'?section_id='+sectionID+'&'+searchParams;
            
            fetch(url)
            .then(response => response.text())
            .then(data => {
            //   console.log(data); 
              var html = document.createElement('div');
              html.innerHTML = data;
              var newProducts = html.querySelector('[data-next-page]').innerHTML; 
              section.querySelector('[data-next-page]').innerHTML = newProducts;
              Theme.sections.collectionHelpers.init(section);

          })
          .catch((error) => {
            console.error('Error:', error);
          });


          });
        }
        this.collectionHelpers.init(section);
      },
      collectionHelpers:{
        init: function(section){
          var ajaxSelectorPopups = section.querySelectorAll('[data-ajax-open]');
        ajaxSelectorPopups.forEach((trigger) => {
        var popupContainer = trigger.closest('[data-ajax-card]');
        trigger.addEventListener('click', function(){
          popupContainer.querySelector('[data-variant-popup]').classList.add('display');
        });

        var variants = JSON.parse(popupContainer.querySelector('[data-variant-json]').innerHTML);
        var atc = popupContainer.querySelector('[data-ajax-add]');
        console.log(variants);
        popupContainer.querySelector('[data-variant-popup]').addEventListener('change', function(){
          if (variants){
            function getVariant(section){
              var selectedOptions = [];
              var variants = JSON.parse(popupContainer.querySelector('[data-variant-json]').innerHTML);
              var variantContainers = popupContainer.querySelectorAll('.optionValuesContainer'); 
              variantContainers.forEach((container) => {
                var checked = container.querySelector('input:checked').value;
                console.log(checked);
                selectedOptions.push(checked);
              });
              return variants.find(element => JSON.stringify(element.options) === JSON.stringify(selectedOptions));
            }
          if (getVariant().id){
            atc.setAttribute('data-ajax-add',getVariant().id);
          }
          }
        });
        Theme.initAjaxSection(section);

      });
      }
      },
      Product: function(section){
        //Theme.initqty(section);

        var headerHeight = document.querySelector('#shopify-section-header').clientHeight;
        var sectionHeight = window.innerHeight - headerHeight;

        if (window.innerWidth > 649){
          var productMeta = section.querySelector('[data-meta]');
          var variantContainer = section.querySelector('[data-variant-container]');
          productMeta.style.height = sectionHeight - Theme.helpers.convertRemToPixels(4) + 'px';
          variantContainer.style.height = sectionHeight - Theme.helpers.convertRemToPixels(4)  + 'px';  
        }else{
          var productMedia = section.querySelector('[data-media-mobile]');
          setTimeout(() => {
            var flkty = new Flickity( productMedia, {
              cellAlign: 'left',
              adaptiveHeight: true
            });
          }, 200);

        }

        var stickyATC = section.querySelector('[data-sticky]');

        let root = document.documentElement;
          root.style.setProperty('--stickyHeight', (stickyATC.clientHeight)  + "px");

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

        var mediaCounter = section.querySelectorAll('.ProductMedia--Counter .Product--Image--Anchor');
        var DeskMedia = section.querySelectorAll('.ProductMedia .Product--Image');

        function removeDots(){
          mediaCounter.forEach((do2, index) => {
            do2.classList.remove('active');
            });
        }

        function makeButtons(index){
          mediaCounter.forEach((do2, index) => {
            do2.classList.remove('active');
            });
            mediaCounter[index].classList.add('active');
        }

        mediaCounter.forEach((dot, index) => {
          dot.addEventListener('click', function(){
            console.log(DeskMedia[index].offsetTop);
            removeDots();
            dot.classList.add('active');
            window.scrollTo({
              top: DeskMedia[index].offsetTop,
              left: 0,
              behavior: "smooth",
            });
            
          })
        });

        window.addEventListener('scroll', function(){
          DeskMedia.forEach((imgContainer,index) => {
            if (Theme.isInViewPort(imgContainer)){
              makeButtons(index);
            }
          });
        });

        stickyATC.addEventListener('click', async function(){
          var variantID = getVariant(section).id;
          Theme.addToCart(variantID,1);
        });

      },
      CartDrawer: function(section){
        var cartLinks = document.querySelectorAll('[data-opencart]');
        console.log(cartLinks);
        cartLinks.forEach((link) =>{
          console.log(link);
          //link.setAttribute('href', "#");
          link.addEventListener('click', function(e){
            console.log(e.target);
            if (e.target.closest('[data-closecart]')){
            Theme.cart.close();
              return
            }
            Theme.cart.open();
          });

        Theme.cart.init();

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
        console.log(current, newValue);
        text.setAttribute('data-value', newValue);
        text.textContent = newValue;
        if (!ajaxCart){
        return;
        }
      }

      if (e.target.closest('.minus')){
        var newValue = current - 1;
        if ( newValue === 0 || newValue <= 0){
          return
        }
        text.setAttribute('data-value', newValue);
        text.textContent = newValue;
        if (!ajaxCart){
          return;
        }
      }

      if (ajaxCart){
        var key = e.target.closest('[data-item]').getAttribute('data-item');
        var newAmount = newValue;
        Theme.changeCart(key,newAmount);
      }




    }
    }
  };



  Theme.AjaxRenderer = (function () {
    function AjaxRenderer({ sections, onReplace, debug } = {}) {
      this.sections = sections || [];
      this.cachedSections = [];
      this.onReplace = onReplace;
      this.debug = Boolean(debug);
    }
  
    AjaxRenderer.prototype = Object.assign({}, AjaxRenderer.prototype, {
      renderPage: function (basePath, newParams, updateURLHash = true) {
        const currentParams = new URLSearchParams(window.location.search);
        const updatedParams = this.getUpdatedParams(currentParams, newParams)
  
        const sectionRenders = this.sections.map(section => {
  
          const url = `${basePath}?section_id=${section.sectionId}&${updatedParams.toString()}`;
          const cachedSectionUrl = cachedSection => cachedSection.url === url;
  
          return this.cachedSections.some(cachedSectionUrl)
            ? this.renderSectionFromCache(cachedSectionUrl, section)
            : this.renderSectionFromFetch(url, section);
        });
  
        if (updateURLHash) this.updateURLHash(updatedParams);
  
        return Promise.all(sectionRenders);
      },
  
      renderSectionFromCache: function (url, section) {
        const cachedSection = this.cachedSections.find(url);
  
        this.log(`[AjaxRenderer] rendering from cache: url=${cachedSection.url}`);
        this.renderSection(cachedSection.html, section);
        return Promise.resolve(section);
      },
  
      renderSectionFromFetch: function (url, section) {
        this.log(`[AjaxRenderer] redering from fetch: url=${url}`);
  
        return new Promise((resolve, reject) => {
          fetch(url)
            .then(response => response.text())
            .then(responseText => {
              const html = responseText;
              this.cachedSections = [...this.cachedSections, { html, url }];
              this.renderSection(html, section);
              resolve(section);
            })
            .catch(err => reject(err));
        });
      },
  
      renderSection: function (html, section) {
        this.log(
          `[AjaxRenderer] rendering section: section=${JSON.stringify(section)}`,
        );
  
        const newDom = new DOMParser().parseFromString(html, 'text/html');
        if (this.onReplace) {
          this.onReplace(newDom, section);
        } else {
          if (typeof section.nodeId === 'string') {
            var newContentEl = newDom.getElementById(section.nodeId);
            if (!newContentEl) {
              return;
            }
  
            document.getElementById(section.nodeId).innerHTML =
              newContentEl.innerHTML;
          } else {
            section.nodeId.forEach(id => {
              document.getElementById(id).innerHTML =
                newDom.getElementById(id).innerHTML;
            });
          }
        }
  
        return section;
      },
  
      getUpdatedParams: function (currentParams, newParams) {
        const clone = new URLSearchParams(currentParams);
        const preservedParams = ['sort_by', 'q', 'options[prefix]', 'type'];
  
        // Find what params need to be removed
        // delete happens first as we cannot specify keys based off of values
        for (const [key, value] of clone.entries()) {
          if (!newParams.getAll(key).includes(value) && !preservedParams.includes(key)) {
            clone.delete(key);
          };
        }
  
        // Find what params need to be added
        for (const [key, value] of newParams.entries()) {
          if (!clone.getAll(key).includes(value) && value !== '') {
            clone.append(key, value);
          }
        }
  
        return clone;
      },
  
      updateURLHash: function (searchParams) {
        history.pushState(
          {},
          '',
          `${window.location.pathname}${
            searchParams && '?'.concat(searchParams)
          }`,
        );
      },
  
      log: function (...args) {
        if (this.debug) {
          console.log(...args);
        }
      },
    });
  
    return AjaxRenderer;
  })();

  document.addEventListener("DOMContentLoaded", (event) => {
    Theme.init();
  });

 