import { Icon } from "./Icon";
import { Image } from "./Image";
import './TopCountries.css';

export const TopCountries = () => {
    const Countrydata = [
        { name: 'USA', rise: true, value: 21942.83, id: 1 },
        { name: 'Ireland', rise: false, value: 19710.0, id: 2 },
        { name: 'Ukraine', rise: false, value: 12320.3, id: 3 },
        { name: 'Sweden', rise: true, value: 9725.0, id: 4 },
    ];

    return (
        <div className="top-countries">
            <div className="top-countries-header">
                <div className="title">Top Growering Markets</div>
                <Icon path="res-react-dash-plus" className="icon" />
            </div>
            <div>favourites</div>
            {Countrydata.map(({ name, rise, value, id }) => (
                <div className="top-countries-item" key={id}>
                    <div>{id}</div>
                    <Image path={`res-react-dash-flag-${id}`} className="image" />
                    <div className="name">{name}</div>
                    <div className="flex-grow"></div>
                    <div className="value">{`$${value.toLocaleString()}`}</div>
                    <Icon
                        path={
                            rise ? 'res-react-dash-country-up' : 'res-react-dash-country-down'
                        }
                        className="icon"
                    />
                    <Icon path="res-react-dash-options" className="options" />
                </div>
            ))}
            <div className="flex-grow"></div>
            <div className="top-countries-footer">
                <div>Check All</div>
            </div>
        </div>
    );
}
