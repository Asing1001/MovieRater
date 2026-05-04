import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Article from '@/models/article';

const tabLabels = ['好雷', '普雷', '負雷', '其他'];

function ArticleList({ articles }: { articles: Article[] }) {
  if (!articles.length) return <Typography sx={{ mt: 0.75 }} color="text.secondary">無文章</Typography>;
  return (
    <Box component="ul" sx={{ mt: 0.75, mb: 0, pl: 2.5 }}>
      {articles.map((a, i) => (
        <Box component="li" key={i} sx={{ mb: 0.5 }}>
          <Link
            href={a.url ?? '#'}
            target="_blank"
            rel="noopener"
            underline="hover"
            sx={{ fontSize: '0.9rem', color: 'inherit' }}
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
  const groups = [good, normal, bad, other];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 1.5,
      }}
    >
      {tabLabels.map((label, i) => (
        <Box
          key={label}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 1.5,
            bgcolor: 'background.paper',
            minWidth: 0,
          }}
        >
          <Typography variant="subtitle2" component="h3" fontWeight={800}>
            {label} ({groups[i].length})
          </Typography>
          <ArticleList articles={groups[i]} />
        </Box>
      ))}
    </Box>
  );
}
