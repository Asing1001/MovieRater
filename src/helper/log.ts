const debugEnabled = process.env.LOG_LEVEL === 'debug';

const log = {
  debug: function (functionName, args) {
    if (!debugEnabled) return;
    let logArgs = Array.from(args)
      .map((arg) => JSON.stringify(arg).substr(0, 100))
      .join(', ');
    console.log(`${functionName}(${logArgs})`);
  },
};

export default log;
