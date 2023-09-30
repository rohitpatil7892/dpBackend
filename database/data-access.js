const DB = require('./db-config');
const Errors = require('../errors');


async function getObjectByConditions(table, projection, condition, top, skip, orderBy, count, joins, parentAliasName) {
    try {
        //set default values
        skip = skip || 0;
        let limit = top || 10;
        let filter = condition ? `WHERE ${condition}` : '';
        limit = limit === -1 ? 'ALL' : limit;
        if (orderBy) {
            orderBy = `ORDER BY ${orderBy}`;
        } else {
            orderBy = ``;
        }
        projection = projection || '*';
        //build query
        joins = joins || ``;
        //build query
        if (parentAliasName) {
            parentAliasName = `AS ${parentAliasName}`;
        } else {
            parentAliasName = ``
        }
        const query = `SELECT ${projection} FROM "${table}" ${parentAliasName} ${joins} ${filter} ${orderBy} LIMIT ${limit} OFFSET ${skip};`;
        console.log(`getObjectByConditions:`, { query });
        let data = await DB.executeQuery(query);
        let result = {};
        result['data'] = data;
        //Get count if demand by user
        if (count) {
            table = table.split(',')[0];
            const countQuery = `SELECT COUNT("ID") FROM "${table}" ${parentAliasName} ${filter} LIMIT ALL `;
            let dataCount = await DB.executeQuery(countQuery);
            result['Count'] = dataCount ? dataCount[0]['count'] : undefined;
            result['Count'] = parseInt(result['Count']);
        }
        return result;
    } catch (error) {
        console.error(`Error in getObjectByConditions`, { error });
        throw (error);
    }
}

async function updateObjectByID(table, objectID, data) {
    try {
        let updates = await getDataForUpdate(data);
        let condition = `"ID" = ${objectID}`;
        const query = `UPDATE "${table}" SET ${updates} WHERE ${condition} RETURNING *; `;
        console.log(`Database: updateObjectByID`, { query: query });
        let updatedObject = await DB.executeQuery(query);
        return updatedObject[0];
    } catch (error) {
        console.error(`Error in updateObjectByID`);
        throw error;
    }
}

async function deleteObjectByID(table, objectID) {
    try {
        let condition = `"ID" = ${objectID} `;
        let object = await this.getObjectByConditions(table, '*', condition, 0, 0, '', false);
        if (!object || !object['data'] || object['data'].length === 0) {
            await Errors.objectNotFound('Object Not found with ID' + objectID);
        }
        let filter = `WHERE ${condition} `;
        //build query
        const query = `DELETE FROM "${table}" ${filter} RETURNING *; `;
        console.debug(`Database: deleteObjectByID`, { query: query });
        let deletedObject = await DB.executeQuery(query);
        return deletedObject[0];
    } catch (error) {
        console.error(`Error in deleteObjectByID`);
        throw error;
    }
}

async function createObject(table, data) {
    try {
        let objectToAdd = await getDataCreate(data);
        const query = `INSERT INTO "${table}"(${objectToAdd.keys}) VALUES(${objectToAdd.placeHolders}) RETURNING * `;
        console.debug(`Database: createObject`, { query: query });
        let insertedObject = await DB.executeQuery(query, objectToAdd.values);
        return insertedObject[0];
    } catch (error) {
        console.error(`Error in createObject`, { error });
        throw error;
    }
}

async function getDataCreate(data) {
    let objectKeys = Object.keys(data);
    let placeHolders = [];
    let values = [];
    let keys = [];
    for (let index = 0; index < objectKeys.length; index++) {
        let key = objectKeys[index];
        keys.push(`"${key}"`);
        placeHolders.push(`$${index + 1} `);
        values.push(data[key]);
    }
    return {
        placeHolders,
        keys,
        values
    }
}

async function getDataForUpdate(data) {
    let objectKeys = Object.keys(data);
    let updates = [];
    for (let index = 0; index < objectKeys.length; index++) {
        let key = objectKeys[index];
        let value = data[key];
        if (Array.isArray(value)) {
            let elements = [];
            let elementType = typeof value[0];
            if (elementType === 'object') {
                for (let element of value) {
                    elements.push(`'${JSON.stringify(element)}'`);
                }
                updates.push(`"${key}" = ARRAY[${elements}]:: json[]`);
            } else {
                for (let element of value) {
                    elements.push(`"${element}"`);
                }
                updates.push(`"${key}" = '{${elements}}'`);
            }
        } else if (typeof value === "number") {
            updates.push(`"${key}" = ${value} `);
        } else {
            //TODO: need to handle apostrophe. use reference from escape characters from string utils if it is string.
            updates.push(`"${key}" = '${value}'`);
        }
    }
    return updates;
}

module.exports = {
    getObjectByConditions: getObjectByConditions,
    updateObjectByID: updateObjectByID,
    deleteObjectByID: deleteObjectByID,
    createObject: createObject
}