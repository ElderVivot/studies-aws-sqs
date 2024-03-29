import 'dotenv/config'
import { SQSClient, GetQueueUrlCommand, CreateQueueCommand } from '@aws-sdk/client-sqs'

// Initialize SQS client with region
const sqsClient = new SQSClient({ region: process.env.AWS_REGION })

// Function to get the URL of an existing queue, returns undefined if not found
async function getQueueUrl(queueName: string): Promise<string | undefined> {
    const command = new GetQueueUrlCommand({ QueueName: queueName })
    try {
        const response = await sqsClient.send(command)
        return response.QueueUrl
    } catch (error) {
        if (error.toString().indexOf('QueueDoesNotExist') >= 0) {
            console.log(`Queue "${queueName}" does not exist.`)
            return undefined
        }
        throw error // Rethrow unexpected errors
    }
}

// Function to create a new SQS queue
async function createQueue(queueName: string): Promise<string> {
    const command = new CreateQueueCommand({
        QueueName: queueName,
        Attributes: {
            VisibilityTimeout: '1800',
        },
    })
    const response = await sqsClient.send(command)
    return response.QueueUrl!
}

// Main function to check and create queue if it doesn't exist
async function ensureQueueExists(queueName: string): Promise<void> {
    let queueUrl = await getQueueUrl(queueName)
    if (!queueUrl) {
        queueUrl = await createQueue(queueName)
        console.log(`Created queue "${queueName}" with URL: ${queueUrl}`)
    } else {
        console.log(`Queue "${queueName}" already exists with URL: ${queueUrl}`)
    }
}

// Replace 'TesteQueue2' with your desired queue name
ensureQueueExists('TesteQueue2').catch((error) => console.error(error))
