import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface LinkViewProps {
  linkData: {
    title: string;
    description: string;
    url: string;
  }[];
}
const LinkView: React.FC<LinkViewProps> = ({ linkData }) => {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Helpful Resources</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {linkData.map((link, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">{link.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {link.description}
              </p>
              <Button asChild variant="outline">
                <Link href={link.url} target="_blank" rel="noopener noreferrer">
                  Visit Resource
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LinkView;
