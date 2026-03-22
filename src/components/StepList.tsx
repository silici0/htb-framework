import React from "react";
import {
  Box,
  VStack,
  Text,
  Badge,
  Flex,
  Button,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  HStack,
  Image,
} from "@chakra-ui/react";
import { Step, Phase } from "../types";
import { StepUtils } from "../utils/stepUtils";

interface StepListProps {
  steps: Step[];
  selectedStepId?: string;
  onStepSelect: (stepId: string) => void;
  onNewStep: () => void;
}

export const StepList: React.FC<StepListProps> = ({
  steps,
  selectedStepId,
  onStepSelect,
  onNewStep,
}) => {
  const groupedSteps = StepUtils.groupStepsByPhase(steps);
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [detailStep, setDetailStep] = React.useState<Step | null>(null);

  return (
    <Box
      bg="gray.900"
      borderRight="1px solid"
      borderColor={borderColor}
      width="300px"
      p={4}
      height="100%"
      overflow="auto"
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold" color="green.400">
          STEPS
        </Text>
        <Button
          size="sm"
          bg="green.600"
          color="white"
          _hover={{ bg: "green.700" }}
          onClick={onNewStep}
        >
          + NEW
        </Button>
      </Flex>

      <VStack spacing={3} align="stretch">
        {Object.entries(groupedSteps).map(([phase, phaseSteps]) => (
          <Box key={phase} mb={4}>
            <Flex align="center" mb={2}>
              <Text
                fontSize="sm"
                fontWeight="bold"
                color={StepUtils.getPhaseColor(phase as Phase)}
                textTransform="uppercase"
                flex={1}
              >
                {StepUtils.getPhaseName(phase as Phase)}
              </Text>
            </Flex>

            {phaseSteps.length === 0 ? (
              <Text fontSize="sm" color="gray.500" ml={4}>
                No steps
              </Text>
            ) : (
              phaseSteps.map((step) => (
                <Box
                  key={step.id}
                  p={2}
                  bg={selectedStepId === step.id ? "gray.700" : "gray.800"}
                  borderRadius="md"
                  border="1px solid"
                  borderColor={
                    selectedStepId === step.id ? "green.400" : "transparent"
                  }
                >
                  <Flex justify="space-between" align="center" gap={2}>
                    <Box
                      flex={1}
                      minWidth={0}
                      cursor="pointer"
                      _hover={{ opacity: 0.9 }}
                      onClick={() => onStepSelect(step.id)}
                    >
                      <Flex justify="space-between" align="center">
                        <Text fontSize="sm" color="green.300" noOfLines={1}>
                          {step.title}
                        </Text>
                        <Badge
                          fontSize="xs"
                          colorScheme={
                            step.status === "success"
                              ? "green"
                              : step.status === "failed"
                                ? "red"
                                : "yellow"
                          }
                        >
                          {StepUtils.getStatusIcon(step.status)}
                        </Badge>
                      </Flex>
                      <Text fontSize="xs" color="gray.400" mt={1}>
                        {step.description
                          ? step.description.substring(0, 50) + "..."
                          : "No description"}
                      </Text>
                    </Box>

                    <Button
                      size="xs"
                      variant="outline"
                      colorScheme="blue"
                      onClick={() => setDetailStep(step)}
                    >
                      INFO
                    </Button>
                  </Flex>
                </Box>
              ))
            )}
          </Box>
        ))}
      </VStack>

      <Modal
        isOpen={!!detailStep}
        onClose={() => setDetailStep(null)}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent
          bg="gray.800"
          color="white"
          border="1px solid"
          borderColor="green.400"
        >
          <ModalHeader color="green.300">Step details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {detailStep && (
              <VStack align="stretch" spacing={3}>
                <Box>
                  <Text fontSize="xs" color="gray.400">
                    Title
                  </Text>
                  <Text fontSize="md" color="green.200">
                    {detailStep.title}
                  </Text>
                </Box>

                <HStack>
                  <Text fontSize="xs" color="gray.400">
                    Phase:
                  </Text>
                  <Badge colorScheme="purple">
                    {StepUtils.getPhaseName(detailStep.phase)}
                  </Badge>
                  <Text fontSize="xs" color="gray.400">
                    Status:
                  </Text>
                  <Badge
                    colorScheme={
                      detailStep.status === "success"
                        ? "green"
                        : detailStep.status === "failed"
                          ? "red"
                          : "yellow"
                    }
                  >
                    {detailStep.status}
                  </Badge>
                </HStack>

                <Box>
                  <Text fontSize="xs" color="gray.400">
                    Phase Information
                  </Text>
                  <Text fontSize="sm" whiteSpace="pre-wrap">
                    {StepUtils.getPhaseDescription(detailStep.phase)}
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xs" color="gray.400">
                    Description
                  </Text>
                  <Text fontSize="sm" whiteSpace="pre-wrap">
                    {detailStep.description || "No description"}
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xs" color="gray.400">
                    Commands
                  </Text>
                  {detailStep.commands?.length ? (
                    <VStack align="stretch" spacing={1} mt={1}>
                      {detailStep.commands.map((command, idx) => (
                        <Box
                          key={`${detailStep.id}-cmd-${idx}`}
                          bg="gray.900"
                          p={2}
                          borderRadius="md"
                        >
                          <Text fontSize="xs" color="green.200">
                            {command}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  ) : (
                    <Text fontSize="sm">No commands</Text>
                  )}
                </Box>

                <Box>
                  <Text fontSize="xs" color="gray.400">
                    Screenshots
                  </Text>
                  {detailStep.screenshots?.length ? (
                    <VStack align="stretch" spacing={2} mt={2}>
                      {detailStep.screenshots.map((screenshot, idx) => (
                        <Box
                          key={`${detailStep.id}-screenshot-${idx}`}
                          borderRadius="md"
                          overflow="hidden"
                          border="1px solid"
                          borderColor="green.400"
                        >
                          <Image
                            src={screenshot}
                            alt={`Screenshot ${idx + 1}`}
                            maxW="100%"
                            maxH="300px"
                            objectFit="contain"
                          />
                        </Box>
                      ))}
                    </VStack>
                  ) : (
                    <Text fontSize="sm">No screenshots</Text>
                  )}
                </Box>

                <Box>
                  <Text fontSize="xs" color="gray.400">
                    Results
                  </Text>
                  <Text fontSize="sm" whiteSpace="pre-wrap">
                    {detailStep.results || "No results"}
                  </Text>
                </Box>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => setDetailStep(null)} colorScheme="green">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
