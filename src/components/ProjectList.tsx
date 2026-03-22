import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  Button,
  Flex,
  useColorModeValue,
  Badge,
} from "@chakra-ui/react";
import { Machine } from "../types";
import { StepUtils } from "../utils/stepUtils";
import { TerminalLayout } from "./TerminalLayout";

interface ProjectListProps {
  machines: Machine[];
  onNewProject: () => void;
  onSelectProject: (machine: Machine) => void;
  onDeleteProject: (machineId: string) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  machines,
  onNewProject,
  onSelectProject,
  onDeleteProject,
}) => {
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [stepsData, setStepsData] = useState<Record<string, any[]>>({});

  // Load steps for all machines
  useEffect(() => {
    const loadAllSteps = async () => {
      const stepsPromises = machines.map(async (machine) => {
        try {
          const response = await fetch(`/api/steps?machineId=${machine.id}`);
          if (response.ok) {
            const steps = await response.json();
            return { machineId: machine.id, steps };
          }
          return { machineId: machine.id, steps: [] };
        } catch (error) {
          console.error(`Erro ao carregar passos para ${machine.name}:`, error);
          return { machineId: machine.id, steps: [] };
        }
      });

      const results = await Promise.all(stepsPromises);
      const stepsMap: Record<string, any[]> = {};
      results.forEach(({ machineId, steps }) => {
        stepsMap[machineId] = steps;
      });
      setStepsData(stepsMap);
    };

    if (machines.length > 0) {
      loadAllSteps();
    }
  }, [machines]);

  const handleDeleteProject = async (
    machineId: string,
    machineName: string,
  ) => {
    if (
      confirm(
        `Tem certeza que deseja excluir o projeto "${machineName}"? Esta ação não pode ser desfeita.`,
      )
    ) {
      try {
        const response = await fetch(`/api/machines`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ machineId }),
        });

        if (response.ok) {
          onDeleteProject(machineId);
        } else {
          throw new Error("Falha ao excluir projeto");
        }
      } catch (error) {
        console.error("Erro ao excluir projeto:", error);
      }
    }
  };

  return (
    <TerminalLayout>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold" color="green.400">
            HTB PROJECTS
          </Text>
          <Button
            size="lg"
            bg="green.600"
            color="white"
            _hover={{ bg: "green.700" }}
            onClick={onNewProject}
          >
            + NEW PROJECT
          </Button>
        </Flex>

        {/* Projects Grid */}
        <Box>
          {machines.length === 0 ? (
            <Box
              bg="gray.800"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="md"
              p={8}
              textAlign="center"
            >
              <Text color="gray.400" mb={4}>
                No projects found
              </Text>
              <Text fontSize="sm" color="gray.500">
                Create your first project to start documenting your explorations
              </Text>
            </Box>
          ) : (
            <VStack spacing={4}>
              {machines.map((machine) => {
                const steps = stepsData[machine.id] || [];
                const progress = StepUtils.calculateProgress(steps);

                return (
                  <Box
                    key={machine.id}
                    bg="gray.800"
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="md"
                    p={4}
                    width="100%"
                    _hover={{ borderColor: "green.400" }}
                  >
                    <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={1} flex={1}>
                        <Text fontSize="lg" fontWeight="bold" color="green.400">
                          {machine.name}
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                          IP: {machine.ip} | URL: {machine.url || "N/A"}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Created:{" "}
                          {new Date(machine.createdAt).toLocaleDateString()}
                        </Text>

                        <Flex gap={2} mt={2}>
                          <Badge colorScheme="blue">
                            Progress: {progress.percentage}%
                          </Badge>
                          <Badge colorScheme="green">
                            {progress.completed}/{progress.total} steps
                          </Badge>
                        </Flex>
                      </VStack>

                      <Flex gap={2}>
                        <Button
                          size="sm"
                          bg="green.600"
                          color="white"
                          _hover={{ bg: "green.700" }}
                          onClick={() => onSelectProject(machine)}
                        >
                          OPEN
                        </Button>
                        <Button
                          size="sm"
                          bg="red.600"
                          color="white"
                          _hover={{ bg: "red.700" }}
                          onClick={() =>
                            handleDeleteProject(machine.id, machine.name)
                          }
                        >
                          DELETE
                        </Button>
                      </Flex>
                    </Flex>
                  </Box>
                );
              })}
            </VStack>
          )}
        </Box>

        {/* Footer Info */}
        <Box
          bg="gray.900"
          border="1px solid"
          borderColor={borderColor}
          borderRadius="md"
          p={4}
          textAlign="center"
        >
          <Text fontSize="sm" color="gray.500">
            Tip: Each project creates a folder with all documentation files
          </Text>
          <Text fontSize="xs" color="gray.600" mt={1}>
            Files are saved locally at: projects/[machine-id]/
          </Text>
        </Box>
      </VStack>
    </TerminalLayout>
  );
};
