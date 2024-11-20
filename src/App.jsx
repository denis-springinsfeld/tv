import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  Star,
  Calendar,
  Clock,
  Tv,
  Users,
  BarChart,
} from "lucide-react";

// Import the useFetch hook
import useFetch from "./lib/useFetch";

export default function App() {
  const [searchSerie, setSearchSerie] = useState("stranger things");
  const {
    data: showData,
    isLoading: isLoadingShow,
    error: showError,
  } = useFetch(
    `https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(searchSerie)}&embed[]=cast&embed[]=episodes&embed[]=seasons`,
  );

  useEffect(() => {
    if (showData) {
      const {
        name,
        genres,
        image,
        summary,
        premiered,
        runtime,
        rating,
        network,
        status,
        language,
        _embedded: { cast, episodes, seasons },
      } = showData;
    }
  }, [showData]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const serie = formData.get("serie");
    setSearchSerie(serie);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const removePs = (htmlString) => {
    return htmlString.replace(/<\/?p[^>]*>/g, "");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-center text-4xl font-bold">
          TV Series Info <img src="/logo.svg" alt="logo" />
        </h1>

        <form onSubmit={handleSearch} className="mb-8 flex gap-2">
          <Input
            type="text"
            name="serie"
            placeholder="Search for a TV series..."
            defaultValue={searchSerie}
            className="flex-grow"
          />
          <Button type="submit">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </form>

        {isLoadingShow && (
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
              <Skeleton className="mt-4 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-3/4" />
            </CardContent>
          </Card>
        )}

        {showError && (
          <Card className="border-red-500">
            <CardHeader>
              <CardTitle className="text-red-500">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{showError}</p>
            </CardContent>
          </Card>
        )}

        {showData && (
          <>
            <div
              // data-img={showData.image?.medium}
              className="h-[500px] bg-cover bg-center"
              style={{ backgroundImage: `url(${showData.image?.medium})` }}
            >
              Test
            </div>
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl">{showData.name}</CardTitle>
                  <CardDescription>
                    {showData.genres.map((genre) => (
                      <Badge key={genre} variant="secondary" className="mr-2">
                        {genre}
                      </Badge>
                    ))}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-6 md:flex-row">
                    <img
                      src={
                        showData.image?.medium ||
                        "/placeholder.svg?height=295&width=210"
                      }
                      alt={showData.name}
                      className="h-auto max-w-[210px] rounded-lg shadow-md"
                    />
                    <div>
                      <p className="mb-4">{removePs(showData.summary)}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          <div>
                            <h3 className="font-semibold">Premiered</h3>
                            <p>
                              {showData.premiered
                                ? formatDate(showData.premiered)
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          <div>
                            <h3 className="font-semibold">Runtime</h3>
                            <p>
                              {showData.runtime
                                ? `${showData.runtime} min`
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Star className="mr-2 h-4 w-4 text-yellow-400" />
                          <div>
                            <h3 className="font-semibold">Rating</h3>
                            <p>{showData.rating?.average || "N/A"}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Tv className="mr-2 h-4 w-4" />
                          <div>
                            <h3 className="font-semibold">Network</h3>
                            <p>{showData.network?.name || "N/A"}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <BarChart className="mr-2 h-4 w-4" />
                          <div>
                            <h3 className="font-semibold">Status</h3>
                            <p>{showData.status}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4" />
                          <div>
                            <h3 className="font-semibold">Language</h3>
                            <p>{showData.language}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="cast">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="cast">Cast</TabsTrigger>
                  <TabsTrigger value="episodes">Episodes</TabsTrigger>
                  <TabsTrigger value="seasons">Seasons</TabsTrigger>
                  <TabsTrigger value="details">More Details</TabsTrigger>
                </TabsList>
                <TabsContent value="cast">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cast</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {showData._embedded.cast.map((castMember) => (
                          <div
                            key={castMember.person.id}
                            className="flex items-center space-x-4 rounded-lg p-2 hover:bg-gray-100"
                          >
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={castMember.person.image?.medium || ""}
                                alt={castMember.person.name}
                              />
                              <AvatarFallback>
                                {castMember.person.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">
                                {castMember.person.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {castMember.character.name}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="episodes">
                  <Card>
                    <CardHeader>
                      <CardTitle>Episodes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {showData._embedded.episodes.map((episode) => (
                          <AccordionItem
                            key={episode.id}
                            value={`episode-${episode.id}`}
                          >
                            <AccordionTrigger>
                              S{episode.season}E{episode.number}: {episode.name}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="font-semibold">Air Date:</p>
                                  <p>{formatDate(episode.airdate)}</p>
                                </div>
                                <div>
                                  <p className="font-semibold">Runtime:</p>
                                  <p>{episode.runtime} minutes</p>
                                </div>
                              </div>
                              <p className="mt-2">
                                {episode.summary
                                  ? removePs(episode.summary)
                                  : ""}
                              </p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="seasons">
                  <Card>
                    <CardHeader>
                      <CardTitle>Seasons</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {showData._embedded.seasons.map((season) => (
                          <Card key={season.id}>
                            <CardHeader>
                              <CardTitle>Season {season.number}</CardTitle>
                              <CardDescription>
                                {season.premiereDate && season.endDate
                                  ? `${formatDate(season.premiereDate)} - ${formatDate(season.endDate)}`
                                  : "Dates not available"}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p>
                                <span className="font-semibold">Episodes:</span>{" "}
                                {season.episodeOrder || "N/A"}
                              </p>
                              <p>
                                <span className="font-semibold">Network:</span>{" "}
                                {season.network?.name || "N/A"}
                              </p>
                              {season.summary && (
                                <p className="mt-2">
                                  {removePs(season.summary)}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="details">
                  <Card>
                    <CardHeader>
                      <CardTitle>Additional Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold">Type</h3>
                          <p>{showData.type}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Official Site</h3>
                          <p>
                            {showData.officialSite ? (
                              <a
                                href={showData.officialSite}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                Visit
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Schedule</h3>
                          <p>
                            {showData.schedule.days.join(", ")} at{" "}
                            {showData.schedule.time}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Country</h3>
                          <p>{showData.network?.country?.name || "N/A"}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Premiered</h3>
                          <p>
                            {showData.premiered
                              ? formatDate(showData.premiered)
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Ended</h3>
                          <p>
                            {showData.ended
                              ? formatDate(showData.ended)
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      {showData.webChannel && (
                        <div className="mt-4">
                          <h3 className="font-semibold">Web Channel</h3>
                          <p>{showData.webChannel.name}</p>
                        </div>
                      )}
                      {showData.externals && (
                        <div className="mt-4">
                          <h3 className="font-semibold">External IDs</h3>
                          <p>IMDB: {showData.externals.imdb || "N/A"}</p>
                          <p>TheTVDB: {showData.externals.thetvdb || "N/A"}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
