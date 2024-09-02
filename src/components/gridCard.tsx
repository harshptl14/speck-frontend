import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface GridCardProps {
  cardData: {
    title: string;
    number: string;
    subtitle?: string;
  }[];
}

const GridCard: React.FC<GridCardProps> = ({ cardData }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {cardData.map((card, index) => (
        <Card key={index} x-chunk={`dashboard-01-chunk-${index}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.number}</div>
            <p className="text-xs text-muted-foreground">{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GridCard;
