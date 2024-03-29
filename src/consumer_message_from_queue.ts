import 'dotenv/config'
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs"
import { promiseTimeOut } from './_promise-timeout'

// Step 2: Configure AWS
const sqsClient = new SQSClient({
    region: process.env.AWS_REGION || '',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
})

// Step 3: Create SQS Client
const queueURL = process.env.URL_QUEUE

// Step 4: Polling Function
const pollMessages = async () => {
    const receiveParams = {
        QueueUrl: queueURL,
        MaxNumberOfMessages: 1,
        VisibilityTimeout: 2,
        WaitTimeSeconds: 10,
    }

    try {
        console.log(new Date().toISOString())
        const data = await sqsClient.send(new ReceiveMessageCommand(receiveParams))
        await promiseTimeOut(4000)
        data.Messages?.forEach(async (message) => {
            console.log("Received message:", message.Body)

            // Process the message...

            // Delete the message from the queue after processing
            const deleteParams = {
                QueueUrl: queueURL,
                ReceiptHandle: message.ReceiptHandle!,
            }
            await sqsClient.send(new DeleteMessageCommand(deleteParams))
            console.log("Message deleted:", message.MessageId)
        })
    } catch (error) {
        console.error("Error:", error)
    }
}

// Step 5: Continuous Polling (Optional)
setInterval(pollMessages, 10000) // Adjust the interval as necessary
