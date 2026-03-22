import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  useToast,
  VStack,
  HStack,
  Badge,
  Textarea,
} from "@chakra-ui/react";
import { Step, Machine } from "../types";
import { StepUtils } from "../utils/stepUtils";
import { StepList } from "./StepList";
import { StepForm } from "./StepForm";
import { TerminalLayout } from "./TerminalLayout";

interface ProjectDashboardProps {
  machine: Machine;
  onBack: () => void;
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({
  machine,
  onBack,
}) => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [selectedStepId, setSelectedStepId] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conclusion, setConclusion] = useState<string>("");
  const toast = useToast();

  useEffect(() => {
    loadSteps();
    loadConclusion();
  }, [machine.id]);

  useEffect(() => {
    // Auto-select first step if available
    if (steps.length > 0 && !selectedStepId && !isEditing) {
      setSelectedStepId(steps[0].id);
    }
  }, [steps, selectedStepId, isEditing]);

  const loadSteps = async () => {
    try {
      const response = await fetch(`/api/steps?machineId=${machine.id}`);
      if (response.ok) {
        const stepsData = await response.json();
        setSteps(stepsData);
      }
    } catch (error) {
      console.error("Error loading steps:", error);
    }
  };

  const loadConclusion = async () => {
    try {
      const response = await fetch(`/api/conclusion?machineId=${machine.id}`);
      if (response.ok) {
        const data = await response.json();
        setConclusion(data.conclusion || "");
      }
    } catch (error) {
      console.error("Error loading conclusion:", error);
    }
  };

  const handleSaveConclusion = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/conclusion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          machineId: machine.id,
          conclusion: conclusion,
        }),
      });

      if (response.ok) {
        toast({
          title: "Conclusion saved successfully!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        throw new Error("Failed to save conclusion");
      }
    } catch (error) {
      toast({
        title: "Error saving conclusion",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveStep = async (formData: any) => {
    setIsLoading(true);

    try {
      const stepData: Step = {
        id: selectedStepId || StepUtils.generateStepId(),
        machineId: machine.id,
        phase: formData.phase,
        title: formData.title,
        description: formData.description,
        commands: StepUtils.parseCommands(formData.commands),
        screenshots: formData.screenshots || [],
        results: formData.results,
        status: formData.status,
        createdAt: selectedStepId
          ? steps.find((s) => s.id === selectedStepId)?.createdAt || new Date()
          : new Date(),
        updatedAt: new Date(),
      };

      const response = await fetch("/api/steps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stepData),
      });

      if (response.ok) {
        await loadSteps();
        setSelectedStepId(stepData.id);
        setIsEditing(false);

        toast({
          title: "Step saved successfully!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        // Auto-generate agent
        generateAgent(stepData.phase);
      } else {
        throw new Error("Failed to save step");
      }
    } catch (error) {
      toast({
        title: "Error saving step",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStep = async () => {
    if (!selectedStepId) return;

    try {
      const response = await fetch(
        `/api/steps?machineId=${machine.id}&stepId=${selectedStepId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        loadSteps();
        setSelectedStepId("");

        toast({
          title: "Step deleted successfully!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        throw new Error("Failed to delete step");
      }
    } catch (error) {
      toast({
        title: "Error deleting step",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleNewStep = () => {
    setSelectedStepId("");
    setIsEditing(true);
  };

  const handleSelectStep = (stepId: string) => {
    setSelectedStepId(stepId);
    setIsEditing(false);
  };

  const handleGenerateDocuments = async () => {
    try {
      const response = await fetch("/api/generate-documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ machineId: machine.id }),
      });

      if (response.ok) {
        toast({
          title: "Documents generated successfully!",
          description: "playbook.md and writeup.md were created",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error("Failed to generate documents");
      }
    } catch (error) {
      toast({
        title: "Error generating documents",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const generateAgent = async (phase: Step["phase"]) => {
    try {
      const response = await fetch("/api/generate-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          machineId: machine.id,
          phase: phase,
          steps: steps,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate agent");
      }
    } catch (error) {
      console.error("Error generating agent:", error);
    }
  };

  const selectedStep = steps.find((s) => s.id === selectedStepId);
  const progress = StepUtils.calculateProgress(steps);

  return (
    <TerminalLayout>
      <Flex height="100%" direction="column">
        {/* Header */}
        <Flex justify="space-between" align="center" mb={4}>
          <VStack align="start" spacing={1}>
            <Text fontSize="2xl" fontWeight="bold" color="green.400">
              {machine.name}
            </Text>
            <Text fontSize="sm" color="gray.400">
              IP: {machine.ip} | URL: {machine.url || "N/A"}
            </Text>
          </VStack>

          <HStack spacing={2}>
            <Badge colorScheme="blue">Progress: {progress.percentage}%</Badge>
            <Badge colorScheme="green">
              {progress.completed}/{progress.total} steps
            </Badge>
            <Button
              size="sm"
              onClick={onBack}
              variant="outline"
              colorScheme="red"
            >
              BACK
            </Button>
          </HStack>
        </Flex>

        {/* Main Content */}
        <Flex flex={1} gap={4} height="100%">
          {/* Step List */}
          <StepList
            steps={steps}
            selectedStepId={selectedStepId}
            onStepSelect={handleSelectStep}
            onNewStep={handleNewStep}
          />

          {/* Step Form */}
          <Box flex={1}>
            {selectedStep || isEditing ? (
              <StepForm
                key={selectedStep?.id || (isEditing ? "new-step" : "no-step")}
                step={selectedStep}
                onSave={handleSaveStep}
                onDelete={handleDeleteStep}
                isLoading={isLoading}
              />
            ) : (
              <Box
                bg="gray.800"
                border="1px solid"
                borderColor="green.400"
                borderRadius="md"
                p={8}
                height="100%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="lg" color="green.400" mb={4}>
                  Select a step or create a new one
                </Text>
                <Button
                  size="lg"
                  bg="green.600"
                  color="white"
                  _hover={{ bg: "green.700" }}
                  onClick={handleNewStep}
                >
                  + NEW STEP
                </Button>
              </Box>
            )}
          </Box>
        </Flex>

        {/* Conclusion Section */}
        <Box mt={4} p={4} borderTop="1px solid" borderColor="green.400">
          <Text fontSize="lg" fontWeight="bold" color="green.400" mb={2}>
            CONCLUSION
          </Text>
          <Textarea
            value={conclusion}
            onChange={(e) => setConclusion(e.target.value)}
            placeholder="Enter the project conclusion..."
            bg="gray.800"
            border="1px solid"
            borderColor="green.400"
            color="white"
            _placeholder={{ color: "gray.500" }}
            minH="120px"
            mb={2}
          />
          <Button
            size="sm"
            bg="green.600"
            color="white"
            _hover={{ bg: "green.700" }}
            onClick={handleSaveConclusion}
            isLoading={isLoading}
          >
            SAVE CONCLUSION
          </Button>
        </Box>

        {/* Footer Actions */}
        <Flex
          justify="space-between"
          mt={4}
          p={2}
          borderTop="1px solid"
          borderColor="green.400"
        >
          <HStack spacing={2}>
            <Button
              size="sm"
              bg="blue.600"
              color="white"
              _hover={{ bg: "blue.700" }}
              onClick={handleGenerateDocuments}
            >
              GENERATE DOCUMENTS
            </Button>
            <Button
              size="sm"
              bg="purple.600"
              color="white"
              _hover={{ bg: "purple.700" }}
              onClick={() => {
                // Generate all agents
                Object.values(StepUtils.groupStepsByPhase(steps)).forEach(
                  (group) => {
                    if (group.length > 0) {
                      generateAgent(group[0].phase);
                    }
                  },
                );
                toast({
                  title: "Agents generated successfully!",
                  status: "success",
                  duration: 2000,
                  isClosable: true,
                });
              }}
            >
              GENERATE AGENTS
            </Button>
          </HStack>

          <Text fontSize="sm" color="gray.500">
            Shortcuts: Ctrl+N (new), Ctrl+S (save), Ctrl+G (generate docs)
          </Text>
        </Flex>
      </Flex>
    </TerminalLayout>
  );
};
