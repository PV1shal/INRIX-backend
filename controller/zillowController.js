import axios from 'axios';

// Function to search properties based on an address
export async function searchProperties(req, res) {
    const address = req.query.address; // Extract the address from query parameters

    if (!address) {
        return res.status(400).send({ error: 'Address is required' });
    }

    const options = {
        method: 'GET',
        url: 'https://zillow56.p.rapidapi.com/search',
        params: { location: address },
        headers: {
            'X-RapidAPI-Key': '302e8cc6f5mshb301d1d596b2433p13baeejsn8720ea500b8f', // Replace with your actual API key
            'X-RapidAPI-Host': 'zillow56.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch property data' });
    }
}

// Function to get nearby schools based on a Zillow Property ID (zpid)
export async function nearbySchools(req, res) {
    const zpid = req.query.zpid; // Extract the zpid from query parameters

    if (!zpid) {
        return res.status(400).send({ error: 'Zillow Property ID (zpid) is required' });
    }

    const options = {
        method: 'GET',
        url: 'https://zillow56.p.rapidapi.com/schools',
        params: { zpid: zpid },
        headers: {
            'X-RapidAPI-Key': '302e8cc6f5mshb301d1d596b2433p13baeejsn8720ea500b8f', // Replace with your actual API key
            'X-RapidAPI-Host': 'zillow56.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch nearby schools' });
    }
}
