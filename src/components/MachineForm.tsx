import React, { useState } from 'react';
import { Box, VStack, Text, Input, Button, useColorModeValue, Flex } from '@chakra-ui/react';
import { MachineFormData } from '../types';

interface MachineFormProps {
  onSubmit: (data: MachineFormData) => void;
  isLoading?: boolean;
}

export const MachineForm: React.FC<MachineFormProps> = ({
  onSubmit,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<MachineFormData>({
    name: '',
    ip: '',
    url: ''
  });

  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof MachineFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Box
      bg="gray.800"
      border="1px solid"
      borderColor={borderColor}
      borderRadius="md"
      p={6}
      maxWidth="500px"
      margin="0 auto"
    >
      <Text fontSize="xl" fontWeight="bold" color="green.400" mb={6} textAlign="center">
        NEW MACHINE
      </Text>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          {/* Machine Name */}
          <Box>
            <Text fontSize="sm" color="gray.400" mb={2}>
              MACHINE NAME
            </Text>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              bg="black"
              border="1px solid"
              borderColor="green.400"
              color="green.300"
              _hover={{ borderColor: 'green.300' }}
              _focus={{ borderColor: 'green.400', boxShadow: '0 0 0 1px #22c55e' }}
              placeholder="Ex: Legacy, Blue, Optimum"
              required
            />
          </Box>

          {/* IP */}
          <Box>
            <Text fontSize="sm" color="gray.400" mb={2}>
              IP ADDRESS
            </Text>
            <Input
              value={formData.ip}
              onChange={(e) => handleInputChange('ip', e.target.value)}
              bg="black"
              border="1px solid"
              borderColor="green.400"
              color="green.300"
              _hover={{ borderColor: 'green.300' }}
              _focus={{ borderColor: 'green.400', boxShadow: '0 0 0 1px #22c55e' }}
              placeholder="Ex: 10.10.10.4"
              pattern="^(\d{1,3}\.){3}\d{1,3}$"
              required
            />
          </Box>

          {/* URL (Optional) */}
          <Box>
            <Text fontSize="sm" color="gray.400" mb={2}>
              URL (OPTIONAL)
            </Text>
            <Input
              value={formData.url || ''}
              onChange={(e) => handleInputChange('url', e.target.value)}
              bg="black"
              border="1px solid"
              borderColor="green.400"
              color="green.300"
              _hover={{ borderColor: 'green.300' }}
              _focus={{ borderColor: 'green.400', boxShadow: '0 0 0 1px #22c55e' }}
              placeholder="Ex: http://example.com"
            />
          </Box>

          {/* Actions */}
          <Flex justify="space-between" mt={6}>
            <Button
              type="submit"
              size="lg"
              bg="green.600"
              color="white"
              _hover={{ bg: 'green.700' }}
              isLoading={isLoading}
              loadingText="CREATING"
              width="100%"
            >
              CREATE PROJECT
            </Button>
          </Flex>

          <Text fontSize="xs" color="gray.500" textAlign="center" mt={2}>
            After creating, you will be redirected to the steps dashboard
          </Text>
        </VStack>
      </form>
    </Box>
  );
};