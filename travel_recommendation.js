document.querySelectorAll(".link").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const url = e.target.getAttribute("href");
        showPage(url);
    });
});

const showPage = async url => {
    await fetch(url)
        .then(response => response.text())
        .then(html => {
            document.querySelector("main").innerHTML = html;
        })
        .catch(err => console.warn("Error loading the site", err));
}

const searchClick = async () => {
    const loadedData = await fetchAPI();
    await showLoadedData(loadedData);
    console.log(loadedData);
}

const clearClick = () => {
    document.getElementById("search").value = "";
    document.querySelector(".recommendations").remove();
}

const fetchAPI = async () => {
    const data = await fetch("travel_recommendation_api.json")
        .then(response => response.json())
        .then(data => data);
    const searchText = document.getElementById("search").value.toLowerCase();
    const loadedData = [];
    if (searchText.includes("countries") || searchText.includes("country")) return getAllCities(data);
    if (searchText.includes("beach")) return getAllBeaches(data);
    if (searchText.includes("temple")) return getAllTemples(data);

    Object.entries(data).forEach(([key, value]) => {
        switch (key) {
            case "countries":
                value.forEach(country => {
                    country.cities.forEach(city => {
                        if (city.name.toLowerCase().includes(searchText) || city.description.toLowerCase().includes(searchText)) {
                            loadedData.push(city);
                        }
                    });
                });
                break;
            case "temples":
                searchInTemplesOrBeaches(value);
                break;
            case "beaches":
                searchInTemplesOrBeaches(value);
                break;
        }
    })
    return loadedData;

    function searchInTemplesOrBeaches(value) {
        value.forEach(element => {
            if (element.name.toLowerCase().includes(searchText) || element.description.toLowerCase().includes(searchText)) {
                loadedData.push(element);
            };
        });
    }
}

function getAllCities(data) {
    const returnArray = [];
    data.countries.forEach(country => returnArray.push(...country.cities));
    return returnArray;
}

function getAllBeaches(data) {
    return data.beaches;
}

function getAllTemples(data) {
    return data.temples;
}

const showLoadedData = async (loadedData) => {
    await showPage("home.html");
    const main = document.querySelector("main");
    const recommendations = document.createElement("div");
    recommendations.classList.add("recommendations");
    loadedData.forEach(entry => {
        const recommendation = document.createElement("div");

        const textDiv = document.createElement("div");

        const image = document.createElement("img");
        const title = document.createElement("h3");
        const description = document.createElement("p");
        const visit = document.createElement("button");

        image.setAttribute("src", entry.imageUrl);
        title.innerText = entry.name;
        description.innerText = entry.description;
        visit.innerText = "Visit";

        recommendation.classList.add("recommendation");
        recommendation.appendChild(image);
        textDiv.appendChild(title);
        textDiv.appendChild(description);
        textDiv.appendChild(visit);
        recommendation.appendChild(textDiv);

        recommendations.appendChild(recommendation)
    })
    main.appendChild(recommendations);
}