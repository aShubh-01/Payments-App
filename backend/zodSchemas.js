const zod = require('zod');

const userDataSchema = zod.object({
    username: zod.string().min(1),
    firstName: zod.string().min(1),
    lastName: zod.string().min(1),
    password: zod.string().min(6)
});

const updateUserDataSchema = zod.object({
    firstName: zod.string().min(1),
    lastName: zod.string().min(1),
    password: zod.string().min(6),
})

const transferSchema = zod.object({
    to: zod.string().min(1),
    amount: zod.number().min(1)
})

module.exports = {
    userDataSchema,
    updateUserDataSchema,
    transferSchema
}
