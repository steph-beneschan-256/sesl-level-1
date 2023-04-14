import { useEffect, useState } from "react";
import { database } from "./firebase_data/firebase";
import { ref, runTransaction } from "firebase/database";
import { getCity } from "./rev-geocoding/rev-geocode";

export default function ClickTracker() {
    // Number of clicks made by the user during the current session
    const [sessionClicks, setSessionClicks] = useState(0);
    // Whether the session data has been loaded
    const [dataLoaded, setDataLoaded] = useState(false);

    const [userCity, setUserCity] = useState("");
    const [userCityLoaded, setUserCoordsLoaded] = useState(false);

    const [clicksAtLastSync, setClicksAtLastSync] = useState(0); // The number of clicks during this session, when the database was last updated
    const [updatingDB, setUpdatingDB] = useState(false); // Whether the database is currently being updated

    function loadData() {
        const savedClickCount = JSON.parse(sessionStorage.getItem("session_clicks"));
        if(savedClickCount)
            setSessionClicks(savedClickCount);
        setDataLoaded(true);
    }

    /*
    Get the user's location, specifically the city in which
    the user is currently located.
    */
    async function locationButtonClicked() {
        getCity().then((newUserCity) => {
            console.log(newUserCity);
            setUserCity(newUserCity);
            setUserCoordsLoaded(true);
        });
        
    }

    function mainButtonClicked() {
        /*
        Saving should occur as soon as the value is updated. However,
        component states do not update immediately. To fix this, the
        new session click total is manually calculated and saved to
        the session storage.
        */
        const newSessionClicks = sessionClicks + 1;
        setSessionClicks(newSessionClicks);
        // Ensure that session storage is updated immediately
        sessionStorage.setItem("session_clicks", JSON.stringify(newSessionClicks));
    }

    /*
    Ensure that the database is not updated until after component state values have been updated 
    Synchronization with the database probably does not need to be immediate, so an effect hook
    is used here
    */
    useEffect(() => {
        if(userCityLoaded && !updatingDB) {
            setUpdatingDB(true); // prevent more than one update per render
            const clicksToAdd = sessionClicks - clicksAtLastSync;
            const locationRef = ref(database, "clicks_by_city");
            runTransaction(locationRef, (locData) => {
                if(locData) {
                    if(locData[userCity] && locData[userCity]["clicks"])
                        locData[userCity]["clicks"] = JSON.parse(locData[userCity]["clicks"]) + clicksToAdd;
                    else
                        locData[userCity] = {"clicks": clicksToAdd};
                }
                else
                    locData = {"clicks_by_city": {cityName:{"clicks":clicksToAdd}}};
                return locData;
            }).then(() => {
                setClicksAtLastSync(sessionClicks);
                console.log("Data saved");
                setUpdatingDB(false);
            }).catch((err) => {
                console.log(err);
                setUpdatingDB(false);
            });
        };

    }, [userCityLoaded, sessionClicks, userCity, clicksAtLastSync, updatingDB]);

    // Load session data only once
    if(!dataLoaded)
        loadData();

    return (
        <div>
            <button className="main-button" onClick={mainButtonClicked}>
                Click me!
            </button>
            <h2>
                Your clicks this session:
            </h2>
            <h1>
                {sessionClicks}
            </h1>
            {userCityLoaded ? 
            (<div>
                (Data sharing enabled)
            </div>)
            :
            (<div>
                <button className="location-button" onClick={locationButtonClicked}>
                    Share your click data (requires location access)
                </button>
            </div>)}
            
        </div>
    )
}