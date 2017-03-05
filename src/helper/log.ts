let log = {
    debug: function (args) {
        let functionName = new Error().stack.split(' ')[11];
        console.log(functionName, args);
    }
}

export default log;
