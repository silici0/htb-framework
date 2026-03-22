import type { NextApiRequest, NextApiResponse } from "next";
import { FileUtils } from "../../src/utils/fileUtils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const { machineId } = req.query;

      if (!machineId) {
        return res.status(400).json({ error: "machineId is required" });
      }

      const conclusion = FileUtils.loadConclusion(machineId as string);
      return res.status(200).json({ conclusion });
    } catch (error) {
      console.error("Error loading conclusion:", error);
      return res.status(500).json({
        error: "Error loading conclusion",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  if (req.method === "POST") {
    try {
      const { machineId, conclusion } = req.body;

      if (!machineId) {
        return res.status(400).json({ error: "machineId is required" });
      }

      FileUtils.saveConclusion(machineId, conclusion || "");
      return res
        .status(200)
        .json({ message: "Conclusion saved successfully!" });
    } catch (error) {
      console.error("Error saving conclusion:", error);
      return res.status(500).json({
        error: "Error saving conclusion",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
