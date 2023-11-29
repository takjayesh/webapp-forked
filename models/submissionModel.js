module.exports = (sequelize, DataTypes) => {
    const Submission = sequelize.define('Submission', {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        username: DataTypes.STRING,
        assignment_id: DataTypes.UUID,
        submission_url: DataTypes.STRING,
      }, {
        tableName: 'submissions',
        createdAt: 'submission_date',
        updatedAt: 'assignment_updated',
        timestamps: true
      });

    return Submission;
};