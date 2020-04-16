const covidApp = {};
covidApp.baseUrl = "https://api.covid19api.com/";


covidApp.dropDown = () => {
    //source for the DropDown menu design and logic:  https://github.com/Godsont/Custom-Select-Box-with-Search
    const selected = document.querySelector(".selected");
    const optionsContainer = document.querySelector(".options-container");
    const searchBox = document.querySelector(".search-box input");
    const optionsList = document.querySelectorAll(".option");

    selected.addEventListener("click", () => {
        //listens for a click on Please Select Country box
        //adds a class Active to it
        optionsContainer.classList.toggle("active");

        searchBox.value = "";
        filterList("");

        //puts the cursor in the search box
        if (optionsContainer.classList.contains("active")) {
            searchBox.focus();
        };
    });

    //appends the list of countries in the drop down menu 
    optionsList.forEach(o => {
        o.addEventListener("click", () => {
            selected.innerHTML = o.querySelector("label").innerHTML;
            //closes the drop down on selection
            optionsContainer.classList.remove("active");

            // 3. grabs the selected country value and saves it in a variable
            const selectedCountry = $(selected).text();
            console.log(`User selected: ${selectedCountry}`);
        });
    });

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



covidApp.getCountries = () => {
    const setup = {
        "url": `${covidApp.baseUrl}summary`,
        "method": "GET",
        "timeout": 0
    };

    $.ajax(setup).then(data => {
        data.Countries.forEach((item) => {
            const fullCountryName = item.Country;
            $('.options-container').append(`
                <div class="option">
                    <input type="radio" class="radio" id=${fullCountryName} name="category" />
                    <label for=${fullCountryName}>${fullCountryName}</label>
                </div>
            `);
        });
        covidApp.dropDown();
        // 1. calling the drop down logic here
    });
};



covidApp.init = () => {
    covidApp.getCountries();
    // 2. covidApp.dropDown(); //removing this function because we called it inside covidApp.getCountries
};

$(function () {
    covidApp.init();
});