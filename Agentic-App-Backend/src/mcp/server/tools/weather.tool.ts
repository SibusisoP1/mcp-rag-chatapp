import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { weatherService } from "../../../services/weather.service.ts";

export function registerWeatherTools(server: McpServer) {
  console.log("Registering weather tools...");

  //tool 1: get weather by city
  server.registerTool(
    "getWeatherData",
    {
      title: "fetch live weather data by city",
      description:
        "fetch live weather data by city from the OpenWeatherMap API",
      inputSchema: {
        city: z.string(),
        country: z.string().optional(),
      },
      outputSchema: {
        data: z.any(), //going to return alot of data , so we can specify later if we want any specific data
      },
    },
    async ({ city, country }) => {
      console.log("Fetching weather data...");

      const query = country ? `${city},${country}` : city;

      const weatherData = await weatherService.getWeatherData(query);

      return {
        content: [{ type: "text", text: JSON.stringify(weatherData, null, 2) }],
        structuredContent: { data: weatherData },
      };
    },
  );
}
