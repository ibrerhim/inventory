import React from 'react';
import './styles.css';
import SlideNavbar from './SlideInNavbar';
import {
    Users,
    Package,
} from "lucide-react"; // Import necessary icons

function Card() {
    const cards = [
        {
          name: "products",
          total: 21,
          description: "total products",
          footer: "added today : 2",
          icon: <Package size={24} /> // Icon for products
        },
        {
          name: "users",
          total: 3,
          description: "total users",
          footer: "todays sales: 9",
          icon: <Users size={24} /> // Icon for users
        },
    ];

    return (
        <div className="page card-1-page">
            {/* <SlideNavbar /> */}
            <div className="cards">
                {cards.map((card) => (
                    <label key={card.name} id={card.name}>
                        <input type="checkbox" />
                        <div className="card">
                            <div className="front">
                                <header>
                                    <h2>{card.name}</h2>
                                    {/* Icon displayed at the top of each card */}
                                    <span>{card.icon}</span> 
                                </header>
                                <var>{card.total}</var>
                                <h3>{card.description}</h3>
                                <h4>{card.footer}</h4>
                            </div>
                            <div className="back">
                                <header>
                                    <h2>{card.name}</h2>
                                    <span className="material-symbols-outlined">close</span>
                                </header>
                                <p>More Information</p>
                            </div>
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
}

export default Card;
