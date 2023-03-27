(function (document) {
   let slider = document.querySelector('#toggle');
   let oddRows = document.querySelectorAll('.row:nth-child(odd)');
   let cardImgs = document.querySelectorAll('.card-img')
   var shuffle = false;

   slider.addEventListener('click', function () {
      shuffle = !shuffle;
      slider.classList.toggle('active')
      if (shuffle) {
         oddRows.forEach(row => {
            row.className = 'row oddResizer';
            row.lastElementChild.className = 'product-card stacked rowChild widen'
         });
         cardImgs.forEach(card => {
               card.classList.toggle('remove')
         })
      } else {
         oddRows.forEach(row => {
            row.className = 'row';
            row.lastElementChild.className = 'product-card stacked rowChild'
         });
         cardImgs.forEach(card => {
            card.classList.toggle('remove')
      })
      }
     
   });
})(document);