import type { NextApiRequest, NextApiResponse } from "next";
import { StepUtils } from "../../src/utils/stepUtils";
import { FileUtils } from "../../src/utils/fileUtils";
import fs from "fs-extra";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { machineId, phase, steps } = req.body;

    if (!machineId || !phase || !steps) {
      return res
        .status(400)
        .json({ error: "machineId, phase and steps are required" });
    }

    // Generate agent content
    const agentContent = StepUtils.generateAgentFromSteps(steps, phase);
    const agentPath = FileUtils.getAgentPath(machineId, phase);
    fs.ensureDirSync(FileUtils.getAgentsDir(machineId));
    fs.writeFileSync(agentPath, agentContent);

    res.status(200).json({
      message: "Agent generated successfully!",
      agentPath: agentPath,
      phase: phase,
    });
  } catch (error) {
    console.error("Error generating agent:", error);
    res.status(500).json({
      error: "Error generating agent",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
