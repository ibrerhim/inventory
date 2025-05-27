import React from 'react';
import {
    Users,
    Package,
    TrendingUp,
    DollarSign,
    ShoppingCart,
    BarChart3
} from "lucide-react";
import { Card as ShadcnCard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';

function Card() {
    const cards = [
        {
          name: "Products",
          total: 21,
          description: "Total products in inventory",
          footer: "2 added today",
          icon: <Package className="h-8 w-8 text-blue-500" />,
          color: "bg-gradient-to-br from-blue-900/50 to-blue-800/30 hover:from-blue-800/50 hover:to-blue-700/30"
        },
        {
          name: "Users",
          total: 3,
          description: "Active system users",
          footer: "Last login: Today",
          icon: <Users className="h-8 w-8 text-green-500" />,
          color: "bg-gradient-to-br from-green-900/50 to-green-800/30 hover:from-green-800/50 hover:to-green-700/30"
        },
        {
          name: "Sales",
          total: "$1,240",
          description: "Total sales this month",
          footer: "9 sales today",
          icon: <DollarSign className="h-8 w-8 text-yellow-500" />,
          color: "bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 hover:from-yellow-800/50 hover:to-yellow-700/30"
        },
        {
          name: "Analytics",
          total: "15%",
          description: "Growth rate",
          footer: "Compared to last month",
          icon: <TrendingUp className="h-8 w-8 text-purple-500" />,
          color: "bg-gradient-to-br from-purple-900/50 to-purple-800/30 hover:from-purple-800/50 hover:to-purple-700/30"
        },
    ];

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-white">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <ShadcnCard
                        key={card.name}
                        className={`border border-white/10 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${card.color}`}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xl font-bold">{card.name}</CardTitle>
                            <div className="p-2 rounded-full bg-background/10">
                                {card.icon}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{card.total}</div>
                            <p className="text-sm text-muted-foreground mt-1">{card.description}</p>
                        </CardContent>
                        <CardFooter>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <BarChart3 className="h-3 w-3" />
                                {card.footer}
                            </p>
                        </CardFooter>
                    </ShadcnCard>
                ))}
            </div>
        </div>
    );
}

export default Card;
