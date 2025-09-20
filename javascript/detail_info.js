let eventsGlobal = {};
const url1 = 'https://api-formula-1.p.rapidapi.com/races?season=2025';
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': '',
        'x-rapidapi-host': 'api-formula-1.p.rapidapi.com'
    }
};

function getSessionTime(session, currentEvent) {
    let sessionTime = new Date(currentEvent.get(session).date);
    return sessionTime.toLocaleTimeString("en-AU") + " " + sessionTime.toLocaleDateString("en-AU");
}

function updateInfoStandardRace(currentEvent) {
    const trackMap = document.getElementById("track-map");
    const trackName = document.getElementById("track-name");
    const p1 = document.getElementById("session1");
    const p2Label = document.getElementById("session2-label");
    const p2 = document.getElementById("session2");
    const p3Label = document.getElementById("session3-label");
    const p3 = document.getElementById("session3");
    const quali = document.getElementById("quali");
    const race = document.getElementById("race");
    const country = document.getElementById("country");
    const city = document.getElementById("city");
    const distance = document.getElementById("distance");
    const raceDates = document.getElementById("race-dates");

    let startDate = new Date(currentEvent.get("1st Practice").date);
    let endDate = new Date(currentEvent.get("Race").date);

    trackMap.src = "images/" + currentEvent.get("Race").competition.id + ".avif";
    trackName.innerText = currentEvent.get("Race").competition.name;
    p1.innerText = getSessionTime("1st Practice", currentEvent);
    p2Label.innerText = "Practice 2: ";
    p2.innerText = getSessionTime("2nd Practice", currentEvent);
    p3Label.innerText = "Practice 3: ";
    p3.innerText = getSessionTime("3rd Practice", currentEvent);
    quali.innerText = getSessionTime("1st Qualifying", currentEvent);
    race.innerText = getSessionTime("Race", currentEvent);
    country.innerText = currentEvent.get("Race").competition.location.country;
    city.innerText = currentEvent.get("Race").competition.location.city;
    distance.innerText = currentEvent.get("Race").distance;
    raceDates.innerText = startDate.toLocaleDateString("en-AU") + " - " + endDate.toLocaleDateString("en-AU");
}

function updateInfoSprintRace(currentEvent) {
    const trackMap = document.getElementById("track-map");
    const trackName = document.getElementById("track-name");
    const p1 = document.getElementById("session1");
    const sprintQualiLabel = document.getElementById("session2-label");
    const sprintQuali = document.getElementById("session2");
    const sprintLabel = document.getElementById("session3-label");
    const sprint = document.getElementById("session3");
    const quali = document.getElementById("quali");
    const race = document.getElementById("race");
    const country = document.getElementById("country");
    const city = document.getElementById("city");
    const distance = document.getElementById("distance");
    const raceDates = document.getElementById("race-dates");

    let startDate = new Date(currentEvent.get("1st Practice").date);
    let endDate = new Date(currentEvent.get("Race").date);


    trackMap.src = "images/" + currentEvent.get("Race").competition.id + ".avif";
    trackName.innerText = currentEvent.get("Race").competition.name;
    p1.innerText = getSessionTime("1st Practice", currentEvent);
    sprintQualiLabel.innerText = "Sprint Shootout: ";
    sprintQuali.innerText = getSessionTime("1st Sprint Shootout", currentEvent);
    sprintLabel.innerText = "Sprint Race: ";
    sprint.innerText = getSessionTime("Sprint", currentEvent);
    quali.innerText = getSessionTime("1st Qualifying", currentEvent);
    race.innerText = getSessionTime("Race", currentEvent);
    country.innerText = currentEvent.get("Race").competition.location.country;
    city.innerText = currentEvent.get("Race").competition.location.city;
    distance.innerText = currentEvent.get("Race").distance;
    raceDates.innerText = startDate.toLocaleDateString("en-AU") + " - " + endDate.toLocaleDateString("en-AU");
}

function changeInfo() {
    let menu = document.getElementById("races");
    let compId = menu.value;
    let currentEvent = eventsGlobal.get(parseInt(compId));
    console.log(currentEvent);
    if (currentEvent.has("2nd Practice")) {
        updateInfoStandardRace(currentEvent);
    } else {
        updateInfoSprintRace(currentEvent);
    }
}

fetch(url1, options)
    .then((answer) => {
        return answer.json();
    })
    .then((answer) => {
        let events = new Map();
        for (let i = 0; i < answer.response.length; i++) {
            let compId = answer.response[i].competition.id;
            let type = answer.response[i].type;

            let tempEvent = new Map();
            if (events.get(compId) !== undefined) {
                tempEvent = events.get(compId);
            }
            tempEvent.set(String(type), answer.response[i]);
            events.set(compId, tempEvent);
        }

        eventsGlobal = events;

        console.log(events);
        let keys = events.keys();
        for (let i = 0; i < events.size; i++) {
            let compId = keys.next();
            let currentEvent = events.get(compId.value);
            let eventName = currentEvent.get("Race").competition.name;
            const option = document.createElement("option");
            const element = document.getElementById("races");
            option.value = compId.value;
            option.text = eventName;
            element.appendChild(option);
        }
    })

document.getElementById("races").addEventListener("change", changeInfo);
