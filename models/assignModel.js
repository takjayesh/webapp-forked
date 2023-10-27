module.exports = (sequelize, DataTypes) => {
    const Assignment = sequelize.define('Assignment', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 100
            }
        },
        num_of_attempts: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 10
            }
        },
        deadline: {
            type: DataTypes.DATE,
            allowNull: false
        },
        assignment_created: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        assignment_updated: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'assignments',
        timestamps: true,
        createdAt: 'assignment_created',
        updatedAt: 'assignment_updated'
    });

    return Assignment;
};
