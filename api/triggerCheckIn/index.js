module.exports = async function (context, req) {
    context.log('Azure Function: triggerCheckIn processed a request.');
    
    // In a real Imagine Cup entry, you would save this to Azure Cosmos DB here.
    const userId = (req.body && req.body.userId);

    context.res = {
        status: 200,
        body: {
            status: 'CHECK_IN_INITIATED',
            timestamp: new Date().toISOString(),
            message: `Azure backend received check-in for ${userId}`
        }
    };
}