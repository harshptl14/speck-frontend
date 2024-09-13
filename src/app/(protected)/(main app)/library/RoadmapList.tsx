import { cookies } from "next/headers";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

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
  console.log(
    "roadmap length in the roadmap list",
    myroadmaps?.roadmaps?.length,
    typeof myroadmaps?.roadmaps?.length
  );

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {myroadmaps?.roadmaps?.length !== 0 ? (
          myroadmaps?.roadmaps?.map((roadmap: any) => (
            <Link href={`/course/${roadmap.id}`} key={roadmap.id}>
              <Card className="h-48">
                <CardHeader className="h-full">
                  <CardTitle>{roadmap?.name}</CardTitle>
                  <CardDescription className="text-ellipsis overflow-hidden line-clamp-4">
                    {roadmap?.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))
        ) : (
          <div>No roadmaps found</div>
        )}
      </div>
    </div>
  );
};

export default RoadmapList;
