document.querySelectorAll('.details').forEach((el) => {
   
   el.addEventListener('click', () => {
      
      const filterGroup = el.lastElementChild;
      if (filterGroup.classList.contains('size-transition')){
      filterGroup.classList.toggle('growLarge');} else{
         filterGroup.classList.toggle('grow');
      }
      
   });
});
