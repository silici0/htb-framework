import React, { useState } from "react";
import {
  Box,
  VStack,
  Text,
  Select,
  Textarea,
  Input,
  Flex,
  Button,
  useColorModeValue,
  Badge,
  HStack,
  Image,
} from "@chakra-ui/react";
import { Step, Phase, StepFormData } from "../types";
import { StepUtils } from "../utils/stepUtils";

// Importa o FileUtils apenas no servidor
const FileUtils =
  typeof window === "undefined"
    ? require("../utils/fileUtils").FileUtils
    : null;

interface StepFormProps {
  step?: Step;
  onSave: (data: StepFormData) => void;
  onDelete?: () => void;
  isLoading?: boolean;
}

export const StepForm: React.FC<StepFormProps> = ({
  step,
  onSave,
  onDelete,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<StepFormData>({
    phase: step?.phase || "recon_enum",
    title: step?.title || "",
    description: step?.description || "",
    commands: step?.commands?.join("\n") || "",
    results: step?.results || "",
    status: step?.status || "pending",
  });

  const [selectedScreenshots, setSelectedScreenshots] = useState<
    (string | ArrayBuffer)[]
  >([]);

  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleSave = () => {
    onSave(formData);
  };

  const handleDelete = () => {
    if (onDelete && confirm("Are you sure you want to delete this step?")) {
      onDelete();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filePromises = Array.from(files).map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(filePromises).then((screenshots) => {
        setSelectedScreenshots(screenshots);
        setFormData((prev) => ({
          ...prev,
          screenshots: screenshots as any,
        }));
      });
    }
  };

  return (
    <Box
      bg="gray.800"
      border="1px solid"
      borderColor={borderColor}
      borderRadius="md"
      p={4}
      height="100%"
      overflow="auto"
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold" color="green.400">
          {step ? "EDIT STEP" : "NEW STEP"}
        </Text>
        {step && (
          <Badge
            fontSize="sm"
            colorScheme={
              step.status === "success"
                ? "green"
                : step.status === "failed"
                  ? "red"
                  : "yellow"
            }
          >
            {StepUtils.getStatusIcon(step.status || "pending")}{" "}
            {(step.status || "pending").toUpperCase()}
          </Badge>
        )}
      </Flex>

      <VStack spacing={4} align="stretch">
        {/* Fase */}
        <Box>
          <Text fontSize="sm" color="gray.400" mb={2}>
            PENTEST PHASE
          </Text>
          <Select
            value={formData.phase}
            onChange={(e) =>
              setFormData({ ...formData, phase: e.target.value as Phase })
            }
            bg="black"
            border="1px solid"
            borderColor="green.400"
            color="green.300"
            _hover={{ borderColor: "green.300" }}
            _focus={{
              borderColor: "green.400",
              boxShadow: "0 0 0 1px #22c55e",
            }}
          >
            <option value="recon_enum">Reconnaissance and Scanning</option>
            <option value="vulnerability_analysis">
              Vulnerability Analysis
            </option>
            <option value="exploitation">Exploitation</option>
            <option value="post_exploitation">Post-Exploitation</option>
            <option value="privilege_escalation">Privilege Escalation</option>
          </Select>
        </Box>

        {/* Título */}
        <Box>
          <Text fontSize="sm" color="gray.400" mb={2}>
            STEP TITLE
          </Text>
          <Input
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            bg="black"
            border="1px solid"
            borderColor="green.400"
            color="green.300"
            _hover={{ borderColor: "green.300" }}
            _focus={{
              borderColor: "green.400",
              boxShadow: "0 0 0 1px #22c55e",
            }}
            placeholder="Ex: Port enumeration with Nmap"
          />
        </Box>

        {/* Description */}
        <Box>
          <Text fontSize="sm" color="gray.400" mb={2}>
            DESCRIPTION
          </Text>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            bg="black"
            border="1px solid"
            borderColor="green.400"
            color="green.300"
            _hover={{ borderColor: "green.300" }}
            _focus={{
              borderColor: "green.400",
              boxShadow: "0 0 0 1px #22c55e",
            }}
            placeholder="Describe what is being done in this step..."
            rows={4}
          />
        </Box>

        {/* Commands */}
        <Box>
          <Text fontSize="sm" color="gray.400" mb={2}>
            COMMANDS USED
          </Text>
          <Textarea
            value={formData.commands}
            onChange={(e) =>
              setFormData({ ...formData, commands: e.target.value })
            }
            bg="black"
            border="1px solid"
            borderColor="green.400"
            color="green.300"
            _hover={{ borderColor: "green.300" }}
            _focus={{
              borderColor: "green.400",
              boxShadow: "0 0 0 1px #22c55e",
            }}
            placeholder="Enter the commands used (one per line)..."
            fontFamily="monospace"
            rows={6}
          />
        </Box>

        {/* Screenshots */}
        <Box>
          <Text fontSize="sm" color="gray.400" mb={2}>
            SCREENSHOTS / PRINTS
          </Text>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            bg="black"
            border="1px solid"
            borderColor="green.400"
            color="green.300"
            _hover={{ borderColor: "green.300" }}
            _focus={{
              borderColor: "green.400",
              boxShadow: "0 0 0 1px #22c55e",
            }}
            p={2}
          />
          {selectedScreenshots.length > 0 && (
            <Box mt={3}>
              <Text fontSize="xs" color="gray.400" mb={2}>
                {selectedScreenshots.length} image(s) selected
              </Text>
              <HStack spacing={2} flexWrap="wrap" maxH="150px" overflowY="auto">
                {selectedScreenshots.map((screenshot, idx) => (
                  <Image
                    key={idx}
                    src={screenshot as string}
                    alt={`Screenshot ${idx + 1}`}
                    boxSize="80px"
                    objectFit="cover"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="green.400"
                  />
                ))}
              </HStack>
            </Box>
          )}
        </Box>

        {/* Results */}
        <Box>
          <Text fontSize="sm" color="gray.400" mb={2}>
            RESULTS OBTAINED
          </Text>
          <Textarea
            value={formData.results}
            onChange={(e) =>
              setFormData({ ...formData, results: e.target.value })
            }
            bg="black"
            border="1px solid"
            borderColor="green.400"
            color="green.300"
            _hover={{ borderColor: "green.300" }}
            _focus={{
              borderColor: "green.400",
              boxShadow: "0 0 0 1px #22c55e",
            }}
            placeholder="Describe the results obtained..."
            rows={8}
          />
        </Box>

        {/* Status */}
        <Box>
          <Text fontSize="sm" color="gray.400" mb={2}>
            STATUS
          </Text>
          <Select
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as StepFormData["status"],
              })
            }
            bg="black"
            border="1px solid"
            borderColor="green.400"
            color="green.300"
            _hover={{ borderColor: "green.300" }}
            _focus={{
              borderColor: "green.400",
              boxShadow: "0 0 0 1px #22c55e",
            }}
          >
            <option value="pending">⏳ Pending</option>
            <option value="success">✅ Success</option>
            <option value="failed">❌ Failed</option>
          </Select>
        </Box>

        {/* Actions */}
        <Flex justify="space-between" mt={4}>
          <Flex gap={2}>
            <Button
              size="sm"
              bg="green.600"
              color="white"
              _hover={{ bg: "green.700" }}
              onClick={handleSave}
              isLoading={isLoading}
              loadingText="SAVING"
            >
              SAVE
            </Button>
            {onDelete && (
              <Button
                size="sm"
                bg="red.600"
                color="white"
                _hover={{ bg: "red.700" }}
                onClick={handleDelete}
              >
                DELETE
              </Button>
            )}
          </Flex>

          <Text fontSize="xs" color="gray.500">
            Use Ctrl+S to save quickly
          </Text>
        </Flex>
      </VStack>
    </Box>
  );
};
