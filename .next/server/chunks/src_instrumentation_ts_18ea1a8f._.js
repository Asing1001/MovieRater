module.exports = [
"[project]/src/instrumentation.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "register",
    ()=>register
]);
async function register() {
    if ("TURBOPACK compile-time truthy", 1) {
        const { Mongo } = await __turbopack_context__.A("[project]/src/data/db.ts [instrumentation] (ecmascript, async loader)");
        const cacheManager = (await __turbopack_context__.A("[project]/src/data/cacheManager.ts [instrumentation] (ecmascript, async loader)")).default;
        const { initScheduler } = await __turbopack_context__.A("[project]/src/backgroundService/scheduler.ts [instrumentation] (ecmascript, async loader)");
        await Mongo.openDbConnection();
        // Init cache in background — don't block server startup
        cacheManager.init().catch(console.error);
        initScheduler();
    }
}
}),
];

//# sourceMappingURL=src_instrumentation_ts_18ea1a8f._.js.map