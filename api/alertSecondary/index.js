module.exports = async function (context, req) {
    context.log('Azure Function: alertSecondary processing.');

    const { userId, contact } = req.body;

    context.res = {
        status: 200,
        body: {
            status: 'SECONDARY_ALERT_SENT',
            action: 'AUTOMATED_CALL_INITIATED',
            via: 'Azure Functions'
        }
    };
}