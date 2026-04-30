export const systemSetting = {
  dbUrl: process.env.DB_URL || 'mongodb://localhost:27018/movierater',
  websiteUrl: process.env.WEBSITE_URL,
  enableGraphiql: process.env.ENABLE_GRAPHIQL === 'true',
  enableScheduler: process.env.ENABLE_SCHEDULER === 'true',
  isProduction: process.env.NODE_ENV === 'production',
  taskTriggerKey: process.env.TASK_TRIGGER_KEY || 'taskTriggerKey',
};

export const schedulerSetting = {
  pttPagePerTime: 50,
  yahooPagePerTime: 50,
};

export const omdbSetting = {
  apiKey: process.env.OMDB_API_KEY || '',
};

export const googleApiSetting = {
  // It is a deleted API key, you could retrieve your own one to fetch the real data.
  geoApiKey: process.env.GOOGLEMAP_APIKEY || 'AIzaSyBcj5gbydKX6IdPnSxqDUwTTzlszB7oZVw',
};

console.log('systemSetting', JSON.stringify({
  ...systemSetting,
  dbUrl: systemSetting.dbUrl ? '[redacted]' : undefined,
  taskTriggerKey: systemSetting.taskTriggerKey ? '[redacted]' : undefined,
}));
