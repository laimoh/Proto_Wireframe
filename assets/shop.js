document.querySelectorAll('.filter-group').forEach((el) => {
   el.addEventListener('click', () => {
      const filterGroup = el.nextElementSibling;
      filterGroup.classList.toggle('grow');
   });
});
