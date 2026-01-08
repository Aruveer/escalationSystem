module.exports = async function (context, req) {
    const { state, message } = req.body;
    
    // In a real app, write this to Azure Cosmos DB or Blob Storage
    context.log(`[AUDIT LOG] State: ${state} | Msg: ${message}`);

    context.res = {
        status: 200,
        body: { success: true }
    };
}