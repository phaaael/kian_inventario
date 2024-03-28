function toggleMenu(menuId) {
    var submenu = document.getElementById(menuId);
    if (submenu.classList.contains('expanded')) {
        submenu.classList.remove('expanded');
    } else {
        submenu.classList.add('expanded');
    }
}