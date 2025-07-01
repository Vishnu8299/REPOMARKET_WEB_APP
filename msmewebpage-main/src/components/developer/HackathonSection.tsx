import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowRight } from "lucide-react";

const HackathonSection = () => {
  const activeHackathons = [
    {
      id: 1,
      title: "AI Innovation Challenge",
      deadline: "2024-03-15",
      prize: "$5,000",
    },
    {
      id: 2,
      title: "Web3 Hackathon",
      deadline: "2024-03-20",
      prize: "$3,000",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Active Hackathons
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeHackathons.map((hackathon) => (
            <div
              key={hackathon.id}
              className="flex items-center justify-between p-4 rounded-lg bg-white shadow-sm border"
            >
              <div>
                <h3 className="font-semibold">{hackathon.title}</h3>
                <p className="text-sm text-gray-500">
                  Deadline: {hackathon.deadline}
                </p>
                <p className="text-sm font-medium text-primary">
                  Prize: {hackathon.prize}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Join Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HackathonSection;