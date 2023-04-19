var Shopify = Shopify || {};
Shopify.money_format = "${{amount}}";
Shopify.formatMoney = function (cents, format) {
   if (typeof cents == 'string') {
      cents = cents.replace('.', '');
   }
   var value = '';
   var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
   var formatString = (format || this.money_format);

   function defaultOption(opt, def) {
      return (typeof opt == 'undefined' ? def : opt);
   }

   function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = defaultOption(precision, 2);
      thousands = defaultOption(thousands, ',');
      decimal = defaultOption(decimal, '.');

      if (isNaN(number) || number == null) {
         return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.'),
         dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
         cents = parts[1] ? (decimal + parts[1]) : '';

      return dollars + cents;
   }

   switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
         value = formatWithDelimiters(cents, 2);
         break;
      case 'amount_no_decimals':
         value = formatWithDelimiters(cents, 0);
         break;
      case 'amount_with_comma_separator':
         value = formatWithDelimiters(cents, 2, '.', ',');
         break;
      case 'amount_no_decimals_with_comma_separator':
         value = formatWithDelimiters(cents, 0, '.', ',');
         break;
   }

   return formatString.replace(placeholderRegex, value);
};

var Theme = {
   init: function () {
   let vh = window.innerHeight * 0.01;
   document.documentElement.style.setProperty('--vh', `${vh}px`);
  

   let logoheight = document.querySelector('#LogoContainerParent').offsetHeight;
   // console.log(document.querySelector('#LogoContainerParent'));
      let logoContainerWidth = document.querySelector('#LogoContainerParent').offsetWidth;
   // console.log(logoContainerWidth/4.46829268293);
   document.documentElement.style.setProperty('--logoheight', `${logoContainerWidth/4.4}px`);
      var sections = document.querySelectorAll('[data-section-type]');
      const isProduct = window.location.pathname.includes('products')
      if (window.innerWidth > 679 && !isProduct) {
         var logo = document.querySelector('#DesktopLogo');
         var navHeight = document.querySelector('.MainMenu.Fixed').offsetHeight
         document.documentElement.style.setProperty('--navHeight', (navHeight - 1) + 'px');
         let content = document.querySelector('.content');
         if (document.body.classList.contains('template-index')) {
            content.addEventListener('scroll', () => {
               if (content.scrollTop > 50) {      
                  logo.classList.remove('enlargeState');      
                  logo.classList.add('shrinkState');   
               } else {          
                  logo.classList.remove('shrinkState');
                  logo.classList.add('enlargeState');
               }
            }, {
               passive: true
            })
         } else {
            window.addEventListener('scroll', () => {
               let scrolled = window.scrollY;
               if (scrolled > 50) {
                  logo.classList.remove('enlargeState');      
                  logo.classList.add('shrinkState');
               } else {
                  logo.classList.remove('shrinkState');
                  logo.classList.add('enlargeState');
               }
            }, {
               passive: true
            })
         }
      } else if (isProduct) {
         document.querySelector('main').style.paddingTop = navHeight + 'px'
      }
      const el = document.querySelectorAll('section');
      const options = {
         rootMargin: "0px",
         threshold: 1.0
      }
      const observer = new IntersectionObserver(entries => {
         entries.forEach(entry => {
            if (entry.isIntersecting) {
               let root = document.documentElement;
               if (entry.target.classList.contains('impact-module')) {
                  root.style.setProperty('--colorSVG', 'var(--marshmellow)');
                  root.style.setProperty('--colorHTML', 'var(--marshmellow)');
                  root.style.setProperty('--colorBG', 'none');
               } else if (entry.target.classList.contains('pill_crop-module')) {
                  root.style.setProperty('--colorSVG', 'var(--red)');
                  root.style.setProperty('--colorHTML', 'var(--black)');
                  root.style.setProperty('--colorBG', 'none');
               } else if (entry.target.classList.contains('marquee-module')) {
                  root.style.setProperty('--colorSVG', 'var(--black)');
                  root.style.setProperty('--colorHTML', 'var(--black)');
                  root.style.setProperty('--colorBG', 'none');
               } else if (entry.target.classList.contains('editorial-module')) {
                  root.style.setProperty('--colorSVG', 'var(--black)');
                  root.style.setProperty('--colorHTML', 'var(--black)');
                  root.style.setProperty('--colorBG', 'none');
                  root.style.setProperty('--colorBG', 'none');
               } else if (entry.target.classList.contains('ending-module')) {
                  root.style.setProperty('--colorSVG', 'var(--red)');
                  root.style.setProperty('--colorHTML', 'var(--black)');
                  root.style.setProperty('--colorBG', 'var(--marshmellow)');
               } else {
                  root.style.setProperty('--colorSVG', 'var(--red)');
                  root.style.setProperty('--colorHTML', 'var(--black)');
                  root.style.setProperty('--colorBG', 'var(--marshmellow)');
               }
            }
         })
      }, options)
      el.forEach(e => observer.observe(e))

      sections.forEach((section) => {
         if (!this.sections[section.getAttribute('data-section-type')]) {
            return
         }
         this.sections[section.getAttribute('data-section-type')](section);
      });
      this.initAjax();
      this.cart.init();
      this.mobile_cart.init();
      this.helpers.modals();
   },
   isInViewPort: function (element) {
      const rect = element.getBoundingClientRect();
      return (
         rect.top >= 0 &&
         rect.left >= 0 &&
         rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
         rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
   },
   initAjax: function () {
      var ajaxAtc = document.querySelectorAll('[data-ajax-add]');
      ajaxAtc.forEach((addToCart) => {
         var id = addToCart.getAttribute('data-ajax-add');
         if (!id) {
            console.log('somethings wrong with ajax');
            return
         }
         addToCart.addEventListener('click', function () {
            Theme.addToCart(id);
         });
      });
   },
   initAjaxSection: function (section) {
      var ajaxAtc = section.querySelectorAll('[data-ajax-add]');
      ajaxAtc.forEach((addToCart) => {
         var id = addToCart.getAttribute('data-ajax-add');
         if (!id) {
            console.log('somethings wrong with ajax');
            return
         }
         addToCart.addEventListener('click', function () {
            Theme.addToCart(id);
         });
      });
   },
   addedProduct: function (data) {
      console.log(data);
      if (data.sections) {
         if (data.sections.ajaxcard) {
            var cardcontainer = document.querySelector('#ajaxCardContainer');
            if (window.innerWidth < 649){
            var cardcontainer = document.querySelector('#ajaxCardContainerMobile');
            }
            cardcontainer.innerHTML = data.sections.ajaxcard;
            cardcontainer.classList.add('visible');
            var hide = setTimeout(function () {
               cardcontainer.classList.remove('visible');
            }, 2000)
            Theme.rerenderCart();
         }
      }
   },
   cart: {
      status: function () {
         var CartDrawer = document.querySelector('#CartDrawer');
         if (window.innerWidth > 679) {
            var CartDrawer = document.querySelector('#cartButtonDrawer');
         }
         var hidden = JSON.parse(CartDrawer.getAttribute('aria-hidden'));
         if (hidden) {
            return true
         } else {
            return false
         }
      },
      toggle: function () {
         var CartDrawer = document.querySelector('#CartDrawer');
         if (window.innerWidth > 679) {
            var CartDrawer = document.querySelector('#cartButtonDrawer');
         }
         if (!cartOpen) {
            Theme.cart.open();
            cartOpen = true
         } else {
            Theme.cart.close();
            cartOpen = false
         }
      },
      close: function () {
         var CartDrawer = document.querySelector('#CartDrawer');
         if (window.innerWidth > 679) {
            var CartDrawer = document.querySelector('#cartButtonDrawer');
         }
         var hidden = JSON.parse(CartDrawer.getAttribute('aria-hidden'));
         CartDrawer.setAttribute('aria-hidden', false);
         if (CartDrawer.getAttribute('aria-hidden')) {
            document.querySelector('.wire.right').className = "wire right front"
         }
         
         var cartItem = document.querySelector('#cartTrigger');
         var cartP = document.querySelector('#cartTrigger p');
         cartP.innerHTML = cartItem.getAttribute('data-open');

         cartItem.setAttribute('onclick', "Theme.cart.open(true);");

      },
      open: function () {
         var CartDrawer = document.querySelector('#CartDrawer');
         if (window.innerWidth > 679) {
            var CartDrawer = document.querySelector('#cartButtonDrawer');
         }
         var hidden = JSON.parse(CartDrawer.getAttribute('aria-hidden'));
         CartDrawer.setAttribute('aria-hidden', true);
         if (CartDrawer.getAttribute('aria-hidden')) {
            document.querySelector('.wire.right').className = "wire right back"
         }

         var cartItem = document.querySelector('#cartTrigger');
         cartItem.setAttribute('onclick', "Theme.cart.close(true);");
         var cartP = document.querySelector('#cartTrigger p');
         cartP.innerHTML = cartItem.getAttribute('data-close');
      },
      init: function () {
         var CartDrawer = document.querySelector('#CartDrawer');
         if (window.innerWidth > 679) {
            var CartDrawer = document.querySelector('#cartButtonDrawer');
         } else {
            let root = document.documentElement;
            root.style.setProperty('--headerHeight', document.querySelector('.MainMenu.Fixed').clientHeight + "px");
         }

         var qtys = CartDrawer.querySelectorAll('.qty--wrapper');
         qtys.forEach((quantity) => {
            console.log(quantity);
            console.log(quantity);
            quantity.addEventListener('click', function (event) {
               Theme.helpers.qty(event, quantity, true);
            })
         });

         var removeButtons = CartDrawer.querySelectorAll('.CartItem--remove');
         removeButtons.forEach((button) => {
            button.addEventListener('click', function () {
               Theme.changeCart(button.closest('[data-item]').getAttribute('data-item'), 0);
            })
         })

      }

   },
   addToCart: function (variantID, amount) {
      let formData = {
         'items': [{
            'id': variantID,
            'quantity': amount
         }],
         'sections': "ajaxcard"
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
            // console.log(data);
            var price = Shopify.formatMoney(data.items_subtotal_price);
            var currentCount = parseInt(document.querySelector('#cartCount').innerHTML);
            document.querySelector('#cartCount').innerHTML = currentCount+data.items.length;
            Theme.addedProduct(data);
         })
         .catch((error) => {
            console.error('Error:', error);
         });
   },
   changeCart: function (key, newAmount) {
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
            var currentCount = parseInt(document.querySelector('#cartCount').innerHTML)
            document.querySelector('#cartCount').innerHTML = data.item_count;

         
            var price = Shopify.formatMoney(data.items_subtotal_price);
            //console.log(price)

            var pricesDivs = document.querySelectorAll('[data-ajax-price]');
            pricesDivs.forEach((div) => {
               div.innerHTML = price;
            })

            Theme.rerenderCart();
         })
         .catch((error) => {
            console.error('Error:', error);
         });
   },
   rerenderCart: function () {
      fetch(window.Shopify.routes.root + "?sections=mini-cart")
         .then(response => response.json())
         .then(data => {
            console.log(data);
            var node = document.createElement('div');
            node.innerHTML = data['mini-cart'];
            var html = node.querySelector('.shopify-section').innerHTML;
            if (window.innerWidth > 679) {
               var CartDrawer = document.querySelector('#cartButtonDrawer');
               CartDrawer.querySelector('.CartProducts').innerHTML = html;
            } else {
               var CartDrawer = document.querySelector('#cartMobileItems');
               CartDrawer.innerHTML = html;
            }

            Theme.cart.init();
            Theme.mobile_cart.init();

         })
         .catch((error) => {
            console.error('Error:', error);
         });
   },
   sections: {
      collection: function (section) {
         console.log(section);
         var filterForm = section.querySelector('#storeFrontFilters');
         console.log(section);
         if (filterForm) {

            var viewChanger = filterForm.querySelector('.toggleViewBtn');

            viewChanger.addEventListener('click', function () {
               section.querySelector('[data-next-page]').classList.toggle('random');
               viewChanger.classList.toggle('on');
            });
            console.log(filterForm);
            filterForm.addEventListener('change', function () {
               console.log(new URLSearchParams(new FormData(filterForm)).toString());
               var searchParams = new URLSearchParams(new FormData(filterForm)).toString();
               var baseURL = window.location.pathname;
               var sectionID = section.getAttribute('data-section-id');
               const url = baseURL + '?section_id=' + sectionID + '&' + searchParams;

               fetch(url)
                  .then(response => response.text())
                  .then(data => {
                     console.log(data);
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
      collectionHelpers: {
         init: function (section) {
            var ajaxSelectorPopups = section.querySelectorAll('[data-ajax-open]');
            ajaxSelectorPopups.forEach((trigger) => {
               var popupContainer = trigger.closest('[data-ajax-card]');
               trigger.addEventListener('click', function () {
                  popupContainer.querySelector('[data-variant-popup]').classList.add('display');
               });

               var close = popupContainer.querySelector('.CartItem--remove');
               close.addEventListener('click', function () {
                  popupContainer.querySelector('[data-variant-popup]').classList.remove('display');
               })
               var variants = JSON.parse(popupContainer.querySelector('[data-variant-json]').innerHTML);
               var atc = popupContainer.querySelector('[data-ajax-add]');
               console.log(variants);
               popupContainer.querySelector('[data-variant-popup]').addEventListener('change', function () {
                  if (variants) {
                     function getVariant(section) {
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
                     if (getVariant().id) {
                        atc.setAttribute('data-ajax-add', getVariant().id);
                        atc.querySelector('[data-variant-price]').innerHTML = Shopify.formatMoney(getVariant().price);
                     }
                  }
               });
               Theme.initAjaxSection(section);

            });
         }
      },
      Product: function (section) {
         var headerHeight = document.querySelector('.MainMenu.Fixed').clientHeight;
         var sectionHeight = window.innerHeight - headerHeight;
         var cartWidth = document.querySelector('.MainMenu--rightItem.cart').getBoundingClientRect().width
         var shopWidth = document.querySelector('.MainMenu--leftItem').getBoundingClientRect().width
         if (window.innerWidth > 649) {
            var productMeta = section.querySelector('[data-meta]');
            var variantContainer = section.querySelector('[data-variant-container]');
            variantContainer.style.height = sectionHeight - Theme.helpers.convertRemToPixels(4) + 'px';
         } else {
            var productMedia = section.querySelector('[data-mobile-slider]');
            setTimeout(() => {
               var flkty = new Flickity(productMedia, {
                  cellAlign: 'left',
                  adaptiveHeight: true
               });
            }, 200);
         }
         var stickyATC = section.querySelector('[data-sticky]');
         if (window.innerWidth < 649){
         var stickyATC = section.querySelector('[data-sticky].stickyATC');
         }


         let root = document.documentElement;
         root.style.setProperty('--headerHeight', (headerHeight) + "px");
         root.style.setProperty('--stickyHeight', (stickyATC.clientHeight) + "px");
         root.style.setProperty('--cartWidth', (cartWidth - 16)+ "px");
         root.style.setProperty('--shopWidth', (shopWidth - 16)+ "px");
   
         var form = section.querySelector('form[action="/cart/add"]');
         var qtys = section.querySelectorAll('.qty--wrapper')
         qtys.forEach((quantity) => {
            quantity.addEventListener('click', function (event) {
               Theme.helpers.qty(event, quantity, false);
            })
         });

         function getVariant(section) {
            var selectedOptions = [];
            var variants = JSON.parse(section.querySelector('[data-variant-json]').innerHTML);
            var variantContainers = section.querySelectorAll('.optionValuesContainer');
            variantContainers.forEach((container) => {
               var checked = container.querySelector('input:checked').value;
               selectedOptions.push(checked);
            });
            return variants.find(element => JSON.stringify(element.options) === JSON.stringify(selectedOptions));
         }

         var selected = getVariant(section);
         stickyATC.setAttribute('data-selected', selected.id);
         console.log(stickyATC);
         form.addEventListener('change', function () {
            var selected = getVariant(section);
            console.log(selected);
            stickyATC.setAttribute('data-selected', selected.id);
            console.log(stickyATC.querySelector('[data-variant-price]'));
            stickyATC.querySelector('[data-variant-price]').innerHTML = Shopify.formatMoney(selected.price);
         });

         var mediaCounter = section.querySelectorAll('.ProductMedia--Counter .Product--Image--Anchor');
         var DeskMedia = section.querySelectorAll('.ProductMedia .Product--Image');

         function removeDots() {
            mediaCounter.forEach((do2, index) => {
               do2.classList.remove('active');
            });
         }

         function makeButtons(index) {
            mediaCounter.forEach((do2, index) => {
               do2.classList.remove('active');
            });
            mediaCounter[index].classList.add('active');
         }

         mediaCounter.forEach((dot, index) => {
            dot.addEventListener('click', function () {
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

         window.addEventListener('scroll', function () {
            DeskMedia.forEach((imgContainer, index) => {
               if (Theme.isInViewPort(imgContainer)) {
                  makeButtons(index);
               }
            });
         });

         stickyATC.addEventListener('click', async function () {
            var variantID = getVariant(section).id;
            var amount = parseInt(section.querySelector('.productQty [data-value]').getAttribute('data-value'));
            Theme.addToCart(variantID, amount);
         });

      },
      CartDrawer: function (section) {
         var cartLinks = document.querySelectorAll('[data-opencart]');
         cartLinks.forEach((link) => {
            //link.setAttribute('href', "#");
            link.addEventListener('click', function (e) {
               if (e.target !== link) {
                  return
               }
               Theme.cart.open();
            });
            //Theme.cart.init();
         });
      }
   },
   helpers: {
      modals: function(){
         var modalTriggers = document.querySelectorAll('[data-modal-target]');
         modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(){
               var targetModal = '#'.concat(trigger.getAttribute('data-modal-target'));
               if (document.querySelector(targetModal)){
                  var targetModal = document.querySelector(targetModal);
                  targetModal.classList.add('flex');
                  targetModal.classList.add('visible');

                  targetModal.querySelector('[data-closemodal]').addEventListener('click', function(){
                     targetModal.classList.remove('flex');
                     targetModal.classList.remove('visible');
                  })
               }
            })

         })
      },
      openDesc: function () {
         Theme.helpers.collapseProducts();
         var desk = document.querySelector('.MetaItem.ProductDescription');
         if (desk) {
            desk.setAttribute('initheihgt', Theme.helpers.convertRemToPixels(4) + 'px');
            desk.style.height = desk.scrollHeight + 'px';
            document.querySelector('.read').classList.add('hovered')
         }
      },
      toggleDesc: function () {
         Theme.helpers.collapseProducts();
         var desk = document.querySelector('.MetaItem.ProductDescription');
         if (desk.getAttribute('initheihgt')){
            desk.style.height = desk.getAttribute('initheihgt');
            desk.removeAttribute('initheihgt');
            document.querySelector('.read').classList.remove('hovered');
         }else{
            desk.setAttribute('initheihgt', Theme.helpers.convertRemToPixels(4) + 'px');
            desk.style.height = desk.scrollHeight + 'px';
            document.querySelector('.read').classList.add('hovered');
         }
      },
      toggleShipping: function () {
         Theme.helpers.collapseProducts();

         var desk = document.querySelector('.MetaItem[data-shipping-container]');
         if(JSON.parse(desk.getAttribute('hoveredDiv'))){
            desk.removeAttribute('hoveredDiv');
         document.querySelector('.ship').classList.remove('hovered')
         }else{
            desk.style.height = desk.scrollHeight + 'px';
            desk.setAttribute('hoveredDiv',true);
         document.querySelector('.ship').classList.add('hovered')
         }

      },
      openSizing: function () {
         Theme.helpers.collapseProducts();
      },
      collapseProducts: function () {
         var sizing = document.querySelector('.MetaItem[data-sizing-container]');
         var shipping = document.querySelector('.MetaItem[data-shipping-container]');
         var desk = document.querySelector('.MetaItem.ProductDescription');
         document.querySelector('.read').classList.remove('hovered')
         document.querySelector('.ship').classList.remove('hovered')
         desk.style.height = Theme.helpers.convertRemToPixels(4) + 'px';
         shipping.style.height = 0;
         sizing.style.height = 0;
      },
      convertRemToPixels: function (rem) {
         return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
      },
      qty: function (e, wrapper, ajaxCart) {
         var plus = wrapper.querySelector('.plus');
         var minus = wrapper.querySelector('.minus');
         var text = wrapper.querySelector('[data-value]');
         var current = parseFloat(text.getAttribute('data-value'));
         if (e.target.closest('.plus')) {
            var newValue = current + 1;
            console.log(current, newValue);
            text.setAttribute('data-value', newValue);
            text.textContent = newValue;
            if (!ajaxCart) {
               return;
            }
         }

         if (e.target.closest('.minus')) {
            var newValue = current - 1;
            if (newValue === 0 || newValue <= 0) {
               return
            }
            text.setAttribute('data-value', newValue);
            text.textContent = newValue;
            if (!ajaxCart) {
               return;
            }
         }
         if (ajaxCart) {
            var key = e.target.closest('[data-item]').getAttribute('data-item');
            var newAmount = newValue;
            Theme.changeCart(key, newAmount);
         }
      },
      remove: function (e, wrapper, ajaxCart) {
         if (ajaxCart) {
            var key = e.target.closest('[data-item]').getAttribute('data-item');
            Theme.changeCart(key, 0);
         }
      }
   },
   closeAll: function () {
      var mobileMenu = document.querySelector('#shopify-section-header .MobileMenu--Items');
      mobileMenu.style.height = 0 + 'px';
      var filter = document.querySelector('#FilterMobile');
      filter.style.height = 0 + 'px';
      var cart = document.querySelector('#cartMobile');
      document.querySelector('#cartMobile').style.height = '0';
      cart.setAttribute('opened', false);
      var search = document.querySelector('#mobileSearch');
      search.classList.remove('visible');
   },
   mobile_menu: {
      open: function () {
         Theme.closeAll();
         var mobileMenu = document.querySelector('#shopify-section-header .MobileMenu--Items');
         mobileMenu.style.height = mobileMenu.scrollHeight + 'px';
      },
      close: function () {
         var mobileMenu = document.querySelector('#shopify-section-header .MobileMenu--Items');
         console.log(mobileMenu);
         mobileMenu.style.height = 0 + 'px';
      }
   },
   filter: {
      open: function () {
         Theme.closeAll();
         var filter = document.querySelector('#FilterMobile');
         filter.style.height = filter.scrollHeight + 'px';
      },
      close: function () {
         var filter = document.querySelector('#FilterMobile');
         filter.style.height = 0 + 'px';
      }
   },
   search: {
      open: function () {
         Theme.closeAll();
         var search = document.querySelector('#mobileSearch');
         search.classList.add('visible')
      },
      openDesk: function () {
         var search = document.querySelector('#deskSearchForm');
         document.querySelector('[search-desk-button]').style.display = 'none';
         search.style.display = 'block';
      },
      close: function () {
         var search = document.querySelector('#mobileSearch');
         search.classList.remove('visible')

      },
      submit: function () {
         var value = document.querySelector('#mobileSearch input').value;
         var form = document.querySelector('#mobileSearch form');

         if (value) {
            console.log(value, form);
            form.submit();
         }
      },
      toggle(){
         var search = document.querySelector('#mobileSearch');
         search.classList.toggle('visible');
      }
   },
   mobile_cart: {
      open: function () {
         Theme.closeAll();
         var cart = document.querySelector('#cartMobile');
         if (JSON.parse(cart.getAttribute('opened'))) {
            Theme.mobile_cart.close();
            return
         }

         var contentHeights = document.querySelector('.MainMenu.Fixed').scrollHeight;
         document.querySelector('#cartMobile').style.height =  'calc(95vh - '+contentHeights+'px)';
         var cartHeight = cart.scrollHeight;
         var headerHeight = document.querySelector('.MainMenu.Fixed').scrollHeight;
         let root = document.documentElement;
         root.style.setProperty('--headerMobile', (headerHeight - cartHeight) + "px");

         cart.setAttribute('opened', true);
      },
      close: function () {
         var cart = document.querySelector('#cartMobile');
         document.querySelector('#cartMobile').style.height = '0';
         cart.setAttribute('opened', false);
      },
      init: function () {
         var cart = document.querySelector('#cartMobile');
         var qtys = cart.querySelectorAll('.qty--wrapper');
         var removeButtons = cart.querySelectorAll('.CartItem--remove');
         qtys.forEach((quantity) => {
            quantity.addEventListener('click', function (event) {
               Theme.helpers.qty(event, quantity, true);
            })
         });
         removeButtons.forEach((button) => {
            button.addEventListener('click', function (event) {
               Theme.helpers.remove(event, 0, true);
            })
         })
      }
   }
};

Theme.AjaxRenderer = (function () {
   function AjaxRenderer({
      sections,
      onReplace,
      debug
   } = {}) {
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

            return this.cachedSections.some(cachedSectionUrl) ?
               this.renderSectionFromCache(cachedSectionUrl, section) :
               this.renderSectionFromFetch(url, section);
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
                  this.cachedSections = [...this.cachedSections, {
                     html,
                     url
                  }];
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
         history.pushState({},
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