
//Local Storage City Search
var city="";
// Variables
var searchCity = document.querySelector("#searchCity");
var searchBtn = document.querySelector("#searchBtn");
var clearHist = document.querySelector("#clearHist");
var currentCity = document.querySelector("#currentCity");
var currentTemp = document.querySelector("#temp");
var currentHumid = document.querySelector("#humid")
var currentWindSpeed = document.querySelector("#windSpeed");
var currentUvIndex= document.querySelector("#uvIndex");
var sCity=[];
// Search storage for city that exists
function find(c){
    for (var i=0; i<sCity.length; i++){
        if(c.toUpperCase()===sCity[i]){
            return -1;
        }
    }
    return 1;
}
//Set up the API key
var APIKey="a0aca8a89948154a4182dcecc780b513";
// Grab current weather for city search from API
currentCity.addEventListener("click", function(e) {
    e.preventDefault();
    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        currentWeather(city);
});
// API Call
function currentWeather(city){
    // GET call from API
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){

        // console log response from API
        console.log(response);
        // Get date, name, and icon and concat all three
        //Dta object from server side Api for icon property.
        var currentCity = document.querySelector("#currentCity");
        var weatherIcon= response.weather[0].icon;
        var iconurl="https://openweathermap.org/img/wn/"+weatherIcon +"@2x.png";
        var date=new Date(response.dt*1000).toLocaleDateString();
        $(currentCity).html(response.name +" ("+date+") " + "<img src="+iconurl+">");
        // Parse Temp & Convert to fahrenheit
        var currentTemp = document.querySelector("#temp");
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(currentTemp).html((tempF).toFixed(2)+"&#8457");
        // Humidity
        var currentHumid = document.querySelector("#humid")
        $(currentHumid).html(response.main.humidity+"%");
        //Wind Speed in mph
        var currentWindSpeed = document.querySelector("#windSpeed");
        var ws=response.wind.speed;
        var windMph=(ws*2.237).toFixed(1);
        $(currentWindSpeed).html(windMph+"MPH");
        // UV Index
        // Get UV index and manipulate
        UVIndex(response.coord.lon,response.coord.lat);
        forecast(response.id);
        if(response.cod==200){
            sCity=JSON.parse(localStorage.getItem("cityName"));
            console.log(sCity);
            if (sCity==null){
                sCity=[];
                sCity.push(city.toUpperCase()
                );
                localStorage.setItem("cityName",JSON.stringify(sCity));
                addToList(city);
            }
            else {
                if(find(city)>0){
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("cityName",JSON.stringify(sCity));
                    addToList(city);
                }
            }
        }

    });
}
    // This function returns the UVIindex response.
function UVIndex(ln,lt){
    //lets build the url for uvindex.
    var uvqURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln;
    $.ajax({
            url:uvqURL,
            method:"GET"
            }).then(function(response){
                $(currentUvIndex).html(response.value);
            });
}
    
// 5-Day Forecast
function forecast(cityid){
    var dayover= false;
    var queryforcastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+APIKey;
    $.ajax({
        url:queryforcastURL,
        method:"GET"
    }).then(function(response){
        
        for (i=0;i<5;i++){
            var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            var iconcode= response.list[((i+1)*8)-1].weather[0].icon;
            var iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
            var tempK= response.list[((i+1)*8)-1].main.temp;
            var tempF=(((tempK-273.5)*1.80)+32).toFixed(2);
            var humid= response.list[((i+1)*8)-1].main.humidity;
        
            $("#fDate"+i).html(date);
            $("#fImg"+i).html("<img src="+iconurl+">");
            $("#fTemp"+i).html(tempF+"&#8457");
            $("#fHumid"+i).html(humid+"%");
        }
        
    });
}
//Add past search to Storage list
function addToList(c){
    var listEl= $("<li>"+c.toUpperCase()+"</li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",c.toUpperCase());
    $(".list-group").append(listEl);
}
// Double-click to invoke past search
function invokePastSearch(e){
    var liEl=e.target;
    if (e.target.matches("li")){
        city=liEl.textContent.trim();
        currentWeather(city);
    }
}

// Render
function loadlastCity(){
    $("ul").empty();
    var sCity = JSON.parse(localStorage.getItem("cityName"));
    if(sCity!==null){
        sCity=JSON.parse(localStorage.getItem("cityName"));
        for(i=0; i<sCity.length;i++){
            addToList(sCity[i]);
        }
        city=sCity[i-1];
        currentWeather(city);
    }
}
//Clear the search history from the page
clearHist.addEventListener("click", function(e) {
    e.preventDefault();
    sCity=[];
    localStorage.removeItem("cityName");
    document.location.reload();
});

//Click Handlers
$(document).on("click",invokePastSearch);
$(window).on("load",loadlastCity);





















