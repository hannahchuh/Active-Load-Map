export const modeOptions = [
  { key: "Local", text: "Local", value: "Local" },
  { key: "Regional", text: "Regional", value: "Regional" }
];

export const carrierOptions = [
  { key: "Assigned", text: "Assigned", value: "Assigned" },
  { key: "Not Assigned", text: "Not Assigned", value: "Not Assigned" }
];

export const locationOptions = [
  { key: "Pickups", text: "Pickups", value: "Pickups" },
  { key: "Deliveries", text: "Deliveries", value: "Deliveries" }
];

export const transitStatusOptions = [
  { key: "At Pickup", text: "At Pickup", value: "At Pickup" },
  { key: "At Delivery", text: "At Delivery", value: "At Delivery" },
  { key: "Delivered", text: "Delivered", value: "Delivered" },
  { key: "Paused", text: "Paused", value: "Paused" },
  { key: "Payment Sent", text: "Payment Sent", value: "Payment Sent" },
  { key: "Travelling", text: "Travelling", value: "Travelling" }
];

// time zone number bounds
export const timeZoneOneBounds = [
  {
    north: 47.8,
    south: 45.8,
    east: -119,
    west: -120.5
  },
  {
    north: 44.6,
    south: 42.6,
    east: -119,
    west: -120.5
  },
  {
    north: 41.4,
    south: 39.4,
    east: -119,
    west: -120.5
  },
  {
    north: 38.2,
    south: 36.2,
    east: -119,
    west: -120.5
  }
];

export const timeZoneTwoBounds = [
  {
    north: 47.8,
    south: 45.8,
    east: -107,
    west: -108.5
  },
  {
    north: 44.6,
    south: 42.6,
    east: -107,
    west: -108.5
  },
  {
    north: 41.4,
    south: 39.4,
    east: -107,
    west: -108.5
  },
  {
    north: 38.2,
    south: 36.2,
    east: -107,
    west: -108.5
  }
];

export const timeZoneThreeBounds = [
  {
    north: 47.8,
    south: 45.8,
    east: -93.5,
    west: -95
  },
  {
    north: 44.6,
    south: 42.6,
    east: -93.5,
    west: -95
  },
  {
    north: 41.4,
    south: 39.4,
    east: -93.5,
    west: -95
  },
  {
    north: 38.2,
    south: 36.2,
    east: -93.5,
    west: -95
  }
];

export const timeZoneFourBounds = [
  {
    north: 47.8,
    south: 45.8,
    east: -80,
    west: -81.5
  },
  {
    north: 44.6,
    south: 42.6,
    east: -80,
    west: -81.5
  },
  {
    north: 41.4,
    south: 39.4,
    east: -80,
    west: -81.5
  },
  {
    north: 38.2,
    south: 36.2,
    east: -80,
    west: -81.5
  }
];

export const timeZoneFiveBounds = [
  {
    north: 55,
    south: 53,
    east: -60,
    west: -61.5
  },
  {
    north: 47,
    south: 45,
    east: -63.5,
    west: -65
  }
];

export const timeZoneSixBounds = [
  {
    north: 50,
    south: 48,
    east: -55.5,
    west: -57
  }
];

// packages all time zone bounds
export const timeZoneBounds = [
  timeZoneOneBounds,
  timeZoneTwoBounds,
  timeZoneThreeBounds,
  timeZoneFourBounds,
  timeZoneFiveBounds,
  timeZoneSixBounds
];

export const statesAndCodes: { [state: string]: string } = {
  Arizona: "AZ",
  Alabama: "AL",
  Alaska: "AK",
  "American Samoa": "AS",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  "District of Columbia": "DC",
  "Federated States of Micronesia": "FM",
  Florida: "FL",
  Georgia: "GA",
  Guam: "GU",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  "Marshall Islands": "MH",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  "Northern Mariana Islands": "MP",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Palau: "PW",
  Pennsylvania: "PA",
  "Puerto Rico": "PR",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  "Virgin Islands": "VI",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
  Alberta: "AB",
  "British Columbia": "BC",
  Manitoba: "MB",
  "New Brunswick": "BC",
  "Newfoundland and Labrador": "NL",
  "Northwest Territories": "NT",
  "Nova Scotia": "NS",
  Nunavut: "NU",
  Ontario: "ON",
  "Prince Edward Island": "PE",
  Quebec: "QC",
  Saskatchewan: "SK",
  "Yukon Territory": "YT"
};

export const states = [
  "Alabama",
  "Alaska",
  "American Samoa",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Federated States of Micronesia",
  "Florida",
  "Georgia",
  "Guam",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Marshall Islands",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Northern Mariana Islands",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Palau",
  "Pennsylvania",
  "Puerto Rico",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virgin Island",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon Territory"
];
