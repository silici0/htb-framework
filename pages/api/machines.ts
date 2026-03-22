import type { NextApiRequest, NextApiResponse } from "next";
import { Machine, MachineFormData } from "../../src/types";
import { FileUtils } from "../../src/utils/fileUtils";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Machine | Machine[] | { message: string }>,
) {
  try {
    if (req.method === "GET") {
      // List all machines
      const machines = FileUtils.listMachines();
      res.status(200).json(machines);
    } else if (req.method === "POST") {
      // Create new machine
      const data: MachineFormData = req.body;

      const newMachine: Machine = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        ip: data.ip,
        url: data.url,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      FileUtils.saveMachine(newMachine);
      res.status(201).json(newMachine);
    } else if (req.method === "DELETE") {
      // Delete machine
      const { machineId } = req.body;

      if (!machineId) {
        return res.status(400).json({ message: "machineId is required" });
      }

      try {
        const projectPath = FileUtils.getProjectPath(machineId);
        const fs = require("fs");
        fs.rmSync(projectPath, { recursive: true, force: true });
        res.status(200).json({ message: "Project deleted successfully" });
      } catch (error) {
        console.error("Erro ao excluir projeto:", error);
        res.status(500).json({ message: "Error deleting project" });
      }
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
