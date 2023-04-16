const log = {
  debug: function (functionName, args) {
    let logArgs = Array.from(args)
      .map((arg) => JSON.stringify(arg).substr(0, 100))
      .join(', ');
    console.log(`${functionName}(${logArgs})`);
  },
};

export default log;
