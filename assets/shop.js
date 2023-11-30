document.querySelectorAll('.filter-group').forEach((el) => {
   el.addEventListener('click', () => {
      const filterGroup = el.nextElementSibling;
      filterGroup.classList.toggle('grow');
   });
});
const isMobile = window.innerWidth < 649
document.querySelectorAll('.filter-group-display__list-item').forEach((el) => {
   el.addEventListener('click', () => {
      if (!isMobile){
            el.classList.toggle('active')
      }
      
   });
})
