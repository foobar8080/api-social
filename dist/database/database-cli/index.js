#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const commander_1 = require("commander");
const migration_engine_1 = __importDefault(require("../migrations/migration-engine"));
const program = new commander_1.Command();
program.version('1.0.0');
const initFunc = {
    generateSequelizeRC: () => {
        return `const path = require('path');

module.exports = {
  config: path.resolve('src/database/seeds', 'config.js'),
  'seeders-path': path.resolve('src/database/seeds', 'seeds-files'),
};`;
    },
    generateEnv: () => {
        return `#------------------------#
# Database config
#------------------------#

DB_USERNAME="postgres"
DB_PASSWORD="1111"
DB_DATABASE="api_db_dev"
DB_HOST="127.0.0.1"
DB_PORT="5432"`;
    }
};
const migrationFunc = {
    generateMigrationCodeForTable: (tableName, columnsStr) => {
        const columns = columnsStr ? migrationHelper.generateColumns(columnsStr) : '';
        return `
import { DataTypes, Sequelize } from 'sequelize';

export const up = async ({ context: sequelize }: { context: Sequelize }) => {
  await sequelize.getQueryInterface().createTable('${tableName}', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },${columns}
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  });
};

export const down = async ({ context: sequelize }: { context: Sequelize }) => {
  await sequelize.getQueryInterface().dropTable('${tableName}');
};
    `;
    },
    generateMigrationCodeForColumns: (tableName, columnsStr) => {
        const columns = columnsStr.split(','); // 'age:integer,name:string'
        // --------------------------
        // Create multi columns code
        // --------------------------
        if (columns.length > 1) {
            const resultCode = `
import { DataTypes, Sequelize } from 'sequelize';

export const up = async ({ context: sequelize }: { context: Sequelize }) => {
  await sequelize.transaction(async (transaction) => {
    ${migrationHelper.generateColumnsUp(tableName, columns)}
  });
};
      
export const down = async ({ context: sequelize }: { context: Sequelize }) => {
  await sequelize.transaction(async (transaction) => {${migrationHelper.generateColumnsDown(tableName, columns)}
  });
};
`;
            return resultCode;
        }
        // -----------------------
        // Create one column code
        // -----------------------
        else {
            const [name, type] = columns[0].split(':');
            const res = `
import { DataTypes, Sequelize } from 'sequelize';

export const up = async ({ context: sequelize }: { context: Sequelize }) => {
  await sequelize.getQueryInterface().addColumn('${tableName}', '${name}', {
    type: DataTypes.${type.toUpperCase()}
  });
};

export const down = async ({ context: sequelize }: { context: Sequelize }) => {
  await sequelize.getQueryInterface().removeColumn('${tableName}', '${name}');
};
`;
            return res;
        }
    }
};
const migrationHelper = {
    /**
     * Generate a timestamp in the format of YYYYMMDDHHmmss for database migration files
     * @returns {string} The timestamp in the format of YYYYMMDDHHmmss
     */
    getTimestamp: () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`; // YYYYMMDDHHmmss
        return timestamp;
    },
    /**
     * @param {string} columnsStr 'age:integer,name:string'
     * @returns {string} DataTypes column definitions
     */
    generateColumns: (columnsStr) => {
        const columns = columnsStr.split(',');
        const res = columns.map((column) => {
            const [name, type] = column.split(':');
            return `
    ${name}: {
      type: DataTypes.${type.toUpperCase()}
    }`;
        });
        return res.join() + ',';
    },
    generateColumnsUp: (tableName, columns) => {
        const res = columns.map((column) => {
            const [name, type] = column.split(':');
            return `await sequelize.getQueryInterface().addColumn(
      '${tableName}',
      '${name}',
      {
        type: DataTypes.${type.toUpperCase()}
      },
      { transaction }
    );
    `;
        });
        return res.join('');
    },
    generateColumnsDown: (tableName, columns) => {
        const res = columns.map((column) => {
            const [name] = column.split(':');
            const col = `
    await sequelize.getQueryInterface().removeColumn('${tableName}', '${name}', { transaction });`;
            return col;
        });
        return res.join('');
    }
};
const modelFunc = {
    generateModelCode: (tableName, columnsStr) => {
        const name = tableName.slice(0, -1); // string without last 's' letter
        const modelInterface = columnsStr ? modelHelper.generateInterface(name, columnsStr) : '';
        return `
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db-connection';

${modelInterface}

class ${modelHelper.firstLetterToUppercase(name)} extends Model<${modelHelper.generateAttributesString(name)}> implements ${modelHelper.generateAttributesString(name)} {
  ${modelHelper.generateProperties(columnsStr || '')}
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // public static associate(models: any): void {
  //   this.hasOne(models.Channel, { foreignKey: 'xxx_id' });
  // }
}

${modelHelper.firstLetterToUppercase(name)}.init(
  {
    ${modelHelper.getDataTypes(columnsStr || '')}
  },
  {
    sequelize: sequelize,
    tableName: '${tableName}',
    // underscored: true,
  }
);

export default ${modelHelper.firstLetterToUppercase(name)};
`;
    }
};
const modelHelper = {
    generateInterface: (tableName, columnsStr) => {
        const columns = columnsStr.split(',');
        const res = columns.map((column) => {
            const [name, type] = column.split(':');
            return `
  ${name}: ${modelHelper.sequelizeToTypescriptType(type)};`;
        });
        return `interface ${modelHelper.generateAttributesString(tableName)} {
  ${res.join('')}
}`;
    },
    generateAttributesString(str) {
        return `I${modelHelper.firstLetterToUppercase(str)}Attributes`; // IUserAttributes
    },
    firstLetterToUppercase(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    generateProperties(columnsStr) {
        const columns = columnsStr.split(',');
        const res = columns.map((column) => {
            const [name, type] = column.split(':');
            return `public ${name}!: ${modelHelper.sequelizeToTypescriptType(type)};
  `;
        });
        return res.join('');
    },
    getDataTypes(columnsStr) {
        const columns = columnsStr.split(',');
        const res = columns.map((column) => {
            const [name, type] = column.split(':');
            return `${name}: DataTypes.${type.toUpperCase()},
    `;
        });
        return res.join('');
    },
    sequelizeToTypescriptType(type) {
        switch (type.toUpperCase()) {
            case 'STRING':
            case 'CHAR':
            case 'TEXT':
                return 'string';
            case 'INTEGER':
            case 'BIGINT':
            case 'FLOAT':
            case 'DOUBLE':
                return 'number';
            case 'DECIMAL':
                return 'string'; // or use a custom Decimal type in TypeScript
            case 'BOOLEAN':
                return 'boolean';
            case 'DATE':
                return 'Date';
            case 'JSON':
            case 'ARRAY':
                return 'any[]'; // or use a custom JSON/Array type in TypeScript
            default:
                return 'any';
        }
    }
};
// ---------------------------------
program
    .command('init')
    .alias('i')
    .description('Creates a .sequelizerc and .env files')
    .action(() => {
    // ----------------
    // .sequelizerc file
    // ----------------
    const file1 = './.sequelizerc';
    const code1 = eval(`\`${initFunc.generateSequelizeRC()}\``);
    fs.writeFile(file1, code1, (err) => {
        if (err)
            throw err;
        console.log(`File ${file1} created successfully!`);
    });
    // ----------------
    // .env file
    // ----------------
    const file2 = './.env';
    const code2 = eval(`\`${initFunc.generateEnv()}\``);
    fs.writeFile(file2, code2, (err) => {
        if (err)
            throw err;
        console.log(`File ${file2} created successfully!`);
    });
});
program
    .command('table')
    .alias('t')
    .description('Creates a migration YYYYMMDDHHmmss-table@<TableName>.ts and model <TableName>.ts files with passed columns data')
    .option('-t, --name <name>', 'File / table / model name')
    .option('-c, --columns <columns>', 'Column name with a data type')
    .action((options) => {
    const { name, columns } = options;
    // ----------------
    // Migration file
    // ----------------
    const fileName = './src/database/migrations/migration-files/' + migrationHelper.getTimestamp() + '-table@' + name + '.ts';
    const code = eval(`\`${migrationFunc.generateMigrationCodeForTable(name, columns)}\``);
    fs.writeFile(fileName, code, (err) => {
        if (err)
            throw err;
        console.log(`File ${fileName} created successfully!`);
    });
    // ----------------
    // Model file
    // ----------------
    const fileModelName = './src/database/models/' + name.slice(0, -1).toLowerCase() + '.ts';
    const modelCode = eval(`\`${modelFunc.generateModelCode(name, columns)}\``);
    fs.writeFile(fileModelName, modelCode, (err) => {
        if (err)
            throw err;
        console.log(`File ${fileModelName} created successfully!`);
    });
});
program
    .command('columns')
    .alias('c')
    .description('Creates a migration file YYYYMMDDHHmmss-columns@<TableName>.ts with passed columns data')
    .option('-t, --tableName <tableName>', 'Table name')
    .option('-c, --columns <columns>', 'Table columns')
    .action((options) => {
    const { tableName, columns } = options;
    const fileName = './src/database/migrations/migration-files/' + migrationHelper.getTimestamp() + '-columns@' + tableName + '.ts';
    const code = eval(`\`${migrationFunc.generateMigrationCodeForColumns(tableName, columns)}\``);
    fs.writeFile(fileName, code, (err) => {
        if (err)
            throw err;
        console.log(`File ${fileName} created successfully!`);
    });
});
program
    .command('up')
    .alias('u')
    .description('Up the database migrations')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield migration_engine_1.default.up();
        console.log('Migration up successfully');
    }
    catch (err) {
        console.error('Error up migration:', err);
    }
}));
program
    .command('down')
    .alias('d')
    .description('Down the database migrations')
    .option('-n, --name <name>', 'Migration name')
    .action((options) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = options;
    try {
        if (name) {
            // down list of migrations
            yield migration_engine_1.default.down({
                migrations: [name]
            });
        }
        else {
            // down one migration
            yield migration_engine_1.default.down({ to: 0 });
        }
        console.log('Migration down successfully');
    }
    catch (err) {
        console.error('Error down migration:', err);
    }
}));
program.parse(process.argv);
