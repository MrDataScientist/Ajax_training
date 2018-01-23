module.exports = {
    port: 3000,
    session: {
        secret: 'teamwork',
        key: 'teamwork',
        maxAge: 2592000000
    },
    mongodb: 'mongodb://localhost:27017/teamwork'
};