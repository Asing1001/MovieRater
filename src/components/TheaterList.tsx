'use client';
import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import Theater from '@/models/theater';

export default function TheaterList({ theaters }: { theaters: Theater[] }) {
  const regions = [...new Set(theaters.map((t) => t.region).filter(Boolean))];

  return (
    <>
      <Typography variant="h6" sx={{ mb: 1 }}>電影院列表</Typography>
      {regions.map((region) => {
        const inRegion = theaters.filter((t) => t.region === region);
        return (
          <div key={region}>
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5, color: 'text.secondary' }}>{region}</Typography>
            <Divider />
            <List dense>
              {inRegion.map((theater) => (
                <ListItem key={theater.name} disablePadding>
                  <ListItemButton component={Link} href={`/theater/${encodeURIComponent(theater.name)}`}>
                    <ListItemText primary={theater.name} secondary={theater.address} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </div>
        );
      })}
    </>
  );
}
