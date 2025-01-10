export const getCities = async (req, res) => {

  const { type } = req.query;
  console.log("type=",type);
  const rentCities = [
    'Mumbai',
    'Kolkata',
    'Bangalore',
    'Chennai',
    'Hyderabad',
    'Ahmedabad', 
  ];
  const buyCities = [
    'Mumbai',
    'Bangalore',
    'Chennai',
    'Hyderabad',
    'Ahmedabad', 
  ];


  res.json(type=="rent" ? rentCities :buyCities);
}

export const topLocalities = async (req, res) => {
  const { type } = req.query;
  const citiesRent = 
  [{
      "locality": "Hebbala",
      "city": "Bangalore"
    }, {
      "locality": "Whitefield",
      "city": "Bangalore"
    },
    {
      "locality": "Jaynagar",
      "city": "Bangalore"
    },
    {
      "locality": "JP Nagar",
      "city": "Bangalore"
    },
  ];

  const citiesBuy = 
  [{
      "locality": "Electronic City",
      "city": "Bangalore"
    }, 
    {
      "locality": "Rajaji Nagar",
      "city": "Bangalore"
    },
    {
      "locality": "Malleshwaram",
      "city": "Bangalore"
    },
  ];
  res.json(type=="rent" ? citiesRent:citiesBuy);
}

