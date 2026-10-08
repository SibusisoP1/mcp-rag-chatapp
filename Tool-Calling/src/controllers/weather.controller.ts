import type { Request, Response } from "express";
import { weatherService } from "../services/weather.service.ts";

export class weatherController {
  static getWeather = async (req: Request, res: Response) => {
    try {
      const { q } = req.query || "Paris";

      if (!q) {
        return res
          .status(400)
          .json({ success: false, error: "City query parameter is required" });
      }

      const Data = await weatherService.getWeatherData(q as string);
      return res.json({ success: true, data: Data });
    } catch (error) {
      console.error("Error fetching weather:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  };
}
