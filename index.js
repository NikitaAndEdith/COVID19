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
                // console.log(item);
                
                const NewConfirmed = item.NewConfirmed.toLocaleString();
                const TotalConfirmed = item.TotalConfirmed.toLocaleString();
                const NewDeaths = item.NewDeaths.toLocaleString();
                const TotalDeaths = item.TotalDeaths.toLocaleString();
                const NewRecovered = item.NewRecovered.toLocaleString();
                const TotalRecovered = item.TotalRecovered.toLocaleString();

                $('.statsBox').empty().append(`
                    <tr class="headers"><td>New Cases:</td><td>${NewConfirmed}</td></tr>
                    <tr class="headers"><td>Total Cases:</td><td>${TotalConfirmed}</td></tr>
                    <tr class="headers"><td>New Deaths:</td><td>${NewDeaths}</td></tr>
                    <tr class="headers"><td>Total Deaths:</td><td>${TotalDeaths}</td></tr>
                    <tr class="headers"><td>New Recovered:</td><td>${NewRecovered}</td></tr>
                    <tr class="headers"><td>Total Recovered:</td><td>${TotalRecovered}</td></tr>
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

        const globalNewConfirmed = response.Global.NewConfirmed.toLocaleString();
        const globalTotalConfirmed = response.Global.TotalConfirmed.toLocaleString();
        const globalNewDeaths = response.Global.NewDeaths.toLocaleString();
        const globalTotalDeaths = response.Global.TotalDeaths.toLocaleString();
        const globalNewRecovered = response.Global.NewRecovered.toLocaleString();
        const globalTotalRecovered = response.Global.TotalRecovered.toLocaleString();

        $('.statsBox').append(`
            <tr>
                <th class="headers">Global stats:</th>
            </tr>  
            <tr>
                <td class="headers">New Cases:</td><td>${globalNewConfirmed}</td>
            </tr>
            <tr>
                <td class="headers">Total Cases:</td><td>${globalTotalConfirmed}</td>
            </tr>
            <tr>
                <td class="headers">New Deaths:</td><td>${globalNewDeaths}</td>
            </tr>
            <tr>
                <td class="headers">Total Deaths:</td><td>${globalTotalDeaths}</td>
            </tr>
            <tr>
                <td class="headers">New Recovered:</td><td>${globalNewRecovered}</td>
            </tr>
            <tr>
                <td class="headers">Total Recovered:</td><td>${globalTotalRecovered}</td>
            </tr>
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

        //don't show the table when the menu is open
        $(".statsBox").css("opacity", "0");

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

            //don't show the table when the menu is open
            $(".statsBox").css("opacity", "1");

            // 3. grabs the selected country value and saves it in a variable
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