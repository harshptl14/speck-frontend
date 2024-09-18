import React from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import MarkdownRenderer from "./markdownRenderer";
import MarkmapRenderer from "./markmapRenderer";
const TabsComponent = ({ markdown }: { markdown: string }) => {
    return (
        <div>
            <Tabs defaultValue="roadmap">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
                        <TabsTrigger value="markmap">Markmap</TabsTrigger>
                    </TabsList>
                    <div className="ml-auto flex items-center gap-2">
                        {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-sm"
                      >
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem checked>
                        Fulfilled
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Declined
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Refunded
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-sm"
                  >
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Export</span>
                  </Button> */}
                    </div>
                </div>
                <TabsContent value="roadmap">
                    <Card x-chunk="dashboard-05-chunk-3">
                        <div className="pt-4">
                            <CardContent >
                                <MarkdownRenderer markdown={markdown}></MarkdownRenderer>
                            </CardContent>
                        </div>
                    </Card>
                </TabsContent>
                <TabsContent value="markmap">
                    <Card x-chunk="dashboard-05-chunk-3">
                        <div className="pt-4">

                            <CardContent >
                                <div className="w-full h-[500px]">

                                    <MarkmapRenderer data={markdown} />
                                </div>
                            </CardContent>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div >
    );
};

export default TabsComponent;
