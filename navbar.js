function openNav() {
  console.log("openNav called");
  var navElement = document.getElementById("nav");
  if (navElement) {
    console.log("nav element found");
    navElement.style.width = "20%";
  } else {
    console.error("nav element not found");
  }
};

function closeNav() {
  console.log("closeNav called");
  var navElement = document.getElementById("nav");
  if (navElement) {
    console.error("nav element found");
    navElement.style.width = "0";
  } else {
    console.error("nav element not found");
  }
};

// Ensure functions are accessible in the global scope
window.openNav = openNav;
window.closeNav = closeNav;