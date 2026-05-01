export const systemSetting = {
  dbUrl: process.env.DB_URL || 'mongodb://localhost:27018/movierater',
  websiteUrl: process.env.WEBSITE_URL,
  isProduction: process.env.NODE_ENV === 'production',
};

export const omdbSetting = {
  apiKey: process.env.OMDB_API_KEY || '',
};

console.log('systemSetting', JSON.stringify({
  ...systemSetting,
  dbUrl: systemSetting.dbUrl ? '[redacted]' : undefined,
}));
