import { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom';
import brakePads from '../assets/produx/brakepadsimg.jpeg';
import oilFilter from '../assets/produx/oilfilterimg.jpeg';
import carBattery from '../assets/produx/carbatteryimg.jpeg';
import windBlades from '../assets/produx/windshieldwipersimg.jpeg';
import antifreeze from '../assets/produx/antifreezeimg.jpeg';
import headBulbs from '../assets/produx/headlightbulbimg.jpeg';
import sparkPlugs from '../assets/produx/sparkplug.jpeg';
import seatCover from '../assets/produx/seatcover.jpeg';
import carFresh from '../assets/produx/carfreshener.jpeg';
import carStereo from '../assets/produx/carstereo.jpeg';

export default function Products()
{
    // temporary product list (testing purposes)
    const products = [
        { id: 1, name: "Brake Pads", price: 35.99, image: brakePads},
        { id: 2, name: "Oil Filter", price: 11.99, image: oilFilter},
        { id: 3, name: "Car Battery", price: 139.99, image: carBattery},
        { id: 4, name: "Windshield Wiper Blades", price: 15.99, image: windBlades},
        { id: 5, name: "Antifreeze", price: 12.99, image: antifreeze},
        { id: 6, name: "Headlight Bulbs", price: 9.99, image: headBulbs},
        { id: 7, name: "Spark Plugs", price: 7.99, image: sparkPlugs},
        { id: 8, name: "Seat Covers", price: 32.99, image: seatCover},
        { id: 9, name: "Air Fresheners", price: 6.99, image: carFresh},
        { id: 10, name: "Car Stereo", price: 75.99, image: carStereo}
    ];

    // used to store things typed in search.
    const [search, setSearch] = useState('');

    // used to display matching products from search
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
);

    return (
        <div>
            <Navbar />

            <div className="web-page">
                <h1>Our Products</h1>
                <p>Browse available auto parts!</p>

                <input
                    type="text"
                    placeholder="Search products"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    />

                    {filteredProducts.map((product) => (
                        <div key={product.id} style={{ color: 'black' }}>
                            <Link to={`/products/${product.id}`}                            
                            style={{ color: 'black', textDecoration: 'none'}}>
                            <img
                                src={product.image}
                                alt={product.name}
                                width="150" 
                                />
                            <h2>{product.name}</h2>
                            <p>Price: ${product.price.toFixed(2)}</p>           
            </Link>
            </div>
            ))}
            </div>
        </div>
    );
}