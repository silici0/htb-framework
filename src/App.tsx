import React, { useState, useEffect } from 'react';
import { Machine, MachineFormData } from './types';
import { ProjectList } from './components/ProjectList';
import { MachineForm } from './components/MachineForm';
import { ProjectDashboard } from './components/ProjectDashboard';
import { Box, useToast } from '@chakra-ui/react';

type View = 'list' | 'form' | 'dashboard';

function App() {
  const [view, setView] = useState<View>('list');
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    try {
      const response = await fetch('/api/machines');
      if (response.ok) {
        const loadedMachines = await response.json();
        setMachines(loadedMachines);
      }
    } catch (error) {
      console.error('Error loading machines:', error);
    }
  };

  const handleCreateMachine = async (data: MachineFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/machines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newMachine = await response.json();
        await loadMachines();
        
        toast({
          title: "Project created successfully!",
          description: `Machine ${newMachine.name} was added to your dashboard.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Auto-open dashboard
        setSelectedMachine(newMachine);
        setView('dashboard');
      } else {
        throw new Error('Failed to create machine');
      }

    } catch (error) {
      toast({
        title: "Error creating project",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMachine = (machine: Machine) => {
    setSelectedMachine(machine);
    setView('dashboard');
  };

  const handleDeleteMachine = (machineId: string) => {
    setMachines(prev => prev.filter(m => m.id !== machineId));
    if (selectedMachine?.id === machineId) {
      setSelectedMachine(null);
      setView('list');
    }
  };

  const handleBackToProjects = () => {
    setSelectedMachine(null);
    setView('list');
  };

  return (
    <Box minHeight="100vh" bg="black" color="green.400">
      {view === 'list' && (
        <ProjectList
          machines={machines}
          onNewProject={() => setView('form')}
          onSelectProject={handleSelectMachine}
          onDeleteProject={handleDeleteMachine}
        />
      )}

      {view === 'form' && (
        <MachineForm
          onSubmit={handleCreateMachine}
          isLoading={isLoading}
        />
      )}

      {view === 'dashboard' && selectedMachine && (
        <ProjectDashboard
          machine={selectedMachine}
          onBack={handleBackToProjects}
        />
      )}
    </Box>
  );
}

export default App;