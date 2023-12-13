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
         //Edited the Toggle to validate the input fields
            if(el.querySelector('input')){
               let input = el.querySelector('input');
               if(input.checked){
                  el.classList.add('active')
               }else{
                  el.classList.remove('active')

               }
            }
            //el.classList.toggle('active')
      }
   });
})
