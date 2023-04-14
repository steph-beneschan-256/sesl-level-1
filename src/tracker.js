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

    // Number of clicks that still need to be saved to the database
    const [unsavedClicks, setUnsavedClicks] = useState(0);

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
        Saving should occur as soon as the value is updated, so I elected to use an event handler
        instead of an effect hook.
        */
        const newSessionClicks = sessionClicks + 1; // Since component states do not update immediately, the new value is calculated ad hoc
        setSessionClicks(n => n + 1);
        setUnsavedClicks(n => n + 1);
        // Ensure that session storage is updated immediately
        sessionStorage.setItem("session_clicks", JSON.stringify(newSessionClicks));
    }

    /*
    Whenever there are unsaved clicks (i.e. clicks from the user that have not yet been
    saved to the database), update the database appropriately.
    I decided that an effect hook was necessary here to ensure that the database always
    reflects the correct data.
    
    Usefully, the hook should also automatically trigger when the user enables location
    permissions (which modifies the userCity variable).
    */
    useEffect(() => {
        if((unsavedClicks > 0) && (userCity)) {
            setUnsavedClicks(0);
            const locationRef = ref(database, "clicks_by_city");
            runTransaction(locationRef, (locData) => {
                if(locData) {
                    if(locData[userCity] && locData[userCity]["clicks"])
                        locData[userCity]["clicks"] = JSON.parse(locData[userCity]["clicks"]) + unsavedClicks;
                    else
                        locData[userCity] = {"clicks": unsavedClicks};
                }
                else
                    locData = {"clicks_by_city": {cityName:{"clicks":unsavedClicks}}};
                return locData;
            }).then(() => {
            
            }).catch((err) => {
                console.log(err);
            });
        }

    }, [unsavedClicks, userCity])

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