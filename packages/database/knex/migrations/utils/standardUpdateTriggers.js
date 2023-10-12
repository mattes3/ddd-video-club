/**
 * @param tableName string
 * @return string
 */
exports.createUpdateTrigger = function (tableName) {
    return `
        CREATE OR REPLACE FUNCTION dddvc.trigger_set_${tableName}_updated_at()
        RETURNS TRIGGER AS
        $$
        BEGIN
            NEW.updated_at = now();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER set_updated_at
            BEFORE UPDATE
            ON dddvc.${tableName}
            FOR EACH ROW
        EXECUTE PROCEDURE dddvc.trigger_set_${tableName}_updated_at();
    `;
};

/**
 * @param tableName string
 * @return string
 */
exports.dropUpdateTrigger = function (tableName) {
    return `
        DROP TRIGGER set_updated_at ON dddvc.${tableName};
        DROP FUNCTION dddvc.trigger_set_${tableName}_updated_at;
    `;
};
