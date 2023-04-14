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
                const c = snapshot.val()["clicks_by_city"];

                // Render data table
                setDataTableRows(Object.entries(c).map(([city, cityData]) => {
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
                console.log("Could not retrieve world click data");
            }
        })

    }

    return (
        <div className="click-map">
            {mapDataLoaded ? (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>City</th>
                                <th>Number of Clicks</th>
                            </tr>
                        </thead>
                        {dataTableRows.length > 0 && (
                            <tbody>
                                {dataTableRows}
                            </tbody>
                        )}
                    </table>
                    <div>
                        World click data last updated at {mapTimeStamp}
                    </div>
                    <button onClick={getMapData}>
                    Update world click data
                    </button>
                </div>
                )
            : (
                <button onClick={getMapData}>
                    Retrieve world click data
                </button>
            )
            }
        </div>
    )

}