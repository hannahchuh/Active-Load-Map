# Active Load Map: Freight Transportation Management App

# Intro 
Much of the current software in the transportation management industry is outdated, lacks consolidation, and provides little functionality for efficient, user-friendly searches and visualization. For freight brokers, being able to quickly display and filter  the location, status, and other information about loads (ie freigh shipments) to book is a necessity that has not been met. 

Active Load Map is an app that parses freight shipment information, displaying relevant information on a map accompanied with weather, traffic, time zones, and transit overlays as well as filters for dates, pickups/deliveries, mode, transit status, radius search (filtering by a certain radius from a location), and city/state/province.

# Demo
Find the link [here](https://alm-demo.firebaseapp.com)! For demonstration purposes login functionality has been disabled on the linked page (so you won't see the "loading" icon that would normally appear when the app retrieves the shipment data from the database).

# About 
This app was created during a software development internship for a transportation and logistics company during the Summer of 2019. The frontend is written in React/Typescript and the backend is in Clojure. Google Maps API is used for geo-location, location autocomplete, and the map display.

# Features
Active Load Map is mobile friendly! 

<b>Markers:</b>

- Colored markers distinguish between:
  - Pickups (Red)
  - Deliveries 
    - At Delivery (Green)
    - In Transit (Purple)
    - All other deliveries ("Paused", "At Pickup", etc.) (Blue)

<b>Toggleable Overlays:</b>
- Weather
- Traffic 
- Time Zones 
- Transit Arcs 
  - Toggling "Transit Arcs" will paint thin arcs (Google Maps polyline) from a pickup to a delivery if that load is "Travelling." 

<b>Filters:</b>
- Address Range Search
  - Search bar with autocomplete for cities/places, with a range slider. Filters loads that are in the selected radius around the chosen location.
- Pickup and delivery date filters
- Pickups ONLY or deliveries ONLY
- Mode 
- Transit Status
- City
  - This is different from Address Range Search, as you can choose multiple cities only out of a set list composed of all cities where the loads are delivering/picking up from.
- Carrier Assigned or Carrier Unassigned
- State/Province

<b>Toast:</b>
In the event of errors with fetching from the database, querying from Google Maps API, etc., toast notifications will appear on the bottom right of the screen.

# Screen Captures
![Image of Screen Capture - General Desktop](https://raw.githubusercontent.com/hannahchuh/Active-Load-Map/master/screen_captures/general_desktop_screencapture.png)

# Where's the Backend?
Backend for this code is written in Clojure. It was written to work with with the company's backend and database and part of it has been included in the "backend" folder for demosntration. In src/active-load-map/index.tsx you can see that I have provided sample data from src/active-load-map/sampleData.tsx and commented out where I fetch the data from the company's database. This app could reasonably be configured to work with your database although the types/fetching and the desired filters may require some tweaking.

