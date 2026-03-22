import type { NextApiRequest, NextApiResponse } from "next";
import { Step } from "../../src/types";
import { FileUtils } from "../../src/utils/fileUtils";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Step[] | { message: string }>,
) {
  try {
    const machineIdFromQuery = req.query.machineId;
    const machineIdFromBody = req.body?.machineId;
    const machineId =
      typeof machineIdFromQuery === "string"
        ? machineIdFromQuery
        : typeof machineIdFromBody === "string"
          ? machineIdFromBody
          : undefined;

    if (!machineId || typeof machineId !== "string") {
      return res.status(400).json({ message: "machineId is required" });
    }

    if (req.method === "GET") {
      const steps = FileUtils.listSteps(machineId);
      return res.status(200).json(steps);
    } else if (req.method === "POST") {
      const step = req.body as Step;
      if (!step || step.machineId !== machineId) {
        return res.status(400).json({ message: "Invalid step data" });
      }
      FileUtils.saveStep(step);
      return res.status(200).json([step]);
    } else if (req.method === "DELETE") {
      const { stepId } = req.query;
      if (!stepId || typeof stepId !== "string") {
        return res.status(400).json({ message: "stepId is required" });
      }
      const fs = require("fs-extra");
      const stepPath = FileUtils.getStepPath(machineId, stepId);
      if (fs.existsSync(stepPath)) {
        fs.removeSync(stepPath);
      }
      return res.status(200).json([]);
    } else {
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
