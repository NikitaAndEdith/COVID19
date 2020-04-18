const covidApp = {};
covidApp.baseUrl = "https://api.covid19api.com/";

const xDate = [];
const yDeaths = [];
const yConfirmed = [];


// Function for mapping graph
function graphIt(){
    const ctx = document.getElementById('myChart').getContext('2d');
    const chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: xDate,
            datasets: [{
                label: "Deaths",
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: yDeaths,
            }, {
                label: "Cases",
                fill: false,
                borderColor: '#ffff00',
                data: yConfirmed,

            }]
        },

        // Configuration options go here
        options: {}
    });
}

covidApp.getSinceDayOne = (country) => {
    const dayOne = {
        "url": `${covidApp.baseUrl}/total/dayone/country/${country}`,
        "method": "GET",
        "timeout": 500,    
    };

    $.ajax(dayOne).then((data) => {
        // console.log(data)
        let yesterdayDeath = 0;
        let yesterdayCases = 0;
        data.forEach((item) => {
            const deathsDelta = item.Deaths - yesterdayDeath;
            const confirmedCasesDelta = item.Confirmed - yesterdayCases;
            const dayOneDate = item.Date.split('T')[0];
            
            yDeaths.push(deathsDelta);
            yConfirmed.push(confirmedCasesDelta);
            xDate.push(dayOneDate);

            yesterdayDeath = item.Deaths;
            yesterdayCases = item.Confirmed;
        });
        graphIt();
    })
};

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

        const globalNewConfirmed = response.Global.NewConfirmed.toLocaleString();
        const globalTotalConfirmed = response.Global.TotalConfirmed.toLocaleString();
        const globalNewDeaths = response.Global.NewDeaths.toLocaleString();
        const globalTotalDeaths = response.Global.TotalDeaths.toLocaleString();
        const globalNewRecovered = response.Global.NewRecovered.toLocaleString();
        const globalTotalRecovered = response.Global.TotalRecovered.toLocaleString();
        

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
            covidApp.getSinceDayOne(selectedCountry);

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