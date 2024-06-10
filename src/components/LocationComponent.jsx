import React, { useState, useEffect } from "react";

const LocationComponent = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
            .then((response) => response.json())
            .then((data) => {
              const locationName = data.locality;
              setLocation(locationName);
            })
            .catch((error) => {
              console.error("Error fetching location:", error);
            });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div>
      {location ? (
        <p>Your current location is: {location}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default LocationComponent;
