import z from "zod";
import { clientsService } from "../services/clientsService";
const loginBodySchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long")
});

export const clientsController = {
    loginTempController: async (request: any, reply: any): Promise<void> => {
        const parseResult = loginBodySchema.safeParse(request.body);
        if (!parseResult.success) {
            reply.status(400).send({ message: 'Invalid request body', errors: parseResult.error.message });
            return;
        }
        const { username, password } = parseResult.data;
        try {
            const client = await clientsService.loginTemp(username, password);
            if (client) {
                reply.status(200).send(client);
            } else {
                reply.status(404).send({ message: 'Client not found' });
            }
        } catch (error) {
            console.error("Error in loginTempController:", error);
            reply.status(500).send({ message: 'Internal Server Error' });
        }
    }
};