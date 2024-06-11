import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoib2RvbGFuIiwiYSI6ImNsd3U2anFuZTBibmEyaXE1cHowY2IzcWUifQ.Jyo1DMVIDkdx5wmg5xIA0Q';

const StepTwoContent = () => {
    const [viewport, setViewport] = useState({
        latitude: 37.7749, // Default to San Francisco
        longitude: -122.4194,
        zoom: 10,
    });
    const [location, setLocation] = useState('');
    const [marker, setMarker] = useState({ latitude: 37.7749, longitude: -122.4194 });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            setViewport({ ...viewport, latitude, longitude });
            setMarker({ latitude, longitude });
            setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        },
        (error) => console.error('Error getting location:', error),
        { enableHighAccuracy: true }
        );
    }, []);

    const handleSearch = async () => {
        if (location) {
        const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${MAPBOX_TOKEN}`
        );
        const data = await response.json();
        if (data.features && data.features.length > 0) {
            const [longitude, latitude] = data.features[0].center;
            setViewport({ ...viewport, latitude, longitude });
            setMarker({ latitude, longitude });
        }
        }
    };

    return (
        <div className="flex flex-col w-full justify-center pt-4">
            <div className="w-full max-w-lg mb-4">
                <input
                type="text"
                className="w-full p-2 rounded border border-gray-300 shadow-sm"
                placeholder="Search by town and state (e.g., San Francisco, CA)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
            </div>
            <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
                <Map
                    initialViewState={viewport}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    mapboxAccessToken={MAPBOX_TOKEN}
                    onMove={(evt) => setViewport(evt.viewState)}
                >
                    <Marker latitude={viewport.latitude} longitude={viewport.longitude} />
                </Map>
            </div>
        </div>
    );
};

export default StepTwoContent;
