import { useState } from "react";
import { database } from "./firebase_data/firebase";
import { ref, get } from "firebase/database";

export default function ClickMap(){

    const [dataTableRows, setDataTableRows] = useState([]);
    const [mapTimeStamp, setMapTimeStamp] = useState("");
    const [mapDataLoaded, setMapDataLoaded] = useState(false);

    //get most recent map data
    function getMapData() {
        
        // Read map data from database
        get(ref(database)).then((snapshot) => {
            if(snapshot.exists()) {
                console.log(snapshot);
                const c = snapshot.val();

                // Render data table
                setDataTableRows(Object.entries(c).map(([city, cityData]) => {
                    console.log(`${city}: ${cityData["clicks"]} clicks`);
                    return(
                        <tr>
                            <td>{city}</td>
                            <td>{cityData["clicks"]} clicks</td>
                        </tr>
                    )
                }));
                
                // Update timestamp
                const currTime = new Date(Date.now());
                setMapTimeStamp(currTime.toLocaleTimeString());

                setMapDataLoaded(true);
            }
            else {
                console.log("Could not retrieve map data");
            }
        })

    }

    return (
        <div className="click-map">
            {mapDataLoaded ? (
                <div>
                    <table>
                        <tr>
                            <th>City</th>
                            <th>Number of Clicks</th>
                        </tr>
                        {dataTableRows}
                    </table>
                    <div>
                        Map last updated at {mapTimeStamp}
                    </div>
                    <button onClick={getMapData}>
                    Update map data
                    </button>
                </div>
                )
            : (
                <button onClick={getMapData}>
                    Retrieve map data
                </button>
            )
            }
        </div>
    )

}