document.querySelectorAll('.filter-group').forEach((el) => {
   el.addEventListener('click', () => {
      const filterGroup = el.nextElementSibling;
      filterGroup.classList.toggle('grow');

      if (filterGroup.hasAttribute('data-height')){
         filterGroup.closest('#FilterMobile').style.height = filterGroup.closest('#FilterMobile').scrollHeight - (parseInt(filterGroup.getAttribute('data-height'))) + 'px';
         filterGroup.removeAttribute('data-height');

      }else{
         filterGroup.setAttribute('data-height', getComputedStyle(filterGroup).getPropertyValue('height'));
         filterGroup.closest('#FilterMobile').style.height = filterGroup.closest('#FilterMobile').scrollHeight + 'px';
      }
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
