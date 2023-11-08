import StatsD from 'node-statsd';

// Initialize the StatsD client
const client = new StatsD({ host: '127.0.0.1', port: 8125 });
// Replace with your StatsD server address
// Replace with your StatsD server port

// Middleware to create a StatsD metric name
export const getStatsD = () => {
  return (req, res, next) => {
    const metricName = `api.${req.method.toLowerCase()}.${req.originalUrl.replace(/\//g, '_')}`;
    client.increment(metricName);
    next();
  };
};

// Middleware to be used at the end of a request
export const endStatsD = () => {
    return (req, res, next) => {
        client.close();
        next();
    };
};
