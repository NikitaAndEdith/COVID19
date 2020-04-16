const covidApp = {};
covidApp.baseUrl = "https://api.covid19api.com/";

covidApp.getCountryStats = (country)=>{
    var settings = {
        "url": "https://api.covid19api.com/summary",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).then( (data)=>{
        // console.log(data);
        // console.log(data.Countries);
        // data.Countries
        data.Countries.forEach( (item)=>{
            // console.log(item.Country);
            if (item.Country === country) {
                console.log(item);

                const NewConfirmed = item.NewConfirmed;
                const TotalConfirmed = item.TotalConfirmed;
                const NewDeaths = item.NewDeaths;
                const TotalDeaths = item.TotalDeaths;
                const NewRecovered = item.NewRecovered;
                const TotalRecovered = item.TotalRecovered;


                $('.statsBox').empty().append(`
                    <h2 class="headers">${country} stats:</h2>
                    <h3 class="headers">New Cases: ${NewConfirmed}</h3>
                    <h3 class="headers">Total Cases: ${TotalConfirmed}</h3>
                    <h3 class="headers">New Deaths: ${NewDeaths}</h3>
                    <h3 class="headers">Total Deaths: ${TotalDeaths}</h3>
                    <h3 class="headers">New Recovered: ${NewRecovered}</h3>
                    <h3 class="headers">Total Recovered: ${TotalRecovered}</h3>
                `);
            };
        })
    });
};

covidApp.getGlobal = ()=>{

    var settings = {
        "url": "https://api.covid19api.com/summary",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).then(function (response) {
        // console.log(response.Global);

        const globalNewConfirmed = response.Global.NewConfirmed;
        const globalTotalConfirmed = response.Global.TotalConfirmed;
        const globalNewDeaths = response.Global.NewDeaths;
        const globalTotalDeaths = response.Global.TotalDeaths;
        const globalNewRecovered = response.Global.NewRecovered;
        const globalTotalRecovered = response.Global.TotalRecovered;

        $('.statsBox').append(`
            <h2 class="headers">Global stats:</h2>
            <h3 class="headers">New Cases: ${globalNewConfirmed}</h3>
            <h3 class="headers">Total Cases: ${globalTotalConfirmed}</h3>
            <h3 class="headers">New Deaths: ${globalNewDeaths}</h3>
            <h3 class="headers">Total Deaths: ${globalTotalDeaths}</h3>
            <h3 class="headers">New Recovered: ${globalNewRecovered}</h3>
            <h3 class="headers">Total Recovered: ${globalTotalRecovered}</h3>
        `);
    });
};

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
        o.addEventListener("click", (event) => {
            event.preventDefault();
            selected.innerHTML = o.querySelector("label").innerHTML;
            //closes the drop down on selection
            optionsContainer.classList.remove("active");

            // // 3. grabs the selected country value and saves it in a variable
            const selectedCountry = $(selected).text();
            // console.log(`User selected: ${selectedCountry}`);

            covidApp.getCountryStats(selectedCountry);
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
        // calling the drop down logic here
        covidApp.dropDown();
    });
};



covidApp.init = () => {
    covidApp.getGlobal();
    covidApp.getCountries();
};

$(function () {
    covidApp.init();
});