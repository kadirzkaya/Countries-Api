const countryState=document.querySelector(".countryState");
const loading=document.querySelector(".loading");
const neighbours=document.querySelector(".neighbours");
const inputSearch=document.querySelector("#inputSearch");
const search=document.querySelector("#search");
const link="https://restcountries.com/v3.1/name/";
const neighboursApi="https://restcountries.com/v3.1/alpha?codes=";

let loc="";
let color="";
let cityName="";

search.addEventListener("click",(e)=>{
    e.preventDefault();
    loc=inputSearch.value;
    countryState.innerHTML="";
    neighbours.innerHTML="";
    inputSearch.value="";
    loading.classList.remove("hide");
    fetchApi(link);
    
});

async function fetchApi(link){
    const response=await fetch(link+loc);
    if(response.ok){
        const data=await response.json();

        showCountryState(data[0]);


        if(data[0].borders!=null){
            let borders=data[0].borders.join(",");
            const resNeighbours=await fetch(neighboursApi+borders);
            if(resNeighbours.ok){
                const neighboursData=await resNeighbours.json();
                showCountryNeighbours(neighboursData);
            }else {
                newBordersError("Komuşu ülkeler bulunmaya çalışılırken bir hata oluştu.");
            }
        }else {
            newBordersError("Bu ülkenin herhangi bir komşusu bulunmamaktadır.");
        }        

    }else{
        loading.classList.add("hide");
        newError("Geçerli bir ülke giriniz.");
    }
};

const newError=(err)=>{
    countryState.innerHTML=`<h6 class="alert alert-danger">${err}</h6>`;
    neighbours.innerHTML=`<h6 class="alert alert-danger">Ülke bulunamadığından komşu bulunamaz.</h6>`;
}

const newBordersError=(err)=>{
    neighbours.innerHTML=`<h6 class="alert alert-danger">${err}</h6>`;
}

const showCountryState=(data)=>{
    let population=populate(data.population)
    const html=`<img src="${data.flags.png}">
                <h2>${data.name.common}</h2>
                <h6><span><i class="fa-solid fa-landmark-flag"></i></span>${data.capital[0]}</h6>
                <h6><span><i class="fa-solid fa-person"></i></span>${population} million</h6>
                <h6><span><i class="fa-solid fa-language"></i></span>${Object.values(data.languages)} </h6>
                <h6><span><i class="fa-solid fa-globe"></i></span>${data.continents[0]}</h6>
                <h6><span><i class="fa-solid fa-wallet"></i></span>${Object.values(data.currencies)[0].name}-${Object.values(data.currencies)[0].symbol}</h6>
                <h6><span><i class="fa-regular fa-clock"></i></span>${data.timezones[0]}</h6>`;
    loading.classList.add("hide");
    countryState.innerHTML=html;
}

const showCountryNeighbours=(borders)=>{
    let htmlBorder="";
    borders.forEach(element => {
        let population=populate(element.population)
        htmlBorder+=`<div>
                    <img src="${element.flags.png}">
                    <h2>${element.name.common}</h2>
                    <h6><span><i class="fa-solid fa-landmark-flag"></i></span>${element.capital[0]}</h6>
                    <h6><span><i class="fa-solid fa-person"></i></span>${population} million</h6>
                    <h6><span><i class="fa-solid fa-language"></i></span>${Object.values(element.languages)} </h6>
                    <h6><span><i class="fa-solid fa-globe"></i></span>${element.continents[0]}</h6>
                    <h6><span><i class="fa-solid fa-wallet"></i></span>${Object.values(element.currencies)[0].name}-${Object.values(element.currencies)[0].symbol}</h6>
                    <h6><span><i class="fa-regular fa-clock"></i></span>${element.timezones[0]}</h6>
                    </div>`;
    });

    neighbours.innerHTML=htmlBorder;
}