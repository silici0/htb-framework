import type { NextApiRequest, NextApiResponse } from "next";
import { FileUtils } from "../../src/utils/fileUtils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { machineId } = req.body;

    if (!machineId) {
      return res.status(400).json({ error: "machineId is required" });
    }

    // Generate playbook
    const playbookContent = FileUtils.generatePlaybook(machineId);
    FileUtils.writeFileSync(
      FileUtils.getPlaybookPath(machineId),
      playbookContent,
    );

    // Generate write-up
    const writeupContent = FileUtils.generateWriteup(machineId);
    FileUtils.writeFileSync(
      FileUtils.getWriteupPath(machineId),
      writeupContent,
    );

    res.status(200).json({
      message: "Documents generated successfully!",
      playbookPath: FileUtils.getPlaybookPath(machineId),
      writeupPath: FileUtils.getWriteupPath(machineId),
    });
  } catch (error) {
    console.error("Error generating documents:", error);
    res.status(500).json({
      error: "Error generating documents",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
