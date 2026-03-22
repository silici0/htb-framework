import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

interface TerminalLayoutProps {
  children: React.ReactNode;
}

export const TerminalLayout: React.FC<TerminalLayoutProps> = ({ children }) => {
  return (
    <Box
      bg="black"
      color="green.400"
      fontFamily="monospace"
      minHeight="100vh"
      border="2px solid green.400"
      borderRadius="md"
      overflow="hidden"
    >
      {/* Terminal Header */}
      <Flex
        bg="gray.900"
        p={2}
        borderBottom="1px solid green.400"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text fontSize="sm" color="green.300">
          HTB-FRAMEWORK v1.0.0
        </Text>
        <Text fontSize="xs" color="gray.500">
          Terminal Interface
        </Text>
      </Flex>

      {/* Terminal Content */}
      <Box flex={1} p={4} overflow="auto">
        {children}
      </Box>

      {/* Terminal Footer */}
      <Flex
        bg="gray.900"
        p={2}
        borderTop="1px solid green.400"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text fontSize="xs" color="gray.500">
          Press F1 for help | F2 to save | F3 for next step
        </Text>
        <Text fontSize="xs" color="green.300">
          Ready
        </Text>
      </Flex>
    </Box>
  );
};