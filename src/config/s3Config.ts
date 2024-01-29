import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: 'AKIA4MTWHY6LBQFS2BHZ',
  secretAccessKey: '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',
  region: 'us-east-1',
});

export default s3;
