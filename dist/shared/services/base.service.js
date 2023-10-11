"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class BaseService {
    constructor(model) {
        this.model = model;
    }
    // ----------------------------------------------
    // Description about WhereOptions, FindOptions:
    // ----------------------------------------------
    // api-social\_docs\postgresql\whereOptions.md
    // api-social\_docs\postgresql\findOptions.md
    // ----------------------------------------------
    // ---------------------------------
    // Find
    // ---------------------------------
    /**
     * If the entity is not found, it creates a new one
     */
    findOrCreate(where, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOrCreateOptions = Object.assign(Object.assign({}, options), { where });
            const [entity, isCreated] = yield this.model.findOrCreate(findOrCreateOptions);
            return [entity, isCreated];
        });
    }
    /**
     * Retrieves a single entity
     */
    findOne(where, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOptions = Object.assign(Object.assign({}, options), { where });
            const entity = yield this.model.findOne(findOptions);
            return entity;
        });
    }
    /**
     * Retrieves multiple entities
     */
    findAll(where, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOptions = Object.assign(Object.assign({}, options), { where });
            const entities = yield this.model.findAll(findOptions);
            return entities;
        });
    }
    // ---------------------------------
    // Create
    // ---------------------------------
    /**
     * Creates one entity
     */
    create(data, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.model.create(data, options);
            return entity;
        });
    }
    /**
     * Creates multiple entities
     */
    createBulk(data, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const entities = yield this.model.bulkCreate(data, options);
            return entities;
        });
    }
    /**
     * Creates multiple entities within a **transaction**
     */
    createBulkTransaction(data, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                const createOptions = Object.assign(Object.assign({}, options), { transaction: t });
                const createdEntity = yield this.model.bulkCreate(data, createOptions);
                return createdEntity;
            }));
            return entity;
        });
    }
    /**
     * Creates multiple entities within an **external transaction**
     */
    createBulkTransactionExternal(data, externalTransaction, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const createOptions = Object.assign(Object.assign({}, options), { transaction: externalTransaction });
            const entities = yield this.model.bulkCreate(data, createOptions);
            return entities;
        });
    }
    // ---------------------------------
    // Update
    // ---------------------------------
    /**
     * Updates multiple entities, optionally returning the updated entities
     */
    updateBulk(update, where, returning = false, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateOptions = Object.assign(Object.assign({}, options), { where, returning });
            const result = yield this.model.update(update, updateOptions);
            return result;
        });
    }
    /**
     * Updates multiple entities within a **transaction**, optionally returning the updated entities
     */
    updateBulkTransaction(update, where, returning = false, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                const updateOptions = Object.assign(Object.assign({}, options), { where, returning, transaction: t });
                const result = yield this.model.update(update, updateOptions);
                return result;
            }));
            return result;
        });
    }
    /**
     * Updates multiple entities within an **external transaction**, optionally returning the updated entities
     */
    updateBulkTransactionExternal(update, where, returning = false, externalTransaction, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateOptions = Object.assign(Object.assign({}, options), { where, returning, transaction: externalTransaction });
            const result = yield this.model.update(update, updateOptions);
            return result;
        });
    }
    // ---------------------------------
    // Delete
    // ---------------------------------
    /**
     * Deletes multiple entities
     */
    deleteBulk(where, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const destroyOptions = Object.assign(Object.assign({}, options), { where });
            const destroyedCount = yield this.model.destroy(destroyOptions);
            return destroyedCount;
        });
    }
    /**
     * Deletes multiple entities within a **transaction**
     */
    deleteBulkTransaction(where, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const destroyedCount = yield this.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                const destroyOptions = Object.assign(Object.assign({}, options), { where, transaction: t });
                const destroyedCount = yield this.model.destroy(destroyOptions);
                return destroyedCount;
            }));
            return destroyedCount;
        });
    }
    /**
     * Deletes multiple entities within an **external transaction**
     */
    deleteBulkTransactionExternal(where, options = {}, externalTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const destroyOptions = Object.assign(Object.assign({}, options), { where, transaction: externalTransaction });
            const destroyedCount = yield this.model.destroy(destroyOptions);
            return destroyedCount;
        });
    }
    // ---------------------------------
    // Transaction
    // ---------------------------------
    transaction(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.model.sequelize)
                throw new Error('Sequelize instance is not defined');
            const t = yield this.model.sequelize.transaction();
            try {
                const result = yield callback(t);
                yield t.commit();
                return result;
            }
            catch (err) {
                yield t.rollback();
                throw err;
            }
        });
    }
    // ---------------------------------
    // Count
    // ---------------------------------
    count(where, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOptions = Object.assign(Object.assign({}, options), { where });
            const count = yield this.model.count(findOptions);
            return count;
        });
    }
    // **********************************************************************************
    // **********************************************************************************
    // **********************************************************************************
    // protected async findOne(id: number, options: FindOptions = {}): Promise<T | null> {
    //   const entity = await this.model.findByPk(id, options);
    //   return entity;
    // }
    findAndCountAll(where, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = options || {}, { offset, limit } = _a, otherOptions = __rest(_a, ["offset", "limit"]);
            const result = yield this.model.findAndCountAll(Object.assign({ where,
                offset,
                limit }, otherOptions));
            return result;
        });
    }
    rawQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.model.sequelize) {
                throw new Error('Sequelize instance is not defined');
            }
            const result = yield this.model.sequelize.query(query);
            return result;
        });
    }
    rawQueryWithParams(query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.model.sequelize) {
                throw new Error('Sequelize instance is not defined');
            }
            const result = yield this.model.sequelize.query(query, {
                replacements: params,
                type: sequelize_1.QueryTypes.SELECT
            });
            return result;
        });
    }
}
exports.default = BaseService;
