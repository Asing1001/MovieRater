'use client';
import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { SortKey } from '@/lib/utils';

const navItems = [
  { label: '現正上映', href: '/' },
  { label: '即將上映', href: '/upcoming' },
  { label: '電影院', href: '/theaters' },
];

const sortOptions: { label: string; value: SortKey }[] = [
  { label: '依上映日期', value: 'releaseDate' },
  { label: '依 IMDb 評分', value: 'imdb' },
  { label: '依 LINE 評分', value: 'line' },
  { label: '依 PTT 評分', value: 'ptt' },
];

const sortableRoutes = ['/', '/upcoming', '/theater'];

export default function AppBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const showSort = sortableRoutes.some((r) => pathname === r || pathname.startsWith(r + '/'));
  const currentSort = (searchParams.get('sort') as SortKey) ?? 'releaseDate';
  const activeTab = navItems.findIndex((n) => n.href === pathname);

  function applySort(value: SortKey) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`${pathname}?${params.toString()}`);
    setSortAnchor(null);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setSearching(false);
    setQuery('');
  }

  return (
    <>
      <MuiAppBar position="sticky" elevation={2} sx={{ bgcolor: 'primary.main' }}>
        <Toolbar sx={{ gap: 1, minHeight: { xs: 56, sm: 64 } }}>
          {/* Mobile menu */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{ display: { xs: searching ? 'none' : 'block', sm: 'block' }, mr: 1, letterSpacing: '-0.5px', flexShrink: 0 }}
          >
            Movie Rater
          </Typography>

          {/* Desktop nav tabs */}
          {!searching && (
            <Tabs
              value={activeTab >= 0 ? activeTab : false}
              sx={{
                display: { xs: 'none', sm: 'flex' },
                flex: 1,
                '& .MuiTab-root': { color: 'rgba(255,255,255,0.7)', minHeight: 64, textTransform: 'none', fontSize: '0.95rem' },
                '& .Mui-selected': { color: 'white !important' },
                '& .MuiTabs-indicator': { bgcolor: 'white' },
              }}
            >
              {navItems.map((item) => (
                <Tab key={item.href} label={item.label} component={Link} href={item.href} />
              ))}
            </Tabs>
          )}

          {/* Search bar (expanded) */}
          {searching ? (
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'rgba(255,255,255,0.15)',
                borderRadius: 1,
                px: 1.5,
              }}
            >
              <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 1, flexShrink: 0 }} />
              <InputBase
                autoFocus
                placeholder="搜尋電影名稱（中英皆可）"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ color: 'white', flex: 1, '& input::placeholder': { color: 'rgba(255,255,255,0.6)' } }}
              />
              <IconButton size="small" color="inherit" onClick={() => { setSearching(false); setQuery(''); }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
              <IconButton color="inherit" onClick={() => setSearching(true)} aria-label="搜尋">
                <SearchIcon />
              </IconButton>
              {showSort && (
                <>
                  <IconButton color="inherit" onClick={(e) => setSortAnchor(e.currentTarget)} aria-label="排序">
                    <SortIcon />
                  </IconButton>
                  <Menu anchorEl={sortAnchor} open={Boolean(sortAnchor)} onClose={() => setSortAnchor(null)}>
                    {sortOptions.map((opt) => (
                      <MenuItem key={opt.value} selected={currentSort === opt.value} onClick={() => applySort(opt.value)}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </MuiAppBar>

      {/* Mobile drawer */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 240, pt: 1 }}>
          <Typography variant="h6" fontWeight={800} sx={{ px: 2, py: 1.5 }}>Movie Rater</Typography>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.href} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  selected={pathname === item.href}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
