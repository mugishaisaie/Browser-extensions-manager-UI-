const modeBtn = document.getElementById("mode-btn");
const darkIcon = `<img src='assets/images/icon-moon.svg' alt="dark mode icon">`;
const lightIcon = `<img src='assets/images/icon-sun.svg'>`;
const filteredResults = document.querySelector(".filtered-results");

const body = document.body;
const savedTheme = localStorage.getItem("theme");

if(savedTheme === "dark"){
    body.classList.add("dark");
    modeBtn.innerHTML=lightIcon;
}else{
    modeBtn.innerHTML=darkIcon;

}
modeBtn.addEventListener("click", () => {
    body.classList.toggle("dark");
   const isDark = body.classList.contains("dark");
    // console.log(isDark)
    modeBtn.innerHTML = isDark ? lightIcon : darkIcon;

    // save the localStorage
    localStorage.setItem("theme",isDark ?"dark": "light");

})



 // fetch data
 let globalData = [];
async function fetchData() {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText);
    }
    const data = await response.json();
    globalData = data; // Store the fetched data in a global variable
    return data;
  }
  
  async function filterData(btn) {
    if(globalData.length === 0) await fetchData(); // Fetch data if not already fetched
    filteredResults.innerHTML = ""; // Clear previous results
  
    let filtered = [];
  
    if (btn.innerHTML === "all") {
      filtered = globalData;
    } else if (btn.innerHTML === "active") {
      filtered = globalData.filter((item) => item.isActive);
    } else if (btn.innerHTML === "inactive") {
      filtered = globalData.filter((item) => !item.isActive);
    }
  
    filtered.forEach(({ logo, name, description,isActive }) => {
      filteredResults.innerHTML += `
        <div class="extension-container">
        <div class="extension-card">

          <img src="${logo}" alt="extension logo" class="extension-logo">
          <div class="extension-info">
            <h3 class="extension-name">${name}</h3>
            <p class="extension-description">${description}</p>
          </div>
          </div>
          <div class="extension-btns">
            <button class='delete-btn' id='delete-btn-${name}' onclick="deleteExtension('${name}')">remove</button>
            <label class="toggle-switch">
              <input type="checkbox" ${isActive? 'checked': ''} id="ext-toggle-${name}" onchange="toggleExtension('${name}')" aria-label="Toggle ${name}">
              <span class="slider"></span>
            </label> 
          </div>
          </div>
        
      `;
    });
  }
// get delete btn
  function deleteExtension(name){
  globalData = globalData.filter((data)=>data.name !== name)

  const activeBtn = document.querySelector(".filter-btns .active");
  filterData(activeBtn); // Refresh the displayed data based on the active filter button
}
// toggleExtension
 async function toggleExtension(name){
    
    globalData = globalData.map((extension)=>{

      if(extension.name === name){
        return {...extension, isActive: !extension.isActive}
      }
      return extension;

    })

    const activeBtn = document.querySelector(".filter-btns .active");
    filterData(activeBtn); // Refresh the displayed data based on the active filter button
  
}




  // Load all data on initial load

  const allBtn = document.querySelector(".filter-btns button:nth-child(1)");
  allBtn.classList.add("active"); // Set the first button as active by default
  filterData(allBtn); // Load all data on initial load
  // hook buttons to event listener
  const filterContainerBtns = document.querySelector(".filter-btns");
  const filterBtns = filterContainerBtns.querySelectorAll("button");
  
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      
      filterBtns.forEach((btn)=>btn.classList.remove("active"));
      btn.classList.add("active");
      filterData(btn)
     
    
    });
  });
  