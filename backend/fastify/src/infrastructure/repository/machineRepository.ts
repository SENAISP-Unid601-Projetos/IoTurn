import { Prisma, PrismaClient, Status, Machine, Gateway, DeviceStatus } from "@prisma/client";

const prisma = new PrismaClient();

export interface NewMachineData {
    name: string;
    model: string;
    manufacturer: string;
    serialNumber: string;
    status: Status;
    clientId: number;
    responsibleUserId: number;
    gatewayId?: number;
    deviceId?: number
}

export interface RawMachine{
    name: string;
    model: string;
    manufacturer: string;
    serialNumber: string;
    status: Status;
    clientId: number;
    responsibleUserId: number;
    client: {
        companyName: string
    },
    device: {
        nodeId: string
    }
}

export interface UpdateMachineData {
    name?: string;
    model?: string;
    manufacturer?: string;
    serialNumber?: string;
    status?: Status;
    responsibleUserId?: number;
    deviceId?: number;
    gatewayId?: number;
}

export const machineRepository = {
    newMachine: async (data: NewMachineData): Promise<Machine> => {
        try {
            const result = await prisma.machine.create({
                data: {
                    name: data.name,
                    model: data.model,
                    manufacturer: data.manufacturer,
                    serialNumber: data.serialNumber,
                    status: Status[data.status as keyof typeof Status],
                    client: {
                        connect: { id: data.clientId }
                    },
                    responsibleUser: {
                        connect: { id: data.responsibleUserId }
                    },
                    ...(data.deviceId &&{
                        device: {
                            connect: {id: data.deviceId}
                        }
                    }),
                }
            });
            return result;
    
        } catch (err) {
            console.error("Erro ao criar máquina:", err);
            throw new Error("Falha ao acessar o banco de dados para criar máquina."); 
        }
    },findBySerialNumber: async (serialNumber: string): Promise<Machine> => {
        try {
            const isExists = await prisma.machine.findFirst({
                where: { serialNumber }
            });
            return isExists as Machine;
        } catch (err) {
            console.error("Número de série já existe:", err);
            throw new Error("Número de série já existe. Por favor, use um número de série único.");
        }
    },
    findById: async(machineId: number): Promise<Machine> =>{
        try {
            const isExists = await prisma.machine.findFirst({
                where: {
                    id: machineId
                }
            });

            return isExists as Machine
        } catch (err) {
            console.error("Máquina não encontrada:", err);
            throw new Error("Máquina não encontrada");
        }
    },
    findAllUsersMachine: async(id: number): Promise<RawMachine[]> => {
        try {
            const machines = await prisma.machine.findMany({
                where: { clientId: id },
                select: {
                    id:true,
                    name: true,
                    model: true,
                    manufacturer: true,
                    serialNumber: true,
                    status: true,
                    clientId: true,
                    responsibleUserId: true,
                    client: {
                        select:{
                            companyName: true
                        }
                    },
                    device: {
                        select:{
                            nodeId: true
                        }
                    }
                }
            });
            return machines as RawMachine[];
        } catch (err) {
            console.error("Erro ao listar todas as máquina:", err);
            throw new Error("Falha ao acessar o banco de dados para listar as máquinas."); 
        }
    },
    updateMachine: async (machineId:number, data: UpdateMachineData ): Promise<Machine> => {
            try {
                const { gatewayId, ...machineUpdateData } = data;

                const updateMachine = await prisma.machine.update({
                    where: {
                        id: machineId
                    },
                    data: machineUpdateData 
                })
                return updateMachine;
            } catch (error) {
                console.error("Erro ao atualizar máquina:", error);
                throw new Error("Falha ao acessar o banco de dados para atualizar a máquina.");
            }
    },
    deleteMachine: async(machineId: number): Promise<Machine> =>{
        try{
            const deleteMachine = await prisma.machine.update({
                where: {
                    id: machineId
                },
                data: {
                    status: Status.CANCELED
                }
            });

            return deleteMachine;
        } catch(error){
            console.error("Erro ao deletar máquina:", error);
            throw new Error("Falha ao acessar o banco de dados para deletar a máquina.");
        }
    },
    
};