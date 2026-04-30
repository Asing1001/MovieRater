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
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import InputBase from '@mui/material/InputBase';
import Link from 'next/link';
import { SortKey } from '@/lib/utils';

const navItems = [
  { label: '現正上映', href: '/' },
  { label: '即將上映', href: '/upcoming' },
  { label: '電影院', href: '/theaters' },
];

const sortOptions: { label: string; value: SortKey }[] = [
  { label: '依上映日期', value: 'releaseDate' },
  { label: '依IMDb評分', value: 'imdb' },
  { label: '依LINE評分', value: 'line' },
  { label: '依PTT評分', value: 'ptt' },
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
  const currentTitle = navItems.find((n) => n.href === pathname)?.label ?? 'Movie Rater';
  const currentSort = (searchParams.get('sort') as SortKey) ?? 'releaseDate';

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
      <MuiAppBar position="sticky" color="primary">
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setDrawerOpen(true)} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>

          {searching ? (
            <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <InputBase
                autoFocus
                placeholder="搜尋電影名稱（中英皆可）"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => { if (!query) setSearching(false); }}
                sx={{ color: 'white', flex: 1, borderBottom: '1px solid rgba(255,255,255,0.5)', pb: 0.5 }}
              />
            </form>
          ) : (
            <>
              <Typography variant="h6" sx={{ flex: 1 }}>{currentTitle}</Typography>
              <IconButton color="inherit" onClick={() => setSearching(true)}>
                <SearchIcon />
              </IconButton>
            </>
          )}

          {showSort && !searching && (
            <>
              <IconButton color="inherit" onClick={(e) => setSortAnchor(e.currentTarget)}>
                <SortIcon />
              </IconButton>
              <Menu anchorEl={sortAnchor} open={Boolean(sortAnchor)} onClose={() => setSortAnchor(null)}>
                {sortOptions.map((opt) => (
                  <MenuItem
                    key={opt.value}
                    selected={currentSort === opt.value}
                    onClick={() => applySort(opt.value)}
                  >
                    {opt.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Toolbar>
      </MuiAppBar>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List sx={{ width: 220 }}>
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
      </Drawer>
    </>
  );
}
