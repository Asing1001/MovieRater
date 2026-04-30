'use client';
import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Article from '@/models/article';

const tabLabels = ['好雷', '普雷', '負雷', '其他'];

function ArticleList({ articles }: { articles: Article[] }) {
  if (!articles.length) return <Typography sx={{ p: 2 }} color="text.secondary">無文章</Typography>;
  return (
    <Box sx={{ p: 1 }}>
      {articles.map((a, i) => (
        <Box key={i} sx={{ mb: 0.5 }}>
          <Link
            href={a.url ?? '#'}
            target="_blank"
            rel="noopener"
            underline="hover"
            sx={{ fontSize: '0.9rem', color: '#aaa' }}
          >
            {a.title}
          </Link>
        </Box>
      ))}
    </Box>
  );
}

export default function PttArticles({
  good, normal, bad, other,
}: {
  good: Article[];
  normal: Article[];
  bad: Article[];
  other: Article[];
}) {
  const [tab, setTab] = useState(0);
  const groups = [good, normal, bad, other];

  return (
    <Box sx={{ mt: 2, bgcolor: '#1a1a1a', color: 'white', borderRadius: 1 }}>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        textColor="inherit"
        indicatorColor="secondary"
        variant="fullWidth"
      >
        {tabLabels.map((label, i) => (
          <Tab key={i} label={`${label} (${groups[i].length})`} />
        ))}
      </Tabs>
      <ArticleList articles={groups[tab]} />
    </Box>
  );
}
