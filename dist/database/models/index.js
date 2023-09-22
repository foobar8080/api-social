"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Follower = exports.User = void 0;
const follower_1 = __importDefault(require("./follower"));
exports.Follower = follower_1.default;
const user_1 = __importDefault(require("./user"));
exports.User = user_1.default;
// https://stackoverflow.com/questions/34565360/difference-between-hasone-and-belongsto-in-sequelize-orm
follower_1.default.belongsTo(user_1.default, {
    foreignKey: 'followingUid',
    as: 'following'
});
follower_1.default.belongsTo(user_1.default, {
    foreignKey: 'followerUid',
    as: 'followers'
});
user_1.default.hasMany(follower_1.default, { foreignKey: 'followingUid', as: 'followers' }); // The reversed aliases, like 'followers' for 'followingUid', are designed to mirror the relationship from the perspective of the main user
user_1.default.hasMany(follower_1.default, { foreignKey: 'followerUid', as: 'following' });
