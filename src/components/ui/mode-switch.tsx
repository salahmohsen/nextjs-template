'use client';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useColorScheme } from '@mui/material/styles';

import { cn } from '@/lib/utils';

export function ModeSwitch({ className }: { className?: string }) {
  const { mode, setMode } = useColorScheme();
  if (!mode) {
    return null;
  }
  return (
    <Box className={cn('absolute top-5 right-5', className)}>
      <FormControl>
        <InputLabel id="mode-select-label">Theme</InputLabel>
        <Select
          id="mode-select"
          label="Theme"
          labelId="mode-select-label"
          onChange={(event) => setMode(event.target.value as typeof mode)}
          value={mode}
        >
          <MenuItem value="system">System</MenuItem>
          <MenuItem value="light">Light</MenuItem>
          <MenuItem value="dark">Dark</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
