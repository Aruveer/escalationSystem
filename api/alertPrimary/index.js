module.exports = async function (context, req) {
    context.log('Azure Function: alertPrimary processing.');

    const { userId, contact } = req.body;

    // TODO FOR IMAGINE CUP: Integrate Azure Communication Services here to send real SMS
    // https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/sms/send

    context.res = {
        status: 200,
        body: {
            status: 'PRIMARY_ALERT_SENT',
            sent_to: contact.phone,
            via: 'Azure Functions'
        }
    };
}