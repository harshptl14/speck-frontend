import { cookies } from "next/headers";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
const getMyRoadmaps = async () => {
  const authorization = cookies().get("jwtToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/speck/v1/roadmap/myroadmaps`,
      {
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
      }
    );

    return response.json();
  } catch (error) {
    console.error("Error getting roadmap:", error);
    throw error;
  }
};

const RoadmapList = async () => {
  const myroadmaps = await getMyRoadmaps();
  console.log(myroadmaps);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {myroadmaps?.roadmaps?.map((roadmap: any) => (
          <Card key={roadmap.id}>
            <CardHeader>
              <CardTitle>{roadmap?.name}</CardTitle>
              <CardDescription>{roadmap?.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoadmapList;
