const AWS = require('aws-sdk');
//const dotenv = require('dotenv');
//dotenv.config();

// AWS.config.update({
//   region: "us-east-1",
// });

AWS.config.update({
  region: "us-east-1",
  accessKeyId: "AKIAQWRXHVBYE4IIWZ6D",
  secretAccessKey: "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"
});

const sns = new AWS.SNS();

const publishToSNS = (topicArn, message, callback) => {
  const params = {
    Message: message,
    TopicArn: topicArn,
  };
  console.log(process.env.TOPIC_ARN+"p3");


  sns.publish(params, (err, data) => {
    if (err) {
      console.error('Error publishing message:', err);
      callback(err, null);
    } else {
      console.log('Message published successfully:', data);
      callback(null, data);
    }
  });
};

module.exports = { publishToSNS };