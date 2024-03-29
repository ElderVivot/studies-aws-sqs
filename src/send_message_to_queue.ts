import 'dotenv/config'
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'

// Configure AWS credentials and region
const sqsClient = new SQSClient({
    region: process.env.AWS_REGION || '',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
})

// Define the parameters for sending the message
const params = {
    QueueUrl: process.env.URL_QUEUE,
    MessageBody: JSON.stringify({
        "id": '1',
        "companies": [{ "idCompanie": 'abc', "name": 'asdfasdf' }]
    })
}

// Create a command to send the message to the SQS queue
const sendMessageCommand = new SendMessageCommand(params)

// Send the message to the SQS queue
sqsClient.send(sendMessageCommand)
    .then(data => {
        console.log('Message sent successfully:', data.MessageId)
    })
    .catch(error => {
        console.error('Error sending message to SQS:', error)
    })
