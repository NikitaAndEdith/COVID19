const covidApp = {};
covidApp.dropDown = ()=>{
    //source for the DropDown menu design and logic:  https://github.com/Godsont/Custom-Select-Box-with-Search
    const selected = document.querySelector(".selected");
    const optionsContainer = document.querySelector(".options-container");
    const searchBox = document.querySelector(".search-box input");


    selected.addEventListener("click", () => {
        optionsContainer.classList.toggle("active");

        searchBox.value = "";
        filterList("");

        if (optionsContainer.classList.contains("active")) {
            searchBox.focus();
        };
    });
 
    covidApp.optionsList.forEach(o => {
        o.addEventListener("click", () => {
            selected.innerHTML = o.querySelector("label").innerHTML;
            optionsContainer.classList.remove("active");
        });
    }
    );

    searchBox.addEventListener("keyup", function (e) {
        filterList(e.target.value);
    });

    const filterList = searchTerm => {
        searchTerm = searchTerm.toLowerCase();
        optionsList.forEach(option => {
            let label = option.firstElementChild.nextElementSibling.innerText.toLowerCase();
            if (label.indexOf(searchTerm) != -1) {
                option.style.display = "block";
            } else {
                option.style.display = "none";
            }
        });
    };
};

covidApp.baseUrl = "https://api.covid19api.com/";


covidApp.getCountries = () =>{
    const setup = {
        "url": `${covidApp.baseUrl}summary`,
        "method": "GET",
        "timeout": 0
    }
    $.ajax(setup).then(data => {
        data.Countries.forEach((item) => {
            const fullCountryName = item.Country;
            $('.options-container').append(`
            <div class="option">
                <input type="radio" class="radio" id=${fullCountryName} name="category" />
                <label for=${fullCountryName}>${fullCountryName}</label>
            </div>
            `);
            $('.option').on('click', function () {
                // console.log(this)
            });
        });
        covidApp.optionsList = document.querySelectorAll(".option");
        covidApp.dropDown();
        
    });
};

covidApp.init = ()=>{
    covidApp.getCountries();
};

$(function() {
    covidApp.init();
});