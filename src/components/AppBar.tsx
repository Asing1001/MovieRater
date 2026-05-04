'use client';
import { useState, useEffect, useRef } from 'react';
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
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { announceClientNavigation } from '@/lib/navigationEvents';
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

const sortableRoutes = ['/', '/theater'];

type Suggestion = { value: string; text: string };

function SearchBar({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data: Suggestion[] = await res.json();
        setSuggestions(data);
        setOpen(data.length > 0);
        setActiveIndex(-1);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 200);
  }, [query]);

  function selectSuggestion(s: Suggestion) {
    const href = `/movie/${s.value}`;
    announceClientNavigation(href);
    router.push(href);
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      selectSuggestion(suggestions[activeIndex]);
      return;
    }
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <Box sx={{ flex: 1, position: 'relative' }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'rgba(255,255,255,0.15)',
          borderRadius: 1,
          px: 1.5,
        }}
      >
        <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 1, flexShrink: 0 }} />
        <InputBase
          inputRef={inputRef}
          autoFocus
          placeholder="搜尋電影名稱（中英皆可）"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          sx={{ color: 'white', flex: 1, '& input::placeholder': { color: 'rgba(255,255,255,0.6)' } }}
        />
        {loading && <CircularProgress size={16} sx={{ color: 'rgba(255,255,255,0.7)', mr: 0.5 }} />}
        <IconButton size="small" color="inherit" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 1400,
            maxHeight: 320,
            overflow: 'auto',
            borderRadius: 1,
          }}
        >
          {suggestions.map((s, i) => (
            <Box
              key={s.value}
              onMouseDown={() => selectSuggestion(s)}
              sx={{
                px: 2,
                py: 1,
                cursor: 'pointer',
                bgcolor: i === activeIndex ? 'action.selected' : 'transparent',
                '&:hover': { bgcolor: 'action.hover' },
                borderBottom: i < suggestions.length - 1 ? '1px solid' : 'none',
                borderColor: 'divider',
              }}
            >
              <Typography variant="body2">{s.text}</Typography>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
}

export default function AppBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);
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

          {/* Search */}
          {searching ? (
            <SearchBar onClose={() => setSearching(false)} />
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
